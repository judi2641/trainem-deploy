import { Schema, model, Types } from 'mongoose';
import type { ICompletedTask } from '../../../../shared/types/database/CompletedTask';

const CompletedTaskSchema = new Schema<ICompletedTask>(
	{
		auth0Id: {
			type: String,
			required: true,
		},
		taskID: {
			type: String,
			required: true,
		},
		title: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		difficulty: {
			type: String,
			enum: ['easy', 'middle', 'hard'],
			required: true,
		},
		day: {
			type: String,
			required: true,
		},
		doneAt: {
			type: Date,
			required: true,
		},
		planName: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: true, // createdAt und updatedAt werden automatisch hinzugefügt
	},
);

const CompletedTaskModel = model<ICompletedTask>('CompletedTask', CompletedTaskSchema);

export default CompletedTaskModel;
