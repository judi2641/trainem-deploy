import { BattleModel, IBattle, IBattleParticipant } from './BattleModel';
import { PixelBoardModel, IPixelBoard, IPixel } from './PixelBoardModel';
import { GroupModel } from '../groups/GroupModel';
import { HttpError } from '../../errors/HttpError';
import { logger } from '../../utils/logger';

export class BattleService {
	// ==================== CHALLENGE FLOW ====================

	/**
	 * Erstellt eine neue Challenge (Herausforderung)
	 */
	static async createChallenge(data: {
		challengerGroupId: string;
		opponentGroupId: string;
		challengerUserId: string;
		name?: string;
		description?: string;
		settings?: Partial<{
			duration: number;
			gridSize: number;
			winCondition: 'pixels' | 'xp' | 'hybrid';
			xpPerPixel: number;
			pixelsPerAction: number;
			allowOverwrite: boolean;
		}>;
	}): Promise<IBattle> {
		const { challengerGroupId, opponentGroupId, challengerUserId, name, description, settings } = data;

		// Validiere Challenger-Gruppe
		const challengerGroup = await GroupModel.findById(challengerGroupId);
		if (!challengerGroup) {
			throw new HttpError(404, 'Challenger group not found');
		}

		// Prüfe ob User admin/owner der Challenger-Gruppe ist
		const challengerMember = challengerGroup.members.find((m) => m.userId === challengerUserId);
		if (!challengerMember || challengerMember.role === 'member') {
			throw new HttpError(403, 'Only admins or owners can create challenges');
		}

		// Validiere Opponent-Gruppe
		const opponentGroup = await GroupModel.findById(opponentGroupId);
		if (!opponentGroup) {
			throw new HttpError(404, 'Opponent group not found');
		}

		// Verhindere Self-Challenge
		if (challengerGroupId === opponentGroupId) {
			throw new HttpError(400, 'Cannot challenge your own group');
		}

		// Prüfe ob bereits ein aktives/pending Battle zwischen diesen Gruppen existiert
		const existingBattle = await BattleModel.findOne({
			$or: [
				{ 'challenger.groupId': challengerGroupId, 'opponent.groupId': opponentGroupId },
				{ 'challenger.groupId': opponentGroupId, 'opponent.groupId': challengerGroupId },
			],
			status: { $in: ['pending', 'accepted', 'active'] },
		});

		if (existingBattle) {
			throw new HttpError(400, 'An active battle already exists between these groups');
		}

		// Erstelle Battle-Name falls nicht angegeben
		const battleName = name || `${challengerGroup.name} vs ${opponentGroup.name}`;

		// Erstelle Challenger-Participant
		const challenger: IBattleParticipant = {
			groupId: challengerGroupId,
			groupName: challengerGroup.name,
			color: challengerGroup.color,
			pixelsOwned: 0,
			totalXP: 0,
			members: [],
		};

		// Erstelle Opponent-Participant
		const opponent: IBattleParticipant = {
			groupId: opponentGroupId,
			groupName: opponentGroup.name,
			color: opponentGroup.color,
			pixelsOwned: 0,
			totalXP: 0,
			members: [],
		};

		const battle = new BattleModel({
			name: battleName,
			description,
			challenger,
			opponent,
			status: 'pending',
			challengedAt: new Date(),
			settings: {
				duration: settings?.duration ?? 1440, // 24h default
				gridSize: settings?.gridSize ?? 50,
				winCondition: settings?.winCondition ?? 'pixels',
				xpPerPixel: settings?.xpPerPixel ?? 67,
				pixelsPerAction: settings?.pixelsPerAction ?? 1,
				allowOverwrite: settings?.allowOverwrite ?? true,
			},
		});

		await battle.save();
		logger.info(`Battle challenge created: ${battle._id} - ${battleName}`);

		return battle;
	}

