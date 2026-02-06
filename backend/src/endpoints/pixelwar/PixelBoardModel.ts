import mongoose, { Schema, Document } from 'mongoose';

export interface IPixel {
	x: number;
	y: number;
	color: string;
	groupId: string; // Welche Gruppe besitzt diesen Pixel
	lastUpdatedBy: string; // userId
	lastUpdatedAt: Date;
	conquestCount: number; // Wie oft wurde dieser Pixel erobert
}

export interface IPixelBoard extends Document {
	battleId: string;
	gridWidth: number;
	gridHeight: number;
	pixels: IPixel[];
	createdAt: Date;
	updatedAt: Date;
}

const PixelSchema = new Schema<IPixel>(
	{
		x: { type: Number, required: true, min: 0 },
		y: { type: Number, required: true, min: 0 },
		color: {
			type: String,
			required: true,
			match: /^#[0-9A-F]{6}$/i,
		},
		groupId: {
			type: String,
			required: true,
		},
		lastUpdatedBy: {
			type: String,
			required: true,
		},
		lastUpdatedAt: {
			type: Date,
			required: true,
			default: Date.now,
		},
		conquestCount: {
			type: Number,
			default: 1,
			min: 0,
		},
	},
	{ _id: false },
); // No separate _id for subdocuments

const PixelBoardSchema = new Schema<IPixelBoard>(
	{
		battleId: {
			type: String,
			required: true,
			index: true,
		},
		gridWidth: {
			type: Number,
			required: true,
			default: 200,
			min: 50,
			max: 500,
		},
		gridHeight: {
			type: Number,
			required: true,
			default: 200,
			min: 50,
			max: 500,
		},
		pixels: {
			type: [PixelSchema],
			default: [],
		},
	},
	{
		timestamps: true,
	},
);

// Compound Index für schnellen Pixel-Zugriff
PixelBoardSchema.index({ battleId: 1, 'pixels.x': 1, 'pixels.y': 1 });

export const PixelBoardModel = mongoose.model<IPixelBoard>('PixelBoard', PixelBoardSchema);
