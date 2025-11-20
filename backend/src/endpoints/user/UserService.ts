import { IUser } from "../../../../shared/types/database/user/User";
import { UserModel } from "./UserModel";
import { logger } from "../../utils/logger";
import { HttpError } from "../../errors/HttpError";

export async function createUser(email: String) {
    try{
        const user = new UserModel({email});
        return await user.save()
    }
    catch(error){
        logger.error("failed to create user");
        throw new HttpError(400, "failed to create user");
    }
}

/**
 * throws error if user does not exist
 * @param email 
 * @returns 
 */
export async function getUserByEmail(email: String){
    try{
        const user = await UserModel.findOne({ email });
        if(!user){
            logger.error("user not found");
            throw new HttpError(400, "user not found");
        }
        return user;
    }
    catch(error){
        logger.error("failed to get user");
        throw new HttpError(400, "failed to get user");
    }
}

export async function updateUser(email: String, data: Partial<IUser>){
    try{
        const existing_user = await UserModel.findOne({ email });

        if(!existing_user) {
            logger.error("user not found");
            throw new HttpError(400, "user not found");
        }

        const updated_user = await UserModel.findByIdAndUpdate(
            existing_user._id,
            data,
            { new: true }
        );

        logger.info("user updated");
        return updated_user;
    }
    catch(error){
        logger.error("failed to update user");
        throw new HttpError(400, "failed to udpate user");
    }
}


