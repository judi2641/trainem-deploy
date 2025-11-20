// experience
export const EXPERIENCE = {
	exp1: 'starter',
	exp2: 'intermediate',
	exp3: 'pro',
} as const;

export type TrainingsExperience = (typeof EXPERIENCE)[keyof typeof EXPERIENCE];
