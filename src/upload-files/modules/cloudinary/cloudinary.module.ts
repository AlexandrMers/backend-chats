import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

// services
import { CloudinaryService } from './cloudinary.service';
import { CloudinaryProvider } from './cloudinary.provider';

// models
import { FileUploadModel } from '../../models/file-upload.schema';
import { UserModel } from '../../../users/models/user-model.schema';

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
    MongooseModule.forFeature([
      {
        name: ModelName.USER,
        schema: UserModel,
      },
    ]),
  ],
  providers: [CloudinaryProvider, CloudinaryService],
  exports: [CloudinaryProvider, CloudinaryService],
})
export class CloudinaryModule {}
