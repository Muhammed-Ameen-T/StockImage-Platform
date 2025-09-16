"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRepository = void 0;
/**
 * Generic base repository for Mongoose models.
 * Provides common CRUD operations with full type safety.
 *
 * @template T - The document interface type
 */
class BaseRepository {
    constructor(model) {
        this.model = model;
    }
    /**
     * Finds documents matching the filter.
     * @param filter - MongoDB filter query
     */
    async find(filter) {
        return this.model.find(filter).lean().exec();
    }
    /**
     * Finds a document by its ID.
     * @param id - Document ID
     */
    async findById(id) {
        return this.model.findById(id).lean().exec();
    }
    /**
     * Creates a new document.
     * @param data - Partial document data
     */
    async create(data) {
        const doc = new this.model(data);
        await doc.save();
        return doc.toObject();
    }
    /**
     * Updates a document by ID.
     * @param id - Document ID
     * @param data - Update query
     */
    async update(id, data) {
        const updated = await this.model.findByIdAndUpdate(id, data, { new: true }).exec();
        return updated?.toObject() ?? null;
    }
    /**
     * Deletes a document by ID.
     * @param id - Document ID
     */
    async delete(id) {
        await this.model.findByIdAndDelete(id).exec();
    }
}
exports.BaseRepository = BaseRepository;
