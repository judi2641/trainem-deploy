import { UserToCreate } from "../../../../shared/types/User";
import { UserModel, IUserDocument } from "./UserModel";
import { logger } from "../../utils/logger";
import { HttpError } from "../../errors/HttpError";

export async function create_user(user_data: UserToCreate) : Promise<IUserDocument>{
    try{

        const user: IUserDocument  = new UserModel(user_data);
        
        const user_existing = await UserModel.findOne({email: user.email });
        
        if(user_existing){
            logger.info(`user to email: ${user.email} already exists`);
            return user_existing;
        }
        
        else{
            return await user.save();
        }
    }
    catch(error){
        logger.error("error creating a user", error);
        throw new HttpError(500, "failed to create a user");
    }
}