import { injectable, inject } from "inversify"
import { IImageRepository } from "../../domain/interfaces/repositories/image.repository"
import { IFindUserImagesUseCase } from "../../domain/interfaces/useCases/findUserImages.interface"
import { TYPES } from "../../core/types"
import { CustomError } from "../../utils/errors/custom.error"
import { HttpResCode } from "../../utils/constants/httpResponseCode.utils"
import { IImage } from "../../domain/interfaces/model/image.interface"

/**
 * Use case for retrieving images associated with a specific user.
 */
@injectable()
export class FindUserImagesUseCase implements IFindUserImagesUseCase {
  /**
   * @param imageRepository - Repository for accessing image data
   */
  constructor(@inject(TYPES.ImageRepository) private imageRepository: IImageRepository) {}

  /**
   * Executes the use case to find user images.
   * @param params - Parameters for filtering and pagination
   * @param params.userId - ID of the user whose images are to be retrieved
   * @param [params.skip] - Number of records to skip
   * @param [params.limit] - Maximum number of records to return
   * @param [params.search] - Search keyword for filtering images
   * @param [params.sortBy] - Field to sort by
   * @param [params.sortOrder] - Sort order: 'asc' or 'desc'
   * @returns A promise resolving to an object containing images and total count
   * @throws CustomError if retrieval fails
   */
  async execute(params: {
    userId: string
    skip?: number
    limit?: number
    search?: string
    sortBy?: string
    sortOrder?: "asc" | "desc"
  }): Promise<{ images: IImage[]; total: number }> {
    try {
      return await this.imageRepository.findUserImages(params)
    } catch (error) {
      console.error("❌ Error fetching user images:", error)
      throw new CustomError("Failed to retrieve images", HttpResCode.INTERNAL_SERVER_ERROR)
    }
  }
}