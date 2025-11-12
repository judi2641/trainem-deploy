import mongoose from "mongoose";
import { UserInDatabase } from "../../../../shared/types/User";

export interface IUserDocument extends UserInDatabase, mongoose.Document {
  _id: string;
};

const UserSchema = new mongoose.Schema<UserInDatabase>({
  email: { type: String, required: true, unique: true },
});

delete mongoose.models.User

export const UserModel = mongoose.model("User", UserSchema);