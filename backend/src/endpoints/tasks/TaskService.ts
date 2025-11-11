import { TaskModel, ITaskDocument } from "./TaskModel";
import { TaskToCreate, TaskInDatabase } from "../../../../shared/types/Task";
import { logger } from "../../utils/logger";
import { HttpError } from "../../errors/HttpError";

export async function create_task(task_data: TaskToCreate):Promise<ITaskDocument> {
    try{
        const task: ITaskDocument = new TaskModel(task_data);
        await task.save();
        logger.info("task successfull created", task_data);
        return task;
    }
    catch(error){
        logger.error("error creating task: ", error);
        throw new HttpError(500, "failed to create task");
    }
}

export async function get_allTasks_to_user_id(user_id_: string): Promise<ITaskDocument[]> {
    try{
        const tasks: ITaskDocument[] = await TaskModel.find( { user_id: user_id_} ).exec();
        logger.info(`found ${tasks.length} tasks to ${user_id_}`);
        return tasks;

    }
    catch(error){
        logger.error(`error searching tasks to user_id: ${user_id_}`);
        throw new HttpError(500, "failed to search tasks");
    }
}