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
 * Use case for retrieving images associated with a specific user.
 */
let FindUserImagesUseCase = class FindUserImagesUseCase {
    /**
     * @param imageRepository - Repository for accessing image data
     */
    constructor(imageRepository) {
        this.imageRepository = imageRepository;
    }
    /**
     * Executes the use case to find user images.
     * @param params - Parameters for filtering and pagination
     * @param params.userId - ID of the user whose images are to be retrieved
     * @param [params.skip] - Number of records to skip
     * @param [params.limit] - Maximum number of records to return
     * @param [params.search] - Search keyword for filtering images
     * @param [params.sortBy] - Field to sort by
     * @param [params.sortOrder] - Sort order: 'asc' or 'desc'
     * @returns A promise resolving to an object containing images and total count
     * @throws CustomError if retrieval fails
     */
    async execute(params) {
        try {
            return await this.imageRepository.findUserImages(params);
        }
        catch (error) {
            console.error("❌ Error fetching user images:", error);
            throw new custom_error_1.CustomError("Failed to retrieve images", httpResponseCode_utils_1.HttpResCode.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.FindUserImagesUseCase = FindUserImagesUseCase;
exports.FindUserImagesUseCase = FindUserImagesUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.ImageRepository)),
    __metadata("design:paramtypes", [Object])
], FindUserImagesUseCase);
