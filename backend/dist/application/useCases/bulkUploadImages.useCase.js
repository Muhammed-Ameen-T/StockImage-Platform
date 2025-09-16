"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BulkUploadImagesUseCase = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../core/types");
const cloudinary_service_1 = require("../../infrastructure/services/cloudinary.service");
const mongoose_1 = require("mongoose");
const commonErrorMsg_constants_1 = require("../../utils/constants/commonErrorMsg.constants");
const custom_error_1 = require("../../utils/errors/custom.error");
const httpResponseCode_utils_1 = require("../../utils/constants/httpResponseCode.utils");
let BulkUploadImagesUseCase = class BulkUploadImagesUseCase {
    constructor(imageRepository, cloudinaryService) {
        this.imageRepository = imageRepository;
        this.cloudinaryService = cloudinaryService;
    }
    /**
     * Uploads multiple image files to Cloudinary and stores metadata in DB.
     * @param dto - BulkUploadDTO containing userId, files, and metadata
     */
    async execute(dto) {
        const { userId, files, titles, originalFileNames, mimeTypes, fileSizes } = dto;
        if (files.length !== titles.length ||
            files.length !== originalFileNames.length ||
            files.length !== mimeTypes.length ||
            files.length !== fileSizes.length) {
            throw new custom_error_1.CustomError(commonErrorMsg_constants_1.ErrorMsg.INVALID_FILE_ARRAY, httpResponseCode_utils_1.HttpResCode.BAD_REQUEST);
        }
        try {
            const highestOrder = await this.imageRepository.findMaxOrder(userId);
            const formatted = [];
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const title = titles[i];
                const originalFileName = originalFileNames[i];
                const mimeType = mimeTypes[i];
                const fileSize = fileSizes[i];
                const url = await this.cloudinaryService.uploadImage(file.path);
                formatted.push({
                    userId: new mongoose_1.Types.ObjectId(userId),
                    title,
                    originalFileName,
                    mimeType,
                    fileSize,
                    url,
                    order: highestOrder + (i + 1) * 1000,
                });
            }
            await this.imageRepository.addMany(formatted);
        }
        catch (error) {
            throw new custom_error_1.CustomError(error?.message || commonErrorMsg_constants_1.ErrorMsg.UPLOAD_FAILED, httpResponseCode_utils_1.HttpResCode.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.BulkUploadImagesUseCase = BulkUploadImagesUseCase;
exports.BulkUploadImagesUseCase = BulkUploadImagesUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.ImageRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.CloudinaryService)),
    __metadata("design:paramtypes", [Object, cloudinary_service_1.CloudinaryService])
], BulkUploadImagesUseCase);
