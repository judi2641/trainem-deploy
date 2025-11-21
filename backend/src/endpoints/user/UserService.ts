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

export async function getUserByID(userID: string) {
    const user = await UserModel.findOne({ userID });

    if (!user) {
        throw new HttpError(404, 'User not found');
    }

    return user;
}

export async function getAllUsers() {
    return UserModel.find();
}

export async function updateUser(userID: string, updateData: Partial<IUser>) {
    const updated = await UserModel.findOneAndUpdate({ userID }, { $set: updateData }, { new: true });

    if (!updated) {
        throw new HttpError(404, 'User not found');
    }

    return updated;
}

export async function deleteUser(userID: string) {
    const deleted = await UserModel.findOneAndDelete({ userID });

    if (!deleted) {
        throw new HttpError(404, 'User not found');
    }

    return true;
}

export async function userExistsAndOnboardingStatus(auth0ID: string) {
    const user = await UserModel.findOne({ userID: auth0ID });

    if (!user) {
        return { exists: false, onboardingCompleted: false };
    }

    return {
        exists: true,
        onboardingCompleted: user.onboardingCompleted,
    };
}

/**
 * NEW: Finish onboarding
 */
export async function finishOnboarding(auth0ID: string) {
    const user = await UserModel.findOneAndUpdate(
        { userID: auth0ID },
        { onboardingCompleted: true },
        { new: true },
    );

    if (!user) {
        throw new HttpError(404, 'User not found');
    }

    return user;
}
/**
 *Finish Basic Info
 */
export async function saveBasicUserInfo(auth0ID: string, basicData: any) {
    const updated = await UserModel.findOneAndUpdate(
        { userID: auth0ID },
        {
            firstName: basicData.firstname,
            lastName: basicData.lastname,
            birthDate: basicData.birthDate,
            gender: basicData.gender,
        },
        { new: true, upsert: true },
    );

    if (!updated) {
        throw new HttpError(404, 'User not found');
    }

    return updated;
}
