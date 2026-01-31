import { Schema, model } from 'mongoose';

const PixelSchema = new Schema(
	{
		x: { type: Number, required: true },
		y: { type: Number, required: true },
		color: { type: String, required: true },
	},
	{ _id: false },
);

const PixelArtSchema = new Schema(
	{
		auth0ID: { type: String, required: true, unique: true },
		gridSize: { type: Number, required: true },
		pixels: { type: [PixelSchema], default: [] },
	},
	{
		timestamps: true,
	},
);

export const PixelArtModel = model('PixelArt', PixelArtSchema);
