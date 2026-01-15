import express, { Request, Response } from 'express';
import { HttpError } from '../../errors/HttpError';
import { createInitialUser, getUserByAuth0id, saveBasicUserInfo } from './UserService';
import { logger } from '../../utils/logger';

const router = express.Router();


router.post('/:auth0Id/basic', async (req: Request, res: Response) => {
	try {
		const user = await saveBasicUserInfo(req.params.auth0Id, req.body);
		res.status(200).json(user);
	} catch (error) {
		logger.error(error);
		if (error instanceof HttpError) {
			res.status(error.status).json({ error: error.message });
		} else {
			res.status(500).json({ error: 'unkonwn error' });
		}
	}
});

//after registration
router.post('/', async (req: Request, res: Response) => {
	try {
		const { auth0Id, email } = req.body;

		if (!auth0Id || !email) {
			return res.status(400).json({ error: 'email and auth0Id required' });
		}

		const user = await createInitialUser(auth0Id, email);
		return res.status(201).json(user);
	} catch (error) {
		if (error instanceof HttpError) {
			logger.error(error.message);
			return res.status(error.status).json({ error: error.message });
		} else {
			logger.error(error);
			return res.status(500).json({ error: 'unkown error' });
		}
	}
});

router.get('/:auth0Id', async (req: Request, res: Response) => {
	try {
		const user = await getUserByAuth0id(req.params.auth0Id);
		return res.status(200).json(user);
	} catch (error) {
		if (error instanceof HttpError) {
			logger.error(error.message);
			return res.status(error.status).json({ error: error.message });
		} else {
			logger.error(error);
			return res.status(500).json({ error: error });
		}
	}
});

export default router;
