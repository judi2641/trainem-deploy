import { Schema, model, Types } from 'mongoose';
import { ExerciseSchema } from '../exercises/ExerciseModel';
import { workoutExerciseSchema } from '../workouts/WorkoutModel';
import type { Entry } from '../../../../shared/sharedTypes';
const entrySchema = new Schema<Entry>(
	{
		auth0Id: {
			type: String,
			required: true,
		},
		date: { type: Date, required: true },
		workoutId: { type: Types.ObjectId, ref: 'Workout' },
		plannedExercises: [workoutExerciseSchema],

		completed_exercises: [workoutExerciseSchema],
		habitId: { type: Types.ObjectId, ref: 'Habit' },
		completed: { type: Boolean, default: false },
		score: { type: Number, default: 0 },
	},
	{
		timestamps: true,
	},
);

export default model<Entry>('Entry', entrySchema);
