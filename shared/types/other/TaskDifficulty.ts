export const DIFFICULTY = {
	lvl1: 'easy',
	lvl2: 'middle',
	lvl3: 'hard',
};
export type TaskDifficulty = (typeof DIFFICULTY)[keyof typeof DIFFICULTY];