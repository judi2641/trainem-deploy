import { SeasonModel, ISeason } from './SeasonModel';
import { PixelBoardModel, IPixelBoard, IPixel } from './PixelBoardModel';
import { GroupModel } from '../groups/GroupModel';
import { HttpError } from '../../errors/HttpError';

export class PixelWarService {
	/**
	 * Erstellt eine neue Season
	 */
	static async createSeason(data: {
		name: string;
		description?: string;
		mode: 'territory_control' | 'xp_battle' | 'hybrid';
		startDate: Date;
		endDate: Date;
		gridWidth?: number;
		gridHeight?: number;
	}): Promise<ISeason> {
		const { name, description, mode, startDate, endDate, gridWidth = 200, gridHeight = 200 } = data;

		const season = new SeasonModel({
			name,
			description,
			mode,
			startDate,
			endDate,
			status: 'upcoming',
			participatingGroups: [],
			leaderboard: [],
		});

		await season.save();

		// Erstelle PixelBoard für diese Season
		const pixelBoard = new PixelBoardModel({
			seasonId: String(season._id),
			gridWidth,
			gridHeight,
			pixels: [],
		});

		await pixelBoard.save();

		return season;
	}

	/**
	 * Holt aktive Season
	 */
	static async getActiveSeason(): Promise<ISeason | null> {
		return await SeasonModel.findOne({ status: 'active' });
	}

	/**
	 * Holt Season nach ID
	 */
	static async getSeasonById(seasonId: string): Promise<ISeason> {
		const season = await SeasonModel.findById(seasonId);
		if (!season) {
			throw new HttpError(404, 'Season not found');
		}
		return season;
	}

	/**
	 * Gruppe tritt Season bei
	 */
	static async joinSeason(seasonId: string, groupId: string): Promise<ISeason> {
		const season = await SeasonModel.findById(seasonId);
		if (!season) {
			throw new HttpError(404, 'Season not found');
		}

		if (season.status === 'completed') {
			throw new HttpError(400, 'Season already completed');
		}

		// Prüfe ob Gruppe existiert
		const group = await GroupModel.findById(groupId);
		if (!group) {
			throw new HttpError(404, 'Group not found');
		}

		// Prüfe ob bereits teilnehmend
		if (season.participatingGroups.includes(groupId)) {
			throw new HttpError(400, 'Group already participating');
		}

		season.participatingGroups.push(groupId);
		season.leaderboard.push({
			groupId,
			groupName: group.name,
			totalXP: 0,
			pixelsOwned: 0,
			rank: season.leaderboard.length + 1,
		});

		await season.save();
		return season;
	}

	/**
	 * Holt PixelBoard für Season
	 */
	static async getPixelBoard(seasonId: string): Promise<IPixelBoard> {
		const board = await PixelBoardModel.findOne({ seasonId });
		if (!board) {
			throw new HttpError(404, 'PixelBoard not found');
		}
		return board;
	}

	/**
	 * User setzt Pixel (Hauptfunktion für Pixel-Updates)
	 */
	static async setPixels(data: {
		seasonId: string;
		groupId: string;
		userId: string;
		coordinates: { x: number; y: number }[];
	}): Promise<IPixelBoard> {
		const { seasonId, groupId, userId, coordinates } = data;

		// Validierung
		const season = await SeasonModel.findById(seasonId);
		if (!season) {
			throw new HttpError(404, 'Season not found');
		}

		if (season.status !== 'active') {
			throw new HttpError(400, 'Season is not active');
		}

		// Prüfe ob Gruppe teilnimmt
		if (!season.participatingGroups.includes(groupId)) {
			throw new HttpError(400, 'Group not participating in season');
		}

		// Prüfe ob User Mitglied der Gruppe ist
		const group = await GroupModel.findById(groupId);
		if (!group) {
			throw new HttpError(404, 'Group not found');
		}

		const isMember = group.members.some((m) => m.userId === userId);
		if (!isMember) {
			throw new HttpError(403, 'User is not a member of this group');
		}

		// Hole PixelBoard
		const board = await PixelBoardModel.findOne({ seasonId });
		if (!board) {
			throw new HttpError(404, 'PixelBoard not found');
		}

		// Cooldown-Check (vereinfacht - in Production: Redis)
		// TODO: Implement proper cooldown tracking

		// Limit-Check
		const userPixelsToday = this.getUserPixelsToday(board, userId);
		if (userPixelsToday + coordinates.length > season.rules.maxPixelsPerUser) {
			throw new HttpError(429, 'Daily pixel limit exceeded');
		}

		// Setze Pixel
		for (const coord of coordinates) {
			if (coord.x < 0 || coord.x >= board.gridWidth || coord.y < 0 || coord.y >= board.gridHeight) {
				throw new HttpError(400, `Invalid coordinates: ${coord.x}, ${coord.y}`);
			}

			const existingPixelIndex = board.pixels.findIndex((p) => p.x === coord.x && p.y === coord.y);

			const newPixel: IPixel = {
				x: coord.x,
				y: coord.y,
				color: group.color,
				groupId,
				lastUpdatedBy: userId,
				lastUpdatedAt: new Date(),
				conquestCount: existingPixelIndex >= 0 ? board.pixels[existingPixelIndex].conquestCount + 1 : 1,
			};

			if (existingPixelIndex >= 0) {
				// Update existing pixel
				board.pixels[existingPixelIndex] = newPixel;
			} else {
				// Add new pixel
				board.pixels.push(newPixel);
			}
		}

		await board.save();

		// Update Leaderboard
		await this.updateLeaderboard(seasonId);

		return board;
	}

