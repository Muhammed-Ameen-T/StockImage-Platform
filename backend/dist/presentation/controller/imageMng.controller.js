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
exports.ImageController = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../core/types");
const sendResponse_utils_1 = require("../../utils/response/sendResponse.utils");
const httpResponseCode_utils_1 = require("../../utils/constants/httpResponseCode.utils");
const commonSuccessMsg_constants_1 = require("../../utils/constants/commonSuccessMsg.constants");
const custom_error_1 = require("../../utils/errors/custom.error");
const image_dto_1 = require("../../application/dtos/image.dto");
const commonErrorMsg_constants_1 = require("../../utils/constants/commonErrorMsg.constants");
/**
 * Controller for handling image-related operations such as bulk upload, deletion, and retrieval.
 * @implements {IImageController}
 */
let ImageController = class ImageController {
    /**
     * Constructs an instance of ImageController with injected use cases.
     *
     * @param {IBulkUploadImagesUseCase} bulkUploadUseCase - Use case for bulk uploading images.
     * @param {IDeleteImageUseCase} deleteImageUseCase - Use case for deleting a specific image.
     * @param {IFindUserImagesUseCase} findUserImagesUseCase - Use case for retrieving user images with filters.
     */
    constructor(bulkUploadUseCase, deleteImageUseCase, findUserImagesUseCase, editImageUseCase, reorderImageUseCase) {
        this.bulkUploadUseCase = bulkUploadUseCase;
        this.deleteImageUseCase = deleteImageUseCase;
        this.findUserImagesUseCase = findUserImagesUseCase;
        this.editImageUseCase = editImageUseCase;
        this.reorderImageUseCase = reorderImageUseCase;
    }
    /**
     * Handles bulk image upload via file + title.
     *
     * @route POST /images/bulk-upload
     * @param {Request} req - Contains `files` from Multer and `titles[]` in body.
     */
    async bulkUpload(req, res, next) {
        try {
            const userId = req.decoded?.userId;
            if (!userId) {
                throw new custom_error_1.CustomError(httpResponseCode_utils_1.HttpResMsg.UNAUTHORIZED, httpResponseCode_utils_1.HttpResCode.UNAUTHORIZED);
            }
            const files = req.files?.["files"] || [];
            const normalize = (field) => Array.isArray(field) ? field : field !== undefined ? [field] : [];
            const titles = normalize(req.body.titles);
            const originalFileNames = normalize(req.body.originalFileNames);
            const mimeTypes = normalize(req.body.mimeTypes);
            const fileSizes = normalize(req.body.fileSizes).map(Number);
            if (titles.length !== files.length ||
                originalFileNames.length !== files.length ||
                mimeTypes.length !== files.length ||
                fileSizes.length !== files.length) {
                throw new custom_error_1.CustomError(commonErrorMsg_constants_1.ErrorMsg.INVALID_FILE_ARRAY, httpResponseCode_utils_1.HttpResCode.BAD_REQUEST);
            }
            const dto = new image_dto_1.BulkUploadDTO(userId, files, titles, originalFileNames, mimeTypes, fileSizes);
            await this.bulkUploadUseCase.execute(dto);
            (0, sendResponse_utils_1.sendResponse)(res, httpResponseCode_utils_1.HttpResCode.OK, commonSuccessMsg_constants_1.SuccessMsg.IMAGES_UPLOADED);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Handles image deletion.
     *
     * @route DELETE /delete/:imageId
     * @param {Request} req - Express request object containing `imageId` in the route parameters.
     * @param {Response} res - Express response object used to send success response.
     * @param {NextFunction} next - Express next middleware function for error handling.
     * @returns {Promise<void>} Resolves when deletion is complete.
     */
    async deleteImage(req, res, next) {
        try {
            const { id } = req.params;
            await this.deleteImageUseCase.execute(id);
            (0, sendResponse_utils_1.sendResponse)(res, httpResponseCode_utils_1.HttpResCode.OK, commonSuccessMsg_constants_1.SuccessMsg.IMAGE_DELETED);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Retrieves user-uploaded images with optional filtering, sorting, and pagination.
     *
     * @route GET /images/user
     * @param {Request} req - Express request object containing query params: `page`, `limit`, `search`, `sortBy`, `sortOrder`.
     *                        Also expects `userId` from decoded token (`req.decoded.userId`).
     * @param {Response} res - Express response object used to send retrieved images.
     * @param {NextFunction} next - Express next middleware function for error handling.
     * @returns {Promise<void>} Resolves with paginated image data.
     * @throws {CustomError} If `userId` is missing or unauthorized.
     */
    async findUserImages(req, res, next) {
        try {
            const { skip, limit, search, sortBy, sortOrder } = req.query;
            const userId = req.decoded?.userId;
            if (!userId) {
                throw new custom_error_1.CustomError(httpResponseCode_utils_1.HttpResMsg.UNAUTHORIZED, httpResponseCode_utils_1.HttpResCode.UNAUTHORIZED);
            }
            const result = await this.findUserImagesUseCase.execute({
                userId,
                skip: skip ? Number(skip) : undefined,
                limit: limit ? Number(limit) : undefined,
                search: search ? String(search) : undefined,
                sortBy: sortBy ? String(sortBy) : undefined,
                sortOrder: sortOrder === "asc" ? "asc" : "desc",
            });
            (0, sendResponse_utils_1.sendResponse)(res, httpResponseCode_utils_1.HttpResCode.OK, commonSuccessMsg_constants_1.SuccessMsg.IMAGES_FETCHED, result);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Handles editing metadata of a single image.
     *
     * @route PATCH /images/edit/:imageId
     * @param {Request} req - Express request object containing `imageId` in params and update fields in body.
     * @param {Response} res - Express response object used to send success response.
     * @param {NextFunction} next - Express next middleware function for error handling.
     * @returns {Promise<void>} Resolves when image is successfully updated.
     */
    async editImage(req, res, next) {
        try {
            const { id } = req.params;
            const userId = req.decoded?.userId;
            if (!userId) {
                throw new custom_error_1.CustomError(httpResponseCode_utils_1.HttpResMsg.UNAUTHORIZED, httpResponseCode_utils_1.HttpResCode.UNAUTHORIZED);
            }
            const file = req.file;
            const title = req.body.title;
            const originalFileName = req.body.originalFileName;
            const mimeType = req.body.mimeType;
            const fileSize = req.body.fileSize ? Number(req.body.fileSize) : undefined;
            await this.editImageUseCase.execute(id, {
                title,
                file,
                originalFileName,
                mimeType,
                fileSize,
            });
            (0, sendResponse_utils_1.sendResponse)(res, httpResponseCode_utils_1.HttpResCode.OK, commonSuccessMsg_constants_1.SuccessMsg.IMAGE_UPDATED);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Handles reordering of an image based on drag-and-drop position.
     *
     * @route PATCH /images/reorder
     * @param {Request} req - Express request object containing imageId, previousOrder, nextOrder.
     * @param {Response} res - Express response object used to send success response.
     * @param {NextFunction} next - Express next middleware function for error handling.
     * @returns {Promise<void>} Resolves when image order is updated.
     */
    async reorderImage(req, res, next) {
        try {
            const userId = req.decoded?.userId;
            if (!userId) {
                throw new custom_error_1.CustomError(httpResponseCode_utils_1.HttpResMsg.UNAUTHORIZED, httpResponseCode_utils_1.HttpResCode.UNAUTHORIZED);
            }
            const { imageId, previousOrder, nextOrder } = req.body;
            const dto = new image_dto_1.ReorderImageDTO(imageId, userId, previousOrder, nextOrder);
            await this.reorderImageUseCase.execute(dto);
            (0, sendResponse_utils_1.sendResponse)(res, httpResponseCode_utils_1.HttpResCode.OK, commonSuccessMsg_constants_1.SuccessMsg.IMAGE_REORDERED);
        }
        catch (error) {
            next(error);
        }
    }
};
exports.ImageController = ImageController;
exports.ImageController = ImageController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.BulkUploadImagesUseCase)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.DeleteImageUseCase)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.FindUserImagesUseCase)),
    __param(3, (0, inversify_1.inject)(types_1.TYPES.EditImageUseCase)),
    __param(4, (0, inversify_1.inject)(types_1.TYPES.ReorderImageUseCase)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object])
], ImageController);
