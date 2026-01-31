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
const HabitService_1 = require("./HabitService");
const router = express_1.default.Router();
function sendError(res, err) {
    var _a, _b;
    const status = (_a = err === null || err === void 0 ? void 0 : err.statusCode) !== null && _a !== void 0 ? _a : 500;
    res.status(status).json({ message: (_b = err === null || err === void 0 ? void 0 : err.message) !== null && _b !== void 0 ? _b : 'Internal Server Error' });
}
// GET /habits?auth0Id=xxx
router.get('/:auth0Id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const auth0Id = req.params.auth0Id;
        const habits = yield (0, HabitService_1.getAllHabitsFromUser)(auth0Id);
        res.json(habits);
    }
    catch (err) {
        sendError(res, err);
    }
}));
// POST /habits  { auth0Id, name, type, description?, weekday? }
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { auth0Id, name, type, description, weekday } = req.body;
        const habit = yield (0, HabitService_1.createHabit)(auth0Id, name, type, description, weekday);
        res.status(201).json(habit);
    }
    catch (err) {
        sendError(res, err);
    }
}));
exports.default = router;
