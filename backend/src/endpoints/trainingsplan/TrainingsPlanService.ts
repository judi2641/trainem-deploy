import { TrainingsPlanModel } from "./TrainingsPlanModel";
import { ITrainingsPlan } from "../../../../shared/types/database/traininsplan/TrainingPlan";
import { Types } from "mongoose";
import { ITask } from "../../../../shared/types/database/traininsplan/Task";
import { HttpError } from "../../errors/HttpError";
import { logger } from "../../utils/logger";
import { Http } from "winston/lib/winston/transports";
import { getUserByEmail } from "../user/UserService";

export async function createTrainingsPlan(data: ITrainingsPlan){
    try{
        const trainingplan = new TrainingsPlanModel(data);
        return trainingplan.save();
    }
    catch(error){
        logger.error("failed to create a trainingsplan",error);
        throw new HttpError(400, "failed to create a trainingsplan");
    }
}

export async function getAllTrainingsPlansByEmail(email: String){

    const user = await getUserByEmail(email);

    const trainingplan = await TrainingsPlanModel.find({ userID: user._id });
    logger.info(trainingplan);
    if(!trainingplan){
        logger.error("no trainingsplan was found");
        throw new HttpError(400, "no trainingsplan was found");
    }
    return trainingplan;
}

export async function addTask(plan_id: Types.ObjectId, task: ITask) {
    try{    
        const updatedPlan = await TrainingsPlanModel.findByIdAndUpdate(
            plan_id,
            { $push: { tasks: task } },
            { new: true }
        );
        logger.info("added task");
        return updatedPlan;
    }
    catch(error){
        throw new HttpError(400, "Failed to add a Task");
    }
}

export async function removeTask(plan_id: Types.ObjectId, task_id: Types.ObjectId){
    try{
        const plan = await TrainingsPlanModel.findOne({
            _id: plan_id,
            "tasks._id": task_id,
        });

        if(!plan){
            logger.error("task does not exist");
            throw new HttpError(400, "Task does not exist");
        }

        logger.info("task exists");

        const new_trainingsplan = await TrainingsPlanModel.findByIdAndUpdate(
            plan_id,
            { $pull: { tasks: { _id: task_id } } },
            {new : true}
        )

        logger.info("deleted task");
        return new_trainingsplan;

    }
    catch(error){
        logger.error("failed to remove a task");
        throw new HttpError(400, "failed to remove a task");
    }
}
