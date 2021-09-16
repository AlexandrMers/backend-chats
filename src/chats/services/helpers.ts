import { ChatResponseInterface, MessageResponseInterface } from '../types';

export const calculateUnreadMessages = (
  messages: MessageResponseInterface[] = [],
  authorId: string,
) => {
  return messages.reduce((count, message) => {
    const isReadMessage = message.isRead;
    const isPartnerMessage = message.author.id.toString() !== authorId;

    if (!isReadMessage && isPartnerMessage) {
      return ++count;
    }
    return count;
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
      return calculateUnreadMessages(chats[0]?.messages, authorId);
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
