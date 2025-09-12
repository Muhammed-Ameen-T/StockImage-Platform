import { injectable, inject } from 'inversify';
import { IDeleteImageUseCase } from '../../domain/interfaces/useCases/deleteImage.interface';
import { IImageRepository } from '../../domain/interfaces/repositories/image.repository';
import { TYPES } from '../../core/types';

/**
 * Use case for deleting a user's image.
 */
@injectable()
export class DeleteImageUseCase implements IDeleteImageUseCase {
  constructor(
    @inject(TYPES.ImageRepository) private imageRepository: IImageRepository,
  ) {}

  /**
   * Deletes an image by its ID.
   * @param imageId - ID of the image to delete
   */
  async execute(imageId: string): Promise<void> {
    await this.imageRepository.deleteById(imageId);
  }
}
