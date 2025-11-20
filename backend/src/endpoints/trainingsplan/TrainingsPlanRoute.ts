import express, { Request, Response } from "express" ;
import { createTrainingsPlan, getAllTrainingsPlansByEmail } from "./TrainingsPlanService";
import { HttpError } from "../../errors/HttpError";
import { getUserByEmail } from "../user/UserService";
import { Types } from "mongoose";
import { logger } from "../../utils/logger";

const router = express();

router.get("/:email", async (req: Request, res: Response) => {
    try{
        const trainingsplans = await getAllTrainingsPlansByEmail(req.params.email);
        res.status(200).json(trainingsplans);
    }
    catch(error){
        if(error instanceof HttpError){
            res.status(error.status).json({error: error.message});
        }
        else{
            logger.error(error);
            res.status(500).json({error: "unkown error"});
        }
    }
});

router.post("/:email", async (req: Request, res: Response) => {
    try{

        //throws error if user does not exist
        const user = await getUserByEmail(req.params.email);

        const trainingsplan_data = {
            userID: user._id as Types.ObjectId,
            name: req.body.name,
            tasks: req.body.tasks
        };

        const created_plan = await createTrainingsPlan(trainingsplan_data);

        res.status(201).json(created_plan);
    }
    catch(error){
        if(error instanceof HttpError){
            res.status(error.status).json( { error: error.message });
        }
        else{
            logger.error(error);
            res.status(500).json("unkown error");
        }
    }
});

export default router;