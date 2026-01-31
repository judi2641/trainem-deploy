"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const habitSchema = new mongoose_1.Schema({
    auth0Id: {
        type: String,
        required: true,
    },
    name: { type: String, required: true },
    type: {
        type: String,
        enum: ['daily', 'weekly'],
        required: true,
    },
    weekday: Number,
    description: String,
}, {
    timestamps: true,
});
const HabitModel = (0, mongoose_1.model)('Habit', habitSchema);
exports.default = HabitModel;
