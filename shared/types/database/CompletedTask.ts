import type { ITask } from './traininsplan/Task';

// completedTask is stored in database

export interface ICompletedTask extends ITask {
	_id?: string;
	taskID: string; // the task id by creation
	doneAt: Date; // from Mongoose createdAt...
}
