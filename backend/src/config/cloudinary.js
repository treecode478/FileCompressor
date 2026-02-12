// Cloudinary configuration wrapper.
// Abstracted so we can swap media storage later without touching business logic.

import { v2 as cloudinary } from 'cloudinary';
import env from './env.js';

cloudinary.config({
  cloud_name: env.cloudinary.cloudName,
  api_key: env.cloudinary.apiKey,
  api_secret: env.cloudinary.apiSecret
});

export default cloudinary;

