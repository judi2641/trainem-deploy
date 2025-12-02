import type { Types } from 'mongoose';
import type { ITask } from './Task';

/**
 * Domian Type
 *
 * Fields:
 * - userID 	required UID (MongoDB)
 * - name 		required string
 * - tasks		{@link ITask}
 * - categorie 	optional string
 */
export interface ITrainingsplan {
	userID: Types.ObjectId;
	name: string;
	tasks: ITask[];
	categorie?: string;
}
