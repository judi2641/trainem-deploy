import EntryModel from './EntryModel';
import { logger } from '../../utils/logger';
import { HttpError } from '../../errors/HttpError';
import type { Entry, WorkoutExercise } from '../../../../shared/sharedTypes';
import WorkoutModel from '../workouts/WorkoutModel';
import UserModel from '../users/UserModel';
import { PixelWarService } from '../pixelwar/PixelWarService';
import { GroupService } from '../groups/GroupService';
import { BattleService } from '../pixelwar/BattleService';
/**
 *
 * @param entryId
 * @param workoutId?
 * @param habitId?
 * @param date
 * @returns created entry
 */
export async function createEntry(
  auth0Id: string,
  workoutId?: string,
  habitId?: string,
  date: Date = new Date()
) {
  try {
    if (!workoutId && !habitId) throw new HttpError(400, 'workoutId or habitId required');
    if (workoutId && habitId) throw new HttpError(400, 'only one of workoutId or habitId allowed');

    if (workoutId) {
      const workout = await WorkoutModel.findById(workoutId);
      if (!workout) throw new HttpError(404, 'workout not found');

      return await EntryModel.create({
        auth0Id,
        date,
        workoutId,
        plannedExercises: workout.exercises.toObject(),
        completed_exercises: [],
        completed: false,
        score: 0
      } as Entry);
    }

    const entry = await EntryModel.create({
      auth0Id,
      date,
      habitId,
      plannedExercises: [],
      completed_exercises: [],
      completed: true,
      score: 10
    } as Entry);

    // Update user points
    await UserModel.findOneAndUpdate(
      { auth0Id },
      { $inc: { points: 10 } }
    );

    // Grant pixel rights and add XP to user's groups
    try {
      const groups = await GroupService.getUserGroups(auth0Id);
      for (const group of groups) {
        const groupIdStr = String(group._id);
        await PixelWarService.grantPixelRights(groupIdStr, auth0Id, 10);
        await GroupService.addGroupXP(groupIdStr, auth0Id, 10);

        // Add XP to active battles
        const activeBattles = await BattleService.getActiveBattlesForGroup(groupIdStr);
        for (const battle of activeBattles) {
          await BattleService.addBattleXP(String(battle._id), groupIdStr, auth0Id, 10);
        }
      }
    } catch (error) {
      logger.error('Failed to process group XP/pixels for habit completion', error);
    }

    return entry;
  } catch (error) {
    logger.error('createEntry failed', error);
    if (error instanceof HttpError) throw error;
    throw new HttpError(500, 'failed to create entry');
  }
}
/**
 *
 * @param auth0Id
 * @returns entry array
 */
export async function getAllEntriesFromUser(auth0Id: string) {
  try {
    return await EntryModel.find({ auth0Id }).sort({ date: -1 });
  } catch (error) {
    logger.error('getAllEntriesFromUser failed', error);
    if (error instanceof HttpError) throw error;
    throw new HttpError(500, 'failed to get entries');
  }
}
/**
 *
 * @param entryId
 * @param exerciseName
 * @param weight
 * @returns updated entry
 */
export async function updateEntry(
  entryId: string,
  exerciseName: string,
  weight?: number,
  duration?:number
) {
  try {
    const entry = await EntryModel.findById(entryId);
    if (!entry) throw new HttpError(404, 'entry not found');

    const idx = entry.plannedExercises.findIndex(
      (x) => x.exercise?.name === exerciseName
    );
    if (idx === -1) throw new HttpError(400, 'exercise not found in plannedExercises');

    const ex = entry.plannedExercises[idx];

// wichtig: plain object
const exObj = (ex as any).toObject ? (ex as any).toObject() : ex;

entry.plannedExercises.splice(idx, 1);

entry.completed_exercises.push({
  ...exObj,
  weight: weight ?? exObj.weight,
  duration: duration ?? exObj.duration,
});
if(entry.plannedExercises.length === 0){
  entry.completed = true;
}
entry.score = (entry.score ?? 0) + 67;
await entry.save();

const user = await UserModel.findOneAndUpdate(
  { auth0Id: entry.auth0Id },
  { $inc: { points: 67 } },
  { new: true }
);
if (!user) throw new HttpError(404, 'user not found');

// Grant pixel rights and add XP to user's groups
try {
  if (entry.auth0Id) {
    const groups = await GroupService.getUserGroups(entry.auth0Id);
    for (const group of groups) {
      const groupIdStr = String(group._id);
      await PixelWarService.grantPixelRights(groupIdStr, entry.auth0Id, 67);
      await GroupService.addGroupXP(groupIdStr, entry.auth0Id, 67);

      // Add XP to active battles
      const activeBattles = await BattleService.getActiveBattlesForGroup(groupIdStr);
      for (const battle of activeBattles) {
        await BattleService.addBattleXP(String(battle._id), groupIdStr, entry.auth0Id, 67);
      }
    }
  }
} catch (error) {
  logger.error('Failed to process group XP/pixels for exercise completion', error);
}

return entry;
  } catch (error) {
    logger.error('updateEntryByExerciseName failed', error);
    if (error instanceof HttpError) throw error;
    throw new HttpError(500, 'failed to update entry');
  }
}
export async function abortEntry(entryId: string) {
  try {
    const entry = await EntryModel.findByIdAndUpdate(
      entryId,
      {
        $set: { completed: true },
      },
      { new: true, runValidators: true }
    );

    if (!entry) throw new HttpError(404, 'entry not found');
    return entry;
  } catch (error) {
    logger.error('abortEntry failed', error);
    if (error instanceof HttpError) throw error;
    throw new HttpError(500, 'failed to abort entry');
  }
}

/**
 * Delete an entry
 * @param entryId
 * @param auth0Id - for authorization check
 */
export async function deleteEntry(entryId: string, auth0Id: string) {
  try {
    const entry = await EntryModel.findById(entryId);
    if (!entry) {
      throw new HttpError(404, 'Entry not found');
    }
    if (entry.auth0Id !== auth0Id) {
      throw new HttpError(403, 'Not authorized to delete this entry');
    }

    await EntryModel.findByIdAndDelete(entryId);
    logger.info(`deleted entry ${entryId}`);
  } catch (error) {
    logger.error('deleteEntry failed', error);
    if (error instanceof HttpError) throw error;
    throw new HttpError(500, 'failed to delete entry');
  }
}
