import mongoose, { Schema, Document, Types } from 'mongoose';
import { ITask } from '../../../../shared/types/database/traininsplan/Task';
import { TRAINING_DAYS } from '../../../../shared/types/other/TrainingDays';
import { DIFFICULTY } from '../../../../shared/types/other/TaskDifficulty';

// Schema zu ITask
const TaskSchema = new Schema(
	{
		userID: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: 'User',
		},
		trainingsplanID: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: 'Trainingsplan',
		},
		title: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			default: '',
		},
		difficulty: {
			type: String,
			enum: Object.values(DIFFICULTY), // ["easy","middle","hard"]
			required: true,
		},
		day: {
			type: String,
			enum: TRAINING_DAYS, // ["Mon", "Tue", ... ]
			required: true,
		},
	},
	{ timestamps: true },
);

// Fix für Hot-Reloading (z. B. bei Next.js)
if (mongoose.models.Task) {
	delete mongoose.models.Task;
}

export const TaskModel = mongoose.model('Task', TaskSchema);
