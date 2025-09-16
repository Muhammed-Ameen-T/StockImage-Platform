import { injectable, inject } from 'inversify'
import { IEditImageUseCase } from '../../domain/interfaces/useCases/editImage.interface'
import { IImageRepository } from '../../domain/interfaces/repositories/image.repository'
import { TYPES } from '../../core/types'
import { CustomError } from '../../utils/errors/custom.error'
import { HttpResCode } from '../../utils/constants/httpResponseCode.utils'
import { CloudinaryService } from '../../infrastructure/services/cloudinary.service'

@injectable()
export class EditImageUseCase implements IEditImageUseCase {
  constructor(
    @inject(TYPES.ImageRepository) private imageRepository: IImageRepository,
    @inject(TYPES.CloudinaryService) private cloudinaryService: CloudinaryService
  ) {}

  /**
   * Executes the image update operation.
   * @param imageId - ID of the image to update
   * @param updates - Fields to update (title required, optional file + metadata)
   * @throws {CustomError} If image is not found
   */
  async execute(imageId: string, updates: {
    title: string
    file?: Express.Multer.File
    originalFileName?: string
    mimeType?: string
    fileSize?: number
  }): Promise<void> {
    const { title, file, originalFileName, mimeType, fileSize } = updates

    const updatePayload: Record<string, any> = { title }

    if (file) {
      const url = await this.cloudinaryService.uploadImage(file.path)
      updatePayload.url = url
      updatePayload.originalFileName = originalFileName
      updatePayload.mimeType = mimeType
      updatePayload.fileSize = fileSize
    }

    const updated = await this.imageRepository.updateImage(imageId, updatePayload)

    if (!updated) {
      throw new CustomError('Image not found', HttpResCode.NOT_FOUND)
    }
  }
}
