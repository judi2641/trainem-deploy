import config from "config";
import mongoose from "mongoose";
import { logger } from "../utils/logger";

let _db: mongoose.Connection | null = null;

const connectionString: string = config.get("db.connectionString");

export async function initDB() {
    if(_db) return;

    try{
        await mongoose.connect(connectionString, {
            serverSelectionTimeoutMS: 3000,
        });
        _db = mongoose.connection;
        logger.info("database connected");
    }
    catch(error){    
        logger.error("connection to database failed:", error);    
        throw error;    
    }
}