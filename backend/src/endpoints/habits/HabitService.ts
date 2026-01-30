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

/**
 * Update a habit
 * @param habitId
 * @param auth0Id - for authorization check
 * @param updates - fields to update
 * @returns updated habit
 */
export async function updateHabit(
	habitId: string,
	auth0Id: string,
	updates: { name?: string; description?: string; type?: string; weekday?: number }
) {
	try {
		const habit = await HabitModel.findById(habitId);
		if (!habit) {
			throw new HttpError(404, 'Habit not found');
		}
		if (habit.auth0Id !== auth0Id) {
			throw new HttpError(403, 'Not authorized to update this habit');
		}

		const updatedHabit = await HabitModel.findByIdAndUpdate(
			habitId,
			{ $set: updates },
			{ new: true }
		);
		logger.info(`updated habit ${habitId}`);
		return updatedHabit;
	} catch (error) {
		logger.error('updateHabit failed', error);
		if (error instanceof HttpError) throw error;
		throw new HttpError(500, 'failed to update habit');
	}
}

/**
 * Delete a habit
 * @param habitId
 * @param auth0Id - for authorization check
 */
export async function deleteHabit(habitId: string, auth0Id: string) {
	try {
		const habit = await HabitModel.findById(habitId);
		if (!habit) {
			throw new HttpError(404, 'Habit not found');
		}
		if (habit.auth0Id !== auth0Id) {
			throw new HttpError(403, 'Not authorized to delete this habit');
		}

		await HabitModel.findByIdAndDelete(habitId);
		logger.info(`deleted habit ${habitId}`);
	} catch (error) {
		logger.error('deleteHabit failed', error);
		if (error instanceof HttpError) throw error;
		throw new HttpError(500, 'failed to delete habit');
	}
}