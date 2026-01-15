import { Schema, model, Types } from 'mongoose';

const workoutSchema = new Schema(
	{
		auth0Id: {
			type: String,
			required: true,
		},
		name: { type: String, required: true, trim: true },
		description: String,
		exercises: [
			{
				exerciseName: String,
				exerciseId: {
					type: Types.ObjectId,
					ref: 'Exercise',
					required: true,
				},
				sets: [
					{
						repsPlanned: String, // wenn strength
						durationPlanned: Number, // wenn cardio
					},
				],
			},
		],
	},
	{
		timestamps: true,
	},
);
module.exports = model('Workout', workoutSchema);
