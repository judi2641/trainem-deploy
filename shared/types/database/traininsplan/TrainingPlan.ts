import type { Types } from 'mongoose';
import type { ITask } from './Task';

/**
 * Domian Type
 *
 * Fields:
 * - userID 	required UID (MongoDB)
 * - name 		required string
 * - tasks		{@link ITask}
 * - category 	optional string
 */
export interface ITrainingsplan {
	_id?: string;
	userID: Types.ObjectId;
	name: string;
	tasks: ITask[];
	category?: string;
}
