import { logger } from '../../utils/logger';
import { HttpError } from '../../errors/HttpError';
import HabitModel from './HabitModel';


/**
 *
 * @param auth0Id
 * @param name
 * @param type
 * @param description
 * @param weekday
 * @returns habit array
 */
export async function createHabit(auth0Id: String, name: String,type: string, description?: String,weekday?: number) {
	const habit = new HabitModel({ auth0Id, name,type,weekday, description });

	try {
		await habit.save();
	} catch (error) {
		logger.error('failed to create habit', error);
		throw new HttpError(404, 'failed to create a habit');
	}

	logger.info(`created habit ${name}`);

	return habit;
}
/**
 *
 * @param auth0Id
 * @returns habit array
 */
export async function getAllHabitsFromUser(auth0Id: string){
try {
	return await HabitModel.find({ auth0Id:auth0Id });
  } catch (error) {
	logger.error('getAllHabitsFromUser failed', error);
	if (error instanceof HttpError) throw error;
	throw new HttpError(500, 'failed to get habits');
  }
}
export async function deleteHabit(id:string){
	try{
		HabitModel.findByIdAndDelete(id);
	}
	 catch (error) {
	logger.error('deleteHabits failed', error);
	if (error instanceof HttpError) throw error;
	throw new HttpError(500, 'failed delete Habit');
  }
}