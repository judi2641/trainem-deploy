import { create_user } from "./UserService";
import express, { Request, Response } from "express";
import { logger } from "../../utils/logger";
import { IUserDocument } from "./UserModel";
import { UserInDatabase, UserToCreate } from "../../../../shared/types/User";
import { HttpError } from "../../errors/HttpError";

const router = express();

router.post("/", async (req: Request, res: Response) => {
    try{
        const user_data: UserToCreate = req.body;
        const user: UserInDatabase = await create_user(user_data);
        res.status(200).json(user);
    }
    catch(error){
        if(error instanceof HttpError){
            res.status(error.status).json({error: error.message});
        }
    }
});

export default router;