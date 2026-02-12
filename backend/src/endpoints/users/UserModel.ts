import { Schema, model } from 'mongoose';



const UserSchema = new Schema(
	{
		email: { type: String, required: true, unique: true },
		auth0Id: { type: String, required: true, unique: true },
		firstName: { type: String },
		lastName: { type: String },
		birthDate: { type: Date },

		
		onboardingCompleted: { type: Boolean, default: false },
		points: { type: Number, default: 0, min: 0 },

		lastActiveDate: { type: Date, default: Date.now },
		streak: { type: Number, default: 0 },
	},
	{
		timestamps: true,
	},
);

const UserModel = model('User', UserSchema);
export default UserModel;
