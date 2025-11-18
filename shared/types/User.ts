/*
-----------------------------------------------------
    Domain Types / Models: IUser
-----------------------------------------------------
*/

import { ObjectId } from 'mongoose';

/**
 * Base Interface for all the Users.
 * Contains all the Information, each User contains.
 */
export interface IUser {
	userID: string;
	email: string;
	userType: UserType;

	firstName?: string;
	lastName?: string;
	birthDate?: Date;
	gender?: GenderType;

	avatar?: string;
	img?: string;
}

// gender
export const GENDERS = {
	m: 'm',
	f: 'f',
	d: 'd',
} as const;
export type GenderType = (typeof GENDERS)[keyof typeof GENDERS];

// Usertype
export const USERS = {
	trainer: 'trainer',
	client: 'client',
} as const;
export type UserType = (typeof USERS)[keyof typeof USERS];

/*
-----------------------------------------------------
    Specific Information for a Client
-----------------------------------------------------
*/

/**
 *  Client-Specific Information.
 *
 */
export interface IClient extends IUser {
	/** Each Client can have 0..* Trainingsplans */
	trainingsplans?: string[];
	onboardingData: OnboardingClientData;
	trainer_ID: ObjectId;
}

export type OnboardingClientData = {
	weight?: number;
	height?: number;
	goal?: GoalType;
	experience?: ExperienceType;
	trainingDays?: trainingDayType[];
};

// days
export const TRAINING_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;

export type trainingDayType = (typeof TRAINING_DAYS)[number];

// goals
export const GOALS = {
	goal1: 'Muskelaufbau: Gewicht senken',
	goal2: 'Muskelaufbau: Gewicht halten',
	goal3: 'Muskelaufbau: Gewicht erhöhen',
} as const;
export type GoalType = (typeof GOALS)[keyof typeof GOALS];

// experience
export const EXPERIENCE = {
	exp1: 'starter',
	exp2: 'intermediate',
	exp3: 'pro',
} as const;

export type ExperienceType = (typeof EXPERIENCE)[keyof typeof EXPERIENCE];

/*
-----------------------------------------------------
    Specifc information for a Trainer
-----------------------------------------------------
*/
export interface ITrainer extends IUser {
	client_ID: ObjectId[];
}
