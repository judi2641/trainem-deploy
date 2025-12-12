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
	auth0ID: string;
	email: string;
	userType?: UserType;

	firstName?: string;
	lastName?: string;
	birthDate?: Date;
	gender?: GenderType;
	score?: number;
	avatar?: string;
	img?: string;
}

// gender
export const GENDERS = {
	m: 'Male',
	f: 'Female',
	d: 'Diverse',
} as const;
export type GenderType = (typeof GENDERS)[keyof typeof GENDERS];

// Usertype
export const USERS = {
	trainer: 'trainer',
	client: 'client',
} as const;
export type UserType = (typeof USERS)[keyof typeof USERS];
