// Exercise (passt zum ExerciseSchema)
export interface Exercise {
  _id: string;
  name: string;
  type?: 'strength' | 'cardio';
  primaryMuscleGroups?: string[];
  executionInstructions?: string;
  videoUrl?: string;
  imageUrl?: string;
}

// workoutExerciseSchema (wird in Workout UND Entry genutzt)
export interface WorkoutExercise {
  exercise: Exercise;
  sets?: number;
  reps?: number;
  duration?: number;
  weight?: number;
}

// Workout
export interface Workout {
  _id: string;
  auth0Id: string;
  name: string;
  description?: string;
  exercises: WorkoutExercise[];
  createdAt: string;   
  updatedAt: string;
}

// Entry (plannedExercises und completed_exercises sind bei dir beide workoutExerciseSchema)
export interface Entry {
  _id?: string;
  auth0Id?: string;
  date?: Date;        
  workoutId?: string;
  plannedExercises: WorkoutExercise[];
  completed_exercises: WorkoutExercise[];
  habitId?: string;
  completed: boolean;
  score: number;
  createdAt?: string;
  updatedAt?: string;
}

// Pixel / Canvas (passt zu deinem UserModel: pixels sind platzierte Pixel)
export interface Pixel {
  x: number;
  y: number;
  color: string;
}

export interface Canvas {
  width: number;
  height: number;
  pixels: Pixel[];
}

// User (Feldnamen angepasst)
export interface User {
  _id: string;
  email: string;
  auth0Id: string;
  firstName?: string;
  lastName?: string;
  birthDate?: string;     // oder Date mit Konvertierung

  pixels: Pixel[];
  canvas: Canvas;

  onboardingCompleted: boolean;
  points: number;

  lastActiveDate?: string; 
  streak: number;

  createdAt: string;
  updatedAt: string;
}


export interface Habit {
  _id: string;
  auth0Id: string;
  name: string;
  type: 'daily' | 'weekly';
  weekday?: number;
  description?: string;
  createdAt: string;
  updatedAt: string;
}
