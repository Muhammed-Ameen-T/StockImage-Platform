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
exports.ReorderImageUseCase = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../core/types");
const custom_error_1 = require("../../utils/errors/custom.error");
const httpResponseCode_utils_1 = require("../../utils/constants/httpResponseCode.utils");
const commonErrorMsg_constants_1 = require("../../utils/constants/commonErrorMsg.constants");
/**
 * Use case for reordering an image within a user's image collection.
 */
let ReorderImageUseCase = class ReorderImageUseCase {
    /**
     * @param imageRepository - Repository for accessing and updating image data
     */
    constructor(imageRepository) {
        this.imageRepository = imageRepository;
    }
    /**
     * Executes the reordering logic for a given image.
     * @param dto - Data transfer object containing image reordering details
     * @param dto.imageId - ID of the image to reorder
     * @param dto.previousOrder - Order value of the previous image
     * @param dto.nextOrder - Order value of the next image
     * @param dto.userId - ID of the user who owns the image
     * @throws CustomError if context is invalid or image update fails
     */
    async execute(dto) {
        const { imageId, previousOrder, nextOrder, userId } = dto;
        let newOrder;
        if (previousOrder !== undefined && nextOrder !== undefined) {
            newOrder = (previousOrder + nextOrder) / 2;
        }
        else if (previousOrder === undefined && nextOrder !== undefined) {
            let nearestPrev = await this.imageRepository.findNearestOrderByDirection(userId, nextOrder, 'next');
            if (nearestPrev) {
                newOrder = (nextOrder + nearestPrev) / 2;
            }
            else {
                newOrder = nextOrder + 100;
            }
        }
        else if (previousOrder !== undefined && nextOrder === undefined) {
            let nearestNext = await this.imageRepository.findNearestOrderByDirection(userId, previousOrder, 'prev');
            if (nearestNext) {
                newOrder = (previousOrder + nearestNext) / 2;
            }
            else {
                newOrder = previousOrder - 100;
            }
        }
        else {
            throw new custom_error_1.CustomError(commonErrorMsg_constants_1.ErrorMsg.INVALID_ERROR_CONTEXT, httpResponseCode_utils_1.HttpResCode.BAD_REQUEST);
        }
        if (newOrder === previousOrder || newOrder === nextOrder) {
            const surrounding = await this.imageRepository.findSurroundingImages(userId, previousOrder, nextOrder);
            let baseOrder = 1000;
            const spacing = 100;
            for (const img of surrounding) {
                await this.imageRepository.updateImage(img._id.toString(), { order: baseOrder });
                baseOrder += spacing;
            }
            if (previousOrder !== undefined && nextOrder !== undefined) {
                newOrder = (previousOrder + nextOrder) / 2;
            }
            else if (previousOrder === undefined && nextOrder !== undefined) {
                newOrder = nextOrder - 100;
            }
            else if (previousOrder !== undefined && nextOrder === undefined) {
                newOrder = previousOrder + 100;
            }
        }
        console.log(`✅ Updating image ${imageId} to new order: ${newOrder}`);
        const updated = await this.imageRepository.updateImage(imageId, { order: newOrder });
        if (!updated) {
            throw new custom_error_1.CustomError(commonErrorMsg_constants_1.ErrorMsg.IMAGE_NOT_FOUND, httpResponseCode_utils_1.HttpResCode.NOT_FOUND);
        }
    }
};
exports.ReorderImageUseCase = ReorderImageUseCase;
exports.ReorderImageUseCase = ReorderImageUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.ImageRepository)),
    __metadata("design:paramtypes", [Object])
], ReorderImageUseCase);
