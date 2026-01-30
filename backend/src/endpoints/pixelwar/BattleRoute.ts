import { Router, Request, Response } from 'express';
import { BattleService } from './BattleService';
import { HttpError } from '../../errors/HttpError';
import mongoose from 'mongoose';

const router = Router();

// Hilfsfunktion: Validiert MongoDB ObjectId
function isValidObjectId(id: string): boolean {
	return mongoose.Types.ObjectId.isValid(id);
}

// Hilfsfunktion: Sanitize String Input (verhindert XSS)
function sanitizeString(input: string | undefined, maxLength: number = 100): string | undefined {
	if (!input) return undefined;
	return input
		.slice(0, maxLength)
		.replace(/[<>]/g, '') // Entferne HTML Tags
		.trim();
}

// Konstanten für Limits
const MAX_COORDINATES_PER_REQUEST = 50;

/**
 * POST /api/pixelwar/battles
 * Erstellt eine neue Challenge
 */
router.post('/', async (req: Request, res: Response) => {
	try {
		const { challengerGroupId, opponentGroupId, challengerUserId, name, description, settings } = req.body;

		if (!challengerGroupId || !opponentGroupId || !challengerUserId) {
			throw new HttpError(400, 'Missing required fields: challengerGroupId, opponentGroupId, challengerUserId');
		}

		// Validiere ObjectIds
		if (!isValidObjectId(challengerGroupId) || !isValidObjectId(opponentGroupId)) {
			throw new HttpError(400, 'Invalid group ID format');
		}

		const battle = await BattleService.createChallenge({
			challengerGroupId,
			opponentGroupId,
			challengerUserId,
			name: sanitizeString(name, 100),
			description: sanitizeString(description, 500),
			settings,
		});

		return res.status(201).json(battle);
	} catch (error: any) {
		const statusCode = error.status || 500;
		return res.status(statusCode).json({ error: error.message });
	}
});

/**
 * GET /api/pixelwar/battles
 * Holt alle Battles eines Users
 */
router.get('/', async (req: Request, res: Response) => {
	try {
		const userId = req.query.userId as string;

		if (!userId) {
			throw new HttpError(400, 'Missing userId query parameter');
		}

		const battles = await BattleService.getUserBattles(userId);
		return res.json(battles);
	} catch (error: any) {
		const statusCode = error.status || 500;
		return res.status(statusCode).json({ error: error.message });
	}
});

/**
 * GET /api/pixelwar/battles/active
 * Holt aktive Battles eines Users
 */
router.get('/active', async (req: Request, res: Response) => {
	try {
		const userId = req.query.userId as string;

		if (!userId) {
			throw new HttpError(400, 'Missing userId query parameter');
		}

		const battles = await BattleService.getUserActiveBattles(userId);
		return res.json(battles);
	} catch (error: any) {
		const statusCode = error.status || 500;
		return res.status(statusCode).json({ error: error.message });
	}
});

/**
 * GET /api/pixelwar/battles/pending
 * Holt ausstehende Challenges für einen User
 */
router.get('/pending', async (req: Request, res: Response) => {
	try {
		const userId = req.query.userId as string;

		if (!userId) {
			throw new HttpError(400, 'Missing userId query parameter');
		}

		const battles = await BattleService.getPendingChallenges(userId);
		return res.json(battles);
	} catch (error: any) {
		const statusCode = error.status || 500;
		return res.status(statusCode).json({ error: error.message });
	}
});

/**
 * GET /api/pixelwar/battles/:battleId
 * Holt Battle Details
 */
router.get('/:battleId', async (req: Request, res: Response) => {
	try {
		const { battleId } = req.params;

		if (!isValidObjectId(battleId)) {
			throw new HttpError(400, 'Invalid battle ID format');
		}

		const battle = await BattleService.getBattleById(battleId);
		return res.json(battle);
	} catch (error: any) {
		const statusCode = error.status || 500;
		return res.status(statusCode).json({ error: error.message });
	}
});

/**
 * POST /api/pixelwar/battles/:battleId/accept
 * Challenge annehmen
 */
router.post('/:battleId/accept', async (req: Request, res: Response) => {
	try {
		const { battleId } = req.params;
		const { userId } = req.body;

		if (!isValidObjectId(battleId)) {
			throw new HttpError(400, 'Invalid battle ID format');
		}

		if (!userId) {
			throw new HttpError(400, 'Missing userId');
		}

		const battle = await BattleService.acceptChallenge(battleId, userId);
		return res.json(battle);
	} catch (error: any) {
		const statusCode = error.status || 500;
		return res.status(statusCode).json({ error: error.message });
	}
});

/**
 * POST /api/pixelwar/battles/:battleId/decline
 * Challenge ablehnen
 */
router.post('/:battleId/decline', async (req: Request, res: Response) => {
	try {
		const { battleId } = req.params;
		const { userId } = req.body;

		if (!isValidObjectId(battleId)) {
			throw new HttpError(400, 'Invalid battle ID format');
		}

		if (!userId) {
			throw new HttpError(400, 'Missing userId');
		}

		const battle = await BattleService.declineChallenge(battleId, userId);
		return res.json(battle);
	} catch (error: any) {
		const statusCode = error.status || 500;
		return res.status(statusCode).json({ error: error.message });
	}
});

