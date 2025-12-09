import express, { Request, Response } from 'express';
import { createCompletedTask, getAllCompletedTaskByAuthId } from './CompletedTaskService';
import { HttpError } from '../../errors/HttpError';
import { logger } from '../../utils/logger';

const router = express();

router.post('/:auth0ID', async (req: Request, res: Response) => {
	try {
		const taskId = req.body.id;
		await createCompletedTask(taskId, req.params.auth0ID);
		res.status(201).send();
	} catch (error) {
		if (error instanceof HttpError) {
			res.status(error.status).json({ error: error.message });
		} else {
			logger.error(error);
			res.status(500).json({ error: 'unkown error' });
		}
	}
});

router.get('/:auth0Id', async (req: Request, res: Response) => {
	try {
		const auth0Id = req.params.auth0Id;
		if (!auth0Id) {
			logger.error('auth0ID is missing');
			res.status(400).json({ error: 'auth0ID is missing' });
		}
		const tasks = await getAllCompletedTaskByAuthId(auth0Id);
		res.status(200).json(tasks);
	} catch (error) {
		if (error instanceof HttpError) {
			res.status(error.status).json({ error: error.message });
		} else {
			logger.error(error);
			res.status(500).json({ error: 'unkown error' });
		}
	}
});

export default router;
