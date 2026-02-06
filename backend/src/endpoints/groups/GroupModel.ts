import mongoose, { Schema, Document } from 'mongoose';

export interface IGroupMember {
	userId: string; // auth0Id
	role: 'owner' | 'admin' | 'member';
	joinedAt: Date;
	contributedXP: number;
}

export interface IGroupPixel {
	x: number;
	y: number;
	color: string;
	placedBy?: string; // userId who placed the pixel
	placedAt?: Date;
}

export interface IGroupPixelArt {
	gridSize: number; // z.B. 32x32
	pixels: IGroupPixel[];
}

export interface IGroup extends Document {
	name: string;
	description?: string;
	color: string; // Hex-Farbe für Pixel-War
	members: IGroupMember[];
	maxMembers: number;
	isPublic: boolean;
	inviteCode?: string; // Code zum Beitreten privater Gruppen
	createdAt: Date;
	updatedAt: Date;
	totalXP: number; // Gesamt-XP aller Mitglieder (all-time)
	xp: number;
	// Neues Feature: Gruppen-Canvas
	wins: number; // Anzahl gewonnener Battles
	losses: number; // Anzahl verlorener Battles
	unlockedPixels: number; // Verfügbare Pixel (1 pro Sieg)
	pixelArt: IGroupPixelArt; // Gruppen-Pixelbild
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

const GroupPixelSchema = new Schema<IGroupPixel>({
	x: { type: Number, required: true },
	y: { type: Number, required: true },
	color: { type: String, required: true, match: /^#[0-9A-F]{6}$/i },
	placedBy: { type: String },
	placedAt: { type: Date, default: Date.now },
});

const GroupPixelArtSchema = new Schema<IGroupPixelArt>({
	gridSize: { type: Number, required: true, default: 32, min: 8, max: 64 },
	pixels: { type: [GroupPixelSchema], default: [] },
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
		inviteCode: {
			type: String,
			unique: true,
			sparse: true, // Nur indiziert wenn vorhanden
		},
		totalXP: {
			type: Number,
			default: 0,
			min: 0,
		},
		xp: {
			type: Number,
			default: 0,
			min: 0,
		},
		// Gruppen-Canvas Feature
		wins: {
			type: Number,
			default: 0,
			min: 0,
		},
		losses: {
			type: Number,
			default: 0,
			min: 0,
		},
		unlockedPixels: {
			type: Number,
			default: 10, // Start with 10 pixels
			min: 0,
		},
		pixelArt: {
			type: GroupPixelArtSchema,
			default: () => ({ gridSize: 32, pixels: [] }),
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
