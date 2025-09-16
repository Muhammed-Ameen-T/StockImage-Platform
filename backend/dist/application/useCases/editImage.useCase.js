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
exports.EditImageUseCase = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../core/types");
const custom_error_1 = require("../../utils/errors/custom.error");
const httpResponseCode_utils_1 = require("../../utils/constants/httpResponseCode.utils");
const cloudinary_service_1 = require("../../infrastructure/services/cloudinary.service");
let EditImageUseCase = class EditImageUseCase {
    constructor(imageRepository, cloudinaryService) {
        this.imageRepository = imageRepository;
        this.cloudinaryService = cloudinaryService;
    }
    /**
     * Executes the image update operation.
     * @param imageId - ID of the image to update
     * @param updates - Fields to update (title required, optional file + metadata)
     * @throws {CustomError} If image is not found
     */
    async execute(imageId, updates) {
        const { title, file, originalFileName, mimeType, fileSize } = updates;
        const updatePayload = { title };
        if (file) {
            const url = await this.cloudinaryService.uploadImage(file.path);
            updatePayload.url = url;
            updatePayload.originalFileName = originalFileName;
            updatePayload.mimeType = mimeType;
            updatePayload.fileSize = fileSize;
        }
        const updated = await this.imageRepository.updateImage(imageId, updatePayload);
        if (!updated) {
            throw new custom_error_1.CustomError('Image not found', httpResponseCode_utils_1.HttpResCode.NOT_FOUND);
        }
    }
};
exports.EditImageUseCase = EditImageUseCase;
exports.EditImageUseCase = EditImageUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.ImageRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.CloudinaryService)),
    __metadata("design:paramtypes", [Object, cloudinary_service_1.CloudinaryService])
], EditImageUseCase);
