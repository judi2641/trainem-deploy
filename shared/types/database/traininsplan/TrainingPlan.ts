import type { ITask } from './Task';


export interface ITrainingsPlan {
	auth0ID: string;
	name: string;
	tasks: ITask[];
}
