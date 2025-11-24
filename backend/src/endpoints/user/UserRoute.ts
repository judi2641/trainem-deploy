import express, { Request, Response } from 'express';
import { createUser } from './UserService';
import { HttpError } from '../../errors/HttpError';
import { checkAuth0Token } from '../../utils/checkAuth0Token';
import { saveBasicUserInfo } from './UserService';
import { userExistsAndOnboardingStatus } from './UserService';
import { finishOnboarding } from './UserService';
import { getAllUsers } from './UserService';
import { getUserByID } from './UserService';
import { updateUser } from './UserService';
import { deleteUser } from './UserService';

const router = express();

router.post('/:email', async (req: Request, res: Response) => {
	try {
		const user = await createUser(req.params.email);
		res.status(201).json(user);
	} catch (error) {
		if (error instanceof HttpError) {
			res.status(error.status).json(error.message);
		} else {
			res.status(500).json({ error: 'unkown error' });
		}
	}
});

router.post('/:auth0ID/basic', async (req: Request, res: Response) => {
	try {
		const user = await saveBasicUserInfo(req.params.auth0ID, req.body);
		res.status(200).json(user);
	} catch (error) {
		if (error instanceof HttpError) {
			res.status(error.status).json({ error: error.message });
		} else {
			res.status(500).json({ error: 'unkonwn error' });
		}
	}
});

router.post('/', async (req: Request, res: Response) => {
	try {
		const user = await createUser(req.body);
		res.status(201).json(user);
	} catch (error) {
		handleError(res, error);
	}
});

/**
 * CHECK IF USER EXISTS + ONBOARDING STATUS
 */
router.get('/exists/:auth0ID', async (req: Request, res: Response) => {
	try {
		const info = await userExistsAndOnboardingStatus(req.params.auth0ID);
		res.status(200).json(info);
	} catch (error) {
		handleError(res, error);
	}
});

/**
 * FINISH ONBOARDING
 */
router.post('/:auth0ID', async (req: Request, res: Response) => {
	try {
		const user = await finishOnboarding(req.params.auth0ID);
		res.status(200).json({
			message: 'Onboarding completed',
			user,
		});
	} catch (error) {
		handleError(res, error);
	}
});
/**
 * FINISH ONBOARDING
 */
router.post('/:auth0ID/basic', async (req: Request, res: Response) => {
	try {
		const user = await saveBasicUserInfo(req.params.auth0ID, req.body);
		res.status(200).json(user);
	} catch (error) {
		handleError(res, error);
	}
});

/**
 * GET ALL USERS
 */
router.get('/', async (_req: Request, res: Response) => {
	try {
		const users = await getAllUsers();
		res.status(200).json(users);
	} catch (error) {
		if (error instanceof HttpError) {
			res.status(error.status).json({ error: error.message });
		} else {
			res.status(500).json({ error: 'unkonwn error' });
		}
	}
});

/**
 * GET user BY ID
 */
router.get('/:auth0ID', async (req: Request, res: Response) => {
	try {
		const user = await getUserByID(req.params.auth0ID);
		if (!user) {
			res.status(404).json({ error: 'User not found' });
			return;
		}

		res.status(200).json(user);
		return;
	} catch (error) {
		handleError(res, error);
		return;
	}
});

/**
 * UPDATE USER
 */
router.patch('/:auth0ID', async (req: Request, res: Response) => {
	try {
		const updated = await updateUser(req.params.auth0ID, req.body);
		res.status(200).json(updated);
	} catch (error) {
		handleError(res, error);
	}
});

/**
 * DELETE USER
 */
router.delete('/:auth0ID', async (req: Request, res: Response) => {
	try {
		await deleteUser(req.params.auth0ID);
		res.status(204).send();
	} catch (error) {
		handleError(res, error);
	}
});

function handleError(res: Response, error: any): void {
	if (error instanceof HttpError) {
		res.status(error.status).json({ error: error.message });
		return;
	}

	console.error(error);
	res.status(500).json({ error: 'An unknown error occurred' });
	return;
}

export default router;
