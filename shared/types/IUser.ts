// //import { TaskInDatabase } from './Task';

// interface IUser {
// 	avatar: string;
// 	img: string;
// 	personalData: IPersonalData;
// 	onboardingData: IOnboardingData;
// 	tasks: TaskInDatabase[];
// }
// export interface Client extends IUser {}
// export interface Trainer extends IUser {}

// // erstmal test Interface für Onboarding Data
// export interface IOnboardingDocument extends Document {
// 	user_id?: string;

// 	goal: string | null;
// 	experience: string | null; //
// 	days: string[];

// 	name: string | null;
// 	age: string | number | null;
// 	weight: string | number | null;
// 	height: string | number | null;
// 	gender: 'Male' | 'Female' | 'Other' | string | null;
// 	started: boolean;

// 	createdAt: Date;
// 	updatedAt: Date;
// }
// // erstmal test Interface für Onboarding Data

// interface IPersonalData {
// 	userID: string;
// 	email: string;
// 	firstName?: string;
// 	lastName?: string;
// 	avatar?: string;
// 	task?: string;
// 	usertype: userType;
// }

// interface IOnboardingData {
// 	height?: number;
// 	weight?: number;
// 	level?: level;
// 	bodytype?: bodytype;
// }

// enum userType {
// 	trainer,
// 	client,
// }
// enum bodytype {
// 	fatAsFuck,
// 	lauch,
// 	skinnifat,
// 	normal,
// 	shredded,
// 	MarkusRühl,
// }
// enum level {
// 	starter,
// 	intermediate,
// 	pro,
// }
