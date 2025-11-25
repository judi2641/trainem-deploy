import { TrainingsPlanModel } from './TrainingsPlanModel';
import mongoose, { Types } from 'mongoose';
import { ITask } from '../../../../shared/types/database/traininsplan/Task';
import { HttpError } from '../../errors/HttpError';
import { logger } from '../../utils/logger';
import { TrainingsExperience } from '../../../../shared/types/other/TrainingsExperience';
import { TrainingsGoals } from '../../../../shared/types/other/TrainingsGoal';
import { OnboardingClientData } from '../../../../shared/types/other/OnboardingClientData';
import { TrainingDays } from '../../../../shared/types/other/TrainingDays';
import { getUserByAuth0id } from '../user/UserService';

const SESSION_TYPES = [
	'push',
	'pull',
	'legs',
	'upper',
	'lower',
	'full',
	'core',
	'conditioning',
] as const;

type SessionType = (typeof SESSION_TYPES)[number];

// -------------------------------------
// Exercises je SessionType
// -------------------------------------
const DEFAULT_EXERCISES: Record<SessionType, string[]> = {
	push: ['Bankdrücken', 'Schulterdrücken', 'Dips'],
	pull: ['Klimmzüge', 'Langhantelrudern', 'Face Pulls'],
	legs: ['Kniebeugen', 'Ausfallschritte', 'Beinpresse'],
	upper: ['Bankdrücken', 'Klimmzüge', 'Schulterdrücken'],
	lower: ['Kreuzheben', 'Kniebeugen', 'Beinpresse'],
	full: ['Kniebeugen', 'Bankdrücken', 'Klimmzüge'],
	core: ['Plank', 'Hanging Knee Raises', 'Russian Twists'],
	conditioning: ['Burpees', 'Mountain Climbers', 'Jumping Jacks'],
};

// -------------------------------------
// Experience -> Difficulty
// -------------------------------------
function mapDifficulty(exp: TrainingsExperience | undefined, goal?: TrainingsGoals) {
	// Basis: Experience
	let difficulty: 'easy' | 'middle' | 'hard' =
		exp === 'pro' ? 'hard' : exp === 'intermediate' ? 'middle' : 'easy';

	// Optional kleine Anpassung nach Goal
	if (goal && goal.includes('senken') && difficulty === 'hard') {
		// Fettverlust + pro → eher middle
		difficulty = 'middle';
	}

	return difficulty;
}

// -------------------------------------
// Experience normalisieren
// -------------------------------------
function normalizeExperience(exp?: TrainingsExperience): TrainingsExperience {
	return exp ?? 'starter';
}

// -------------------------------------
// Trainingstage bestimmen
// -------------------------------------
function resolveTrainingDays(onboarding: OnboardingClientData): TrainingDays[] {
	if (onboarding.trainingDays && onboarding.trainingDays.length > 0) {
		return onboarding.trainingDays;
	}
	// Fallback: 3-Tage-Plan (Mon/Wed/Fri) oder komplette Woche
	return ['Mon', 'Wed', 'Fri'];
}

// -------------------------------------
// SessionType pro Tag auswählen
// -------------------------------------
function decideSessionTypeForDay(
	index: number,
	totalDays: number,
	goal?: TrainingsGoals,
): SessionType {
	// Zielabhängige Grundrotation
	if (!goal || goal.includes('Muskelaufbau')) {
		// Fokus Muskelaufbau
		if (totalDays <= 2) {
			// bei 1–2 Tagen → Fullbody
			return 'full';
		}
		if (totalDays === 3) {
			return ['push', 'pull', 'legs'][index] as SessionType;
		}
		if (totalDays === 4) {
			return ['upper', 'lower', 'push', 'pull'][index] as SessionType;
		}
		// 5+ Tage → klassische Rotation
		const rotation: SessionType[] = ['push', 'pull', 'legs', 'upper', 'lower'];
		return rotation[index % rotation.length];
	}

	// Ziel: Gewicht halten → ausgewogen
	if (goal.includes('halten')) {
		const rotation: SessionType[] = ['full', 'upper', 'lower', 'push', 'pull', 'legs'];
		return rotation[index % rotation.length];
	}

	// Ziel: Gewicht senken → mehr Conditioning & Fullbody
	if (goal.includes('senken')) {
		const rotation: SessionType[] = ['full', 'conditioning', 'full', 'core', 'conditioning'];
		return rotation[index % rotation.length];
	}

	// Fallback
	return 'full';
}

