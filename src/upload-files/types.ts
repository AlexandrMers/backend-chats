import { FileUpload } from './models/file-upload.schema';
import { Document } from 'mongoose';

export type FileUploadDocument = FileUpload & Document;
