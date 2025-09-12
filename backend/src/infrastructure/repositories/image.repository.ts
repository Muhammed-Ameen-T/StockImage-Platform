import { injectable } from 'inversify';
import { BaseRepository } from './base.repository';
import { IImage } from '../../domain/interfaces/model/image.interface';
import { IImageRepository } from '../../domain/interfaces/repositories/image.repository';
import { ImageModel } from '../database/image.modal';
import { FilterQuery, SortOrder } from 'mongoose';

/**
 * Repository for image-specific operations.
 */
@injectable()
export class ImageRepository implements IImageRepository {
  private readonly baseRepo: BaseRepository<IImage>;

  constructor() {
    this.baseRepo = new BaseRepository<IImage>(ImageModel);
  }

  /**
   * Finds all images uploaded by a specific user, sorted by order.
   * @param userId - ID of the user
   */
  async findByUser(userId: string): Promise<IImage[]> {
    return this.baseRepo.find({ userId });
  }

  /**
   * Updates the order of a specific image.
   * @param imageId - ID of the image
   * @param newOrder - New order value
   * @returns Updated image
   */
  async updateOrder(imageId: string, newOrder: number): Promise<IImage> {
    await this.baseRepo.update(imageId, { order: newOrder });
    const updated = await this.baseRepo.findById(imageId);
    if (!updated) throw new Error('Image not found');
    return updated;
  }

  /**
   * Adds multiple images in bulk.
   * @param images - Array of image data
   * @returns Array of created image entities
   */
  async addMany(images: Partial<IImage>[]): Promise<IImage[]> {
    const created: IImage[] = [];
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
  async deleteById(imageId: string): Promise<void> {
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
  async findUserImages(params: {
    userId: string;
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<{ images: IImage[]; totalCount: number }> {
    const {
      userId,
      page = 1,
      limit = 10,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = params;

    const filter: FilterQuery<IImage> = { userId };
    if (search) {
      filter.title = { $regex: search, $options: 'i' };
    }

    const skip = (page - 1) * limit;
    const sort: Record<string, SortOrder> = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    const [images, totalCount] = await Promise.all([
      ImageModel.find(filter).sort(sort).skip(skip).limit(limit).lean<IImage[]>(),
      ImageModel.countDocuments(filter),
    ]);

    return { images, totalCount };
  }

  /**
   * Updates a single image's metadata.
   * @param imageId - ID of the image to update
   * @param updates - Fields to update (title, url, order)
   * @returns Updated image or null if not found
   */
  async updateImage(
    imageId: string,
    updates: Partial<{ title: string; url: string; order: number }>
  ): Promise<IImage | null> {
    const updated = await ImageModel.findByIdAndUpdate(imageId, updates, { new: true }).lean<IImage | null>();
    return updated;
  }
}