import { ChatDocument, ChatResponseInterface } from '../types';
import { formatMessageResponse } from './formatMessageResponse';

export const formatChatResponse = (
  chat: ChatDocument,
): ChatResponseInterface => {
  const chatJson = chat?.toJSON();

  return {
    id: chatJson?._id,
    author: {
      fullName: chatJson?.author.fullName,
      id: chatJson?.author._id,
    },
    partner: {
      fullName: chatJson?.partner.fullName,
      id: chatJson?.partner._id,
    },
    lastMessage: formatMessageResponse(chat.lastMessage),
  };
};
