import { Types } from 'mongoose';
import { logger } from '../../utils/logger';
import { HttpError } from '../../errors/HttpError';
import { TrainingsPlanModel } from '../workouts/WorkoutModel';
import CompletedTaskModel from '../models/ExerciseModel';
import { addPoints } from '../users/UserService';

export async function createCompletedTask(id: string, auth0Id: string) {
	try {
		if (!Types.ObjectId.isValid(id)) {
			logger.error(`${id} is not a valid mongoose id`);
			throw new HttpError(400, `${id} is not a valid mongoose id`);
		}
		const mongoose_id = new Types.ObjectId(id);

		const trainingsplan = await TrainingsPlanModel.findOne({ 'tasks._id': mongoose_id });

		if (!trainingsplan) {
			logger.error('task does not exist');
			throw new HttpError(400, 'task does not exist');
		}

		const task = trainingsplan.tasks.find((task) => task._id?.toString() === id);

		if (!task) {
			logger.error(`task does not exist in trainingsplan`);
			throw new HttpError(400, 'task does not exist in trainingsplan');
		}

		const completedTask = new CompletedTaskModel({
			auth0Id: auth0Id,
			taskID: id,
			title: task.title,
			description: task.description,
			difficulty: task.difficulty,
			day: task.day,
			doneAt: Date.now(),
			planName: trainingsplan.name,
		});

		const factor =
			completedTask.difficulty == 'easy' ? 1 : completedTask.difficulty == 'middle' ? 2 : 3;

		await addPoints(auth0Id, 50 * factor);
		completedTask.save();
	} catch (error) {
		if (error instanceof HttpError) {
			throw error;
		} else {
			logger.error(error);
			throw new HttpError(400, 'failed to create completed task');
		}
	}
}

export async function getAllCompletedTaskByAuthId(auth0Id: string) {
	try {
		if (!auth0Id) {
			logger.error('auth0Id is missing');
			throw new HttpError(400, 'auth0id is missing');
		}
		const tasks = await CompletedTaskModel.find({ auth0Id: auth0Id });
		return tasks;
	} catch (error) {
		if (error instanceof HttpError) {
			throw error;
		} else {
			logger.error('failed to get all completed tasks');
			throw new HttpError(400, 'failed to get all completedTasks');
		}
	}
}
