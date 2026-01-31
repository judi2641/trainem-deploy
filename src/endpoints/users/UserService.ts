import UserModel from './UserModel';
import { logger } from '../../utils/logger';
import { HttpError } from '../../errors/HttpError';

/**
 * creates user with only auth0id and email
 * it is supposed to be called only after registration with Auth0
 * @param auth0Id
 * @param email
 * @returns created user
 */
export async function createInitialUser(auth0Id: string, email: string) {
	const user = new UserModel({ auth0Id, email });

	try {
		await user.save();
	} catch (error) {
		logger.error('failed to create InitialUser', error);
		throw new HttpError(404, 'failed to create a user');
	}

	logger.info(`user with email ${email} created`);

	return user;
}

/**
 *Finish Basic Info
 */
export async function saveBasicUserInfo(auth0Id: string, basicData: any) {
	const updated = await UserModel.findOneAndUpdate(
		{ auth0Id: auth0Id },
		{
			firstName: basicData.firstname,
			lastName: basicData.lastname,
			birthDate: basicData.birthDate,
			onboardingCompleted: true,
		},
		{ new: true },
	);

	if (!updated) {
		throw new HttpError(404, 'User not found');
	}

	return updated;
}

export async function getUserByAuth0id(auth0Id: string) {
	const user = await UserModel.findOne({ auth0Id });

	if (!user) {
		logger.error('user not found');
		throw new HttpError(400, 'user not found');
	}

	return user;
}

export async function updateLastActiveDate(auth0Id: string) {
	const updated = await UserModel.findOneAndUpdate(
		{ auth0Id: auth0Id },
		{
			lastActiveDate: Date.now(),
		},
		{ new: true },
	);

	if (!updated) {
		throw new HttpError(404, 'User not found');
	}

	return updated;
}
