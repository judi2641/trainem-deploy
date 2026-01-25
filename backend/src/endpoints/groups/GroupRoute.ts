import { Router, Request, Response } from 'express';
import { GroupService } from './GroupService';
import { HttpError } from '../../errors/HttpError';
import mongoose from 'mongoose';

const router = Router();

// Hilfsfunktion: Validiert MongoDB ObjectId
function isValidObjectId(id: string): boolean {
	return mongoose.Types.ObjectId.isValid(id);
}

// Hilfsfunktion: Sanitize String Input (verhindert XSS)
function sanitizeString(input: string | undefined, maxLength: number = 100): string | undefined {
	if (!input) return undefined;
	return input
		.slice(0, maxLength)
		.replace(/[<>]/g, '') // Entferne HTML Tags
		.trim();
}

// Hilfsfunktion: Validiert Hex-Farbcode
function isValidColor(color: string): boolean {
	return /^#[0-9A-Fa-f]{6}$/.test(color);
}

/**
 * POST /api/groups
 * Erstellt eine neue Gruppe
 */
router.post('/', async (req: Request, res: Response) => {
	try {
		const { name, description, color, ownerId, isPublic, maxMembers } = req.body;

		if (!name || !color || !ownerId) {
			throw new HttpError(400, 'Missing required fields: name, color, ownerId');
		}

		// Validiere Farbformat
		if (!isValidColor(color)) {
			throw new HttpError(400, 'Invalid color format. Must be hex color like #FF5733');
		}

		// Validiere maxMembers
		if (maxMembers !== undefined && (typeof maxMembers !== 'number' || maxMembers < 1 || maxMembers > 1000)) {
			throw new HttpError(400, 'maxMembers must be a number between 1 and 1000');
		}

		const group = await GroupService.createGroup({
			name: sanitizeString(name, 50)!,
			description: sanitizeString(description, 500),
			color,
			ownerId,
			isPublic: Boolean(isPublic),
			maxMembers,
		});

		res.status(201).json(group);
	} catch (error: any) {
		const statusCode = error.status || 500;
		res.status(statusCode).json({ error: error.message });
	}
});

/**
 * GET /api/groups/public
 * Holt alle öffentlichen Gruppen
 */
router.get('/public', async (req: Request, res: Response) => {
	try {
		let limit = parseInt(req.query.limit as string) || 50;
		let skip = parseInt(req.query.skip as string) || 0;

		// Limit sanitization um DoS zu verhindern
		limit = Math.min(Math.max(1, limit), 100);
		skip = Math.max(0, skip);

		const groups = await GroupService.getPublicGroups(limit, skip);
		res.json(groups);
	} catch (error: any) {
		const statusCode = error.status || 500;
		res.status(statusCode).json({ error: error.message });
	}
});

/**
 * GET /api/groups/user/:userId
 * Holt alle Gruppen eines Users
 */
router.get('/user/:userId', async (req: Request, res: Response) => {
	try {
		const { userId } = req.params;
		const groups = await GroupService.getUserGroups(userId);
		res.json(groups);
	} catch (error: any) {
		const statusCode = error.status || 500;
		res.status(statusCode).json({ error: error.message });
	}
});

/**
 * GET /api/groups/:groupId
 * Holt eine Gruppe nach ID
 */
router.get('/:groupId', async (req: Request, res: Response) => {
	try {
		const { groupId } = req.params;

		if (!isValidObjectId(groupId)) {
			throw new HttpError(400, 'Invalid group ID format');
		}

		const group = await GroupService.getGroupById(groupId);
		res.json(group);
	} catch (error: any) {
		const statusCode = error.status || 500;
		res.status(statusCode).json({ error: error.message });
	}
});

/**
 * POST /api/groups/:groupId/join
 * User tritt Gruppe bei
 */
router.post('/:groupId/join', async (req: Request, res: Response) => {
	try {
		const { groupId } = req.params;
		const { userId } = req.body;

		if (!isValidObjectId(groupId)) {
			throw new HttpError(400, 'Invalid group ID format');
		}

		if (!userId) {
			throw new HttpError(400, 'Missing userId');
		}

		const group = await GroupService.joinGroup(groupId, userId);
		res.json(group);
	} catch (error: any) {
		const statusCode = error.status || 500;
		res.status(statusCode).json({ error: error.message });
	}
});

/**
 * POST /api/groups/:groupId/leave
 * User verlässt Gruppe
 */
router.post('/:groupId/leave', async (req: Request, res: Response) => {
	try {
		const { groupId } = req.params;
		const { userId } = req.body;

		if (!isValidObjectId(groupId)) {
			throw new HttpError(400, 'Invalid group ID format');
		}

		if (!userId) {
			throw new HttpError(400, 'Missing userId');
		}

		const group = await GroupService.leaveGroup(groupId, userId);
		res.json(group);
	} catch (error: any) {
		const statusCode = error.status || 500;
		res.status(statusCode).json({ error: error.message });
	}
});

/**
 * DELETE /api/groups/:groupId
 * Löscht eine Gruppe (nur Owner)
 */
router.delete('/:groupId', async (req: Request, res: Response) => {
	try {
		const { groupId } = req.params;
		const { userId } = req.body;

		if (!isValidObjectId(groupId)) {
			throw new HttpError(400, 'Invalid group ID format');
		}

		if (!userId) {
			throw new HttpError(400, 'Missing userId');
		}

		await GroupService.deleteGroup(groupId, userId);
		res.status(204).send();
	} catch (error: any) {
		const statusCode = error.status || 500;
		res.status(statusCode).json({ error: error.message });
	}
});

/**
 * PATCH /api/groups/:groupId/members/:targetUserId/role
 * Ändert Rolle eines Members
 */
router.patch('/:groupId/members/:targetUserId/role', async (req: Request, res: Response) => {
	try {
		const { groupId, targetUserId } = req.params;
		const { requesterId, newRole } = req.body;

		if (!isValidObjectId(groupId)) {
			throw new HttpError(400, 'Invalid group ID format');
		}

		if (!requesterId || !newRole) {
			throw new HttpError(400, 'Missing requesterId or newRole');
		}

		if (newRole !== 'admin' && newRole !== 'member') {
			throw new HttpError(400, 'Invalid role. Must be admin or member');
		}

		const group = await GroupService.changeMemberRole(groupId, requesterId, targetUserId, newRole);
		res.json(group);
	} catch (error: any) {
		const statusCode = error.status || 500;
		res.status(statusCode).json({ error: error.message });
	}
});

export default router;
