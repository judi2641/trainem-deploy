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
const UserService_1 = require("./UserService");
const HttpError_1 = require("../../errors/HttpError");
const UserService_2 = require("./UserService");
const UserService_3 = require("./UserService");
const UserService_4 = require("./UserService");
const UserService_5 = require("./UserService");
const UserService_6 = require("./UserService");
const UserService_7 = require("./UserService");
const UserService_8 = require("./UserService");
const router = (0, express_1.default)();
router.post("/:email", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield (0, UserService_1.createUser)(req.params.email);
        res.status(201).json(user);
    }
    catch (error) {
        if (error instanceof HttpError_1.HttpError) {
            res.status(error.status).json(error.message);
        }
        else {
            res.status(500).json({ error: "unkown error" });
        }
    }
}));
router.post('/:auth0ID/basic', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield (0, UserService_2.saveBasicUserInfo)(req.params.auth0ID, req.body);
        res.status(200).json(user);
    }
    catch (error) {
        if (error instanceof HttpError_1.HttpError) {
            res.status(error.status).json({ error: error.message });
        }
        else {
            res.status(500).json({ error: "unkonwn error" });
        }
    }
}));
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield (0, UserService_1.createUser)(req.body);
        res.status(201).json(user);
    }
    catch (error) {
        handleError(res, error);
    }
}));
/**
 * CHECK IF USER EXISTS + ONBOARDING STATUS
 */
router.get('/exists/:auth0ID', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const info = yield (0, UserService_3.userExistsAndOnboardingStatus)(req.params.auth0ID);
        res.status(200).json(info);
    }
    catch (error) {
        handleError(res, error);
    }
}));
/**
 * FINISH ONBOARDING
 */
router.post('/:auth0ID', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield (0, UserService_4.finishOnboarding)(req.params.auth0ID);
        res.status(200).json({
            message: 'Onboarding completed',
            user,
        });
    }
    catch (error) {
        handleError(res, error);
    }
}));
/**
 * FINISH ONBOARDING
 */
router.post('/:auth0ID/basic', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield (0, UserService_2.saveBasicUserInfo)(req.params.auth0ID, req.body);
        res.status(200).json(user);
    }
    catch (error) {
        handleError(res, error);
    }
}));
/**
 * GET ALL USERS
 */
router.get('/', (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield (0, UserService_5.getAllUsers)();
        res.status(200).json(users);
    }
    catch (error) {
        if (error instanceof HttpError_1.HttpError) {
            res.status(error.status).json({ error: error.message });
        }
        else {
            res.status(500).json({ error: "unkonwn error" });
        }
    }
}));
/**
 * GET user BY ID
 */
router.get('/:auth0ID', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield (0, UserService_6.getUserByID)(req.params.auth0ID);
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        res.status(200).json(user);
        return;
    }
    catch (error) {
        handleError(res, error);
        return;
    }
}));
/**
 * UPDATE USER
 */
router.patch('/:auth0ID', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updated = yield (0, UserService_7.updateUser)(req.params.auth0ID, req.body);
        res.status(200).json(updated);
    }
    catch (error) {
        handleError(res, error);
    }
}));
/**
 * DELETE USER
 */
router.delete('/:auth0ID', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, UserService_8.deleteUser)(req.params.auth0ID);
        res.status(204).send();
    }
    catch (error) {
        handleError(res, error);
    }
}));
function handleError(res, error) {
    if (error instanceof HttpError_1.HttpError) {
        res.status(error.status).json({ error: error.message });
        return;
    }
    console.error(error);
    res.status(500).json({ error: 'An unknown error occurred' });
    return;
}
exports.default = router;
