"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const pixelSchema = new mongoose_1.Schema({
    x: { type: Number, required: true, min: 0 },
    y: { type: Number, required: true, min: 0 },
    color: {
        type: String,
        required: true,
        match: /^#[0-9A-Fa-f]{6}$/, // Hex-Format validieren "#RRGGBB"
    },
}, { _id: false });
const canvasSchema = new mongoose_1.Schema({
    width: { type: Number, default: 32, min: 1, max: 64 },
    height: { type: Number, default: 32, min: 1, max: 64 },
    pixels: [pixelSchema],
}, { _id: false });
const UserSchema = new mongoose_1.Schema({
    email: { type: String, required: true, unique: true },
    auth0Id: { type: String, required: true, unique: true },
    firstName: { type: String },
    lastName: { type: String },
    birthDate: { type: Date },
    pixels: [pixelSchema],
    canvas: canvasSchema,
    onboardingCompleted: { type: Boolean, default: false },
    points: { type: Number, default: 0, min: 0 },
    lastActiveDate: { type: Date, default: Date.now },
    streak: { type: Number, default: 0 },
}, {
    timestamps: true,
});
const UserModel = (0, mongoose_1.model)('User', UserSchema);
exports.default = UserModel;
