import { Schema, model } from 'mongoose';

export const ExerciseSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	type: {
		type: String,
		enum: ['strength', 'cardio'],
	},
	primaryMuscleGroups: [String],
	executionInstructions: String,
	videoUrl: String,
	imageUrl: String,
});

export const ExerciseModel = model('Exercise', ExerciseSchema);

export default ExerciseModel;