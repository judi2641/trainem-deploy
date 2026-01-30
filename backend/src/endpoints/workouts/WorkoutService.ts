import WorkoutModel from './WorkoutModel';
import { logger } from '../../utils/logger';
import { HttpError } from '../../errors/HttpError';
import ExerciseModel from '../exercises/ExerciseModel';


/**
 *
 * @param auth0Id
 * @param name
 * @param description
 * @returns created empty workout to to auth0Id, name and description
 */
export async function createEmptyWorkout(auth0Id: String, name: String, description: String) {
	const workout = new WorkoutModel({ auth0Id, name, description });

	try {
		await workout.save();
	} catch (error) {
		logger.error('failed to create InitialUser', error);
		throw new HttpError(404, 'failed to create a user');
	}

	logger.info(`created workout ${name}`);

	return workout;
}

/**
 *
 * @param exerciseName
 * @param workoutId
 * @param sets
 * @param reps
 * @param duration
 * @returns workout with added exercise
 */
export async function addExerciseToWorkout(
	exerciseName: String,
	workoutId: String,
	sets?: Number,
	reps?: Number,
	duration?: Number,
) {
	const workout = await WorkoutModel.findById(workoutId);

	if (!workout) {
		logger.error('could not find wourkout');
		throw new HttpError(404, 'could not find workout');
	}
	const exercise = await ExerciseModel.findOne({ name: exerciseName });

	if (!exercise) {
		logger.error(`could not find exercise ${exerciseName}`);
		throw new HttpError(404, `could not find exercise ${exerciseName}`);
	}

	const workoutExercise = {
		exercise: exercise.toObject(),
		sets: sets,
		reps: reps,
		duration: duration,
	};

	workout.exercises.push(workoutExercise);
	return await workout.save();
}
/**
 *
 * @param auth0Id
 * @returns workout array
 */
export async function getAllWorkoutsFromUser(auth0Id: string){
try {
	const workouts:any[] = await WorkoutModel.find({ auth0Id:auth0Id });
	return workouts;
  } catch (error) {
	logger.error('getAllWorkoutsFromUser failed', error);
	if (error instanceof HttpError) throw error;
	throw new HttpError(500, 'failed to get workouts');
  }
}

/**
 * Update a workout
 * @param workoutId
 * @param auth0Id - for authorization check
 * @param updates - fields to update
 * @returns updated workout
 */
export async function updateWorkout(
	workoutId: string,
	auth0Id: string,
	updates: { name?: string; description?: string }
) {
	try {
		const workout = await WorkoutModel.findById(workoutId);
		if (!workout) {
			throw new HttpError(404, 'Workout not found');
		}
		if (workout.auth0Id !== auth0Id) {
			throw new HttpError(403, 'Not authorized to update this workout');
		}

		const updatedWorkout = await WorkoutModel.findByIdAndUpdate(
			workoutId,
			{ $set: updates },
			{ new: true }
		);
		logger.info(`updated workout ${workoutId}`);
		return updatedWorkout;
	} catch (error) {
		logger.error('updateWorkout failed', error);
		if (error instanceof HttpError) throw error;
		throw new HttpError(500, 'failed to update workout');
	}
}

/**
 * Delete a workout
 * @param workoutId
 * @param auth0Id - for authorization check
 */
export async function deleteWorkout(workoutId: string, auth0Id: string) {
	try {
		const workout = await WorkoutModel.findById(workoutId);
		if (!workout) {
			throw new HttpError(404, 'Workout not found');
		}
		if (workout.auth0Id !== auth0Id) {
			throw new HttpError(403, 'Not authorized to delete this workout');
		}

		await WorkoutModel.findByIdAndDelete(workoutId);
		logger.info(`deleted workout ${workoutId}`);
	} catch (error) {
		logger.error('deleteWorkout failed', error);
		if (error instanceof HttpError) throw error;
		throw new HttpError(500, 'failed to delete workout');
	}
}

/**
 * Remove exercise from workout
 * @param workoutId
 * @param auth0Id
 * @param exerciseIndex - index of exercise to remove
 */
export async function removeExerciseFromWorkout(
	workoutId: string,
	auth0Id: string,
	exerciseIndex: number
) {
	try {
		const workout = await WorkoutModel.findById(workoutId);
		if (!workout) {
			throw new HttpError(404, 'Workout not found');
		}
		if (workout.auth0Id !== auth0Id) {
			throw new HttpError(403, 'Not authorized to modify this workout');
		}
		if (exerciseIndex < 0 || exerciseIndex >= workout.exercises.length) {
			throw new HttpError(400, 'Invalid exercise index');
		}

		workout.exercises.splice(exerciseIndex, 1);
		await workout.save();
		logger.info(`removed exercise at index ${exerciseIndex} from workout ${workoutId}`);
		return workout;
	} catch (error) {
		logger.error('removeExerciseFromWorkout failed', error);
		if (error instanceof HttpError) throw error;
		throw new HttpError(500, 'failed to remove exercise from workout');
	}
}
