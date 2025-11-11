import express, { Request, Response } from 'express';
import { TaskInDatabase } from '../../../../shared/types/Task';
import { create_task, get_allTasks_to_user_id } from "./TaskService";
import { logger } from '../../utils/logger';
import { HttpError } from '../../errors/HttpError';
import { ITaskDocument } from './TaskModel';

const router = express();

router.post("/", async (req: Request, res: Response) => {
    try{
        logger.info(req.body);
        const task: TaskInDatabase = await create_task(req.body);
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

router.get("/:user_id", async (req: Request, res: Response) => {
    const user_id = req.params.user_id;
    try{
        const tasks: ITaskDocument[] = await get_allTasks_to_user_id(user_id);
        res.status(200).json(tasks);
    }
    catch(error){
        if(error instanceof HttpError){
            res.status(error.status).json({error: error.message});
        }
        else{
            res.status(500).json({error: 'An unkown error occured'});
        }
    }
})

export default router;