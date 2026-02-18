const User = require("../../models/auth.model");
const Message = require("../../models/message.model");

const getUsers = async (currentUser) => {
  //  Admin see all 
  if (currentUser.role === "admin") {
    return User.find({
      _id: { $ne: currentUser.id },
      isDeleted: false,
    }).select("-password");
  }

  // Normal user  only users he chatted with
  const messages = await Message.find({
    $or: [
      { senderId: currentUser.id },
      { receiverId: currentUser.id },
    ],
  });

  const userIds = new Set();

  messages.forEach((msg) => {
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


const searchUsers = async (currentUser, keyword) => {
  return User.find({
    _id: { $ne: currentUser.id },
    name: { $regex: keyword, $options: "i" },
    isDeleted: false,
  }).select("-password");
};

module.exports = { getUsers, searchUsers };