/**
 * POST /api/pixelwar/battles/:battleId/cancel
 * Challenge abbrechen (nur Challenger vor Accept)
 */
router.post('/:battleId/cancel', async (req: Request, res: Response) => {
	try {
		const { battleId } = req.params;
		const { userId } = req.body;

		if (!isValidObjectId(battleId)) {
			throw new HttpError(400, 'Invalid battle ID format');
		}

		if (!userId) {
			throw new HttpError(400, 'Missing userId');
		}

		const battle = await BattleService.cancelChallenge(battleId, userId);
		return res.json(battle);
	} catch (error: any) {
		const statusCode = error.status || 500;
		return res.status(statusCode).json({ error: error.message });
	}
});

/**
 * POST /api/pixelwar/battles/:battleId/surrender
 * Aufgeben
 */
router.post('/:battleId/surrender', async (req: Request, res: Response) => {
	try {
		const { battleId } = req.params;
		const { groupId, userId } = req.body;

		if (!isValidObjectId(battleId)) {
			throw new HttpError(400, 'Invalid battle ID format');
		}

		if (!groupId || !userId) {
			throw new HttpError(400, 'Missing groupId or userId');
		}

		if (!isValidObjectId(groupId)) {
			throw new HttpError(400, 'Invalid group ID format');
		}

		const battle = await BattleService.surrender(battleId, groupId, userId);
		return res.json(battle);
	} catch (error: any) {
		const statusCode = error.status || 500;
		return res.status(statusCode).json({ error: error.message });
	}
});

/**
 * GET /api/pixelwar/battles/:battleId/board
 * Holt PixelBoard eines Battles
 */
router.get('/:battleId/board', async (req: Request, res: Response) => {
	try {
		const { battleId } = req.params;

		if (!isValidObjectId(battleId)) {
			throw new HttpError(400, 'Invalid battle ID format');
		}

		const board = await BattleService.getBattleBoard(battleId);
		return res.json(board);
	} catch (error: any) {
		const statusCode = error.status || 500;
		return res.status(statusCode).json({ error: error.message });
	}
});

/**
 * POST /api/pixelwar/battles/:battleId/pixels
 * Pixel setzen im Battle
 */
router.post('/:battleId/pixels', async (req: Request, res: Response) => {
	try {
		const { battleId } = req.params;
		const { groupId, userId, coordinates, color } = req.body;

		if (!isValidObjectId(battleId)) {
			throw new HttpError(400, 'Invalid battle ID format');
		}

		if (!groupId || !userId || !coordinates || !Array.isArray(coordinates)) {
			throw new HttpError(400, 'Missing or invalid fields: groupId, userId, coordinates');
		}

		if (!isValidObjectId(groupId)) {
			throw new HttpError(400, 'Invalid group ID format');
		}

		// Limit Koordinaten-Array um DoS zu verhindern
		if (coordinates.length > MAX_COORDINATES_PER_REQUEST) {
			throw new HttpError(400, `Maximum ${MAX_COORDINATES_PER_REQUEST} coordinates per request allowed`);
		}

		// Validiere Koordinaten-Format
		for (const coord of coordinates) {
			if (typeof coord.x !== 'number' || typeof coord.y !== 'number') {
				throw new HttpError(400, 'Coordinates must have numeric x and y values');
			}
			if (!Number.isInteger(coord.x) || !Number.isInteger(coord.y)) {
				throw new HttpError(400, 'Coordinates must be integers');
			}
		}

		const board = await BattleService.setPixelsInBattle({
			battleId,
			groupId,
			userId,
			coordinates,
			color, // Optional custom color
		});

		return res.json(board);
	} catch (error: any) {
		const statusCode = error.status || 500;
		return res.status(statusCode).json({ error: error.message });
	}
});

/**
 * GET /api/pixelwar/battles/:battleId/score
 * Live-Score abrufen
 */
router.get('/:battleId/score', async (req: Request, res: Response) => {
	try {
		const { battleId } = req.params;

		if (!isValidObjectId(battleId)) {
			throw new HttpError(400, 'Invalid battle ID format');
		}

		const score = await BattleService.getLiveScore(battleId);
		return res.json(score);
	} catch (error: any) {
		const statusCode = error.status || 500;
		return res.status(statusCode).json({ error: error.message });
	}
});

/**
 * POST /api/pixelwar/battles/:battleId/end
 * Battle manuell beenden (nur Admin/Owner der beteiligten Gruppen)
 */
router.post('/:battleId/end', async (req: Request, res: Response) => {
	try {
		const { battleId } = req.params;
		const { userId } = req.body;

		if (!isValidObjectId(battleId)) {
			throw new HttpError(400, 'Invalid battle ID format');
		}

		if (!userId) {
			throw new HttpError(400, 'Missing userId - authorization required');
		}

		const battle = await BattleService.endBattle(battleId, userId);
		return res.json(battle);
	} catch (error: any) {
		const statusCode = error.status || 500;
		return res.status(statusCode).json({ error: error.message });
	}
});

export default router;
