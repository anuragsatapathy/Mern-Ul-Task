import mongoose, { Document, Model, Schema } from "mongoose";

export interface IMessage extends Document {
  senderId: mongoose.Types.ObjectId;
  receiverId: mongoose.Types.ObjectId;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const schema: Schema<IMessage> = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 60 * 60 * 24 * 10, // 10 days TTL
    },
  },
  { timestamps: true }
);

schema.set("toJSON", {
  transform: (_doc, ret: any) => {
    ret._id = ret._id.toString();
    ret.senderId = ret.senderId.toString();
    ret.receiverId = ret.receiverId.toString();
    return ret;
  },
});

const Message: Model<IMessage> = mongoose.model<IMessage>(
  "Message",
  schema
);

export default Message;
