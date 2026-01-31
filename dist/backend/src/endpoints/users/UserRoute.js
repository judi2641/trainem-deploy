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
const HttpError_1 = require("../../errors/HttpError");
const UserService_1 = require("./UserService");
const logger_1 = require("../../utils/logger");
const router = express_1.default.Router();
router.post('/:auth0Id/basic', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield (0, UserService_1.saveBasicUserInfo)(req.params.auth0Id, req.body);
        res.status(200).json(user);
    }
    catch (error) {
        logger_1.logger.error(error);
        if (error instanceof HttpError_1.HttpError) {
            res.status(error.status).json({ error: error.message });
        }
        else {
            res.status(500).json({ error: 'unkonwn error' });
        }
    }
}));
//after registration
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { auth0Id, email } = req.body;
        if (!auth0Id || !email) {
            return res.status(400).json({ error: 'email and auth0Id required' });
        }
        const user = yield (0, UserService_1.createInitialUser)(auth0Id, email);
        return res.status(201).json(user);
    }
    catch (error) {
        if (error instanceof HttpError_1.HttpError) {
            logger_1.logger.error(error.message);
            return res.status(error.status).json({ error: error.message });
        }
        else {
            logger_1.logger.error(error);
            return res.status(500).json({ error: 'unkown error' });
        }
    }
}));
router.get('/:auth0Id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield (0, UserService_1.getUserByAuth0id)(req.params.auth0Id);
        return res.status(200).json(user);
    }
    catch (error) {
        if (error instanceof HttpError_1.HttpError) {
            logger_1.logger.error(error.message);
            return res.status(error.status).json({ error: error.message });
        }
        else {
            logger_1.logger.error(error);
            return res.status(500).json({ error: error });
        }
    }
}));
exports.default = router;
