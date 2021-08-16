import { ChatResponseInterface, MessageResponseInterface } from '../types';

export const calculateUnreadMessages = (
  messages: MessageResponseInterface[],
  authorId: string,
) => {
  return messages.reduce((count, message) => {
    const isUnreadMessage = !message.isRead;
    const isPartnerMessage = message.author.id !== authorId;

    return isUnreadMessage && isPartnerMessage ? count + 1 : count;
  }, 0);
};

export async function getUnreadMessages(
  queuePromisesChats: Promise<
    ChatResponseInterface & { messages: MessageResponseInterface[] }
  >[],
  authorId: string,
) {
  return Promise.all([...queuePromisesChats]).then(
    (
      chats: (ChatResponseInterface & {
        messages: MessageResponseInterface[];
      })[],
    ) => {
      return calculateUnreadMessages(chats[0].messages, authorId);
    },
  );
}

export function formatChatsWithUnreadCountMessages(
  chats: ChatResponseInterface[],
  unreadCountMessages: number,
) {
  return chats.map((chat) => {
    return {
      ...chat,
      unreadCountMessages,
    };
  });
}
