import Chat from "../../models/chat.model";

interface CreateChatData {
  participants: string[];
  isDeleted?: boolean;
  [key: string]: any; 
}

const createChat = async (data: CreateChatData) => {
  return Chat.create(data);
};

const getChats = async (userId: string) => {
  return Chat.find({ participants: userId, isDeleted: false });
};

export { createChat, getChats };
