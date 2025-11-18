/**
 * This Document stores Completed Tasks.
 * If a user completes a Task the Task will be stored.
 * With the userID we can list all The tasks completed by a user
 *
 * - Each Task will be linked to the specific User.
 * - Each Task will have its own id
 * - Each Task will have a completion time.
 * - Each Task will have a difficutly level
 */

import { model, Schema } from 'mongoose';
import { DIFFICULTY, ICompletedTask } from '../../../../shared/types/Training';

export interface ICompletedTaskDocument extends ICompletedTask, Document {}

const CompletedTaskSchema = new Schema<ICompletedTaskDocument>({
	userID: { type: Schema.Types.ObjectId, ref: 'User', required: true },
	trainingsplanID: { type: Schema.Types.ObjectId, ref: 'TrainingPlan', required: true },

	taskID: { type: Schema.Types.ObjectId, required: true },
	doneAt: { type: Date, default: Date.now, immutable: true },

	// From ITASK, but we want to keep files from creation time
	title: { type: String, required: true },
	description: { type: String, required: true },
	day: [{ type: String, required: true }],
	difficulty: { type: String, enum: Object.values(DIFFICULTY), required: true },
});

export const CompletedTaskModel = model<ICompletedTaskDocument>(
	'CompletedTask',
	CompletedTaskSchema,
);