// -------------------------------------
// Description je Übung generieren
// -------------------------------------
function buildDescription(
	exerciseName: string,
	session: SessionType,
	exp: TrainingsExperience,
	goal?: TrainingsGoals,
	weight?: number,
	height?: number,
): string {
	const baseLevel =
		exp === 'pro' ? 'fortgeschritten' : exp === 'intermediate' ? 'mittel' : 'Einsteiger';

	let repRange = '8–12 Wiederholungen';
	if (goal?.includes('senken')) repRange = '12–20 Wiederholungen';
	if (goal?.includes('halten')) repRange = '10–15 Wiederholungen';

	let extra = '';
	if (weight && weight > 100) {
		extra = ' Achte besonders auf saubere Technik und moderates Volumen.';
	} else if (weight && weight < 60) {
		extra = ' Fokus auf progressiven Aufbau von Kraft und Muskulatur.';
	}

	return `${session.toUpperCase()}-Session (${baseLevel}): ${repRange}.${extra}`;
}

// -------------------------------------
// Tasks für einen Tag generieren
// -------------------------------------
function generateTasksForDay(
	day: TrainingDays,
	dayIndex: number,
	totalDays: number,
	onboarding: OnboardingClientData,
	userID: mongoose.Types.ObjectId,
	trainingsplanID: mongoose.Types.ObjectId,
): ITask[] {
	const exp = normalizeExperience(onboarding.experience);
	const goal = onboarding.goal;
	const sessionType = decideSessionTypeForDay(dayIndex, totalDays, goal);
	const difficulty = mapDifficulty(exp, goal);

	const exercises = DEFAULT_EXERCISES[sessionType];

	return exercises.map<ITask>((exerciseName) => ({
		userID,
		trainingsplanID,
		title: exerciseName,
		description: buildDescription(
			exerciseName,
			sessionType,
			exp,
			goal,
			onboarding.weight,
			onboarding.height,
		),
		difficulty,
		day,
	}));
}

// -------------------------------------
// HAUPTFUNKTION: Default Plan aus Onboarding
// -------------------------------------
export async function createDefaultTrainingsplanFromOnboarding(
	userID: string,
	onboarding: OnboardingClientData,
) {
	if (!mongoose.Types.ObjectId.isValid(userID)) {
		throw new HttpError(400, 'Invalid userID');
	}

	const userObjID = new mongoose.Types.ObjectId(userID);
	const days = resolveTrainingDays(onboarding);
	const exp = normalizeExperience(onboarding.experience);

	// Name dynamisch abhängig vom Ziel / Experience
	let name = 'Default Trainingsplan';
	if (onboarding.goal?.includes('erhöhen')) {
		name = 'Muskelaufbau-Plan';
	} else if (onboarding.goal?.includes('senken')) {
		name = 'Fettverlust-Plan';
	} else if (onboarding.goal?.includes('halten')) {
		name = 'Erhaltungs-Plan';
	}
	name += ` (${exp})`;

	const empty_tasks: ITask[] = [];

	// Trainingsplan-Grundgerüst anlegen
	const planDoc = await TrainingsPlanModel.create({
		userID: userObjID,
		name,
		tasks: empty_tasks,
	});

	const planID = planDoc._id as mongoose.Types.ObjectId;

	const tasks: ITask[] = [];

	days.forEach((day, index) => {
		const dayTasks = generateTasksForDay(day, index, days.length, onboarding, userObjID, planID);
		tasks.push(...dayTasks);
	});

	planDoc.tasks.push(...tasks);
	await planDoc.save();

	return planDoc;
}

export async function getTrainingsPlanByAuth0ID(auth0ID: string) {
	try {
		const user = await getUserByAuth0id(auth0ID);
		return await TrainingsPlanModel.find({ userID: user._id });
	} catch (error) {
		logger.error('failed to get trainingsplans bei auth0ID', error);
		if (error instanceof HttpError) {
			throw error;
		} else {
			throw new HttpError(400, 'failed to get trainingsplan by auth0ID');
		}
	}
}

/**
 * creates new task to trainingsplan with trainingsplanID
 * @param trainingsplanID
 * @param newTask
 * @returns updated trainingsplan
 */
export async function createTaskForTrainingsplan(trainingsplanID: Types.ObjectId, newTask: ITask) {
	try {
		const trainingsplan = await TrainingsPlanModel.findById(trainingsplanID);
		if (!trainingsplan) {
			logger.error('trainingsplan nicht gefunden');
			throw new HttpError(400, 'trainingsplan nicht gefunden');
		}
		trainingsplan.tasks.push(newTask);
		return await trainingsplan.save();
	} catch (error) {
		if (error instanceof HttpError) {
			throw error;
		} else {
			logger.error('failed to create new task');
			throw new HttpError(400, 'failed to create new task');
		}
	}
}
