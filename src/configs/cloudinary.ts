import { ConfigOptions } from 'cloudinary/types';

const getCloudinaryConfig = (): ConfigOptions => ({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET_KEY,
});

export default getCloudinaryConfig;
