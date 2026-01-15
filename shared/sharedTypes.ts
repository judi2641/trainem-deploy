// Exercise
export interface Exercise {
	_id: string;
	name: string;
	type?: 'strength' | 'cardio' | 'bodyweight';
	primaryMuscleGroups: string[];
	executionInstructions: string;
	videoUrl: string;
	imageUrl: string;
}

// Set Types
export interface PlannedSet {
	repsPlanned?: string;
	durationPlanned?: number;
}

export interface CompletedSet {
	repsPlanned: string;
	repsDone: number;
	weight?: number;
	durationDone?: number;
	distance?: number;
	completed: boolean;
}

// Workout
export interface WorkoutExercise {
	excercise: Exercise;
	sets: PlannedSet[];
}

export interface Workout {
	_id: string;
	auth0Id: string;
	name: string;
	description?: string;
	exercises: WorkoutExercise[];
	createdAt: Date;
	updatedAt: Date;
}

// Entry
export interface PlannedExercise {
	exerciseId: string;
	name: string;
	sets: PlannedSet[];
}

export interface CompletedExercise {
	exerciseId: string;
	name: string;
	sets: CompletedSet[];
}

export interface Entry {
	_id: string;
	auth0Id: string;
	date: Date;
	workoutId?: string;
	plannedExercises: PlannedExercise[];
	completed_exercises: CompletedExercise[];
	habitId?: string;
	completed: boolean;
	score: number;
	createdAt: Date;
	updatedAt: Date;
}

// User
export interface Pixel {
	color: string;
	x?: number;
	y?: number;
}

export interface Canvas {
	width: number;
	height: number;
	pixels: Pixel[];
}

export interface User {
	_id: string;
	email: string;
	firstname: string;
	lastname: string;
	auth0Id: string;
	points: number;
	pixels: Pixel[]; // Inventory
	canvas: Canvas;
	lastActiveDate?: Date;
	streak: number;
	createdAt: Date;
	updatedAt: Date;
}

// Habit
export interface Habit {
	_id: string;
	auth0Id: string;
	name: string;
	type: 'daily' | 'weekly';
	weekday?: number; // 0-6
	description?: string;
	createdAt: Date;
	updatedAt: Date;
}
