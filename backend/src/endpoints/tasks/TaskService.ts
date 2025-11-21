import { TaskModel } from './TaskModel';
import { ITask } from '../../../../shared/types/database/traininsplan/Task';
import { HttpError } from '../../errors/HttpError';
import mongoose from 'mongoose';

/**
 * CREATE
 */
export async function createTask(data: ITask) {
	try {
		const task = await TaskModel.create(data);
		return task;
	} catch (err) {
		throw new HttpError(400, 'Could not create task');
	}
}

/**
 * GET by userID
 */
export async function getTasksByUserID(userID: string) {
	if (!mongoose.Types.ObjectId.isValid(userID)) {
		throw new HttpError(400, 'Invalid userID');
	}

	return TaskModel.find({ userID });
}

/**
 * GET by trainingsplanID
 */
export async function getTasksByTrainingsplanID(planID: string) {
	if (!mongoose.Types.ObjectId.isValid(planID)) {
		throw new HttpError(400, 'Invalid trainingsplanID');
	}

	return TaskModel.find({ trainingsplanID: planID });
}

/**
 * UPDATE task
 */
export async function updateTask(taskID: string, updateData: Partial<ITask>) {
	if (!mongoose.Types.ObjectId.isValid(taskID)) {
		throw new HttpError(400, 'Invalid taskID');
	}

	const updated = await TaskModel.findByIdAndUpdate(taskID, { $set: updateData }, { new: true });

	if (!updated) {
		throw new HttpError(404, 'Task not found');
	}

	return updated;
}

/**
 * DELETE task
 */
export async function deleteTask(taskID: string) {
	if (!mongoose.Types.ObjectId.isValid(taskID)) {
		throw new HttpError(400, 'Invalid taskID');
	}

	const deleted = await TaskModel.findByIdAndDelete(taskID);

	if (!deleted) {
		throw new HttpError(404, 'Task not found');
	}

	return true;
}
