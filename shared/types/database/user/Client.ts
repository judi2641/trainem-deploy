import { OnboardingClientData } from "../../other/OnboardingClientData";
import { IUser } from "./User";
import { ObjectId } from "mongoose";

export interface IClient extends IUser {
	/** Each Client can have 0..* Trainingsplans */
	trainingsplans?: string[];
	onboardingData: OnboardingClientData;
	trainer_ID: ObjectId;
}
