import { injectable, inject } from 'inversify';
import { IImageRepository } from '../../domain/interfaces/repositories/image.repository';
import { TYPES } from '../../core/types';
import { IBulkUploadImagesUseCase } from '../../domain/interfaces/useCases/bulkImageUpload.interface';
import { Types } from 'mongoose';

/**
 * Use case for bulk uploading images with titles.
 */
@injectable()
export class BulkUploadImagesUseCase implements IBulkUploadImagesUseCase {
  constructor(
    @inject(TYPES.ImageRepository) private imageRepository: IImageRepository,
  ) {}

  /**
   * Uploads multiple images for a user.
   * @param userId - ID of the user uploading images
   * @param images - Array of image objects with title and url
   */
  async execute(userId: string, images: { title: string; url: string }[]): Promise<void> {
    const formatted = images.map((img, index) => ({
      userId: new Types.ObjectId(userId),
      title: img.title,
      url: img.url,
      order: index,
    }));

    await this.imageRepository.addMany(formatted);
  }
}
