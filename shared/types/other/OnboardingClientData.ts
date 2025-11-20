import { GoalType } from "./TrainingsGoal";
import { TrainingDays } from "./TrainingDays";
import { TrainingsExperience } from "./TrainingsExperience";

export type OnboardingClientData = {
	weight?: number;
	height?: number;
	goal?: GoalType;
	experience?: TrainingsExperience;
	trainingDays?: TrainingDays[];
};