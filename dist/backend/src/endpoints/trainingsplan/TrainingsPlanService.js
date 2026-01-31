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
exports.createTrainingsPlan = createTrainingsPlan;
exports.getAllTrainingsPlansByEmail = getAllTrainingsPlansByEmail;
exports.addTask = addTask;
exports.removeTask = removeTask;
exports.createDefaultTrainingsplanFromOnboarding = createDefaultTrainingsplanFromOnboarding;
exports.getTrainingsplansByUserID = getTrainingsplansByUserID;
const TrainingsPlanModel_1 = require("./TrainingsPlanModel");
const mongoose_1 = __importDefault(require("mongoose"));
const HttpError_1 = require("../../errors/HttpError");
const logger_1 = require("../../utils/logger");
const UserService_1 = require("../user/UserService");
function createTrainingsPlan(data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const trainingplan = new TrainingsPlanModel_1.TrainingsPlanModel(data);
            return trainingplan.save();
        }
        catch (error) {
            logger_1.logger.error("failed to create a trainingsplan", error);
            throw new HttpError_1.HttpError(400, "failed to create a trainingsplan");
        }
    });
}
function getAllTrainingsPlansByEmail(email) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield (0, UserService_1.getUserByEmail)(email);
        const trainingplan = yield TrainingsPlanModel_1.TrainingsPlanModel.find({ userID: user._id });
        logger_1.logger.info(trainingplan);
        if (!trainingplan) {
            logger_1.logger.error("no trainingsplan was found");
            throw new HttpError_1.HttpError(400, "no trainingsplan was found");
        }
        return trainingplan;
    });
}
function addTask(plan_id, task) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const updatedPlan = yield TrainingsPlanModel_1.TrainingsPlanModel.findByIdAndUpdate(plan_id, { $push: { tasks: task } }, { new: true });
            logger_1.logger.info("added task");
            return updatedPlan;
        }
        catch (error) {
            throw new HttpError_1.HttpError(400, "Failed to add a Task");
        }
    });
}
function removeTask(plan_id, task_id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const plan = yield TrainingsPlanModel_1.TrainingsPlanModel.findOne({
                _id: plan_id,
                "tasks._id": task_id,
            });
            if (!plan) {
                logger_1.logger.error("task does not exist");
                throw new HttpError_1.HttpError(400, "Task does not exist");
            }
            logger_1.logger.info("task exists");
            const new_trainingsplan = yield TrainingsPlanModel_1.TrainingsPlanModel.findByIdAndUpdate(plan_id, { $pull: { tasks: { _id: task_id } } }, { new: true });
            logger_1.logger.info("deleted task");
            return new_trainingsplan;
        }
        catch (error) {
            logger_1.logger.error("failed to remove a task");
            throw new HttpError_1.HttpError(400, "failed to remove a task");
        }
    });
}
const SESSION_TYPES = [
    'push',
    'pull',
    'legs',
    'upper',
    'lower',
    'full',
    'core',
    'conditioning',
];
// -------------------------------------
// Exercises je SessionType
// -------------------------------------
const DEFAULT_EXERCISES = {
    push: ['Bankdrücken', 'Schulterdrücken', 'Dips'],
    pull: ['Klimmzüge', 'Langhantelrudern', 'Face Pulls'],
    legs: ['Kniebeugen', 'Ausfallschritte', 'Beinpresse'],
    upper: ['Bankdrücken', 'Klimmzüge', 'Schulterdrücken'],
    lower: ['Kreuzheben', 'Kniebeugen', 'Beinpresse'],
    full: ['Kniebeugen', 'Bankdrücken', 'Klimmzüge'],
    core: ['Plank', 'Hanging Knee Raises', 'Russian Twists'],
    conditioning: ['Burpees', 'Mountain Climbers', 'Jumping Jacks'],
};
// -------------------------------------
// Experience -> Difficulty
// -------------------------------------
function mapDifficulty(exp, goal) {
    // Basis: Experience
    let difficulty = exp === 'pro' ? 'hard' : exp === 'intermediate' ? 'middle' : 'easy';
    // Optional kleine Anpassung nach Goal
    if (goal && goal.includes('senken') && difficulty === 'hard') {
        // Fettverlust + pro → eher middle
        difficulty = 'middle';
    }
    return difficulty;
}
// -------------------------------------
// Experience normalisieren
// -------------------------------------
function normalizeExperience(exp) {
    return exp !== null && exp !== void 0 ? exp : 'starter';
}
// -------------------------------------
// Trainingstage bestimmen
// -------------------------------------
function resolveTrainingDays(onboarding) {
    if (onboarding.trainingDays && onboarding.trainingDays.length > 0) {
        return onboarding.trainingDays;
    }
    // Fallback: 3-Tage-Plan (Mon/Wed/Fri) oder komplette Woche
    return ['Mon', 'Wed', 'Fri'];
}
// -------------------------------------
// SessionType pro Tag auswählen
// -------------------------------------
function decideSessionTypeForDay(index, totalDays, goal) {
    // Zielabhängige Grundrotation
    if (!goal || goal.includes('Muskelaufbau')) {
        // Fokus Muskelaufbau
        if (totalDays <= 2) {
            // bei 1–2 Tagen → Fullbody
            return 'full';
        }
        if (totalDays === 3) {
            return ['push', 'pull', 'legs'][index];
        }
        if (totalDays === 4) {
            return ['upper', 'lower', 'push', 'pull'][index];
        }
        // 5+ Tage → klassische Rotation
        const rotation = ['push', 'pull', 'legs', 'upper', 'lower'];
        return rotation[index % rotation.length];
    }
    // Ziel: Gewicht halten → ausgewogen
    if (goal.includes('halten')) {
        const rotation = ['full', 'upper', 'lower', 'push', 'pull', 'legs'];
        return rotation[index % rotation.length];
    }
    // Ziel: Gewicht senken → mehr Conditioning & Fullbody
    if (goal.includes('senken')) {
        const rotation = ['full', 'conditioning', 'full', 'core', 'conditioning'];
        return rotation[index % rotation.length];
    }
    // Fallback
    return 'full';
}
// -------------------------------------
// Description je Übung generieren
// -------------------------------------
function buildDescription(exerciseName, session, exp, goal, weight, height) {
    const baseLevel = exp === 'pro' ? 'fortgeschritten' : exp === 'intermediate' ? 'mittel' : 'Einsteiger';
    let repRange = '8–12 Wiederholungen';
    if (goal === null || goal === void 0 ? void 0 : goal.includes('senken'))
        repRange = '12–20 Wiederholungen';
    if (goal === null || goal === void 0 ? void 0 : goal.includes('halten'))
        repRange = '10–15 Wiederholungen';
    let extra = '';
    if (weight && weight > 100) {
        extra = ' Achte besonders auf saubere Technik und moderates Volumen.';
    }
    else if (weight && weight < 60) {
        extra = ' Fokus auf progressiven Aufbau von Kraft und Muskulatur.';
    }
    return `${session.toUpperCase()}-Session (${baseLevel}): ${repRange}.${extra}`;
}
// -------------------------------------
// Tasks für einen Tag generieren
// -------------------------------------
function generateTasksForDay(day, dayIndex, totalDays, onboarding, userID, trainingsplanID) {
    const exp = normalizeExperience(onboarding.experience);
    const goal = onboarding.goal;
    const sessionType = decideSessionTypeForDay(dayIndex, totalDays, goal);
    const difficulty = mapDifficulty(exp, goal);
    const exercises = DEFAULT_EXERCISES[sessionType];
    return exercises.map((exerciseName) => ({
        userID,
        trainingsplanID,
        title: exerciseName,
        description: buildDescription(exerciseName, sessionType, exp, goal, onboarding.weight, onboarding.height),
        difficulty,
        day,
    }));
}
// -------------------------------------
// HAUPTFUNKTION: Default Plan aus Onboarding
// -------------------------------------
function createDefaultTrainingsplanFromOnboarding(userID, onboarding) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c;
        if (!mongoose_1.default.Types.ObjectId.isValid(userID)) {
            throw new HttpError_1.HttpError(400, 'Invalid userID');
        }
        const userObjID = new mongoose_1.default.Types.ObjectId(userID);
        const days = resolveTrainingDays(onboarding);
        const exp = normalizeExperience(onboarding.experience);
        // Name dynamisch abhängig vom Ziel / Experience
        let name = 'Default Trainingsplan';
        if ((_a = onboarding.goal) === null || _a === void 0 ? void 0 : _a.includes('erhöhen')) {
            name = 'Muskelaufbau-Plan';
        }
        else if ((_b = onboarding.goal) === null || _b === void 0 ? void 0 : _b.includes('senken')) {
            name = 'Fettverlust-Plan';
        }
        else if ((_c = onboarding.goal) === null || _c === void 0 ? void 0 : _c.includes('halten')) {
            name = 'Erhaltungs-Plan';
        }
        name += ` (${exp})`;
        const empty_tasks = [];
        // Trainingsplan-Grundgerüst anlegen
        const planDoc = yield TrainingsPlanModel_1.TrainingsPlanModel.create({
            userID: userObjID,
            name,
            tasks: empty_tasks,
        });
        const planID = planDoc._id;
        const tasks = [];
        days.forEach((day, index) => {
            const dayTasks = generateTasksForDay(day, index, days.length, onboarding, userObjID, planID);
            tasks.push(...dayTasks);
        });
        planDoc.tasks.push(...tasks);
        yield planDoc.save();
        return planDoc;
    });
}
function getTrainingsplansByUserID(userID) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!mongoose_1.default.Types.ObjectId.isValid(userID)) {
                throw new HttpError_1.HttpError(400, 'Invalid userID');
            }
            return TrainingsPlanModel_1.TrainingsPlanModel.find({ userID });
        }
        catch (error) {
            logger_1.logger.error(`error searching tasks to user_id: ${userID}`);
            throw new HttpError_1.HttpError(500, 'failed to search onboarding');
        }
    });
}
