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
exports.createHabit = createHabit;
exports.getAllHabitsFromUser = getAllHabitsFromUser;
const logger_1 = require("../../utils/logger");
const HttpError_1 = require("../../errors/HttpError");
const HabitModel_1 = __importDefault(require("./HabitModel"));
/**
 *
 * @param auth0Id
 * @param name
 * @param type
 * @param description
 * @param weekday
 * @returns habit array
 */
function createHabit(auth0Id, name, type, description, weekday) {
    return __awaiter(this, void 0, void 0, function* () {
        const habit = new HabitModel_1.default({ auth0Id, name, type, weekday, description });
        try {
            yield habit.save();
        }
        catch (error) {
            logger_1.logger.error('failed to create habit', error);
            throw new HttpError_1.HttpError(404, 'failed to create a habit');
        }
        logger_1.logger.info(`created habit ${name}`);
        return habit;
    });
}
/**
 *
 * @param auth0Id
 * @returns habit array
 */
function getAllHabitsFromUser(auth0Id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield HabitModel_1.default.find({ auth0Id: auth0Id });
        }
        catch (error) {
            logger_1.logger.error('getAllHabitsFromUser failed', error);
            if (error instanceof HttpError_1.HttpError)
                throw error;
            throw new HttpError_1.HttpError(500, 'failed to get habits');
        }
    });
}
