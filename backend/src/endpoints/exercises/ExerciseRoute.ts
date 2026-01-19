import express, { Request, Response } from 'express';
import ExerciseModel from './ExerciseModel';

const router = express.Router();

function sendError(res: any, err: any) {
  const status = err?.statusCode ?? 500;
  res.status(status).json({ message: err?.message ?? 'Internal Server Error' });
}
// GET /entries?auth0Id=xxx
router.get('/', async (req: Request, res: Response) => {
  try {
    const exercises = await ExerciseModel.find()
    res.json(exercises);
  } catch (err) {
    sendError(res, err);
  }
});

export default router;
