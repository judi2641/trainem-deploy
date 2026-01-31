import { Schema, model, Types } from 'mongoose';
import { ExerciseSchema } from '../exercises/ExerciseModel';

export const workoutExerciseSchema = new Schema(
	{
		exercise: { type: ExerciseSchema, required: true },
		sets: Number,
		reps: Number,
		duration: Number,
		weight: Number,
	},
	{
		_id: false,
	},
);

const workoutSchema = new Schema(
	{
		auth0Id: {
			type: String,
			required: true,
		},
		name: { type: String, required: true, trim: true },
		description: String,
		exercises: [workoutExerciseSchema],
	},
	{
		timestamps: true,
	},
);

const WorkoutModel = model('WorkoutModel', workoutSchema);
export default WorkoutModel;
