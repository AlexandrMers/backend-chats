import { ChatResponseInterface, MessageResponseInterface } from '../types';

export const calculateUnreadMessages = (
  messages: MessageResponseInterface[] = [],
  authorId: string,
) => {
  return messages.reduce((count, message) => {
    const isUnreadMessage = !message.isRead;
    const isPartnerMessage = message.author.id !== authorId;

    if (isUnreadMessage && isPartnerMessage) {
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
      return chats.reduce((obj, chat) => {
        obj[chat.id] = calculateUnreadMessages(chat?.messages, authorId);
        return obj;
      }, {});
    },
  );
}

export function formatChatsWithUnreadCountMessages(
  chats: ChatResponseInterface[],
  unreadCountMessages: { [key: string]: number },
) {
  return chats.map((chat) => {
    return {
      ...chat,
      unreadCountMessages: unreadCountMessages[chat.id],
    };
  });
}
