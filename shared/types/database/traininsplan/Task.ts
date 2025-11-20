import { ObjectId } from 'mongoose';
import { TrainingDays } from '../../other/TrainingDays';


export interface ITask {
    title: string;
    description: string;
    difficulty: difficultyType;
    day: TrainingDays;
}

export const DIFFICULTY = {
	lvl1: 'easy',
	lvl2: 'middle',
	lvl3: 'hard',
};
export type difficultyType = (typeof DIFFICULTY)[keyof typeof DIFFICULTY];
