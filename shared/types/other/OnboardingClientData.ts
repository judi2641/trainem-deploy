import { TrainingsGoals } from "./TrainingsGoal";
import { TrainingDays } from "./TrainingDays";
import { TrainingsExperience } from "./TrainingsExperience";

export type OnboardingClientData = {
	weight?: number;
	height?: number;
	goal?: TrainingsGoals;
	experience?: TrainingsExperience;
	trainingDays?: TrainingDays[];
};