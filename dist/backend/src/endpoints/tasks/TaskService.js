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
exports.createTask = createTask;
exports.getTasksByUserID = getTasksByUserID;
exports.getTasksByTrainingsplanID = getTasksByTrainingsplanID;
exports.updateTask = updateTask;
exports.deleteTask = deleteTask;
const TaskModel_1 = require("./TaskModel");
const HttpError_1 = require("../../errors/HttpError");
const mongoose_1 = __importDefault(require("mongoose"));
/**
 * CREATE
 */
function createTask(data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const task = yield TaskModel_1.TaskModel.create(data);
            return task;
        }
        catch (err) {
            throw new HttpError_1.HttpError(400, 'Could not create task');
        }
    });
}
/**
 * GET by userID
 */
function getTasksByUserID(userID) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!mongoose_1.default.Types.ObjectId.isValid(userID)) {
            throw new HttpError_1.HttpError(400, 'Invalid userID');
        }
        return TaskModel_1.TaskModel.find({ userID });
    });
}
/**
 * GET by trainingsplanID
 */
function getTasksByTrainingsplanID(planID) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!mongoose_1.default.Types.ObjectId.isValid(planID)) {
            throw new HttpError_1.HttpError(400, 'Invalid trainingsplanID');
        }
        return TaskModel_1.TaskModel.find({ trainingsplanID: planID });
    });
}
/**
 * UPDATE task
 */
function updateTask(taskID, updateData) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!mongoose_1.default.Types.ObjectId.isValid(taskID)) {
            throw new HttpError_1.HttpError(400, 'Invalid taskID');
        }
        const updated = yield TaskModel_1.TaskModel.findByIdAndUpdate(taskID, { $set: updateData }, { new: true });
        if (!updated) {
            throw new HttpError_1.HttpError(404, 'Task not found');
        }
        return updated;
    });
}
/**
 * DELETE task
 */
function deleteTask(taskID) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!mongoose_1.default.Types.ObjectId.isValid(taskID)) {
            throw new HttpError_1.HttpError(400, 'Invalid taskID');
        }
        const deleted = yield TaskModel_1.TaskModel.findByIdAndDelete(taskID);
        if (!deleted) {
            throw new HttpError_1.HttpError(404, 'Task not found');
        }
        return true;
    });
}
