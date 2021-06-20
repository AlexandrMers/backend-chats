import { Document } from 'mongoose';
import { FileUpload } from './models/file-upload.schema';

export type FileUploadDocument = FileUpload & Document;

export type FileInterface = Pick<
  FileUploadDocument,
  'fileName' | 'size' | 'url' | 'publicId' | 'user' | 'extension' | 'id'
>;
