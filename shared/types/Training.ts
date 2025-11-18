import { ObjectId } from 'mongoose';
import { trainingDayType } from './User';

export interface ITrainingsplan {
	userID: ObjectId;
	name: string;
	tasks: ITask[];
}

export interface ITask {
	userID: ObjectId;
	trainingsplanID: ObjectId;
	title: string;
	description: string;
	difficulty: difficultyType;
	day: trainingDayType;
}

export const DIFFICULTY = {
	lvl1: 'easy',
	lvl2: 'middle',
	lvl3: 'hard',
};
export type difficultyType = (typeof DIFFICULTY)[keyof typeof DIFFICULTY];

export interface ICompletedTask extends ITask {
	taskID: ObjectId; // the task id by creation
	doneAt: Date; // from Mongoose createdAt...
}

// TODO: Move Traingsdays here?
// TODO: should all the onboading data be here?
