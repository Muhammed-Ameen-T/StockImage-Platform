"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloudinaryService = void 0;
const cloudinary_1 = require("cloudinary");
const env_config_1 = require("../../config/env.config");
cloudinary_1.v2.config({
    cloud_name: env_config_1.env.CLOUDINARY_CLOUD_NAME,
    api_key: env_config_1.env.CLOUDINARY_API_KEY,
    api_secret: env_config_1.env.CLOUDINARY_API_SECRET,
});
class CloudinaryService {
    /**
     * Uploads a local image file to Cloudinary.
     * @param filePath - Local path of the image file
     * @returns {Promise<string>} - Secure Cloudinary URL
     */
    async uploadImage(filePath) {
        const result = await cloudinary_1.v2.uploader.upload(filePath, {
            folder: 'user-images',
            resource_type: 'image',
        });
        return result.secure_url;
    }
}
exports.CloudinaryService = CloudinaryService;
