import type { ITask } from './traininsplan/Task';

// completedTask is stored in database

export interface ICompletedTask extends ITask {
	auth0Id: string;
	_id?: string;
	taskID: string; // the task id by creation
	doneAt: Date; // from Mongoose createdAt...
	planName: string;
}
