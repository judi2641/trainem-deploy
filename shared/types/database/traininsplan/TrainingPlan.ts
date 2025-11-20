import { Types } from 'mongoose';
import { ITask } from './Task';


export interface ITrainingsPlan {
	_id?: Types.ObjectId;
	userID: Types.ObjectId;
	name: string;
	tasks: ITask[];
}
