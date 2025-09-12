import { injectable, inject } from 'inversify';
import { IEditImageUseCase } from '../../domain/interfaces/useCases/editImage.interface';
import { IImageRepository } from '../../domain/interfaces/repositories/image.repository';
import { TYPES } from '../../core/types';
import { CustomError } from '../../utils/errors/custom.error';
import { HttpResCode } from '../../utils/constants/httpResponseCode.utils';

/**
 * Use case for editing a single image's metadata.
 */
@injectable()
export class EditImageUseCase implements IEditImageUseCase {
  constructor(
    @inject(TYPES.ImageRepository) private imageRepository: IImageRepository
  ) {}

  /**
   * Executes the image update operation.
   * @param imageId - ID of the image to update
   * @param updates - Fields to update (title, url, order)
   * @throws {CustomError} If image is not found
   */
  async execute(imageId: string, updates: { title?: string; url?: string; order?: number }): Promise<void> {
    const updated = await this.imageRepository.updateImage(imageId, updates);
    if (!updated) {
      throw new CustomError('Image not found', HttpResCode.NOT_FOUND);
    }
  }
}
