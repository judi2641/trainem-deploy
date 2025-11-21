import express, { Request, Response } from 'express';
import { ITask } from '../../../../shared/types/database/traininsplan/Task';
import {
	createTask,
	getTasksByUserID,
	getTasksByTrainingsplanID,
	updateTask,
	deleteTask,
} from './TaskService';
import { logger } from '../../utils/logger';
import { HttpError } from '../../errors/HttpError';

const router = express.Router();

/**
 * CREATE Task
 */
router.post('/', async (req: Request, res: Response) => {
	try {
		const taskData: ITask = req.body;
		const task = await createTask(taskData);
		res.status(201).json(task);
	} catch (error) {
		logger.error(error);
		handleError(res, error);
	}
});

/**
 * GET tasks by userID
 */
router.get('/user/:userID', async (req: Request, res: Response) => {
	try {
		const tasks = await getTasksByUserID(req.params.userID);
		res.status(200).json(tasks);
	} catch (error) {
		handleError(res, error);
	}
});

/**
 * GET tasks by trainingsplanID
 */
router.get('/plan/:trainingsplanID', async (req: Request, res: Response) => {
	try {
		const tasks = await getTasksByTrainingsplanID(req.params.trainingsplanID);
		res.status(200).json(tasks);
	} catch (error) {
		handleError(res, error);
	}
});

/**
 * UPDATE task
 */
router.patch('/:taskID', async (req: Request, res: Response) => {
	try {
		const updatedTask = await updateTask(req.params.taskID, req.body);
		res.status(200).json(updatedTask);
	} catch (error) {
		handleError(res, error);
	}
});

/**
 * DELETE task
 */
router.delete('/:taskID', async (req: Request, res: Response) => {
	try {
		await deleteTask(req.params.taskID);
		res.status(204).send();
	} catch (error) {
		handleError(res, error);
	}
});

/**
 * Local helper
 */
function handleError(res: Response, error: any) {
	if (error instanceof HttpError) {
		return res.status(error.status).json({ error: error.message });
	}
	return res.status(500).json({ error: 'An unknown error occurred' });
}

export default router;
