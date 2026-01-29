import express, { Request, Response } from 'express';
import { createHabit, getAllHabitsFromUser, updateHabit, deleteHabit } from './HabitService';

const router = express.Router();

function sendError(res: any, err: any) {
  const status = err?.statusCode ?? err?.status ?? 500;
  res.status(status).json({ message: err?.message ?? 'Internal Server Error' });
}

// GET /habits/:auth0Id - Alle Habits eines Users
router.get('/:auth0Id', async (req: Request, res: Response) => {
  try {
    const auth0Id = req.params.auth0Id;
    const habits = await getAllHabitsFromUser(auth0Id);
    res.json(habits);
  } catch (err) {
    sendError(res, err);
  }
});

// POST /habits - Neues Habit erstellen
router.post('/', async (req: Request, res: Response) => {
  try {
    const { auth0Id, name, type, description, weekday } = req.body;
    const habit = await createHabit(auth0Id, name, type, description, weekday);
    res.status(201).json(habit);
  } catch (err) {
    sendError(res, err);
  }
});

// PUT /habits/:habitId - Habit aktualisieren
router.put('/:habitId', async (req: Request, res: Response): Promise<void> => {
  try {
    const { habitId } = req.params;
    const { auth0Id, name, description, type, weekday } = req.body;

    if (!auth0Id) {
      res.status(400).json({ message: 'auth0Id is required' });
      return;
    }

    const habit = await updateHabit(habitId, auth0Id, { name, description, type, weekday });
    res.json(habit);
  } catch (err) {
    sendError(res, err);
  }
});

// DELETE /habits/:habitId - Habit löschen
router.delete('/:habitId', async (req: Request, res: Response): Promise<void> => {
  try {
    const { habitId } = req.params;
    const { auth0Id } = req.body;

    if (!auth0Id) {
      res.status(400).json({ message: 'auth0Id is required' });
      return;
    }

    await deleteHabit(habitId, auth0Id);
    res.status(204).send();
  } catch (err) {
    sendError(res, err);
  }
});

export default router;
