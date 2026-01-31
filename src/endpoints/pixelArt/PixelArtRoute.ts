import express, { Request, Response } from 'express';
import { HttpError } from '../../errors/HttpError';
import { logger } from '../../utils/logger';
import { getPixelArt, savePixelArt } from './PixelArtService';

const router = express();

router.post('/:auth0ID', async (req: Request, res: Response) => {
	try {
		const pixelArt = await savePixelArt(req.params.auth0ID, req.body);
		res.status(200).json(pixelArt);
	} catch (error) {
		if (error instanceof HttpError) {
			logger.error(error.message);
			res.status(error.status).json({ error: error.message });
		} else {
			logger.error(error);
			res.status(500).json({ error: 'unkown error' });
		}
	}
});

router.get('/:auth0ID', async (req: Request, res: Response) => {
	try {
		const pixelArt = await getPixelArt(req.params.auth0ID);
		res.status(200).json(pixelArt);
	} catch (error) {
		if (error instanceof HttpError) {
			logger.error(error.message);
			res.status(error.status).json({ error: error.message });
		} else {
			logger.error(error);
			res.status(500).json({ error: 'unkown error' });
		}
	}
});

export default router;
