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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageRepository = void 0;
const inversify_1 = require("inversify");
const base_repository_1 = require("./base.repository");
const image_modal_1 = require("../database/image.modal");
/**
 * Repository for image-specific operations.
 */
let ImageRepository = class ImageRepository {
    constructor() {
        this.baseRepo = new base_repository_1.BaseRepository(image_modal_1.ImageModel);
    }
    /**
     * Finds all images uploaded by a specific user, sorted by order.
     * @param userId - ID of the user
     */
    async findByUser(userId) {
        return this.baseRepo.find({ userId });
    }
    /**
     * Updates the order of a specific image.
     * @param imageId - ID of the image
     * @param newOrder - New order value
     * @returns Updated image
     */
    async updateOrder(imageId, newOrder) {
        await this.baseRepo.update(imageId, { order: newOrder });
        const updated = await this.baseRepo.findById(imageId);
        if (!updated)
            throw new Error('Image not found');
        return updated;
    }
    /**
     * Adds multiple images in bulk.
     * @param images - Array of image data
     * @returns Array of created image entities
     */
    async addMany(images) {
        const created = [];
        for (const image of images) {
            const result = await this.baseRepo.create(image);
            created.push(result);
        }
        return created;
    }
    /**
     * Deletes an image by its ID.
     * @param imageId - ID of the image to delete
     */
    async deleteById(imageId) {
        await this.baseRepo.delete(imageId);
    }
    /**
     * Retrieves user-uploaded images with optional search, sorting, and pagination.
     *
     * @param {Object} params - Query parameters for filtering and pagination.
     * @param {string} params.userId - ID of the user whose images are being fetched.
     * @param {number} [params.page=1] - Page number for pagination.
     * @param {number} [params.limit=10] - Number of images per page.
     * @param {string} [params.search] - Optional search keyword to filter by image title.
     * @param {string} [params.sortBy='createdAt'] - Field to sort by.
     * @param {'asc' | 'desc'} [params.sortOrder='desc'] - Sort direction.
     * @returns {Promise<{ images: IImage[]; totalCount: number }>} Paginated and filtered image list.
     */
    async findUserImages(params) {
        const { userId, skip = 0, limit = 8, search, sortBy = "order", sortOrder = "desc", } = params;
        const filter = { userId };
        if (search) {
            filter.title = { $regex: search, $options: "i" };
        }
        const sort = { [sortBy]: sortOrder === "asc" ? 1 : -1 };
        const [images, total] = await Promise.all([
            image_modal_1.ImageModel.find(filter).sort(sort).skip(skip).limit(limit).lean(),
            image_modal_1.ImageModel.countDocuments(filter),
        ]);
        return { images, total };
    }
    /**
     * Updates a single image's metadata.
     * @param imageId - ID of the image to update
     * @param updates - Fields to update (title, url, order)
     * @returns Updated image or null if not found
     */
    async updateImage(imageId, updates) {
        const updated = await image_modal_1.ImageModel.findByIdAndUpdate(imageId, updates, { new: true }).lean();
        return updated;
    }
    /**
     * Finds surrounding images for localized reordering.
     * @param userId - ID of the user
     * @param previousOrder - Order of the image before the target (optional)
     * @param nextOrder - Order of the image after the target (optional)
     * @returns Array of images sorted by order
     */
    async findSurroundingImages(userId, previousOrder, nextOrder) {
        const filter = { userId };
        if (previousOrder !== undefined && nextOrder !== undefined) {
            filter.order = { $gte: previousOrder, $lte: nextOrder };
        }
        else if (previousOrder === undefined && nextOrder !== undefined) {
            filter.order = { $lte: nextOrder };
        }
        else if (previousOrder !== undefined && nextOrder === undefined) {
            filter.order = { $gte: previousOrder };
        }
        return await image_modal_1.ImageModel.find(filter)
            .sort({ order: 1 })
            .limit(10)
            .lean();
    }
    /**
     * Finds the highest order value for a user's images.
     * @param userId - ID of the user
     * @returns Max order number or 0 if no images exist
     */
    async findMaxOrder(userId) {
        const result = await image_modal_1.ImageModel
            .findOne({ userId })
            .sort({ order: -1 })
            .select("order")
            .lean();
        return result?.order || 0;
    }
    /**
     * Finds the lowest order value for a user's images.
     * @param userId - ID of the user
     * @returns Min order number or 0 if no images exist
     */
    async findMinOrder(userId) {
        const result = await image_modal_1.ImageModel
            .findOne({ userId })
            .sort({ order: 1 })
            .select("order")
            .lean();
        return result?.order || 0;
    }
    /**
   * Finds the nearest order value in the specified direction from the target.
   * @param userId - ID of the user
   * @param targetOrder - The reference order value
   * @param direction - 'next' for higher, 'prev' for lower
   * @returns Nearest order value or null if none exists
   */
    async findNearestOrderByDirection(userId, targetOrder, direction) {
        const query = {
            userId,
            order: direction === 'next'
                ? { $gt: targetOrder }
                : { $lt: targetOrder }
        };
        const sort = {
            order: direction === 'next' ? 1 : -1
        };
        const result = await image_modal_1.ImageModel
            .findOne(query)
            .sort(sort)
            .select('order')
            .lean();
        return result?.order ?? null;
    }
};
exports.ImageRepository = ImageRepository;
exports.ImageRepository = ImageRepository = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], ImageRepository);
