import { v2 as cloudinary } from 'cloudinary';
import { env } from '../../config/env.config';

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

export class CloudinaryService {
  /**
   * Uploads a local image file to Cloudinary.
   * @param filePath - Local path of the image file
   * @returns {Promise<string>} - Secure Cloudinary URL
   */
  async uploadImage(filePath: string): Promise<string> {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'user-images',
      resource_type: 'image',
    });
    return result.secure_url;
  }
}
