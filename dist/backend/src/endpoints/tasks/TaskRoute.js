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
const express_1 = __importDefault(require("express"));
const TaskService_1 = require("./TaskService");
const logger_1 = require("../../utils/logger");
const HttpError_1 = require("../../errors/HttpError");
const router = express_1.default.Router();
/**
 * CREATE Task
 */
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const taskData = req.body;
        const task = yield (0, TaskService_1.createTask)(taskData);
        res.status(201).json(task);
    }
    catch (error) {
        logger_1.logger.error(error);
        handleError(res, error);
    }
}));
/**
 * GET tasks by userID
 */
router.get('/user/:userID', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tasks = yield (0, TaskService_1.getTasksByUserID)(req.params.userID);
        res.status(200).json(tasks);
    }
    catch (error) {
        handleError(res, error);
    }
}));
/**
 * GET tasks by trainingsplanID
 */
router.get('/plan/:trainingsplanID', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tasks = yield (0, TaskService_1.getTasksByTrainingsplanID)(req.params.trainingsplanID);
        res.status(200).json(tasks);
    }
    catch (error) {
        handleError(res, error);
    }
}));
/**
 * UPDATE task
 */
router.patch('/:taskID', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedTask = yield (0, TaskService_1.updateTask)(req.params.taskID, req.body);
        res.status(200).json(updatedTask);
    }
    catch (error) {
        handleError(res, error);
    }
}));
/**
 * DELETE task
 */
router.delete('/:taskID', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, TaskService_1.deleteTask)(req.params.taskID);
        res.status(204).send();
    }
    catch (error) {
        handleError(res, error);
    }
}));
/**
 * Local helper
 */
function handleError(res, error) {
    if (error instanceof HttpError_1.HttpError) {
        return res.status(error.status).json({ error: error.message });
    }
    return res.status(500).json({ error: 'An unknown error occurred' });
}
exports.default = router;
