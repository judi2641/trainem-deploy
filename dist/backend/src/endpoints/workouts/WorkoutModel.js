"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.workoutExerciseSchema = void 0;
const mongoose_1 = require("mongoose");
const ExerciseModel_1 = require("../exercises/ExerciseModel");
exports.workoutExerciseSchema = new mongoose_1.Schema({
    exercise: { type: ExerciseModel_1.ExerciseSchema, required: true },
    sets: Number,
    reps: Number,
    duration: Number,
    weight: Number,
}, {
    _id: false,
});
const workoutSchema = new mongoose_1.Schema({
    auth0Id: {
        type: String,
        required: true,
    },
    name: { type: String, required: true, trim: true },
    description: String,
    exercises: [exports.workoutExerciseSchema],
}, {
    timestamps: true,
});
const WorkoutModel = (0, mongoose_1.model)('WorkoutModel', workoutSchema);
exports.default = WorkoutModel;
