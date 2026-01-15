import EntryModel from './EntryModel';
import { logger } from '../../utils/logger';
import { HttpError } from '../../errors/HttpError';
export async function createEntry(auth0Id: string,workoutId: string){
    try{

    }
}
export async function getAllEntriesFromUser() {
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
