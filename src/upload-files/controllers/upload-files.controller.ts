import {
  Controller,
  Delete,
  Param,
  Post,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

// services
import { CloudinaryService } from '../modules/cloudinary/cloudinary.service';

// guards
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

// types
import { AuthorizedRequestInterface, Statuses } from '../../types';

@Controller('upload-file')
export class UploadFilesController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @UseGuards(JwtAuthGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Request() req: AuthorizedRequestInterface,
  ) {
    try {
      return this.cloudinaryService.uploadFile(file, req.user);
    } catch (error) {
      return {
        status: Statuses.ERROR,
        error: error.toString(),
      };
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete('delete/:id')
  async deleteFile(@Param('id') id: string) {
    try {
      return this.cloudinaryService.deleteFileByPublicId(id);
    } catch (error) {
      return {
        status: Statuses.ERROR,
        error: error.toString(),
      };
    }
  }
}
