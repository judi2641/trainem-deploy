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
const express_1 = __importDefault(require("express"));
const WorkoutService_1 = require("./WorkoutService");
const router = express_1.default.Router();
function sendError(res, err) {
    var _a, _b;
    const status = (_a = err === null || err === void 0 ? void 0 : err.statusCode) !== null && _a !== void 0 ? _a : 500;
    res.status(status).json({ message: (_b = err === null || err === void 0 ? void 0 : err.message) !== null && _b !== void 0 ? _b : 'Internal Server Error' });
}
// GET /workouts?auth0Id=xxx
router.get('/:auth0Id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const auth0Id = req.params.auth0Id;
        const workouts = yield (0, WorkoutService_1.getAllWorkoutsFromUser)(auth0Id);
        res.json(workouts);
    }
    catch (err) {
        sendError(res, err);
    }
}));
// POST /workouts  { auth0Id, name, description }
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { auth0Id, name, description } = req.body;
        const workout = yield (0, WorkoutService_1.createEmptyWorkout)(auth0Id, name, description);
        res.status(201).json(workout);
    }
    catch (err) {
        sendError(res, err);
    }
}));
router.post('/onboarding', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { auth0Id, name, description } = req.body;
        const workout = yield (0, WorkoutService_1.createEmptyWorkout)(auth0Id, name, description);
        res.status(201).json(workout);
    }
    catch (err) {
        sendError(res, err);
    }
}));
// POST /workouts/:workoutId/exercises  { exerciseName, sets?, reps?, duration? }
router.post('/:workoutId/exercises', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { exerciseName, sets, reps, duration } = req.body;
        const workout = yield (0, WorkoutService_1.addExerciseToWorkout)(exerciseName, req.params.workoutId, sets, reps, duration);
        res.json(workout);
    }
    catch (err) {
        sendError(res, err);
    }
}));
exports.default = router;
