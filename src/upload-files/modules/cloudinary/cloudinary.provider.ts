import { v2 } from 'cloudinary';
import getCloudinaryConfig from '../../../configs/cloudinary';

const CLOUDINARY = 'cloudinary';

export const CloudinaryProvider = {
  provide: CLOUDINARY,
  useFactory: () => {
    return v2.config(getCloudinaryConfig());
  },
};
