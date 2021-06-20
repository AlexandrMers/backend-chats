import { v2 as cloudinary } from 'cloudinary';
import { Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

// types
import { UserResponseInterface } from '../../../users/types';
import { FileInterface, FileUploadDocument } from '../../types';
import { ModelName, Statuses } from '../../../types';
import { formatFileFromDB } from './helpers';

@Injectable()
export class CloudinaryService {
  constructor(
    @InjectModel(ModelName.FILE_UPLOAD)
    private readonly fileUploadModel: Model<FileUploadDocument>,
  ) {}

  async uploadFile(file: Express.Multer.File, user: UserResponseInterface) {
    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            resource_type: 'auto',
          },
          (error, result) => {
            if (error) {
              return reject({
                status: Statuses.ERROR,
                error: error,
              });
            }

            if (!result) {
              return reject({
                status: Statuses.ERROR,
                error: 'Результат с cloudinary не был получен',
              });
            }

            const fileData: FileInterface = {
              publicId: result.public_id,
              fileName: result.original_filename,
              size: result.bytes,
              extension: result.format,
              url: result.url,
              user: Types.ObjectId(user.id),
            };

            const newFile = new this.fileUploadModel(fileData);

            newFile
              .save()
              .then((savedFile) => {
                resolve({
                  status: Statuses.SUCCESS,
                  data: formatFileFromDB(savedFile),
                });
              })
              .catch((error) => {
                reject(error);
              });
          },
        )
        .end(file.buffer);
    });
  }

  async deleteFileByPublicId(id: string) {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(id, async (error, result) => {
        if (error) {
          reject({
            status: Statuses.ERROR,
            error: error.toString(),
          });
        }

        await this.fileUploadModel.deleteOne({
          publicId: id,
        });

        resolve({
          status: Statuses.SUCCESS,
          data: result.result,
        });
      });
    });
  }
}
