import { Schema, model, Types } from 'mongoose';
import { ExerciseSchema } from '../exercises/ExerciseModel';
import { workoutExerciseSchema } from '../workouts/WorkoutModel';
const entrySchema = new Schema(
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

export default model('Entry', entrySchema);
