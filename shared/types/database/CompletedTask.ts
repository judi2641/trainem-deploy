import { ObjectId } from "mongoose";
import { ITask } from "./traininsplan/Task";

// completedTask is stored in database

export interface ICompletedTask extends ITask {
    _id?: ObjectId;
    taskID: ObjectId; // the task id by creation
    doneAt: Date; // from Mongoose createdAt...
}