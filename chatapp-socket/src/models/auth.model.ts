import mongoose, { Document, Model, Schema } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "admin" | "user";
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const schema: Schema<IUser> = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const User: Model<IUser> = mongoose.model<IUser>("User", schema);

export default User;
