import User from "../../models/auth.model";
import Message from "../../models/message.model";

interface CurrentUser {
  id: string;
  role: string;
}

const getUsers = async (currentUser: CurrentUser) => {
  // Admin see all
  if (currentUser.role === "admin") {
    return User.find({
      _id: { $ne: currentUser.id },
      isDeleted: false,
    }).select("-password");
  }

  // Normal user → only users he chatted with
  const messages = await Message.find({
    $or: [
      { senderId: currentUser.id },
      { receiverId: currentUser.id },
    ],
  });

  const userIds = new Set<string>();

  messages.forEach((msg: any) => {
    if (msg.senderId.toString() !== currentUser.id) {
      userIds.add(msg.senderId.toString());
    }
    if (msg.receiverId.toString() !== currentUser.id) {
      userIds.add(msg.receiverId.toString());
    }
  });

  return User.find({
    _id: { $in: Array.from(userIds) },
    isDeleted: false,
  }).select("-password");
};

const searchUsers = async (
  currentUser: CurrentUser,
  keyword?: string
) => {
  return User.find({
    _id: { $ne: currentUser.id },
    name: { $regex: keyword, $options: "i" },
    isDeleted: false,
  }).select("-password");
};

export { getUsers, searchUsers };
