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
	return await WorkoutModel.find({ auth0Id:auth0Id });
  } catch (error) {
	logger.error('getAllWorkoutsFromUser failed', error);
	if (error instanceof HttpError) throw error;
	throw new HttpError(500, 'failed to get workouts');
  }
}
