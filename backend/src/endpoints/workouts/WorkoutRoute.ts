import express, { Request, Response } from 'express';
import {
  createEmptyWorkout,
  addExerciseToWorkout,
  getAllWorkoutsFromUser,
  updateWorkout,
  deleteWorkout,
  removeExerciseFromWorkout
} from './WorkoutService';

const router = express.Router();

function sendError(res: any, err: any) {
  const status = err?.statusCode ?? err?.status ?? 500;
  res.status(status).json({ message: err?.message ?? 'Internal Server Error' });
}

// GET /workouts/:auth0Id - Alle Workouts eines Users
router.get('/:auth0Id', async (req: Request, res: Response) => {
  try {
    const auth0Id = req.params.auth0Id;
    const workouts = await getAllWorkoutsFromUser(auth0Id);
    res.json(workouts);
  } catch (err) {
    sendError(res, err);
  }
});

// POST /workouts - Neues Workout erstellen
router.post('/', async (req: Request, res: Response) => {
  try {
    const { auth0Id, name, description } = req.body;
    const workout = await createEmptyWorkout(auth0Id, name, description);
    res.status(201).json(workout);
  } catch (err) {
    sendError(res, err);
  }
});

// POST /workouts/onboarding - Workout während Onboarding erstellen
router.post('/onboarding', async (req: Request, res: Response) => {
  try {
    const { auth0Id, name, description } = req.body;
    const workout = await createEmptyWorkout(auth0Id, name, description);
    res.status(201).json(workout);
  } catch(err) {
    sendError(res, err);
  }
});

// PUT /workouts/:workoutId - Workout aktualisieren
router.put('/:workoutId', async (req: Request, res: Response): Promise<void> => {
  try {
    const { workoutId } = req.params;
    const { auth0Id, name, description } = req.body;

    if (!auth0Id) {
      res.status(400).json({ message: 'auth0Id is required' });
      return;
    }

    const workout = await updateWorkout(workoutId, auth0Id, { name, description });
    res.json(workout);
  } catch (err) {
    sendError(res, err);
  }
});

// DELETE /workouts/:workoutId - Workout löschen
router.delete('/:workoutId', async (req: Request, res: Response): Promise<void> => {
  try {
    const { workoutId } = req.params;
    const { auth0Id } = req.body;

    if (!auth0Id) {
      res.status(400).json({ message: 'auth0Id is required' });
      return;
    }

    await deleteWorkout(workoutId, auth0Id);
    res.status(204).send();
  } catch (err) {
    sendError(res, err);
  }
});

// POST /workouts/:workoutId/exercises - Übung zu Workout hinzufügen
router.post('/:workoutId/exercises', async (req: Request, res: Response) => {
  try {
    const { exerciseName, sets, reps, duration } = req.body;
    const workout = await addExerciseToWorkout(exerciseName, req.params.workoutId, sets, reps, duration);
    res.json(workout);
  } catch (err) {
    sendError(res, err);
  }
});

// DELETE /workouts/:workoutId/exercises/:exerciseIndex - Übung aus Workout entfernen
router.delete('/:workoutId/exercises/:exerciseIndex', async (req: Request, res: Response): Promise<void> => {
  try {
    const { workoutId, exerciseIndex } = req.params;
    const { auth0Id } = req.body;

    if (!auth0Id) {
      res.status(400).json({ message: 'auth0Id is required' });
      return;
    }

    const workout = await removeExerciseFromWorkout(workoutId, auth0Id, parseInt(exerciseIndex));
    res.json(workout);
  } catch (err) {
    sendError(res, err);
  }
});

export default router;
