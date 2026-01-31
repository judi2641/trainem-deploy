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
const logger_1 = require("./utils/logger");
const cors_1 = __importDefault(require("cors"));
const db_1 = require("./database/db");
const UserRoute_1 = __importDefault(require("./endpoints/users/UserRoute"));
// import TrainingsplanRoute from './endpoints/routes/TrainingsPlanRoute';
// import CompletedTaskRoute from './endpoints/routes/CompletedTaskRoute';
const WorkoutRoute_1 = __importDefault(require("./endpoints/workouts/WorkoutRoute"));
const HabitRoute_1 = __importDefault(require("./endpoints/habits/HabitRoute"));
const EntryRoute_1 = __importDefault(require("./endpoints/entries/EntryRoute"));
const ExerciseRoute_1 = __importDefault(require("./endpoints/exercises/ExerciseRoute"));
const PixelArtRoute_1 = __importDefault(require("./endpoints/pixelArt/PixelArtRoute"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get('/', (req, res) => {
    res.status(200).json('Hi');
});
app.use('/api/user', UserRoute_1.default);
app.use('/api/workouts', WorkoutRoute_1.default);
app.use('/api/habits', HabitRoute_1.default);
app.use('/api/entries', EntryRoute_1.default);
app.use('/api/exercises', ExerciseRoute_1.default);
app.use('/api/pixel-art', PixelArtRoute_1.default);
function startServer() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, db_1.initDB)();
            app.listen(3000, () => {
                logger_1.logger.info('server is running on port 3000');
            });
        }
        catch (error) {
            logger_1.logger.error('serverstart failed:', error);
        }
    });
}
startServer();
