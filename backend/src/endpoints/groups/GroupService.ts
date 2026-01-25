import { GroupModel, IGroup, IGroupMember } from './GroupModel';
import { HttpError } from '../../errors/HttpError';

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
		const group = new GroupModel({
			name,
			description,
			color,
			members: [owner],
			isPublic,
			maxMembers,
			totalXP: 0,
			currentSeasonXP: 0,
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
		group.currentSeasonXP += xp;
		await group.save();
	}

	static async resetSeasonXP(): Promise<void> {
		await GroupModel.updateMany({}, { currentSeasonXP: 0, 'members.$[].contributedXP': 0 });
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
}
