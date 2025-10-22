import express from "express";
import type { Request, Response } from "express";
import { logger } from "./utils/logger";
import cors from "cors";
import { initDB } from "./database/db";

const app = express();

app.use(cors());

app.get("/", (req: Request, res: Response) => {
    res.status(200).json("Hi");
});

async function startServer() {
    try{
        await initDB();
        app.listen(3000, () => {
            logger.info("server is running on port 3000");
        })
    }
    catch(error){
        logger.error("serverstart failed:", error);
    }
}

startServer();

