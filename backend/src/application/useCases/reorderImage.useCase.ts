import { injectable, inject } from 'inversify';
import { IImageRepository } from '../../domain/interfaces/repositories/image.repository';
import { TYPES } from '../../core/types';
import { CustomError } from '../../utils/errors/custom.error';
import { HttpResCode } from '../../utils/constants/httpResponseCode.utils';
import { IReorderImageUseCase } from '../../domain/interfaces/useCases/reorderImage.interface';
import { ReorderImageDTO } from '../dtos/image.dto';

@injectable()
export class ReorderImageUseCase implements IReorderImageUseCase {
  constructor(
    @inject(TYPES.ImageRepository) private imageRepository: IImageRepository
  ) {}

  async execute(dto: ReorderImageDTO): Promise<void> {
    const { imageId, previousOrder, nextOrder, userId } = dto;
    let newOrder: number;

    if (previousOrder !== undefined && nextOrder !== undefined) {
      newOrder = (previousOrder + nextOrder) / 2;
    } else if (previousOrder === undefined && nextOrder !== undefined) {
      newOrder = nextOrder - 100;
    } else if (previousOrder !== undefined && nextOrder === undefined) {
      newOrder = previousOrder + 100;
    } else {
      throw new CustomError('Invalid reorder context', HttpResCode.BAD_REQUEST);
    }

    if (newOrder === previousOrder || newOrder === nextOrder) {
      const surrounding = await this.imageRepository.findSurroundingImages(userId, previousOrder, nextOrder);
      let baseOrder = 1000;
      const spacing = 100;

      for (const img of surrounding) {
        await this.imageRepository.updateImage(img._id.toString(), { order: baseOrder });
        baseOrder += spacing;
      }

      // Retry calculation
      if (previousOrder !== undefined && nextOrder !== undefined) {
        newOrder = (previousOrder + nextOrder) / 2;
      } else if (previousOrder === undefined && nextOrder !== undefined) {
        newOrder = nextOrder - 100;
      } else if (previousOrder !== undefined && nextOrder === undefined) {
        newOrder = previousOrder + 100;
      }
    }

    const updated = await this.imageRepository.updateImage(imageId, { order: newOrder });
    if (!updated) {
      throw new CustomError('Image not found', HttpResCode.NOT_FOUND);
    }
  }
}
