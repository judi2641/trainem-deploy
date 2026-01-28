export const GOALS = {
	goal1: 'Muskelaufbau',
	goal2: 'Kraft',
	goal3: 'Abnehmen',
	goal4: 'Ausdauer',
	goal5: 'Allround-Fitness',
} as const;
export type TrainingsGoals = (typeof GOALS)[keyof typeof GOALS];
