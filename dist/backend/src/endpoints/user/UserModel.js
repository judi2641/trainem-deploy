"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const mongoose_1 = require("mongoose");
const User_1 = require("../../../../shared/types/database/user/User");
// Pfad ggf. anpassen
const UserSchema = new mongoose_1.Schema({
    email: { type: String, required: true, unique: true },
    userType: { type: String, enum: Object.values(User_1.USERS) },
    firstName: { type: String },
    lastName: { type: String },
    birthDate: { type: Date },
    gender: { type: String, enum: Object.values(User_1.GENDERS) },
    avatar: { type: String },
    img: { type: String },
    onboardingCompleted: { type: Boolean, default: false }
}, {
    timestamps: true,
});
exports.UserModel = (0, mongoose_1.model)("User", UserSchema);
