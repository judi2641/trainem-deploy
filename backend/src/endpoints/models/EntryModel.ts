import { Schema, model, Types } from 'mongoose';

const entrySchema = new Schema(
	{
		auth0Id: {
			type: String,
			required: true,
		},
		date: { type: Date, required: true },
		workoutId: { type: Types.ObjectId, ref: 'Workout' },
		plannedExercises: [
			{
				exerciseId: { type: Types.ObjectId, ref: 'Exercise', required: true },
				name: String,
				sets: [
					{
						repsPlanned: String,
						durationPlanned: Number,
						restTime: Number,
					},
				],
			},
		],
		completed_exercises: [
			{
				exerciseId: { type: Types.ObjectId, ref: 'Exercise', required: true },
				name: String,
				sets: [
					{
						repsPlanned: String,
						repsDone: Number,
						weight: Number,
						durationDone: Number,
						distance: Number,
						completed: { type: Boolean, default: false },
					},
				],
			},
		],
		habitId: { type: Types.ObjectId, ref: 'Habit' },
		completed: { type: Boolean, default: false },
		score: { type: Number, default: 0 },
	},
	{
		timestamps: true,
	},
);

export default model('Entry', entrySchema);
