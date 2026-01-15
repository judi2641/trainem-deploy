import { Schema, model, Types } from 'mongoose';

export const ExerciseSchema = new Schema({
	name: {
		type: String,
		required: true,
		trim: true,
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

const ExerciseModel = model('Exercise', ExerciseSchema);

export default ExerciseModel;
