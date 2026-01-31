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
const logger_1 = require("../../utils/logger");
const PixelArtService_1 = require("./PixelArtService");
const router = (0, express_1.default)();
router.post('/:auth0ID', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pixelArt = yield (0, PixelArtService_1.savePixelArt)(req.params.auth0ID, req.body);
        res.status(200).json(pixelArt);
    }
    catch (error) {
        if (error instanceof HttpError_1.HttpError) {
            logger_1.logger.error(error.message);
            res.status(error.status).json({ error: error.message });
        }
        else {
            logger_1.logger.error(error);
            res.status(500).json({ error: 'unkown error' });
        }
    }
}));
router.get('/:auth0ID', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pixelArt = yield (0, PixelArtService_1.getPixelArt)(req.params.auth0ID);
        res.status(200).json(pixelArt);
    }
    catch (error) {
        if (error instanceof HttpError_1.HttpError) {
            logger_1.logger.error(error.message);
            res.status(error.status).json({ error: error.message });
        }
        else {
            logger_1.logger.error(error);
            res.status(500).json({ error: 'unkown error' });
        }
    }
}));
exports.default = router;
