import { Schema, model } from 'mongoose';
import type { IPixelArt } from '../../../../shared/types/database/user/PixelArt';

const PixelSchema = new Schema(
	{
		x: { type: Number, required: true },
		y: { type: Number, required: true },
		color: { type: String, required: true },
	},
	{ _id: false },
);

const PixelArtSchema = new Schema<IPixelArt>(
	{
		auth0ID: { type: String, required: true, unique: true },
		gridSize: { type: Number, required: true },
		pixels: { type: [PixelSchema], default: [] },
	},
	{
		timestamps: true,
	},
);

export const PixelArtModel = model<IPixelArt>('PixelArt', PixelArtSchema);
