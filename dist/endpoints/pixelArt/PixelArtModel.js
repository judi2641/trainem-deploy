"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PixelArtModel = void 0;
const mongoose_1 = require("mongoose");
const PixelSchema = new mongoose_1.Schema({
    x: { type: Number, required: true },
    y: { type: Number, required: true },
    color: { type: String, required: true },
}, { _id: false });
const PixelArtSchema = new mongoose_1.Schema({
    auth0ID: { type: String, required: true, unique: true },
    gridSize: { type: Number, required: true },
    pixels: { type: [PixelSchema], default: [] },
}, {
    timestamps: true,
});
exports.PixelArtModel = (0, mongoose_1.model)('PixelArt', PixelArtSchema);
