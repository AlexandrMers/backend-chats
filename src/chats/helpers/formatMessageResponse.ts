import { MessageDocument, MessageResponseInterface } from '../types';

export const formatMessageResponse = (
  message: MessageDocument,
): MessageResponseInterface => {
  const messageJson = message?.toJSON();

  return {
    id: messageJson?._id,
    chatId: message.chat,
    type: messageJson?.type,
    isRead: messageJson?.isRead,
    text: messageJson?.text,
    createdAt: messageJson?.createdAt,
    author: {
      fullName: messageJson?.author.fullName,
      id: messageJson?.author._id,
    },
  };
};
