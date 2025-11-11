import { TaskModel, ITaskDocument } from "./TaskModel";
import { Task } from "../../../../shared/types/Task";
import { logger } from "../../utils/logger";
import { HttpError } from "../../errors/HttpError";

export async function createTask(task_data: Task):Promise<ITaskDocument> {
    try{
        const task: ITaskDocument = new TaskModel(task_data);
        await task.save();
        logger.info("task successfull created", task_data);
        return task;
    }
    catch(error){
        logger.error("error creating task: ", error);
        throw new HttpError(400, "failed to create task");
    }
}