import { FileInterface, FileUploadDocument } from '../../types';

export const formatFileFromDB = (
  file: FileUploadDocument,
  isFormatDocToJSON = true,
): FileInterface => {
  let fileDocJson;

  if (isFormatDocToJSON) {
    fileDocJson = file.toJSON();
  } else {
    fileDocJson = file;
  }

  return {
    id: fileDocJson._id,
    url: fileDocJson.url,
    user: fileDocJson.user,
    fileName: fileDocJson.fileName,
    size: fileDocJson.size,
    publicId: fileDocJson.publicId,
    extension: fileDocJson.extension,
  };
};
