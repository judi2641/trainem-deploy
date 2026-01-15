import EntryModel from './EntryModel';
import { logger } from '../../utils/logger';
import { HttpError } from '../../errors/HttpError';

export async function createEntry(auth0Id: string,workoutId?: string,habitId?:string){
    try{
		const workout = getWorkout(workoutId)
    }
}
export async function getAllEntriesFromUser(auth0Id:string) {
	try {
		const entries = await EntryModel.find({ auth0Id: auth0Id });
		return entries;
	} catch (error) {
		if (error instanceof HttpError) {
			throw error;
		} else {
			logger.error('failed to get all etries');
			throw new HttpError(400, 'failed to get all completedTasks');
		}
	}
}
export async function updateEntry(entryId:String,){
	
}
