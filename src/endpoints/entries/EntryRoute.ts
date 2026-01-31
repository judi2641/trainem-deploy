import express, { Request, Response } from 'express';
import { abortEntry, createEntry, getAllEntriesFromUser, updateEntry } from './EntryService';

const router = express.Router();

function sendError(res: any, err: any) {
  const status = err?.statusCode ?? 500;
  res.status(status).json({ message: err?.message ?? 'Internal Server Error' });
}
// GET /entries?auth0Id=xxx
router.get('/:auth0Id', async (req: Request, res: Response) => {
  try {
    const auth0Id = req.params.auth0Id;
    const entries = await getAllEntriesFromUser(auth0Id);
    res.json(entries);
  } catch (err) {
    sendError(res, err);
  }
});

// POST /entries  { auth0Id, workoutId? , habitId? , date? }
router.post('/', async (req: Request, res: Response) => {
  try {
    const { auth0Id, workoutId, habitId, date } = req.body;
    const entry = await createEntry(auth0Id, workoutId, habitId, date ? new Date(date) : undefined);
    res.status(201).json(entry);
  } catch (err) {
    sendError(res, err);
  }
});

// PATCH /entries/:entryId/complete-exercise  { exerciseName, weight? }
router.patch('/:entryId/complete-exercise', async (req: Request, res: Response) => {
  try {
    const { exerciseName, weight } = req.body;
    const entry = await updateEntry(req.params.entryId, exerciseName, weight);
    res.json(entry);
  } catch (err) {
    sendError(res, err);
  }
});

router.patch('/:entryId/abort', async (req: Request, res: Response) => {
  try {
    const entry = await abortEntry(req.params.entryId);
    res.json(entry);
  } catch (err) {
    sendError(res, err);
  }
});
export default router;
