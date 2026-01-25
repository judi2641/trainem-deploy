import { Router, Request, Response } from 'express';
import { PixelWarService } from './PixelWarService';
import { HttpError } from '../../errors/HttpError';

const router = Router();

/**
 * POST /api/pixelwar/seasons
 * Erstellt eine neue Season
 */
router.post('/seasons', async (req: Request, res: Response) => {
	try {
		const { name, description, mode, startDate, endDate, gridWidth, gridHeight } = req.body;

		if (!name || !mode || !startDate || !endDate) {
			throw new HttpError(400, 'Missing required fields');
		}

		const season = await PixelWarService.createSeason({
			name,
			description,
			mode,
			startDate: new Date(startDate),
			endDate: new Date(endDate),
			gridWidth,
			gridHeight,
		});

		return res.status(201).json(season);
	} catch (error: any) {
		const statusCode = error.status || 500;
		return res.status(statusCode).json({ error: error.message });
	}
});

/**
 * GET /api/pixelwar/seasons/active
 * Holt die aktive Season
 */
router.get('/seasons/active', async (req: Request, res: Response) => {
	try {
		const season = await PixelWarService.getActiveSeason();
		if (!season) {
			return res.status(404).json({ error: 'No active season' });
		}
		return res.json(season);
	} catch (error: any) {
		const statusCode = error.status || 500;
		return res.status(statusCode).json({ error: error.message });
	}
});

/**
 * GET /api/pixelwar/seasons/:seasonId
 * Holt Season nach ID
 */
router.get('/seasons/:seasonId', async (req: Request, res: Response) => {
	try {
		const { seasonId } = req.params;
		const season = await PixelWarService.getSeasonById(seasonId);
		return res.json(season);
	} catch (error: any) {
		const statusCode = error.status || 500;
		return res.status(statusCode).json({ error: error.message });
	}
});

/**
 * POST /api/pixelwar/seasons/:seasonId/join
 * Gruppe tritt Season bei
 */
router.post('/seasons/:seasonId/join', async (req: Request, res: Response) => {
	try {
		const { seasonId } = req.params;
		const { groupId } = req.body;

		if (!groupId) {
			throw new HttpError(400, 'Missing groupId');
		}

		const season = await PixelWarService.joinSeason(seasonId, groupId);
		return res.json(season);
	} catch (error: any) {
		const statusCode = error.status || 500;
		return res.status(statusCode).json({ error: error.message });
	}
});

/**
 * GET /api/pixelwar/seasons/:seasonId/board
 * Holt PixelBoard für Season
 */
router.get('/seasons/:seasonId/board', async (req: Request, res: Response) => {
	try {
		const { seasonId } = req.params;
		const board = await PixelWarService.getPixelBoard(seasonId);
		return res.json(board);
	} catch (error: any) {
		const statusCode = error.status || 500;
		return res.status(statusCode).json({ error: error.message });
	}
});

/**
 * POST /api/pixelwar/seasons/:seasonId/pixels
 * Setzt Pixel auf dem Board
 */
router.post('/seasons/:seasonId/pixels', async (req: Request, res: Response) => {
	try {
		const { seasonId } = req.params;
		const { groupId, userId, coordinates } = req.body;

		if (!groupId || !userId || !coordinates || !Array.isArray(coordinates)) {
			throw new HttpError(400, 'Missing or invalid fields: groupId, userId, coordinates');
		}

		const board = await PixelWarService.setPixels({
			seasonId,
			groupId,
			userId,
			coordinates,
		});

		return res.json(board);
	} catch (error: any) {
		const statusCode = error.status || 500;
		return res.status(statusCode).json({ error: error.message });
	}
});

/**
 * GET /api/pixelwar/seasons/:seasonId/leaderboard
 * Holt Leaderboard
 */
router.get('/seasons/:seasonId/leaderboard', async (req: Request, res: Response) => {
	try {
		const { seasonId } = req.params;
		const leaderboard = await PixelWarService.getLeaderboard(seasonId);
		return res.json(leaderboard);
	} catch (error: any) {
		const statusCode = error.status || 500;
		return res.status(statusCode).json({ error: error.message });
	}
});

/**
 * POST /api/pixelwar/seasons/:seasonId/complete
 * Beendet eine Season
 */
router.post('/seasons/:seasonId/complete', async (req: Request, res: Response) => {
	try {
		const { seasonId } = req.params;
		const season = await PixelWarService.completeSeason(seasonId);
		return res.json(season);
	} catch (error: any) {
		const statusCode = error.status || 500;
		return res.status(statusCode).json({ error: error.message });
	}
});

export default router;
