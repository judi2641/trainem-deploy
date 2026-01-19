import express, { Request, Response } from 'express';
import { createEmptyWorkout, addExerciseToWorkout, getAllWorkoutsFromUser } from './WorkoutService';

const router = express.Router();

function sendError(res: any, err: any) {
  const status = err?.statusCode ?? 500;
  res.status(status).json({ message: err?.message ?? 'Internal Server Error' });
}
// GET /workouts?auth0Id=xxx
router.get('/:auth0Id', async (req: Request, res: Response) => {
  try {
    const auth0Id = req.params.auth0Id;
    const workouts = await getAllWorkoutsFromUser(auth0Id);
    res.json(workouts);
  } catch (err) {
    sendError(res, err);
  }
});

// POST /workouts  { auth0Id, name, description }
router.post('/', async (req: Request, res: Response) => {
  try {
    const { auth0Id, name, description } = req.body;
    const workout = await createEmptyWorkout(auth0Id, name, description);
    res.status(201).json(workout);
  } catch (err) {
    sendError(res, err);
  }
});

router.post('/onboarding', async (req: Request, res: Response) => {
  try {
    const { auth0Id, name, description } = req.body;
    const workout = await createEmptyWorkout(auth0Id, name, description);
    res.status(201).json(workout);
  }
  catch(err){
    sendError(res, err);
  }
})

// POST /workouts/:workoutId/exercises  { exerciseName, sets?, reps?, duration? }
router.post('/:workoutId/exercises', async (req: Request, res: Response) => {
  try {
    const { exerciseName, sets, reps, duration } = req.body;
    const workout = await addExerciseToWorkout(exerciseName, req.params.workoutId, sets, reps, duration);
    res.json(workout);
  } catch (err) {
    sendError(res, err);
  }
});

export default router;
