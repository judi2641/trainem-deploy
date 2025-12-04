import { Schema, model } from 'mongoose';
import type { Document } from 'mongoose';
import { TRAINING_DAYS } from '../../../../shared/types/other/TrainingDays';
import { DIFFICULTY } from '../../../../shared/types/other/TaskDifficulty';

const TaskSchema = new Schema({
	title: { type: String, required: true },
	description: { type: String, required: true },
	difficulty: { type: String, enum: Object.values(DIFFICULTY), required: true },
	day: { type: String, enum: Object.values(TRAINING_DAYS), required: true },
});
/**
 * Mongoose Document
 *
 * Fields:
 * - userID 	required UID from MongoDB
 * - name 		required string
 * - tasks		{@link ITaskDocument}, default []
 * - categorie 	string
 */

const TrainingsplanSchema = new Schema(
	{
		userID: { type: Schema.Types.ObjectId, ref: 'User', required: true },
		name: { type: String, required: true },
		tasks: { type: [TaskSchema], default: [] },
		categorie: { type: String, required: false },
	},
	{
		timestamps: true,
	},
);

export const TrainingsPlanModel = model('Trainingsplan', TrainingsplanSchema);
