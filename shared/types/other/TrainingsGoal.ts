// goals
export const GOALS = {
	goal1: 'Muskelaufbau: Gewicht senken',
	goal2: 'Muskelaufbau: Gewicht halten',
	goal3: 'Muskelaufbau: Gewicht erhöhen',
} as const;
export type TrainingsGoals = (typeof GOALS)[keyof typeof GOALS];