	/**
	 * Challenge annehmen
	 */
	static async acceptChallenge(battleId: string, userId: string): Promise<IBattle> {
		const battle = await BattleModel.findById(battleId);
		if (!battle) {
			throw new HttpError(404, 'Battle not found');
		}

		if (battle.status !== 'pending') {
			throw new HttpError(400, 'Battle is not pending');
		}

		// Prüfe ob User admin/owner der Opponent-Gruppe ist
		const opponentGroup = await GroupModel.findById(battle.opponent.groupId);
		if (!opponentGroup) {
			throw new HttpError(404, 'Opponent group not found');
		}

		const member = opponentGroup.members.find((m) => m.userId === userId);
		if (!member || member.role === 'member') {
			throw new HttpError(403, 'Only admins or owners can accept challenges');
		}

		// Erstelle PixelBoard für dieses Battle
		const pixelBoard = new PixelBoardModel({
			seasonId: String(battle._id), // Wir nutzen seasonId-Feld für battleId
			gridWidth: battle.settings.gridSize,
			gridHeight: battle.settings.gridSize,
			pixels: [],
		});

		await pixelBoard.save();

		// Update Battle
		battle.status = 'active';
		battle.acceptedAt = new Date();
		battle.startDate = new Date();
		battle.endDate = new Date(Date.now() + battle.settings.duration * 60 * 1000);
		battle.pixelBoardId = String(pixelBoard._id);

		await battle.save();
		logger.info(`Battle accepted: ${battle._id} - starts now, ends ${battle.endDate}`);

		return battle;
	}

	/**
	 * Challenge ablehnen
	 */
	static async declineChallenge(battleId: string, userId: string): Promise<IBattle> {
		const battle = await BattleModel.findById(battleId);
		if (!battle) {
			throw new HttpError(404, 'Battle not found');
		}

		if (battle.status !== 'pending') {
			throw new HttpError(400, 'Battle is not pending');
		}

		// Prüfe ob User zur Opponent-Gruppe gehört
		const opponentGroup = await GroupModel.findById(battle.opponent.groupId);
		if (!opponentGroup) {
			throw new HttpError(404, 'Opponent group not found');
		}

		const member = opponentGroup.members.find((m) => m.userId === userId);
		if (!member || member.role === 'member') {
			throw new HttpError(403, 'Only admins or owners can decline challenges');
		}

		battle.status = 'declined';
		await battle.save();

		logger.info(`Battle declined: ${battle._id}`);
		return battle;
	}

	/**
	 * Challenge abbrechen (nur Challenger vor Accept)
	 */
	static async cancelChallenge(battleId: string, userId: string): Promise<IBattle> {
		const battle = await BattleModel.findById(battleId);
		if (!battle) {
			throw new HttpError(404, 'Battle not found');
		}

		if (battle.status !== 'pending') {
			throw new HttpError(400, 'Can only cancel pending battles');
		}

		// Prüfe ob User zur Challenger-Gruppe gehört
		const challengerGroup = await GroupModel.findById(battle.challenger.groupId);
		if (!challengerGroup) {
			throw new HttpError(404, 'Challenger group not found');
		}

		const member = challengerGroup.members.find((m) => m.userId === userId);
		if (!member || member.role === 'member') {
			throw new HttpError(403, 'Only admins or owners can cancel challenges');
		}

		battle.status = 'cancelled';
		await battle.save();

		logger.info(`Battle cancelled: ${battle._id}`);
		return battle;
	}

	// ==================== BATTLE MANAGEMENT ====================

	/**
	 * Battle manuell beenden (nur Admin/Owner der beteiligten Gruppen)
	 */
	static async endBattle(battleId: string, userId?: string): Promise<IBattle> {
		const battle = await BattleModel.findById(battleId);
		if (!battle) {
			throw new HttpError(404, 'Battle not found');
		}

		if (battle.status !== 'active') {
			throw new HttpError(400, 'Battle is not active');
		}

		// Autorisierung: User muss Admin/Owner einer beteiligten Gruppe sein
		if (userId) {
			const challengerGroup = await GroupModel.findById(battle.challenger.groupId);
			const opponentGroup = await GroupModel.findById(battle.opponent.groupId);

			const isChallengerAdmin = challengerGroup?.members.some(
				(m) => m.userId === userId && (m.role === 'admin' || m.role === 'owner')
			);
			const isOpponentAdmin = opponentGroup?.members.some(
				(m) => m.userId === userId && (m.role === 'admin' || m.role === 'owner')
			);

			if (!isChallengerAdmin && !isOpponentAdmin) {
				throw new HttpError(403, 'Only admins or owners of participating groups can end battles');
			}
		}

		return await this.completeBattle(battle);
	}

