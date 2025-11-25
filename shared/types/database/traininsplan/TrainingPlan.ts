import type { Types } from 'mongoose';
import type { ITask } from './Task';

export interface ITrainingsPlan {
	_id?: Types.ObjectId;
	auth0ID: string;
	name: string;
	tasks: ITask[];
}
