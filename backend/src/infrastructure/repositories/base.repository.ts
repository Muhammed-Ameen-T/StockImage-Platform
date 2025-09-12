import { Model, FilterQuery, UpdateQuery } from 'mongoose';

/**
 * Generic base repository for Mongoose models.
 * Provides common CRUD operations with full type safety.
 *
 * @template T - The document interface type
 */
export class BaseRepository<T> {
  constructor(private readonly model: Model<T>) {}

  /**
   * Finds documents matching the filter.
   * @param filter - MongoDB filter query
   */
  async find(filter: FilterQuery<T>): Promise<T[]> {
    return this.model.find(filter).lean<T[]>().exec();
  }

  /**
   * Finds a document by its ID.
   * @param id - Document ID
   */
  async findById(id: string): Promise<T | null> {
    return this.model.findById(id).lean<T | null>().exec();
  }

  /**
   * Creates a new document.
   * @param data - Partial document data
   */
  async create(data: Partial<T>): Promise<T> {
    const doc = new this.model(data);
    await doc.save();
    return doc.toObject() as T;
  }

  /**
   * Updates a document by ID.
   * @param id - Document ID
   * @param data - Update query
   */
  async update(id: string, data: UpdateQuery<T>): Promise<T | null> {
    const updated = await this.model.findByIdAndUpdate(id, data, { new: true }).exec();
    return updated?.toObject() ?? null;
  }

  /**
   * Deletes a document by ID.
   * @param id - Document ID
   */
  async delete(id: string): Promise<void> {
    await this.model.findByIdAndDelete(id).exec();
  }
}
