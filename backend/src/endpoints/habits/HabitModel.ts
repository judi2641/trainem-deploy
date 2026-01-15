import { Schema, model, Types } from 'mongoose';

const habitSchema = new Schema(
	{
		auth0Id: {
			type: String,
			required: true,
		},
		name: { type: String, required: true},
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
const HabitModel = model('Habit', habitSchema);
export default HabitModel;
