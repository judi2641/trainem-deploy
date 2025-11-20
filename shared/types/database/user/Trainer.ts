import { ObjectId } from "mongoose";
import { IUser } from "./User";

export interface ITrainer extends IUser {
    client_ID: ObjectId[];
}