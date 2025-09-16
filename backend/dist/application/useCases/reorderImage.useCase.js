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
let ReorderImageUseCase = class ReorderImageUseCase {
    constructor(imageRepository) {
        this.imageRepository = imageRepository;
    }
    async execute(dto) {
        const { imageId, previousOrder, nextOrder, userId } = dto;
        let newOrder;
        if (previousOrder !== undefined && nextOrder !== undefined) {
            newOrder = (previousOrder + nextOrder) / 2;
        }
        else if (previousOrder === undefined && nextOrder !== undefined) {
            newOrder = nextOrder - 100;
        }
        else if (previousOrder !== undefined && nextOrder === undefined) {
            newOrder = previousOrder + 100;
        }
        else {
            throw new custom_error_1.CustomError('Invalid reorder context', httpResponseCode_utils_1.HttpResCode.BAD_REQUEST);
        }
        if (newOrder === previousOrder || newOrder === nextOrder) {
            const surrounding = await this.imageRepository.findSurroundingImages(userId, previousOrder, nextOrder);
            let baseOrder = 1000;
            const spacing = 100;
            for (const img of surrounding) {
                await this.imageRepository.updateImage(img._id.toString(), { order: baseOrder });
                baseOrder += spacing;
            }
            // Retry calculation
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
        const updated = await this.imageRepository.updateImage(imageId, { order: newOrder });
        if (!updated) {
            throw new custom_error_1.CustomError('Image not found', httpResponseCode_utils_1.HttpResCode.NOT_FOUND);
        }
    }
};
exports.ReorderImageUseCase = ReorderImageUseCase;
exports.ReorderImageUseCase = ReorderImageUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.ImageRepository)),
    __metadata("design:paramtypes", [Object])
], ReorderImageUseCase);
