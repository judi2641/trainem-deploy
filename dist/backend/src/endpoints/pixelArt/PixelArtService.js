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
exports.savePixelArt = savePixelArt;
exports.getPixelArt = getPixelArt;
const HttpError_1 = require("../../errors/HttpError");
const logger_1 = require("../../utils/logger");
const PixelArtModel_1 = require("./PixelArtModel");
function isValidPixelArt(payload) {
    if (!payload)
        return false;
    if (!payload.auth0ID || typeof payload.auth0ID !== 'string')
        return false;
    if (!payload.gridSize || typeof payload.gridSize !== 'number')
        return false;
    if (payload.gridSize < 1 || payload.gridSize > 128)
        return false;
    if (!Array.isArray(payload.pixels))
        return false;
    for (const pixel of payload.pixels) {
        if (typeof pixel.x !== 'number' || typeof pixel.y !== 'number')
            return false;
        if (typeof pixel.color !== 'string')
            return false;
        if (pixel.x < 0 || pixel.y < 0)
            return false;
        if (pixel.x >= payload.gridSize || pixel.y >= payload.gridSize)
            return false;
    }
    return true;
}
function savePixelArt(auth0ID, payload) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!auth0ID) {
            throw new HttpError_1.HttpError(400, 'auth0ID is missing');
        }
        const data = {
            auth0ID,
            gridSize: payload.gridSize,
            pixels: payload.pixels,
        };
        if (!isValidPixelArt(data)) {
            throw new HttpError_1.HttpError(400, 'invalid pixel art payload');
        }
        try {
            const updated = yield PixelArtModel_1.PixelArtModel.findOneAndUpdate({ auth0ID }, { $set: data }, { new: true, upsert: true });
            return updated;
        }
        catch (error) {
            logger_1.logger.error('failed to save pixel art', error);
            throw new HttpError_1.HttpError(500, 'failed to save pixel art');
        }
    });
}
function getPixelArt(auth0ID) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!auth0ID) {
            throw new HttpError_1.HttpError(400, 'auth0ID is missing');
        }
        try {
            const pixelArt = yield PixelArtModel_1.PixelArtModel.findOne({ auth0ID });
            if (!pixelArt) {
                throw new HttpError_1.HttpError(404, 'pixel art not found');
            }
            return pixelArt;
        }
        catch (error) {
            if (error instanceof HttpError_1.HttpError) {
                throw error;
            }
            logger_1.logger.error('failed to load pixel art', error);
            throw new HttpError_1.HttpError(500, 'failed to load pixel art');
        }
    });
}
