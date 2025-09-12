import { injectable, inject } from 'inversify';
import { IImageRepository } from '../../domain/interfaces/repositories/image.repository';
import { IFindUserImagesUseCase } from '../../domain/interfaces/useCases/findUserImages.interface';
import { TYPES } from '../../core/types';
import { CustomError } from '../../utils/errors/custom.error';
import { HttpResCode } from '../../utils/constants/httpResponseCode.utils';
import { IImage } from '../../domain/interfaces/model/image.interface';

/**
 * Use case for retrieving user-uploaded images with filtering, sorting, and pagination.
 */
@injectable()
export class FindUserImagesUseCase implements IFindUserImagesUseCase {
  constructor(
    @inject(TYPES.ImageRepository) private imageRepository: IImageRepository
  ) {}

  async execute(params: {
    userId: string;
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<{ images: IImage[]; totalCount: number }> {
    try {
      return await this.imageRepository.findUserImages(params);
    } catch (error) {
      console.error('❌ Error fetching user images:', error);
      throw new CustomError('Failed to retrieve images', HttpResCode.INTERNAL_SERVER_ERROR);
    }
  }
}
