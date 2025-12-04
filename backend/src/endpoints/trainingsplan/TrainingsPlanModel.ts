import { Schema, model } from 'mongoose';
import { TRAINING_DAYS } from '../../../../shared/types/other/TrainingDays';
import { DIFFICULTY } from '../../../../shared/types/other/TaskDifficulty';
import { ITask } from '../../../../shared/types/database/traininsplan/Task';
import { ITrainingsplan } from '../../../../shared/types/database/traininsplan/TrainingPlan';
import { Document, Types } from 'mongoose';

export interface ITaskDocument extends Omit<ITask, '_id'>, Document {
	_id: Types.ObjectId;
}

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
 * - category 	string
 */

export interface ITrainingsplanDokument extends Omit<ITrainingsplan, '_id'>, Document {
	_id: Types.ObjectId;
	tasks: Types.DocumentArray<ITask>;
}

const TrainingsplanSchema = new Schema(
	{
		userID: { type: Schema.Types.ObjectId, ref: 'User', required: true },
		name: { type: String, required: true },
		tasks: { type: [TaskSchema], default: [] },
		category: { type: String, required: false },
	},
	{
		timestamps: true,
	},
);

export const TrainingsPlanModel = model('Trainingsplan', TrainingsplanSchema);
