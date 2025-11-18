/**
 *  This document scores all the Trainingsplans.
 *  A Trainngsplan is the summary of daily Tasks.
 *
 *  Each Trainingsplan will have 1 UID
 *  Each Trainingsplan will habe 1 Client which it belongs to.
 *  Each Trainingsplan will have 0..* Tasks
 *
 *
 */

import { model, Schema, Document } from 'mongoose';
import { DIFFICULTY, ITrainingsplan } from '../../../../shared/types/Training';
import { TRAINING_DAYS, USERS } from '../../../../shared/types/User';

export interface ITrainingPlanDocument extends ITrainingsplan, Document {}

const TrainingPlanSchema = new Schema<ITrainingPlanDocument>(
	{
		userID: { type: Schema.Types.ObjectId, ref: USERS.client, required: true },
		name: String,
		// Array von Tasks (jede Task ist typischerweise ein Subdocument)
		tasks: [
			{
				title: { type: String, required: true },
				description: String,
				difficulty: { type: String, enum: Object.values(DIFFICULTY) },
				day: { type: String, enum: Object.values(TRAINING_DAYS) },
			},
		],
	},
	{ timestamps: true },
);

export const TrainingPlanModel = model<ITrainingPlanDocument>('TrainingPlan', TrainingPlanSchema);

// TODO: Subschema von task..
