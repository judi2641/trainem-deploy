import mongoose, { Schema, Document } from 'mongoose';

export interface IGroupMember {
	userId: string; // auth0Id
	role: 'owner' | 'admin' | 'member';
	joinedAt: Date;
	contributedXP: number; // XP beigetragen in aktueller Season
}

export interface IGroup extends Document {
	name: string;
	description?: string;
	color: string; // Hex-Farbe für Pixel-War
	members: IGroupMember[];
	maxMembers: number;
	isPublic: boolean;
	createdAt: Date;
	updatedAt: Date;
	totalXP: number; // Gesamt-XP aller Mitglieder (all-time)
	currentSeasonXP: number; // XP in aktueller Season
}

const GroupMemberSchema = new Schema<IGroupMember>({
	userId: { type: String, required: true },
	role: {
		type: String,
		enum: ['owner', 'admin', 'member'],
		required: true,
		default: 'member',
	},
	joinedAt: { type: Date, required: true, default: Date.now },
	contributedXP: { type: Number, default: 0 },
});

const GroupSchema = new Schema<IGroup>(
	{
		name: {
			type: String,
			required: true,
			trim: true,
			minlength: 3,
			maxlength: 50,
		},
		description: {
			type: String,
			maxlength: 500,
		},
		color: {
			type: String,
			required: true,
			match: /^#[0-9A-F]{6}$/i,
			default: '#FF5733',
		},
		members: {
			type: [GroupMemberSchema],
			required: true,
			default: [],
			validate: {
				validator: function (members: IGroupMember[]) {
					return members.length > 0 && members.length <= this.maxMembers;
				},
				message: 'Group must have at least 1 member and not exceed maxMembers',
			},
		},
		maxMembers: {
			type: Number,
			required: true,
			default: 20,
			min: 2,
			max: 100,
		},
		isPublic: {
			type: Boolean,
			required: true,
			default: true,
		},
		totalXP: {
			type: Number,
			default: 0,
			min: 0,
		},
		currentSeasonXP: {
			type: Number,
			default: 0,
			min: 0,
		},
	},
	{
		timestamps: true,
	},
);

// Index für schnellere Queries
GroupSchema.index({ name: 1 });
GroupSchema.index({ isPublic: 1 });
GroupSchema.index({ 'members.userId': 1 });

export const GroupModel = mongoose.model<IGroup>('Group', GroupSchema);