	/**
	 * Gibt XP-basierte Pixel-Rechte frei
	 * Aufgerufen wenn User Workout/Habit abschließt
	 */
	static async grantPixelRights(groupId: string, userId: string, xp: number): Promise<number> {
		const activeSeason = await this.getActiveSeason();
		if (!activeSeason) {
			return 0; // Keine aktive Season
		}

		// Prüfe ob Gruppe teilnimmt
		if (!activeSeason.participatingGroups.includes(groupId)) {
			return 0;
		}

		// Berechne Pixel-Rechte basierend auf XP
		const pixelRights = Math.floor(xp / activeSeason.rules.xpPerPixel) * activeSeason.rules.pixelsPerAction;

		// In Production: Speichere Pixel-Rechte in Redis/Session
		// Für MVP: Returniere nur die Anzahl
		return pixelRights;
	}

	/**
	 * Aktualisiert das Leaderboard
	 */
	private static async updateLeaderboard(seasonId: string): Promise<void> {
		const season = await SeasonModel.findById(seasonId);
		if (!season) return;

		const board = await PixelBoardModel.findOne({ seasonId });
		if (!board) return;

		// Zähle Pixel pro Gruppe
		const pixelCounts = new Map<string, number>();
		for (const pixel of board.pixels) {
			const current = pixelCounts.get(pixel.groupId) || 0;
			pixelCounts.set(pixel.groupId, current + 1);
		}

		// Update Leaderboard
		for (const entry of season.leaderboard) {
			entry.pixelsOwned = pixelCounts.get(entry.groupId) || 0;

			// Update totalXP from Group
			const group = await GroupModel.findById(entry.groupId);
			if (group) {
				entry.totalXP = group.currentSeasonXP;
			}
		}

		// Sort nach Modus
		if (season.mode === 'territory_control') {
			// Sort by pixelsOwned
			season.leaderboard.sort((a, b) => b.pixelsOwned - a.pixelsOwned);
		} else if (season.mode === 'xp_battle') {
			// Sort by totalXP
			season.leaderboard.sort((a, b) => b.totalXP - a.totalXP);
		} else {
			// Hybrid: 50% pixels, 50% XP
			season.leaderboard.sort((a, b) => {
				const scoreA = a.pixelsOwned * 0.5 + a.totalXP * 0.5;
				const scoreB = b.pixelsOwned * 0.5 + b.totalXP * 0.5;
				return scoreB - scoreA;
			});
		}

		// Update ranks
		season.leaderboard.forEach((entry, index) => {
			entry.rank = index + 1;
		});

		await season.save();
	}

	/**
	 * Season beenden
	 */
	static async completeSeason(seasonId: string): Promise<ISeason> {
		const season = await SeasonModel.findById(seasonId);
		if (!season) {
			throw new HttpError(404, 'Season not found');
		}

		season.status = 'completed';

		// Setze Gewinner
		if (season.leaderboard.length > 0) {
			season.winnerId = season.leaderboard[0].groupId;
		}

		await season.save();

		return season;
	}

	/**
	 * Hilfsfunktion: Zählt Pixel eines Users heute
	 */
	private static getUserPixelsToday(board: IPixelBoard, userId: string): number {
		const today = new Date();
		today.setHours(0, 0, 0, 0);

		return board.pixels.filter((p) => {
			const pixelDate = new Date(p.lastUpdatedAt);
			pixelDate.setHours(0, 0, 0, 0);
			return p.lastUpdatedBy === userId && pixelDate.getTime() === today.getTime();
		}).length;
	}

	/**
	 * Holt Leaderboard
	 */
	static async getLeaderboard(seasonId: string) {
		const season = await SeasonModel.findById(seasonId);
		if (!season) {
			throw new HttpError(404, 'Season not found');
		}

		return season.leaderboard;
	}
}
