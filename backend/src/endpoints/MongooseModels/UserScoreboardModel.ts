/**
 * This Document stores all the Users with their current score.
 * This Document is the central User list. each User (Trainer / Client) must appear in this list
 *
 * There could be a disable score setting for trainers and maybe a privacy setting if a user doesnt want to share its score
 * There could be filter options by Group, gender, age, state, etc..
 *
 * DTO will be used to select speficic infomration for each purpose
 * - e.g. In the global Scoreboard we dont want to see personal Information of the User (adress / lastName...)
 * - e.g. A Trainer should see and update training related Information, but no personal Information...
 *
 *
 *  Each User       will have 1     UID (from Mongoose)
 *  Each User       will have 1     email
 *  Each User       will have 1     Usertype.
 *  Each User       will have 1     Gender
 *  Each User       will have 1     Birthdate
 *  Each User       will have 0..1  ProfileImg
 *  Each User       will have 0..1  Avatar
 *  Each User       will have 0..1  First and LastName
 *
 *  Each Client     will have 1     'Trainingsinformation' (heigt,weight, age, currentState, goals)
 *  Each Client     will have 0..1  Trainer
 *  Each Client     will have 0..*  Trainingsplans (which contains the Tasks...)
 *
 *  Each Trainer    will have 0..* Clients
 *
 *
 * // TODO: -> Each User     will have 1     score ??? -> Maybe only Clients
 *
 */

import mongoose, { Schema, Document } from 'mongoose';
import {
	IUser,
	IClient,
	ITrainer,
	GENDERS,
	USERS,
	GOALS,
	EXPERIENCE,
	TRAINING_DAYS,
} from '../../../../shared/types/User';

/*
    USER
*/
export interface IUserDocument extends IUser, Document {}

const UserSchema = new Schema<IUserDocument>(
	{
		email: { type: String, required: true, unique: true },
		userType: { type: String, enum: Object.values(USERS), required: true },

		firstName: String,
		lastName: String,
		birthDate: Date,
		gender: { type: String, enum: Object.values(GENDERS) },

		avatar: String,
		img: String,
	},
	{ discriminatorKey: 'userType', timestamps: true },
);

export const UserModel = mongoose.model<IUserDocument>('User', UserSchema);

/*
    Client
*/
export interface IClientDocument extends IClient, Document {}

const ClientSchema = new Schema<IClientDocument>({
	// TODO: Go away from Onboarding Data... find good name... Trainingsinfo?
	// TODO: Which fileds should be required?
	onboardingData: {
		weight: Number,
		height: Number,
		goal: { type: String, enum: Object.values(GOALS), default: null },
		experience: { type: String, enum: Object.values(EXPERIENCE), default: null },
		trainingDays: [{ type: String, enum: TRAINING_DAYS }],
	},
	trainer_ID: { type: Schema.Types.ObjectId, ref: USERS.trainer },
	trainingsplans: [{ type: Schema.Types.ObjectId, ref: 'TrainingsPlan' }],
});

export const ClientModel = UserModel.discriminator<IClientDocument>(USERS.client, ClientSchema);

/*
    Trainer
*/
export interface ITrainerDocument extends ITrainer, Document {}

const TrainerSchema = new Schema<ITrainerDocument>({
	client_ID: [{ type: Schema.Types.ObjectId, ref: USERS.client }],
});

export const TrainerModel = UserModel.discriminator<ITrainerDocument>(USERS.trainer, TrainerSchema);
