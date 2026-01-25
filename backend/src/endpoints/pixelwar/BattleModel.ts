import mongoose, { Schema, Document } from 'mongoose';

export interface IBattleMember {
	userId: string;
	contributedXP: number;
	pixelsPlaced: number;
}

export interface IBattleParticipant {
	groupId: string;
	groupName: string;
	color: string;
	pixelsOwned: number;
	totalXP: number;
	members: IBattleMember[];
}

export interface IBattleSettings {
	duration: number; // Minuten (z.B. 1440 = 24h)
	gridSize: number; // z.B. 50x50
	winCondition: 'pixels' | 'xp' | 'hybrid';
	xpPerPixel: number;
	pixelsPerAction: number;
	allowOverwrite: boolean;
}

export interface IBattle extends Document {
	name: string;
	description?: string;
	challenger: IBattleParticipant; // Team A - Herausforderer
	opponent: IBattleParticipant; // Team B - Herausgeforderter
	status: 'pending' | 'accepted' | 'active' | 'completed' | 'declined' | 'cancelled';
	challengedAt: Date;
	acceptedAt?: Date;
	startDate?: Date;
	endDate?: Date;
	actualEndDate?: Date;
	settings: IBattleSettings;
	winnerId?: string; // GroupId des Gewinners
	pixelBoardId?: string; // Referenz zum dedizierten Board
	createdAt: Date;
	updatedAt: Date;
}

const BattleMemberSchema = new Schema<IBattleMember>(
	{
		userId: { type: String, required: true },
		contributedXP: { type: Number, default: 0, min: 0 },
		pixelsPlaced: { type: Number, default: 0, min: 0 },
	},
	{ _id: false },
);

const BattleParticipantSchema = new Schema<IBattleParticipant>(
	{
		groupId: { type: String, required: true },
		groupName: { type: String, required: true },
		color: {
			type: String,
			required: true,
			match: /^#[0-9A-F]{6}$/i,
		},
		pixelsOwned: { type: Number, default: 0, min: 0 },
		totalXP: { type: Number, default: 0, min: 0 },
		members: { type: [BattleMemberSchema], default: [] },
	},
	{ _id: false },
);

const BattleSettingsSchema = new Schema<IBattleSettings>(
	{
		duration: {
			type: Number,
			required: true,
			default: 1440, // 24 Stunden
			min: 60, // Mindestens 1 Stunde
			max: 10080, // Max 1 Woche
		},
		gridSize: {
			type: Number,
			required: true,
			default: 50,
			min: 20,
			max: 200,
		},
		winCondition: {
			type: String,
			enum: ['pixels', 'xp', 'hybrid'],
			default: 'pixels',
		},
		xpPerPixel: {
			type: Number,
			default: 67,
			min: 1,
		},
		pixelsPerAction: {
			type: Number,
			default: 1,
			min: 1,
			max: 10,
		},
		allowOverwrite: {
			type: Boolean,
			default: true,
		},
	},
	{ _id: false },
);

const BattleSchema = new Schema<IBattle>(
	{
		name: {
			type: String,
			required: true,
			trim: true,
			minlength: 3,
			maxlength: 100,
		},
		description: {
			type: String,
			maxlength: 500,
		},
		challenger: {
			type: BattleParticipantSchema,
			required: true,
		},
		opponent: {
			type: BattleParticipantSchema,
			required: true,
		},
		status: {
			type: String,
			enum: ['pending', 'accepted', 'active', 'completed', 'declined', 'cancelled'],
			default: 'pending',
		},
		challengedAt: {
			type: Date,
			required: true,
			default: Date.now,
		},
		acceptedAt: {
			type: Date,
		},
		startDate: {
			type: Date,
		},
		endDate: {
			type: Date,
		},
		actualEndDate: {
			type: Date,
		},
		settings: {
			type: BattleSettingsSchema,
			required: true,
			default: () => ({}),
		},
		winnerId: {
			type: String,
		},
		pixelBoardId: {
			type: String,
		},
	},
	{
		timestamps: true,
	},
);

// Indizes für schnelle Abfragen
BattleSchema.index({ status: 1 });
BattleSchema.index({ 'challenger.groupId': 1 });
BattleSchema.index({ 'opponent.groupId': 1 });
BattleSchema.index({ endDate: 1 });

export const BattleModel = mongoose.model<IBattle>('Battle', BattleSchema);
