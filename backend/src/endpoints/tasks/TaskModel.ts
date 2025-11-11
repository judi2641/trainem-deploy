import mongoose from "mongoose";
import { TaskInDatabase } from "../../../../shared/types/Task";

export interface ITaskDocument extends TaskInDatabase, mongoose.Document {
  _id: string;
};

const TaskSchema = new mongoose.Schema<TaskInDatabase>({
  name: { type: String, required: true },
  day: { type: String, enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"], required: true },
  user_id: {type: String, required: true}
});

delete mongoose.models.Task

export const TaskModel = mongoose.model("Task", TaskSchema);