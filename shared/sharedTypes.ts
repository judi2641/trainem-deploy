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

// Group Member
export interface GroupMember {
  userId: string;
  role: 'owner' | 'admin' | 'member';
  joinedAt: string;
  contributedXP: number;
}

// Group
export interface Group {
  _id: string;
  name: string;
  description?: string;
  color: string;
  members: GroupMember[];
  isPublic: boolean;
  maxMembers: number;
  totalXP: number;
  currentSeasonXP: number;
  createdAt: string;
  updatedAt: string;
}

// PixelBoard Pixel
export interface PixelBoardPixel {
  x: number;
  y: number;
  color: string;
  groupId: string;
  lastUpdatedBy: string;
  lastUpdatedAt: string;
  conquestCount: number;
}

// PixelBoard
export interface PixelBoard {
  _id: string;
  seasonId: string;
  gridWidth: number;
  gridHeight: number;
  pixels: PixelBoardPixel[];
  createdAt: string;
  updatedAt: string;
}

// Season Leaderboard Entry
export interface SeasonLeaderboardEntry {
  groupId: string;
  groupName: string;
  score: number;
  pixelCount: number;
}

// Season
export interface Season {
  _id: string;
  name: string;
  description?: string;
  mode: 'territory_control' | 'xp_battle' | 'hybrid';
  startDate: string;
  endDate: string;
  status: 'upcoming' | 'active' | 'completed';
  participatingGroups: string[];
  leaderboard: SeasonLeaderboardEntry[];
  rules: {
    pixelsPerAction: number;
    xpPerPixel: number;
    cooldownMinutes: number;
    maxPixelsPerUser: number;
  };
  gridWidth: number;
  gridHeight: number;
  createdAt: string;
  updatedAt: string;
}

// Battle Member (tracks individual contributions)
export interface BattleMember {
  userId: string;
  contributedXP: number;
  pixelsPlaced: number;
  pixelsAvailable: number; // Verdiente Pixel durch Training (noch nicht gesetzt)
}

// Battle Participant (a team in the battle)
export interface BattleParticipant {
  groupId: string;
  groupName: string;
  color: string;
  pixelsOwned: number;
  totalXP: number;
  members: BattleMember[];
}

// Battle Settings
export interface BattleSettings {
  duration: number;
  gridSize: number;
  winCondition: 'pixels' | 'xp' | 'hybrid';
  xpPerPixel: number;
  pixelsPerAction: number;
  allowOverwrite: boolean;
}

// Battle
export interface Battle {
  _id: string;
  name: string;
  description?: string;
  challenger: BattleParticipant;
  opponent: BattleParticipant;
  status: 'pending' | 'accepted' | 'active' | 'completed' | 'declined' | 'cancelled';
  challengedAt: string;
  acceptedAt?: string;
  startDate?: string;
  endDate?: string;
  actualEndDate?: string;
  settings: BattleSettings;
  winnerId?: string;
  pixelBoardId?: string;
  createdAt: string;
  updatedAt: string;
}

// Battle Live Score
export interface BattleLiveScore {
  challenger: {
    pixels: number;
    xp: number;
    percentage: number;
  };
  opponent: {
    pixels: number;
    xp: number;
    percentage: number;
  };
  timeRemaining: number;
  status: string;
}
