import { Schema, model, Types } from 'mongoose';
import { GENDERS, USERS } from '../../../../shared/types/database/user/User';
// Pfad ggf. anpassen

const UserSchema = new Schema(
	{
		email: { type: String, required: true, unique: true },
		auth0ID: { type: String, required: true, unique: true },
		userType: { type: String, enum: Object.values(USERS) },

		firstName: { type: String },
		lastName: { type: String },
		birthDate: { type: Date },
		gender: { type: String, enum: ['Male', 'Female', 'Divers'] },

		avatar: { type: String },
		img: { type: String, required: true, default: 'blauLevel1Abnahme' },
		onboardingCompleted: { type: Boolean, default: false },
		score: { type: Number, required: true, default: 0 },
	},
	{
		timestamps: true,
	},
);

export const UserModel = model('User', UserSchema);
