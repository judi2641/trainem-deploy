import express, { Request, Response } from "express";
import { createUser } from "./UserService";
import { HttpError } from "../../errors/HttpError";

const router = express();

router.post("/:email", async (req: Request, res: Response) => {
    try{
        const user = await createUser(req.params.email);
        res.status(201).json(user);
    }
    catch(error){
        if(error instanceof HttpError){
            res.status(error.status).json(error.message);
        }
        else{
            res.status(500).json( {error: "unkown error" });
        }
    }
});

export default router;