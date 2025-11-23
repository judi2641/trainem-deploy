import type { Types } from "mongoose";
import type { ITask } from "./traininsplan/Task";

// completedTask is stored in database

export interface ICompletedTask extends ITask {
    _id?: Types.ObjectId;
    taskID: Types.ObjectId; // the task id by creation
    doneAt: Date; // from Mongoose createdAt...
}