import ExerciseModel from '../exercises/ExerciseModel';
import { createEmptyWorkout, addExerciseToWorkout } from './WorkoutService';
import { createOpenAIResponse, extractOutputText } from '../../utils/openai';
import { HttpError } from '../../errors/HttpError';

type OnboardingInput = {
	goal?: string | null;
	experience?: string | null;
	daysPerWeek?: number | null;
	minutesPerSession?: number | null;
	equipment?: string | null;
	limitations?: string | null;
	preferredSplit?: string | null;
	priorities?: string[] | null;
};

type GeneratedWorkout = {
	name: string;
	description?: string;
	exercises: Array<{
		exerciseName: string;
		sets?: number;
		reps?: number;
		duration?: number;
	}>;
};

function toNumber(value: unknown): number | null {
	if (typeof value === 'number' && Number.isFinite(value)) return value;
	return null;
}

function clamp(value: number, min: number, max: number): number {
	return Math.max(min, Math.min(max, value));
}

function getMaxOutputTokens(workoutsCount: number) {
	const base = 200;
	const perWorkout = 180;
	return clamp(base + perWorkout * workoutsCount, 400, 1800);
}

export async function generateWorkoutsFromOnboarding(auth0Id: string, onboarding: OnboardingInput) {
	const exercises = await ExerciseModel.find({}, { name: 1 }).lean();
	const allowedExercises = exercises.map((ex) => ex.name);

	if (allowedExercises.length === 0) {
		throw new HttpError(400, 'No exercises available for workout generation');
	}

	const workoutsCount = clamp(toNumber(onboarding.daysPerWeek ?? 3) ?? 3, 1, 6);

	const model = process.env.OPENAI_MODEL ?? 'gpt-5-nano';
	const userPayload = {
		goal: onboarding.goal ?? '',
		experience: onboarding.experience ?? '',
		days_per_week: workoutsCount,
		minutes_per_session: onboarding.minutesPerSession ?? null,
		equipment: onboarding.equipment ?? '',
		limitations: onboarding.limitations ?? '',
		preferred_split: onboarding.preferredSplit ?? '',
		priorities: onboarding.priorities ?? [],
		allowed_exercises: allowedExercises,
	};

	const instructions =
		'Create workouts based on the input. Use only exercises from allowed_exercises. Keep output short and structured.';

	const tools = [
		{
			type: 'function',
			name: 'create_workouts',
			description: 'Create workout plans with exercises.',
			parameters: {
				type: 'object',
				properties: {
					workouts: {
						type: 'array',
						minItems: 1,
						maxItems: workoutsCount,
						items: {
							type: 'object',
							properties: {
								name: { type: 'string' },
								description: { type: 'string' },
								exercises: {
									type: 'array',
									minItems: 3,
									maxItems: 10,
									items: {
										type: 'object',
										properties: {
											exerciseName: { type: 'string' },
											sets: { type: 'number' },
											reps: { type: 'number' },
											duration: { type: 'number' },
										},
										required: ['exerciseName'],
										additionalProperties: false,
									},
								},
							},
							required: ['name', 'exercises'],
							additionalProperties: false,
						},
					},
				},
				required: ['workouts'],
				additionalProperties: false,
			},
		},
	];

	let response = await createOpenAIResponse({
		model,
		instructions,
		input: JSON.stringify(userPayload),
		tools,
		tool_choice: { type: 'function', name: 'create_workouts' },
		reasoning: { effort: 'minimal' },
		max_output_tokens: getMaxOutputTokens(workoutsCount),
	});

	const outputItems = (response as { output?: Array<Record<string, unknown>> }).output ?? [];
	const toolCall = outputItems.find(
		(item) => item?.type === 'function_call' && item?.name === 'create_workouts',
	) as { arguments?: unknown } | undefined;

	let parsed: { workouts: GeneratedWorkout[] };
	if (toolCall?.arguments) {
		if (typeof toolCall.arguments === 'string') {
			parsed = JSON.parse(toolCall.arguments);
		} else {
			parsed = toolCall.arguments as { workouts: GeneratedWorkout[] };
		}
	} else {
		const rawText = extractOutputText(response);
		parsed = JSON.parse(rawText) as { workouts: GeneratedWorkout[] };
	}
	const workouts = Array.isArray(parsed.workouts) ? parsed.workouts : [];

	const allowedSet = new Set(allowedExercises.map((name) => name.toLowerCase()));
	const createdWorkouts = [];

	for (const workout of workouts) {
		if (!workout?.name || !Array.isArray(workout.exercises) || workout.exercises.length === 0) {
			continue;
		}

		let created = await createEmptyWorkout(auth0Id, workout.name, workout.description ?? '');

		for (const ex of workout.exercises) {
			if (!ex?.exerciseName) continue;
			const exerciseName = ex.exerciseName.trim();
			if (!allowedSet.has(exerciseName.toLowerCase())) continue;

			created = await addExerciseToWorkout(
				exerciseName,
				created._id.toString(),
				ex.sets,
				ex.reps,
				ex.duration,
			);
		}

		createdWorkouts.push(created);
	}

	return createdWorkouts;
}
