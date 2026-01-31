"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEmptyWorkout = createEmptyWorkout;
exports.addExerciseToWorkout = addExerciseToWorkout;
exports.getAllWorkoutsFromUser = getAllWorkoutsFromUser;
const WorkoutModel_1 = __importDefault(require("./WorkoutModel"));
const logger_1 = require("../../utils/logger");
const HttpError_1 = require("../../errors/HttpError");
const ExerciseModel_1 = __importDefault(require("../exercises/ExerciseModel"));
/**
 *
 * @param auth0Id
 * @param name
 * @param description
 * @returns created empty workout to to auth0Id, name and description
 */
function createEmptyWorkout(auth0Id, name, description) {
    return __awaiter(this, void 0, void 0, function* () {
        const workout = new WorkoutModel_1.default({ auth0Id, name, description });
        try {
            yield workout.save();
        }
        catch (error) {
            logger_1.logger.error('failed to create InitialUser', error);
            throw new HttpError_1.HttpError(404, 'failed to create a user');
        }
        logger_1.logger.info(`created workout ${name}`);
        return workout;
    });
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
function addExerciseToWorkout(exerciseName, workoutId, sets, reps, duration) {
    return __awaiter(this, void 0, void 0, function* () {
        const workout = yield WorkoutModel_1.default.findById(workoutId);
        if (!workout) {
            logger_1.logger.error('could not find wourkout');
            throw new HttpError_1.HttpError(404, 'could not find workout');
        }
        const exercise = yield ExerciseModel_1.default.findOne({ name: exerciseName });
        if (!exercise) {
            logger_1.logger.error(`could not find exercise ${exerciseName}`);
            throw new HttpError_1.HttpError(404, `could not find exercise ${exerciseName}`);
        }
        const workoutExercise = {
            exercise: exercise.toObject(),
            sets: sets,
            reps: reps,
            duration: duration,
        };
        workout.exercises.push(workoutExercise);
        return yield workout.save();
    });
}
/**
 *
 * @param auth0Id
 * @returns workout array
 */
function getAllWorkoutsFromUser(auth0Id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const workouts = yield WorkoutModel_1.default.find({ auth0Id: auth0Id });
            return workouts;
        }
        catch (error) {
            logger_1.logger.error('getAllWorkoutsFromUser failed', error);
            if (error instanceof HttpError_1.HttpError)
                throw error;
            throw new HttpError_1.HttpError(500, 'failed to get workouts');
        }
    });
}
