import { Module } from '@nestjs/common';

// modules
import { MongooseModule } from '@nestjs/mongoose';
import { CloudinaryModule } from './modules/cloudinary/cloudinary.module';

// controllers
import { UploadFilesController } from './controllers/upload-files.controller';

// services

// models
import { FileUploadModel } from './models/file-upload.schema';

// types
import { ModelName } from '../types';

@Module({
  imports: [
    CloudinaryModule,
    MongooseModule.forFeature([
      {
        name: ModelName.FILE_UPLOAD,
        schema: FileUploadModel,
      },
    ]),
  ],
  controllers: [UploadFilesController],
  providers: [],
})
export class UploadFilesModule {}
