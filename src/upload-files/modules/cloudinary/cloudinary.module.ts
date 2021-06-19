import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

// services
import { CloudinaryService } from './cloudinary.service';
import { CloudinaryProvider } from './cloudinary.provider';

// models
import { FileUploadModel } from '../../models/file-upload.schema';

// types
import { ModelName } from '../../../types';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: ModelName.FILE_UPLOAD,
        schema: FileUploadModel,
      },
    ]),
  ],
  providers: [CloudinaryProvider, CloudinaryService],
  exports: [CloudinaryProvider, CloudinaryService],
})
export class CloudinaryModule {}
