import { Schema, model, Types } from 'mongoose';

const habitSchema = new Schema(
	{
		auth0Id: {
			type: String,
			required: true,
		},
		name: { type: String, required: true, trim: true },
		type: {
			type: String,
			enum: ['daily', 'weekly'],
			required: true,
		},
		weekday: Number,
		description: String,
	},
	{
		timestamps: true,
	},
);

export default model('Habit', habitSchema);
