import { GroupModel, IGroup, IGroupMember, IGroupPixel } from './GroupModel';
import { HttpError } from '../../errors/HttpError';
import { logger } from '../../utils/logger';
import crypto from 'crypto';

// Generiert einen 8-Zeichen Invite-Code
function generateInviteCode(): string {
	return crypto.randomBytes(4).toString('hex').toUpperCase();
}

export class GroupService {
	static async createGroup(data: {
		name: string;
		description?: string;
		color: string;
		ownerId: string;
		isPublic?: boolean;
		maxMembers?: number;
	}): Promise<IGroup> {
		const { name, description, color, ownerId, isPublic = true, maxMembers = 20 } = data;
		const existing = await GroupModel.findOne({ name });
		if (existing) {
			throw new HttpError(409, 'Group name already exists');
		}
		const owner: IGroupMember = {
			userId: ownerId,
			role: 'owner',
			joinedAt: new Date(),
			contributedXP: 0,
		};

		// Generiere Invite-Code für alle Gruppen (auch öffentliche können so eingeladen werden)
		const inviteCode = generateInviteCode();

		const group = new GroupModel({
			name,
			description,
			color,
			members: [owner],
			isPublic,
			maxMembers,
			inviteCode,
			totalXP: 0,
			xp: 0,
			unlockedPixels: 10, // Start with 10 pixels for canvas
		});
		await group.save();
		return group;
	}

	static async getGroupById(groupId: string): Promise<IGroup> {
		const group = await GroupModel.findById(groupId);
		if (!group) {
			throw new HttpError(404, 'Group not found');
		}
		return group;
	}

	static async getPublicGroups(limit: number = 50, skip: number = 0): Promise<IGroup[]> {
		return await GroupModel.find({ isPublic: true }).limit(limit).skip(skip).sort({ totalXP: -1 });
	}

	static async getUserGroups(userId: string): Promise<IGroup[]> {
		return await GroupModel.find({ 'members.userId': userId });
	}

	static async joinGroup(groupId: string, userId: string): Promise<IGroup> {
		const group = await GroupModel.findById(groupId);
		if (!group) {
			throw new HttpError(404, 'Group not found');
		}
		const isMember = group.members.some((m) => m.userId === userId);
		if (isMember) {
			throw new HttpError(400, 'User is already a member');
		}
		if (group.members.length >= group.maxMembers) {
			throw new HttpError(400, 'Group is full');
		}
		if (!group.isPublic) {
			throw new HttpError(403, 'Group is private');
		}
		const newMember: IGroupMember = {
			userId,
			role: 'member',
			joinedAt: new Date(),
			contributedXP: 0,
		};
		group.members.push(newMember);
		await group.save();
		return group;
	}

	static async joinGroupByInviteCode(inviteCode: string, userId: string): Promise<IGroup> {
		const group = await GroupModel.findOne({ inviteCode: inviteCode.toUpperCase() });
		if (!group) {
			throw new HttpError(404, 'Invalid invite code');
		}
		const isMember = group.members.some((m) => m.userId === userId);
		if (isMember) {
			throw new HttpError(400, 'User is already a member');
		}
		if (group.members.length >= group.maxMembers) {
			throw new HttpError(400, 'Group is full');
		}
		const newMember: IGroupMember = {
			userId,
			role: 'member',
			joinedAt: new Date(),
			contributedXP: 0,
		};
		group.members.push(newMember);
		await group.save();
		logger.info(`User ${userId} joined group ${group.name} via invite code`);
		return group;
	}

	static async regenerateInviteCode(groupId: string, userId: string): Promise<string> {
		const group = await GroupModel.findById(groupId);
		if (!group) {
			throw new HttpError(404, 'Group not found');
		}
		const member = group.members.find((m) => m.userId === userId);
		if (!member || (member.role !== 'owner' && member.role !== 'admin')) {
			throw new HttpError(403, 'Only owner or admin can regenerate invite code');
		}
		const newCode = generateInviteCode();
		group.inviteCode = newCode;
		await group.save();
		return newCode;
	}

	static async leaveGroup(groupId: string, userId: string): Promise<IGroup> {
		const group = await GroupModel.findById(groupId);
		if (!group) {
			throw new HttpError(404, 'Group not found');
		}
		const member = group.members.find((m) => m.userId === userId);
		if (!member) {
			throw new HttpError(400, 'User is not a member');
		}
		if (member.role === 'owner') {
			throw new HttpError(400, 'Owner cannot leave group. Transfer ownership first.');
		}
		group.members = group.members.filter((m) => m.userId !== userId);
		await group.save();
		return group;
	}

	static async addGroupXP(groupId: string, userId: string, xp: number): Promise<void> {
		const group = await GroupModel.findById(groupId);
		if (!group) {
			throw new HttpError(404, 'Group not found');
		}
		const member = group.members.find((m) => m.userId === userId);
		if (!member) {
			throw new HttpError(400, 'User is not a member');
		}
		member.contributedXP += xp;
		group.totalXP += xp;
		group.xp += xp;
		await group.save();
	}

