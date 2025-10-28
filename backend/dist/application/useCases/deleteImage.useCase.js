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
exports.DeleteImageUseCase = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../core/types");
/**
 * Use case for deleting a user's image.
 */
let DeleteImageUseCase = class DeleteImageUseCase {
    constructor(_imageRepository) {
        this._imageRepository = _imageRepository;
    }
    /**
     * Deletes an image by its ID.
     * @param imageId - ID of the image to delete
     */
    async execute(imageId) {
        await this._imageRepository.deleteById(imageId);
    }
};
exports.DeleteImageUseCase = DeleteImageUseCase;
exports.DeleteImageUseCase = DeleteImageUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.ImageRepository)),
    __metadata("design:paramtypes", [Object])
], DeleteImageUseCase);
