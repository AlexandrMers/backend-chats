import { FileInterface, FileUploadDocument } from '../../types';

export const formatFileFromDB = (file: FileUploadDocument): FileInterface => {
  const fileDocJson = file.toJSON();

  return {
    url: fileDocJson.url,
    user: fileDocJson.user,
    fileName: fileDocJson.fileName,
    size: fileDocJson.size,
    publicId: fileDocJson.publicId,
    extension: fileDocJson.extension,
  };
};
