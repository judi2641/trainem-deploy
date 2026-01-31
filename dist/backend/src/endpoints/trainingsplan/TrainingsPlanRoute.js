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
const TrainingsPlanService_1 = require("./TrainingsPlanService");
const HttpError_1 = require("../../errors/HttpError");
const UserService_1 = require("../user/UserService");
const logger_1 = require("../../utils/logger");
const TrainingsPlanService_2 = require("./TrainingsPlanService");
const router = (0, express_1.default)();
router.get("/:email", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const trainingsplans = yield (0, TrainingsPlanService_1.getAllTrainingsPlansByEmail)(req.params.email);
        res.status(200).json(trainingsplans);
    }
    catch (error) {
        if (error instanceof HttpError_1.HttpError) {
            res.status(error.status).json({ error: error.message });
        }
        else {
            logger_1.logger.error(error);
            res.status(500).json({ error: "unkown error" });
        }
    }
}));
router.post("/:email", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //throws error if user does not exist
        const user = yield (0, UserService_1.getUserByEmail)(req.params.email);
        const trainingsplan_data = {
            userID: user._id,
            name: req.body.name,
            tasks: req.body.tasks
        };
        const created_plan = yield (0, TrainingsPlanService_1.createTrainingsPlan)(trainingsplan_data);
        res.status(201).json(created_plan);
    }
    catch (error) {
        if (error instanceof HttpError_1.HttpError) {
            res.status(error.status).json({ error: error.message });
        }
        else {
            logger_1.logger.error(error);
            res.status(500).json("unkown error");
        }
    }
}));
router.post('/:userID', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const plan = yield (0, TrainingsPlanService_2.createDefaultTrainingsplanFromOnboarding)(req.params.userID, req.body.onboarding);
        return res.status(201).json(plan);
    }
    catch (error) {
        console.error('Trainingplan error:', error);
        return res.status(500).json({ error });
    }
}));
router.get('/:userID', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const plans = yield (0, TrainingsPlanService_2.getTrainingsplansByUserID)(req.params.userID);
        res.status(200).json(plans);
    }
    catch (error) {
        if (error instanceof HttpError_1.HttpError) {
            logger_1.logger.error(error);
            res.status(error.status).json({ error: error.message });
        }
        else {
            res.status(500).json({ error: "unkown error" });
        }
    }
}));
exports.default = router;
