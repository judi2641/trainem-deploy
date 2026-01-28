// experience
export const EXPERIENCE = {
	exp1: 'beginner',
	exp2: 'intermediate',
	exp3: 'experienced',
} as const;

export type TrainingsExperience = (typeof EXPERIENCE)[keyof typeof EXPERIENCE];
