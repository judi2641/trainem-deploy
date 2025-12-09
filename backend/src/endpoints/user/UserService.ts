import { IUser } from '../../../../shared/types/database/user/User';
import { UserModel } from './UserModel';
import { logger } from '../../utils/logger';
import { HttpError } from '../../errors/HttpError';

/**
 *Finish Basic Info
 */
export async function saveBasicUserInfo(auth0ID: string, basicData: any) {
	const updated = await UserModel.findOneAndUpdate(
		{ auth0ID: auth0ID },
		{
			firstName: basicData.firstname,
			lastName: basicData.lastname,
			birthDate: basicData.birthDate,
			gender: basicData.gender,
			img: basicData.img,
		},
		{ new: true, upsert: true },
	);

	if (!updated) {
		throw new HttpError(404, 'User not found');
	}

	return updated;
}

/**
 * creates user with only auth0id and email
 * it is supposed to be called only after registration with Auth0
 * @param auth0ID
 * @param email
 * @returns created user
 */
export async function createInitialUser(auth0ID: string, email: string) {
	const user = new UserModel({ auth0ID, email });

	try {
		await user.save();
	} catch (error) {
		logger.error('failed to create InitialUser', error);
		throw new HttpError(404, 'failed to create a user');
	}

	logger.info(`user with email ${email} created`);

	return user;
}

export async function getUserByAuth0id(auth0ID: string) {
	const user = await UserModel.findOne({ auth0ID });

	if (!user) {
		logger.error('user not found');
		throw new HttpError(400, 'user not found');
	}

	return user;
}
