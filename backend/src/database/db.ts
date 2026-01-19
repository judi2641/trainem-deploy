import config from "config";
import mongoose from "mongoose";
import { logger } from "../utils/logger";
import { ExerciseModel } from "../endpoints/exercises/ExerciseModel";

let _db: mongoose.Connection | null = null;

const connectionString: string = config.get("db.connectionString");

async function createExercises() {
  const exercises = [
    {
      name: 'Bench Press',
      type: 'strength',
      primaryMuscleGroups: ['chest', 'triceps', 'shoulders'],
      executionInstructions: 'Lie on bench, push the barbell up and down',
      videoUrl: 'https://example.com/benchpress-video',
      imageUrl: 'https://example.com/benchpress-image',
    },
    {
      name: 'Squat',
      type: 'strength',
      primaryMuscleGroups: ['quadriceps', 'glutes', 'hamstrings'],
      executionInstructions: 'Stand with feet shoulder-width, lower hips down, then stand up',
      videoUrl: 'https://example.com/squat-video',
      imageUrl: 'https://example.com/squat-image',
    },
    {
      name: 'Running',
      type: 'cardio',
      primaryMuscleGroups: ['legs', 'cardiovascular system'],
      executionInstructions: 'Run at a steady pace for the desired duration',
      videoUrl: 'https://example.com/running-video',
      imageUrl: 'https://example.com/running-image',
    },
    {
      name: 'Deadlift',
      type: 'strength',
      primaryMuscleGroups: ['back', 'glutes', 'hamstrings'],
      executionInstructions: 'Lift barbell from the floor to hip level',
      videoUrl: 'https://example.com/deadlift-video',
      imageUrl: 'https://example.com/deadlift-image',
    },
    {
      name: 'Jump Rope',
      type: 'cardio',
      primaryMuscleGroups: ['legs', 'cardiovascular system'],
      executionInstructions: 'Jump continuously over the rope',
      videoUrl: 'https://example.com/jumprope-video',
      imageUrl: 'https://example.com/jumprope-image',
    },
    {
      name: 'Pull-up',
      type: 'strength',
      primaryMuscleGroups: ['back', 'biceps'],
      executionInstructions: 'Pull body up on a bar until chin is above the bar',
      videoUrl: 'https://example.com/pullup-video',
      imageUrl: 'https://example.com/pullup-image',
    },
    {
      name: 'Cycling',
      type: 'cardio',
      primaryMuscleGroups: ['legs', 'cardiovascular system'],
      executionInstructions: 'Pedal a bicycle or stationary bike at a steady pace',
      videoUrl: 'https://example.com/cycling-video',
      imageUrl: 'https://example.com/cycling-image',
    },
    {
      name: 'Plank',
      type: 'strength',
      primaryMuscleGroups: ['core'],
      executionInstructions: 'Hold a push-up position keeping the body straight',
      videoUrl: 'https://example.com/plank-video',
      imageUrl: 'https://example.com/plank-image',
    },
    {
      name: 'Burpees',
      type: 'cardio',
      primaryMuscleGroups: ['full body'],
      executionInstructions: 'From standing, squat down, jump back, do a push-up, jump forward, and jump up',
      videoUrl: 'https://example.com/burpees-video',
      imageUrl: 'https://example.com/burpees-image',
    },
    {
      name: 'Lunges',
      type: 'strength',
      primaryMuscleGroups: ['quadriceps', 'glutes', 'hamstrings'],
      executionInstructions: 'Step forward and lower hips until both knees are bent at 90 degrees',
      videoUrl: 'https://example.com/lunges-video',
      imageUrl: 'https://example.com/lunges-image',
    },
  ];

  try {
    await ExerciseModel.insertMany(exercises);
    console.log('10 Exercises wurden erfolgreich erstellt.');
  } catch (error) {
    console.error('Fehler beim Erstellen der Exercises:', error);
  }
}




export async function initDB() {
    if(_db) return;

    try{
        await mongoose.connect(connectionString, {
            serverSelectionTimeoutMS: 3000,
        });
        _db = mongoose.connection;
        logger.info("database connected");
        await createExercises();
        logger.info("exercises created");
    }
    catch(error){    
        logger.error("connection to database failed:", error);    
        throw error;    
    }
}