	/**
	 * Aufgeben
	 */
	static async surrender(battleId: string, groupId: string, userId: string): Promise<IBattle> {
		const battle = await BattleModel.findById(battleId);
		if (!battle) {
			throw new HttpError(404, 'Battle not found');
		}

		if (battle.status !== 'active') {
			throw new HttpError(400, 'Battle is not active');
		}

		// Prüfe ob Gruppe am Battle teilnimmt
		const isChallenger = battle.challenger.groupId === groupId;
		const isOpponent = battle.opponent.groupId === groupId;

		if (!isChallenger && !isOpponent) {
			throw new HttpError(403, 'Group is not participating in this battle');
		}

		// Prüfe ob User zur Gruppe gehört
		const group = await GroupModel.findById(groupId);
		if (!group) {
			throw new HttpError(404, 'Group not found');
		}

		const member = group.members.find((m) => m.userId === userId);
		if (!member || member.role === 'member') {
			throw new HttpError(403, 'Only admins or owners can surrender');
		}

		// Gewinner ist die andere Gruppe
		battle.winnerId = isChallenger ? battle.opponent.groupId : battle.challenger.groupId;
		battle.status = 'completed';
		battle.actualEndDate = new Date();

		await battle.save();
		logger.info(`Battle surrendered: ${battle._id} - Winner: ${battle.winnerId}`);

		return battle;
	}

	/**
	 * Battle abschließen (intern)
	 */
	private static async completeBattle(battle: IBattle): Promise<IBattle> {
		// Berechne Gewinner
		const winnerId = this.determineWinner(battle);

		battle.winnerId = winnerId;
		battle.status = 'completed';
		battle.actualEndDate = new Date();

		await battle.save();
		logger.info(`Battle completed: ${battle._id} - Winner: ${winnerId}`);

		return battle;
	}

	/**
	 * Gewinner bestimmen
	 */
	private static determineWinner(battle: IBattle): string | undefined {
		const { winCondition } = battle.settings;
		const challenger = battle.challenger;
		const opponent = battle.opponent;

		let challengerScore: number;
		let opponentScore: number;

		if (winCondition === 'pixels') {
			challengerScore = challenger.pixelsOwned;
			opponentScore = opponent.pixelsOwned;
		} else if (winCondition === 'xp') {
			challengerScore = challenger.totalXP;
			opponentScore = opponent.totalXP;
		} else {
			// Hybrid: 50% pixels + 50% xp (normalisiert)
			const maxPixels = Math.max(challenger.pixelsOwned, opponent.pixelsOwned, 1);
			const maxXP = Math.max(challenger.totalXP, opponent.totalXP, 1);
			challengerScore = (challenger.pixelsOwned / maxPixels) * 0.5 + (challenger.totalXP / maxXP) * 0.5;
			opponentScore = (opponent.pixelsOwned / maxPixels) * 0.5 + (opponent.totalXP / maxXP) * 0.5;
		}

		if (challengerScore > opponentScore) {
			return challenger.groupId;
		} else if (opponentScore > challengerScore) {
			return opponent.groupId;
		}

		// Unentschieden - kein Gewinner
		return undefined;
	}

	// ==================== PIXEL OPERATIONS ====================

