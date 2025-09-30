import { injectable, inject } from 'inversify'
import { IImageRepository } from '../../domain/interfaces/repositories/image.repository'
import { TYPES } from '../../core/types'
import { CustomError } from '../../utils/errors/custom.error'
import { HttpResCode } from '../../utils/constants/httpResponseCode.utils'
import { IReorderImageUseCase } from '../../domain/interfaces/useCases/reorderImage.interface'
import { ReorderImageDTO } from '../dtos/image.dto'
import { ErrorMsg } from '../../utils/constants/commonErrorMsg.constants'

/**
 * Use case for reordering an image within a user's image collection.
 */
@injectable()
export class ReorderImageUseCase implements IReorderImageUseCase {
  /**
   * @param imageRepository - Repository for accessing and updating image data
   */
  constructor(
    @inject(TYPES.ImageRepository) private imageRepository: IImageRepository
  ) {}

  /**
   * Executes the reordering logic for a given image.
   * @param dto - Data transfer object containing image reordering details
   * @param dto.imageId - ID of the image to reorder
   * @param dto.previousOrder - Order value of the previous image
   * @param dto.nextOrder - Order value of the next image
   * @param dto.userId - ID of the user who owns the image
   * @throws CustomError if context is invalid or image update fails
   */
  async execute(dto: ReorderImageDTO): Promise<void> {
    const { imageId, previousOrder, nextOrder, userId } = dto
    let newOrder: number

    if (previousOrder !== undefined && nextOrder !== undefined) {
      newOrder = (previousOrder + nextOrder) / 2
    } else if (previousOrder === undefined && nextOrder !== undefined) {
      let nearestPrev = await this.imageRepository.findNearestOrderByDirection(userId, nextOrder, 'next')
      if (nearestPrev ) {
        newOrder = (nextOrder + nearestPrev) / 2
      }else{
        newOrder = nextOrder + 100
      }
    } else if (previousOrder !== undefined && nextOrder === undefined) {
      let nearestNext = await this.imageRepository.findNearestOrderByDirection(userId, previousOrder, 'prev')
      if (nearestNext ) {
        newOrder = (previousOrder + nearestNext) / 2
      }else{
        newOrder = previousOrder - 100
      }
    } else {
      throw new CustomError(ErrorMsg.INVALID_ERROR_CONTEXT, HttpResCode.BAD_REQUEST)
    }

    if (newOrder === previousOrder || newOrder === nextOrder) {
      const surrounding = await this.imageRepository.findSurroundingImages(userId, previousOrder, nextOrder)
      let baseOrder = 1000
      const spacing = 100

      for (const img of surrounding) {
        await this.imageRepository.updateImage(img._id.toString(), { order: baseOrder })
        baseOrder += spacing
      }

      if (previousOrder !== undefined && nextOrder !== undefined) {
        newOrder = (previousOrder + nextOrder) / 2
      } else if (previousOrder === undefined && nextOrder !== undefined) {
        newOrder = nextOrder - 100
      } else if (previousOrder !== undefined && nextOrder === undefined) {
        newOrder = previousOrder + 100
      }
    }

    console.log(`✅ Updating image ${imageId} to new order: ${newOrder}`)

    const updated = await this.imageRepository.updateImage(imageId, { order: newOrder })
    if (!updated) {
      throw new CustomError(ErrorMsg.IMAGE_NOT_FOUND, HttpResCode.NOT_FOUND)
    }
  }
}