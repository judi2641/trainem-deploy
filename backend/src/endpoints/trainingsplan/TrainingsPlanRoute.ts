import express, { Request, Response } from 'express';
import { logger } from '../../utils/logger';
import {
	createDefaultTrainingsplanFromOnboarding,
	createEmptyTrainingsplan,
	createTaskForTrainingsplan,
	deleteTP,
	getAll,
	getTrainingsPlanByAuth0ID,
	//post,
	put,
} from './TrainingsPlanService';
import { HttpError } from '../../errors/HttpError';
import { getUserByAuth0id } from '../user/UserService';
import { Types } from 'mongoose';
import { isInt8Array } from 'util/types';
import { ITrainingsplanDokument, TrainingsPlanModel } from './TrainingsPlanModel';
import { ITrainingsplan } from '../../../../shared/types/database/traininsplan/TrainingPlan';

const router = express();

router.post('/:auth0ID', async (req: Request, res: Response) => {
	try {
		logger.info('creating default trainingplan');
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

/*
------------------------------------------------------------------------------
	CRUD for Traingsplan
	- There is no validation of the data atm. 
	// TODO: ADD validationMiddleware
------------------------------------------------------------------------------
*/

router.get('/trainingsplan/:auth0ID', async (req: Request, res: Response) => {
	try {
		const auth0ID = req.params.auth0ID;
		const plans: ITrainingsplanDokument[] = await getAll(auth0ID);
		res.status(200).json(plans);
	} catch (error) {
		logger.error(error);
		if (error instanceof HttpError) {
			res.status(error.status).json({ error: error.message });
		} else {
			res.status(500).json({ error: 'Internal Server Error' });
		}
	}
});

// router.post('/trainingsplan', async (req: Request, res: Response) => {
// 	try {
// 		const data: ITrainingsplan = req.body;
// 		const tp: ITrainingsplanDokument = await post(data);
// 		logger.info('Trainingsplan created');
// 		res.status(201).json(tp);
// 	} catch (error) {
// 		logger.error(error);
// 		res.status(500).json({ error: 'Internal Server Error' });
// 	}
// });

router.put('/trainingsplan/:_id', async (req: Request, res: Response) => {
	try {
		const { name, tasks, category } = req.body;
		const updates: Partial<Omit<ITrainingsplan, 'userID'>> = { name, tasks, category };
		const updated: ITrainingsplanDokument = await put(req.params._id, updates);
		logger.info('Trainingsplan updated');
		res.status(200).json(updated);
	} catch (error) {
		if (error instanceof HttpError) {
			logger.error(error);
			res.status(error.status).json({ error: error.message });
		} else {
			res.status(500).json({ error: 'Internal Server Error' });
		}
	}
});

router.delete('/trainingsplan/:_id', async (req: Request, res: Response) => {
	try {
		await deleteTP(req.params._id);
		logger.info('Trainingsplan deleted');
		res.status(204).end();
	} catch (error) {
		if (error instanceof HttpError) {
			logger.error(error);
			res.status(error.status).json({ error: error.message });
		} else {
			res.status(500).json({ error: 'Internal Server Error' });
		}
	}
});

export default router;