	/**
	 * Pixel im Battle setzen
	 */
	static async setPixelsInBattle(data: {
		battleId: string;
		groupId: string;
		userId: string;
		coordinates: { x: number; y: number }[];
	}): Promise<IPixelBoard> {
		const { battleId, groupId, userId, coordinates } = data;

		const battle = await BattleModel.findById(battleId);
		if (!battle) {
			throw new HttpError(404, 'Battle not found');
		}

		if (battle.status !== 'active') {
			throw new HttpError(400, 'Battle is not active');
		}

		// Prüfe ob Battle abgelaufen
		if (battle.endDate && new Date() > battle.endDate) {
			await this.completeBattle(battle);
			throw new HttpError(400, 'Battle has ended');
		}

		// Prüfe ob Gruppe am Battle teilnimmt
		const isChallenger = battle.challenger.groupId === groupId;
		const isOpponent = battle.opponent.groupId === groupId;

		if (!isChallenger && !isOpponent) {
			throw new HttpError(403, 'Group is not participating in this battle');
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
		const board = await PixelBoardModel.findById(battle.pixelBoardId);
		if (!board) {
			throw new HttpError(404, 'PixelBoard not found');
		}

		// Setze Pixel
		for (const coord of coordinates) {
			if (coord.x < 0 || coord.x >= board.gridWidth || coord.y < 0 || coord.y >= board.gridHeight) {
				throw new HttpError(400, `Invalid coordinates: ${coord.x}, ${coord.y}`);
			}

			const existingPixelIndex = board.pixels.findIndex((p) => p.x === coord.x && p.y === coord.y);

			// Prüfe ob Overwrite erlaubt
			if (existingPixelIndex >= 0 && !battle.settings.allowOverwrite) {
				if (board.pixels[existingPixelIndex].groupId !== groupId) {
					throw new HttpError(400, 'Overwriting opponent pixels is not allowed in this battle');
				}
			}

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
				board.pixels[existingPixelIndex] = newPixel;
			} else {
				board.pixels.push(newPixel);
			}
		}

		await board.save();

		// Update Battle Stats
		await this.updateBattleStats(battle, board);

		return board;
	}

	/**
	 * XP zum Battle hinzufügen (aufgerufen von EntryService)
	 */
	static async addBattleXP(battleId: string, groupId: string, userId: string, xp: number): Promise<void> {
		const battle = await BattleModel.findById(battleId);
		if (!battle) return;

		if (battle.status !== 'active') return;

		// Finde das richtige Team
		const isChallenger = battle.challenger.groupId === groupId;
		const isOpponent = battle.opponent.groupId === groupId;

		if (!isChallenger && !isOpponent) return;

		const participant = isChallenger ? battle.challenger : battle.opponent;

		// Update Team XP
		participant.totalXP += xp;

		// Update oder erstelle Member-Eintrag
		const memberIndex = participant.members.findIndex((m) => m.userId === userId);
		if (memberIndex >= 0) {
			participant.members[memberIndex].contributedXP += xp;
		} else {
			participant.members.push({
				userId,
				contributedXP: xp,
				pixelsPlaced: 0,
			});
		}

		await battle.save();
	}

	/**
	 * Holt aktive Battles für eine Gruppe
	 */
	static async getActiveBattlesForGroup(groupId: string): Promise<IBattle[]> {
		return await BattleModel.find({
			$or: [{ 'challenger.groupId': groupId }, { 'opponent.groupId': groupId }],
			status: 'active',
		});
	}

	// ==================== QUERIES ====================

	/**
	 * Holt alle Battles eines Users (über seine Gruppen)
	 */
	static async getUserBattles(userId: string): Promise<IBattle[]> {
		// Finde alle Gruppen des Users
		const groups = await GroupModel.find({ 'members.userId': userId });
		const groupIds = groups.map((g) => String(g._id));

		return await BattleModel.find({
			$or: [{ 'challenger.groupId': { $in: groupIds } }, { 'opponent.groupId': { $in: groupIds } }],
		}).sort({ createdAt: -1 });
	}

