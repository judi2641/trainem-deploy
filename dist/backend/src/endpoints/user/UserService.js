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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = createUser;
exports.getUserByEmail = getUserByEmail;
exports.getUserByID = getUserByID;
exports.getAllUsers = getAllUsers;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;
exports.userExistsAndOnboardingStatus = userExistsAndOnboardingStatus;
exports.finishOnboarding = finishOnboarding;
exports.saveBasicUserInfo = saveBasicUserInfo;
const UserModel_1 = require("./UserModel");
const logger_1 = require("../../utils/logger");
const HttpError_1 = require("../../errors/HttpError");
function createUser(email) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = new UserModel_1.UserModel({ email });
            return yield user.save();
        }
        catch (error) {
            logger_1.logger.error("failed to create user");
            throw new HttpError_1.HttpError(400, "failed to create user");
        }
    });
}
/**
 * throws error if user does not exist
 * @param email
 * @returns
 */
function getUserByEmail(email) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield UserModel_1.UserModel.findOne({ email });
            if (!user) {
                logger_1.logger.error("user not found");
                throw new HttpError_1.HttpError(400, "user not found");
            }
            return user;
        }
        catch (error) {
            logger_1.logger.error("failed to get user");
            throw new HttpError_1.HttpError(400, "failed to get user");
        }
    });
}
function getUserByID(userID) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield UserModel_1.UserModel.findOne({ userID });
        if (!user) {
            throw new HttpError_1.HttpError(404, 'User not found');
        }
        return user;
    });
}
function getAllUsers() {
    return __awaiter(this, void 0, void 0, function* () {
        return UserModel_1.UserModel.find();
    });
}
function updateUser(userID, updateData) {
    return __awaiter(this, void 0, void 0, function* () {
        const updated = yield UserModel_1.UserModel.findOneAndUpdate({ userID }, { $set: updateData }, { new: true });
        if (!updated) {
            throw new HttpError_1.HttpError(404, 'User not found');
        }
        return updated;
    });
}
function deleteUser(userID) {
    return __awaiter(this, void 0, void 0, function* () {
        const deleted = yield UserModel_1.UserModel.findOneAndDelete({ userID });
        if (!deleted) {
            throw new HttpError_1.HttpError(404, 'User not found');
        }
        return true;
    });
}
function userExistsAndOnboardingStatus(auth0ID) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield UserModel_1.UserModel.findOne({ userID: auth0ID });
        if (!user) {
            return { exists: false, onboardingCompleted: false };
        }
        return {
            exists: true,
            onboardingCompleted: user.onboardingCompleted,
        };
    });
}
/**
 * NEW: Finish onboarding
 */
function finishOnboarding(auth0ID) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield UserModel_1.UserModel.findOneAndUpdate({ userID: auth0ID }, { onboardingCompleted: true }, { new: true });
        if (!user) {
            throw new HttpError_1.HttpError(404, 'User not found');
        }
        return user;
    });
}
/**
 *Finish Basic Info
 */
function saveBasicUserInfo(auth0ID, basicData) {
    return __awaiter(this, void 0, void 0, function* () {
        const updated = yield UserModel_1.UserModel.findOneAndUpdate({ userID: auth0ID }, {
            firstName: basicData.firstname,
            lastName: basicData.lastname,
            birthDate: basicData.birthDate,
            gender: basicData.gender,
        }, { new: true, upsert: true });
        if (!updated) {
            throw new HttpError_1.HttpError(404, 'User not found');
        }
        return updated;
    });
}
