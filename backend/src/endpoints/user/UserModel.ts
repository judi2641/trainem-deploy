import { Schema, model, Types } from "mongoose";
import { GENDERS, USERS } from "../../../../shared/types/database/user/User";
// Pfad ggf. anpassen

const UserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    userType: { type: String, enum: Object.values(USERS) },

    firstName: { type: String },
    lastName: { type: String },
    birthDate: { type: Date },
    gender: { type: String, enum: Object.values(GENDERS) },

    avatar: { type: String },
    img: { type: String },
  },
  {
    timestamps: true,
  }
);

export const UserModel = model("User", UserSchema);
