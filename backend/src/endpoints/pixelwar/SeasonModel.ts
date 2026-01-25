import mongoose, { Schema, Document } from 'mongoose';

export interface ISeasonLeaderboard {
	groupId: string;
	groupName: string;
	totalXP: number;
	pixelsOwned: number;
	rank: number;
}

export interface ISeason extends Document {
	name: string;
	description?: string;
	mode: 'territory_control' | 'xp_battle' | 'hybrid';
	startDate: Date;
	endDate: Date;
	status: 'upcoming' | 'active' | 'completed';
	participatingGroups: string[]; // Group IDs
	leaderboard: ISeasonLeaderboard[];
	winnerId?: string; // Group ID des Gewinners
	createdAt: Date;
	updatedAt: Date;
	// Game-Regeln
	rules: {
		pixelsPerAction: number; // Wie viele Pixel pro Workout/Habit
		xpPerPixel: number; // Wieviel XP für 1 Pixel-Aktion
		cooldownMinutes: number; // Cooldown zwischen Pixel-Updates
		maxPixelsPerUser: number; // Max Pixel pro User pro Tag
	};
}

const LeaderboardEntrySchema = new Schema<ISeasonLeaderboard>(
	{
		groupId: { type: String, required: true },
		groupName: { type: String, required: true },
		totalXP: { type: Number, required: true, default: 0 },
		pixelsOwned: { type: Number, required: true, default: 0 },
		rank: { type: Number, required: true, min: 1 },
	},
	{ _id: false },
);

const SeasonSchema = new Schema<ISeason>(
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
			maxlength: 1000,
		},
		mode: {
			type: String,
			enum: ['territory_control', 'xp_battle', 'hybrid'],
			required: true,
			default: 'territory_control',
		},
		startDate: {
			type: Date,
			required: true,
		},
		endDate: {
			type: Date,
			required: true,
			validate: {
				validator: function (endDate: Date) {
					return endDate > this.startDate;
				},
				message: 'End date must be after start date',
			},
		},
		status: {
			type: String,
			enum: ['upcoming', 'active', 'completed'],
			required: true,
			default: 'upcoming',
		},
		participatingGroups: {
			type: [String],
			default: [],
		},
		leaderboard: {
			type: [LeaderboardEntrySchema],
			default: [],
		},
		winnerId: {
			type: String,
		},
		rules: {
			pixelsPerAction: {
				type: Number,
				default: 1,
				min: 1,
				max: 10,
			},
			xpPerPixel: {
				type: Number,
				default: 67, // Gleich wie Exercise XP
				min: 1,
			},
			cooldownMinutes: {
				type: Number,
				default: 30,
				min: 0,
				max: 1440, // Max 24h
			},
			maxPixelsPerUser: {
				type: Number,
				default: 50,
				min: 1,
				max: 1000,
			},
		},
	},
	{
		timestamps: true,
	},
);

// Indizes
SeasonSchema.index({ status: 1, startDate: 1 });
SeasonSchema.index({ endDate: 1 });

export const SeasonModel = mongoose.model<ISeason>('Season', SeasonSchema);
