import { Schema, model, Types } from 'mongoose';
import { TRAINING_DAYS } from '../../../../shared/types/other/TrainingDays';
import { DIFFICULTY } from '../../../../shared/types/other/TaskDifficulty';

const TaskSchema = new Schema({
	title: { type: String, required: true },
	description: { type: String, required: true },
	difficulty: { type: String, enum: Object.values(DIFFICULTY), required: true },
	day: { type: String, enum: Object.values(TRAINING_DAYS), required: true },
});

const TrainingsplanSchema = new Schema(
	{
		userID: { type: Types.ObjectId, ref: 'User', required: true },
		name: { type: String, required: true },
		tasks: { type: [TaskSchema], default: [] },
	},
	{
		timestamps: true,
	},
);

export const TrainingsPlanModel = model('Trainingsplan', TrainingsplanSchema);
