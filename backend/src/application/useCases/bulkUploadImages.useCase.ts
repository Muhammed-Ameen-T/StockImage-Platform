import { injectable, inject } from "inversify"
import { IBulkUploadImagesUseCase } from "../../domain/interfaces/useCases/bulkImageUpload.interface"
import { IImageRepository } from "../../domain/interfaces/repositories/image.repository"
import { TYPES } from "../../core/types"
import { CloudinaryService } from "../../infrastructure/services/cloudinary.service"
import { Types } from "mongoose"
import { BulkUploadDTO } from "../dtos/image.dto"
import { ErrorMsg } from "../../utils/constants/commonErrorMsg.constants"
import { CustomError } from "../../utils/errors/custom.error"
import { HttpResCode } from "../../utils/constants/httpResponseCode.utils"

@injectable()
export class BulkUploadImagesUseCase implements IBulkUploadImagesUseCase {
  constructor(
    @inject(TYPES.ImageRepository) private imageRepository: IImageRepository,
    @inject(TYPES.CloudinaryService) private cloudinaryService: CloudinaryService
  ) {}

  /**
   * Uploads multiple image files to Cloudinary and stores metadata in DB.
   * @param dto - BulkUploadDTO containing userId, files, and metadata
   */
  async execute(dto: BulkUploadDTO): Promise<void> {
    const { userId, files, titles, originalFileNames, mimeTypes, fileSizes } = dto

    if (
      files.length !== titles.length ||
      files.length !== originalFileNames.length ||
      files.length !== mimeTypes.length ||
      files.length !== fileSizes.length
    ) {
      throw new CustomError(ErrorMsg.INVALID_FILE_ARRAY, HttpResCode.BAD_REQUEST)
    }

    try {
      const highestOrder = await this.imageRepository.findMaxOrder(userId)
      const formatted = []

      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const title = titles[i]
        const originalFileName = originalFileNames[i]
        const mimeType = mimeTypes[i]
        const fileSize = fileSizes[i]

        const url = await this.cloudinaryService.uploadImage(file.path)

        formatted.push({
          userId: new Types.ObjectId(userId),
          title,
          originalFileName,
          mimeType,
          fileSize,
          url,
          order:  highestOrder + (i + 1) * 1000,
        })
      }

      await this.imageRepository.addMany(formatted)
    } catch (error: any) {
      throw new CustomError(
        error?.message || ErrorMsg.UPLOAD_FAILED,
        HttpResCode.INTERNAL_SERVER_ERROR
      )
    }
  }
}