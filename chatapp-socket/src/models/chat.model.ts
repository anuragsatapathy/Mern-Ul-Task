import mongoose, { Document, Model, Schema } from "mongoose";

export interface IChat extends Document {
  participants: string[];
  lastMessage?: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const schema: Schema<IChat> = new mongoose.Schema(
  {
    participants: [String],
    lastMessage: String,
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Chat: Model<IChat> = mongoose.model<IChat>("Chat", schema);

export default Chat;
