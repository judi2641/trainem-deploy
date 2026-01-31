"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrainingsPlanModel = void 0;
const mongoose_1 = require("mongoose");
const TrainingDays_1 = require("../../../../shared/types/other/TrainingDays");
const TaskDifficulty_1 = require("../../../../shared/types/other/TaskDifficulty");
const TaskSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    difficulty: { type: String, enum: Object.values(TaskDifficulty_1.DIFFICULTY), required: true },
    day: { type: String, enum: Object.values(TrainingDays_1.TRAINING_DAYS), required: true },
});
const TrainingsplanSchema = new mongoose_1.Schema({
    userID: { type: mongoose_1.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    tasks: { type: [TaskSchema], default: [] },
}, {
    timestamps: true,
});
exports.TrainingsPlanModel = (0, mongoose_1.model)("Trainingsplan", TrainingsplanSchema);
