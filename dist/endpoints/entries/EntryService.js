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
exports.createEntry = createEntry;
exports.getAllEntriesFromUser = getAllEntriesFromUser;
exports.updateEntry = updateEntry;
exports.abortEntry = abortEntry;
const EntryModel_1 = __importDefault(require("./EntryModel"));
const logger_1 = require("../../utils/logger");
const HttpError_1 = require("../../errors/HttpError");
const WorkoutModel_1 = __importDefault(require("../workouts/WorkoutModel"));
const UserModel_1 = __importDefault(require("../users/UserModel"));
/**
 *
 * @param entryId
 * @param workoutId?
 * @param habitId?
 * @param date
 * @returns created entry
 */
function createEntry(auth0Id_1, workoutId_1, habitId_1) {
    return __awaiter(this, arguments, void 0, function* (auth0Id, workoutId, habitId, date = new Date()) {
        try {
            if (!workoutId && !habitId)
                throw new HttpError_1.HttpError(400, 'workoutId or habitId required');
            if (workoutId && habitId)
                throw new HttpError_1.HttpError(400, 'only one of workoutId or habitId allowed');
            if (workoutId) {
                const workout = yield WorkoutModel_1.default.findById(workoutId);
                if (!workout)
                    throw new HttpError_1.HttpError(404, 'workout not found');
                return yield EntryModel_1.default.create({
                    auth0Id,
                    date,
                    workoutId,
                    plannedExercises: workout.exercises.toObject(),
                    completed_exercises: [],
                    completed: false,
                    score: 0
                });
            }
            return yield EntryModel_1.default.create({
                auth0Id,
                date,
                habitId,
                plannedExercises: [],
                completed_exercises: [],
                completed: true,
                score: 10
            });
        }
        catch (error) {
            logger_1.logger.error('createEntry failed', error);
            if (error instanceof HttpError_1.HttpError)
                throw error;
            throw new HttpError_1.HttpError(500, 'failed to create entry');
        }
    });
}
/**
 *
 * @param auth0Id
 * @returns entry array
 */
function getAllEntriesFromUser(auth0Id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield EntryModel_1.default.find({ auth0Id }).sort({ date: -1 });
        }
        catch (error) {
            logger_1.logger.error('getAllEntriesFromUser failed', error);
            if (error instanceof HttpError_1.HttpError)
                throw error;
            throw new HttpError_1.HttpError(500, 'failed to get entries');
        }
    });
}
/**
 *
 * @param entryId
 * @param exerciseName
 * @param weight
 * @returns updated entry
 */
function updateEntry(entryId, exerciseName, weight, duration) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const entry = yield EntryModel_1.default.findById(entryId);
            if (!entry)
                throw new HttpError_1.HttpError(404, 'entry not found');
            const idx = entry.plannedExercises.findIndex((x) => { var _a; return ((_a = x.exercise) === null || _a === void 0 ? void 0 : _a.name) === exerciseName; });
            if (idx === -1)
                throw new HttpError_1.HttpError(400, 'exercise not found in plannedExercises');
            const ex = entry.plannedExercises[idx];
            // wichtig: plain object
            const exObj = ex.toObject ? ex.toObject() : ex;
            entry.plannedExercises.splice(idx, 1);
            entry.completed_exercises.push(Object.assign(Object.assign({}, exObj), { weight: weight !== null && weight !== void 0 ? weight : exObj.weight, duration: duration !== null && duration !== void 0 ? duration : exObj.duration }));
            if (entry.plannedExercises.length === 0) {
                entry.completed = true;
            }
            entry.score = ((_a = entry.score) !== null && _a !== void 0 ? _a : 0) + 67;
            yield entry.save();
            const user = yield UserModel_1.default.findOneAndUpdate({ auth0Id: entry.auth0Id }, { $inc: { points: 67 } }, { new: true });
            if (!user)
                throw new HttpError_1.HttpError(404, 'user not found');
            return entry;
        }
        catch (error) {
            logger_1.logger.error('updateEntryByExerciseName failed', error);
            if (error instanceof HttpError_1.HttpError)
                throw error;
            throw new HttpError_1.HttpError(500, 'failed to update entry');
        }
    });
}
function abortEntry(entryId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const entry = yield EntryModel_1.default.findByIdAndUpdate(entryId, {
                $set: { completed: true },
            }, { new: true, runValidators: true });
            if (!entry)
                throw new HttpError_1.HttpError(404, 'entry not found');
            return entry;
        }
        catch (error) {
            logger_1.logger.error('abortEntry failed', error);
            if (error instanceof HttpError_1.HttpError)
                throw error;
            throw new HttpError_1.HttpError(500, 'failed to abort entry');
        }
    });
}
