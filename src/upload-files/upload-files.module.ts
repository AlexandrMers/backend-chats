import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

// controllers
import { UploadFilesController } from './controllers/upload-files.controller';

// services
import { UploadFilesService } from './services/upload-files.service';

// models
import { FileUploadModel } from './models/file-upload.schema';

// types
import { ModelName } from '../types';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: ModelName.FILE_UPLOAD,
        schema: FileUploadModel,
      },
    ]),
  ],
  controllers: [UploadFilesController],
  providers: [UploadFilesService],
})
export class UploadFilesModule {}
