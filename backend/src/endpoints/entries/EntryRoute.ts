import express, { Request, Response } from 'express';
import { abortEntry, createEntry, getAllEntriesFromUser, updateEntry, deleteEntry } from './EntryService';

const router = express.Router();

function sendError(res: any, err: any) {
  const status = err?.statusCode ?? err?.status ?? 500;
  res.status(status).json({ message: err?.message ?? 'Internal Server Error' });
}

// GET /entries/:auth0Id - Alle Entries eines Users
router.get('/:auth0Id', async (req: Request, res: Response) => {
  try {
    const auth0Id = req.params.auth0Id;
    const entries = await getAllEntriesFromUser(auth0Id);
    res.json(entries);
  } catch (err) {
    sendError(res, err);
  }
});

// POST /entries - Neue Entry erstellen
router.post('/', async (req: Request, res: Response) => {
  try {
    const { auth0Id, workoutId, habitId, date } = req.body;
    const entry = await createEntry(auth0Id, workoutId, habitId, date ? new Date(date) : undefined);
    res.status(201).json(entry);
  } catch (err) {
    sendError(res, err);
  }
});

// PATCH /entries/:entryId/complete-exercise - Übung abschließen
router.patch('/:entryId/complete-exercise', async (req: Request, res: Response) => {
  try {
    const { exerciseName, weight } = req.body;
    const entry = await updateEntry(req.params.entryId, exerciseName, weight);
    res.json(entry);
  } catch (err) {
    sendError(res, err);
  }
});

// PATCH /entries/:entryId/abort - Entry abbrechen
router.patch('/:entryId/abort', async (req: Request, res: Response) => {
  try {
    const entry = await abortEntry(req.params.entryId);
    res.json(entry);
  } catch (err) {
    sendError(res, err);
  }
});

// DELETE /entries/:entryId - Entry löschen
router.delete('/:entryId', async (req: Request, res: Response): Promise<void> => {
  try {
    const { entryId } = req.params;
    const { auth0Id } = req.body;

    if (!auth0Id) {
      res.status(400).json({ message: 'auth0Id is required' });
      return;
    }

    await deleteEntry(entryId, auth0Id);
    res.status(204).send();
  } catch (err) {
    sendError(res, err);
  }
});

export default router;
