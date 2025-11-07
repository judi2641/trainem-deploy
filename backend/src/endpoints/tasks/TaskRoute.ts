import express, { Request, Response } from 'express';
import { Task } from '../../../../shared/types/Task';
import { createTask } from "./TaskService";
import { logger } from '../../utils/logger';
import { HttpError } from '../../errors/HttpError';

const router = express();

router.post("/", async (req: Request, res: Response) => {
    try{
        logger.info(req.body);
        const task: Task = await createTask(req.body);
        res.status(201).json(task);
    }
    catch(error){
        logger.error(error);
        if(error instanceof HttpError){
            res.status(error.status).json({error: error.message});
        }
        else{
            res.status(500).json({error: 'An unkown error occured'});	
        }
    }
});

export default router;