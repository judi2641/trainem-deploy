import express, { Request, Response } from 'express';
import { logger } from '../../utils/logger';
import {
	createDefaultTrainingsplanFromOnboarding,
	createEmptyTrainingsplan,
	createTaskForTrainingsplan,
	getTrainingsPlanByAuth0ID,
} from './TrainingsPlanService';
import { HttpError } from '../../errors/HttpError';
import { getUserByAuth0id } from '../user/UserService';
import { Types } from 'mongoose';
import { isInt8Array } from 'util/types';

const router = express();

router.post('/:auth0ID', async (req: Request, res: Response) => {
	try {
		const user = await getUserByAuth0id(req.params.auth0ID);
		const plan = await createDefaultTrainingsplanFromOnboarding(
			user._id.toString(),
			req.body.onboarding,
		);
		res.status(201).json(plan);
	} catch (error) {
		logger.error(error);
		if (error instanceof HttpError) {
			res.status(error.status).json({ error: error.message });
		} else {
			res.status(500).json({ error: 'unkown error' });
		}
	}
});

router.get('/:auth0ID', async (req: Request, res: Response) => {
	try {
		const trainingsplans = await getTrainingsPlanByAuth0ID(req.params.auth0ID);
		res.status(200).json(trainingsplans);
	} catch (error) {
		if (error instanceof HttpError) {
			res.status(error.status).json({ error: error.message });
		} else {
			res.status(500).json({ error: 'unkown error' });
		}
	}
});

router.post('/tasks/:auth0ID/:trainingsplanID', async (req: Request, res: Response) => {
	try {
		const new_trainingsplans = await createTaskForTrainingsplan(
			new Types.ObjectId(req.params.trainingsplanID),
			req.body,
		);
		res.status(201).json(new_trainingsplans);
	} catch (error) {
		if (error instanceof HttpError) {
			res.status(error.status).json({ error: error.message });
		} else {
			logger.error(error);
			res.status(500).json({ error: 'unkown error' });
		}
	}
});

router.post('/createempty/:auth0ID/', async (req: Request, res: Response) => {
	try {
		const created_trainingsplan = await createEmptyTrainingsplan(
			req.body.name,
			req.params.auth0ID,
			req.body.category,
		);
		res.status(201).json(created_trainingsplan);
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
