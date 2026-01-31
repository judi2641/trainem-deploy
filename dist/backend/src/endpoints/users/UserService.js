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
exports.createInitialUser = createInitialUser;
exports.saveBasicUserInfo = saveBasicUserInfo;
exports.getUserByAuth0id = getUserByAuth0id;
exports.updateLastActiveDate = updateLastActiveDate;
const UserModel_1 = __importDefault(require("./UserModel"));
const logger_1 = require("../../utils/logger");
const HttpError_1 = require("../../errors/HttpError");
/**
 * creates user with only auth0id and email
 * it is supposed to be called only after registration with Auth0
 * @param auth0Id
 * @param email
 * @returns created user
 */
function createInitialUser(auth0Id, email) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = new UserModel_1.default({ auth0Id, email });
        try {
            yield user.save();
        }
        catch (error) {
            logger_1.logger.error('failed to create InitialUser', error);
            throw new HttpError_1.HttpError(404, 'failed to create a user');
        }
        logger_1.logger.info(`user with email ${email} created`);
        return user;
    });
}
/**
 *Finish Basic Info
 */
function saveBasicUserInfo(auth0Id, basicData) {
    return __awaiter(this, void 0, void 0, function* () {
        const updated = yield UserModel_1.default.findOneAndUpdate({ auth0Id: auth0Id }, {
            firstName: basicData.firstname,
            lastName: basicData.lastname,
            birthDate: basicData.birthDate,
            onboardingCompleted: true,
        }, { new: true });
        if (!updated) {
            throw new HttpError_1.HttpError(404, 'User not found');
        }
        return updated;
    });
}
function getUserByAuth0id(auth0Id) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield UserModel_1.default.findOne({ auth0Id });
        if (!user) {
            logger_1.logger.error('user not found');
            throw new HttpError_1.HttpError(400, 'user not found');
        }
        return user;
    });
}
function updateLastActiveDate(auth0Id) {
    return __awaiter(this, void 0, void 0, function* () {
        const updated = yield UserModel_1.default.findOneAndUpdate({ auth0Id: auth0Id }, {
            lastActiveDate: Date.now(),
        }, { new: true });
        if (!updated) {
            throw new HttpError_1.HttpError(404, 'User not found');
        }
        return updated;
    });
}
