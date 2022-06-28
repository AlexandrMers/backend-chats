import { MessageDocument, MessageResponseInterface } from '../types';

import { formatFileFromDB } from '../../upload-files/modules/cloudinary/helpers';

export const formatMessageResponse = (
  message: MessageDocument,
): MessageResponseInterface => {
  const messageJson = message?.toJSON();

  const attachmentsFormatted = messageJson?.attachments?.length
    ? messageJson?.attachments.map((attachment) =>
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        formatFileFromDB(attachment, false),
      )
    : [];

  return {
    id: messageJson?._id,
    chatId: messageJson?.chat,
    type: messageJson?.type,
    isRead: messageJson?.isRead,
    text: messageJson?.text,
    createdAt: messageJson?.createdAt,
    author: {
      fullName: messageJson?.author.fullName,
      id: messageJson?.author._id,
      avatar: messageJson?.author.avatar,
    },
    attachments: attachmentsFormatted,
  };
};
