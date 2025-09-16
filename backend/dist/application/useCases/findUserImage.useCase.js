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
exports.FindUserImagesUseCase = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../core/types");
const custom_error_1 = require("../../utils/errors/custom.error");
const httpResponseCode_utils_1 = require("../../utils/constants/httpResponseCode.utils");
/**
 * Use case for retrieving user-uploaded images with filtering, sorting, and pagination.
 */
let FindUserImagesUseCase = class FindUserImagesUseCase {
    constructor(imageRepository) {
        this.imageRepository = imageRepository;
    }
    async execute(params) {
        try {
            return await this.imageRepository.findUserImages(params);
        }
        catch (error) {
            console.error('❌ Error fetching user images:', error);
            throw new custom_error_1.CustomError('Failed to retrieve images', httpResponseCode_utils_1.HttpResCode.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.FindUserImagesUseCase = FindUserImagesUseCase;
exports.FindUserImagesUseCase = FindUserImagesUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.ImageRepository)),
    __metadata("design:paramtypes", [Object])
], FindUserImagesUseCase);