	/**
	 * Holt aktive Battles eines Users
	 */
	static async getUserActiveBattles(userId: string): Promise<IBattle[]> {
		const groups = await GroupModel.find({ 'members.userId': userId });
		const groupIds = groups.map((g) => String(g._id));

		return await BattleModel.find({
			$or: [{ 'challenger.groupId': { $in: groupIds } }, { 'opponent.groupId': { $in: groupIds } }],
			status: 'active',
		});
	}

	/**
	 * Holt ausstehende Challenges für einen User
	 */
	static async getPendingChallenges(userId: string): Promise<IBattle[]> {
		// Finde Gruppen wo User admin/owner ist
		const groups = await GroupModel.find({
			members: {
				$elemMatch: {
					userId,
					role: { $in: ['admin', 'owner'] },
				},
			},
		});
		const groupIds = groups.map((g) => String(g._id));

		// Finde pending Battles wo diese Gruppen Opponent sind
		return await BattleModel.find({
			'opponent.groupId': { $in: groupIds },
			status: 'pending',
		}).sort({ challengedAt: -1 });
	}

	/**
	 * Holt Battle nach ID
	 */
	static async getBattleById(battleId: string): Promise<IBattle> {
		const battle = await BattleModel.findById(battleId);
		if (!battle) {
			throw new HttpError(404, 'Battle not found');
		}
		return battle;
	}

	/**
	 * Holt PixelBoard eines Battles
	 */
	static async getBattleBoard(battleId: string): Promise<IPixelBoard> {
		const battle = await BattleModel.findById(battleId);
		if (!battle) {
			throw new HttpError(404, 'Battle not found');
		}

		if (!battle.pixelBoardId) {
			throw new HttpError(404, 'Battle has no pixel board (not yet started)');
		}

		const board = await PixelBoardModel.findById(battle.pixelBoardId);
		if (!board) {
			throw new HttpError(404, 'PixelBoard not found');
		}

		return board;
	}

	/**
	 * Live-Score berechnen
	 */
	static async getLiveScore(battleId: string): Promise<{
		challenger: { pixels: number; xp: number; percentage: number };
		opponent: { pixels: number; xp: number; percentage: number };
		timeRemaining: number;
		status: string;
	}> {
		const battle = await BattleModel.findById(battleId);
		if (!battle) {
			throw new HttpError(404, 'Battle not found');
		}

		const totalPixels = battle.challenger.pixelsOwned + battle.opponent.pixelsOwned || 1;

		const timeRemaining = battle.endDate ? Math.max(0, battle.endDate.getTime() - Date.now()) / 1000 : 0;

		return {
			challenger: {
				pixels: battle.challenger.pixelsOwned,
				xp: battle.challenger.totalXP,
				percentage: (battle.challenger.pixelsOwned / totalPixels) * 100,
			},
			opponent: {
				pixels: battle.opponent.pixelsOwned,
				xp: battle.opponent.totalXP,
				percentage: (battle.opponent.pixelsOwned / totalPixels) * 100,
			},
			timeRemaining,
			status: battle.status,
		};
	}

	// ==================== INTERNAL HELPERS ====================

	/**
	 * Update Battle-Statistiken
	 */
	private static async updateBattleStats(battle: IBattle, board: IPixelBoard): Promise<void> {
		// Zähle Pixel pro Gruppe
		const challengerPixels = board.pixels.filter((p) => p.groupId === battle.challenger.groupId).length;
		const opponentPixels = board.pixels.filter((p) => p.groupId === battle.opponent.groupId).length;

		battle.challenger.pixelsOwned = challengerPixels;
		battle.opponent.pixelsOwned = opponentPixels;

		await battle.save();
	}

	/**
	 * Prüft und beendet abgelaufene Battles (für Cron-Job)
	 */
	static async checkAndCompleteExpiredBattles(): Promise<number> {
		const expiredBattles = await BattleModel.find({
			status: 'active',
			endDate: { $lte: new Date() },
		});

		let completed = 0;
		for (const battle of expiredBattles) {
			try {
				await this.completeBattle(battle);
				completed++;
			} catch (error) {
				logger.error(`Failed to complete battle ${battle._id}`, error);
			}
		}

		return completed;
	}
}