	static async deleteGroup(groupId: string, userId: string): Promise<void> {
		const group = await GroupModel.findById(groupId);
		if (!group) {
			throw new HttpError(404, 'Group not found');
		}
		const member = group.members.find((m) => m.userId === userId);
		if (!member || member.role !== 'owner') {
			throw new HttpError(403, 'Only owner can delete group');
		}
		await GroupModel.findByIdAndDelete(groupId);
	}

	static async changeMemberRole(
		groupId: string,
		requesterId: string,
		targetUserId: string,
		newRole: 'admin' | 'member',
	): Promise<IGroup> {
		const group = await GroupModel.findById(groupId);
		if (!group) {
			throw new HttpError(404, 'Group not found');
		}
		const requester = group.members.find((m) => m.userId === requesterId);
		if (!requester || (requester.role !== 'owner' && requester.role !== 'admin')) {
			throw new HttpError(403, 'Insufficient permissions');
		}
		const targetMember = group.members.find((m) => m.userId === targetUserId);
		if (!targetMember) {
			throw new HttpError(404, 'Target user is not a member');
		}
		if (targetMember.role === 'owner') {
			throw new HttpError(400, 'Cannot change owner role');
		}
		targetMember.role = newRole;
		await group.save();
		return group;
	}

	// ==================== GROUP PIXEL ART ====================

	/**
	 * Platziert einen Pixel auf dem Gruppen-Canvas
	 * Nur möglich wenn die Gruppe noch unlockedPixels hat
	 */
	static async placeGroupPixel(data: {
		groupId: string;
		userId: string;
		x: number;
		y: number;
		color: string;
	}): Promise<IGroup> {
		const { groupId, userId, x, y, color } = data;

		const group = await GroupModel.findById(groupId);
		if (!group) {
			throw new HttpError(404, 'Group not found');
		}

		// Prüfe ob User Mitglied der Gruppe ist
		const member = group.members.find((m) => m.userId === userId);
		if (!member) {
			throw new HttpError(403, 'User is not a member of this group');
		}

		// Prüfe ob Gruppe noch Pixel übrig hat
		const usedPixels = group.pixelArt?.pixels?.length || 0;
		const availablePixels = group.unlockedPixels - usedPixels;

		if (availablePixels <= 0) {
			throw new HttpError(400, 'No pixels available. Win more battles to unlock pixels!');
		}

		// Prüfe Grid-Bounds
		const gridSize = group.pixelArt?.gridSize || 32;
		if (x < 0 || x >= gridSize || y < 0 || y >= gridSize) {
			throw new HttpError(400, `Invalid coordinates. Grid is ${gridSize}x${gridSize}`);
		}

		// Validiere Farbe
		if (!/^#[0-9A-F]{6}$/i.test(color)) {
			throw new HttpError(400, 'Invalid color format. Use hex color (e.g. #FF5733)');
		}

		// Initialisiere pixelArt falls nicht vorhanden
		if (!group.pixelArt) {
			group.pixelArt = { gridSize: 32, pixels: [] };
		}

		// Prüfe ob Pixel bereits existiert (überschreiben)
		const existingIndex = group.pixelArt.pixels.findIndex((p) => p.x === x && p.y === y);

		const newPixel: IGroupPixel = {
			x,
			y,
			color,
			placedBy: userId,
			placedAt: new Date(),
		};

		if (existingIndex >= 0) {
			// Pixel überschreiben (zählt nicht als neuer Pixel)
			group.pixelArt.pixels[existingIndex] = newPixel;
			logger.info(`Group ${groupId}: Pixel at (${x},${y}) overwritten by ${userId}`);
		} else {
			// Neuen Pixel hinzufügen
			group.pixelArt.pixels.push(newPixel);
			logger.info(`Group ${groupId}: New pixel placed at (${x},${y}) by ${userId}`);
		}

		await group.save();
		return group;
	}

	/**
	 * Holt Gruppen-Canvas Info
	 */
	static async getGroupPixelArt(groupId: string): Promise<{
		gridSize: number;
		pixels: IGroupPixel[];
		usedPixels: number;
		unlockedPixels: number;
		availablePixels: number;
	}> {
		const group = await GroupModel.findById(groupId);
		if (!group) {
			throw new HttpError(404, 'Group not found');
		}

		const gridSize = group.pixelArt?.gridSize || 32;
		const pixels = group.pixelArt?.pixels || [];
		const usedPixels = pixels.length;
		const unlockedPixels = group.unlockedPixels || 0;
		const availablePixels = Math.max(0, unlockedPixels - usedPixels);

		return {
			gridSize,
			pixels,
			usedPixels,
			unlockedPixels,
			availablePixels,
		};
	}
}
