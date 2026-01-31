"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const WorkoutModel_1 = require("../workouts/WorkoutModel");
const entrySchema = new mongoose_1.Schema({
    auth0Id: {
        type: String,
        required: true,
    },
    date: { type: Date, required: true },
    workoutId: { type: mongoose_1.Types.ObjectId, ref: 'Workout' },
    plannedExercises: [WorkoutModel_1.workoutExerciseSchema],
    completed_exercises: [WorkoutModel_1.workoutExerciseSchema],
    habitId: { type: mongoose_1.Types.ObjectId, ref: 'Habit' },
    completed: { type: Boolean, default: false },
    score: { type: Number, default: 0 },
}, {
    timestamps: true,
});
exports.default = (0, mongoose_1.model)('Entry', entrySchema);
