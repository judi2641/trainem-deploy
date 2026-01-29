import express, { Request, Response } from 'express';
import { createHabit, deleteHabit, getAllHabitsFromUser } from './HabitService';

const router = express.Router();

function sendError(res: any, err: any) {
  const status = err?.statusCode ?? 500;
  res.status(status).json({ message: err?.message ?? 'Internal Server Error' });
}

// GET /habits?auth0Id=xxx
router.get('/:auth0Id', async (req: Request, res: Response) => {
  try {
    const auth0Id = req.params.auth0Id;
    const habits = await getAllHabitsFromUser(auth0Id);
    res.json(habits);
  } catch (err) {
    sendError(res, err);
  }
});

// POST /habits  { auth0Id, name, type, description?, weekday? }
router.post('/', async (req: Request, res: Response) => {
  try {
    const { auth0Id, name, type, description, weekday } = req.body;
    const habit = await createHabit(auth0Id, name, type, description, weekday);
    res.status(201).json(habit);
  } catch (err) {
    sendError(res, err);
  }
});
router.delete('/:habitId', async (req: Request, res: Response) => {
  try {
    const habitId = req.params.habitId;
    await deleteHabit(habitId);
    res.status(204).send();
    }
    catch (err) {
    sendError(res, err);
  }
  })

export default router;
