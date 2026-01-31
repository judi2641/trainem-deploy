"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExerciseModel = exports.ExerciseSchema = void 0;
const mongoose_1 = require("mongoose");
exports.ExerciseSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ['strength', 'cardio'],
    },
    primaryMuscleGroups: [String],
    executionInstructions: String,
    videoUrl: String,
    imageUrl: String,
});
exports.ExerciseModel = (0, mongoose_1.model)('Exercise', exports.ExerciseSchema);
exports.default = exports.ExerciseModel;
