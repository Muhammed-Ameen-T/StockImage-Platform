import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'inversify';
import { IDeleteImageUseCase } from '../../domain/interfaces/useCases/deleteImage.interface';
import { TYPES } from '../../core/types';
import { sendResponse } from '../../utils/response/sendResponse.utils';
import { HttpResCode, HttpResMsg } from '../../utils/constants/httpResponseCode.utils';
import { SuccessMsg } from '../../utils/constants/commonSuccessMsg.constants';
import { IBulkUploadImagesUseCase } from '../../domain/interfaces/useCases/bulkImageUpload.interface';
import { IImageController } from '../../domain/interfaces/controllers/imageMng.controller.interface';
import { IFindUserImagesUseCase } from '../../domain/interfaces/useCases/findUserImages.interface';
import { CustomError } from '../../utils/errors/custom.error';
import { IEditImageUseCase } from '../../domain/interfaces/useCases/editImage.interface';
import { BulkUploadDTO, ReorderImageDTO } from '../../application/dtos/image.dto';
import { IReorderImageUseCase } from '../../domain/interfaces/useCases/reorderImage.interface';
import { ErrorMsg } from '../../utils/constants/commonErrorMsg.constants';

/**
 * Controller for handling image-related operations such as bulk upload, deletion, and retrieval.
 * @implements {IImageController}
 */
@injectable()
export class ImageController implements IImageController {
  /**
   * Constructs an instance of ImageController with injected use cases.
   * 
   * @param {IBulkUploadImagesUseCase} bulkUploadUseCase - Use case for bulk uploading images.
   * @param {IDeleteImageUseCase} deleteImageUseCase - Use case for deleting a specific image.
   * @param {IFindUserImagesUseCase} findUserImagesUseCase - Use case for retrieving user images with filters.
   */
  constructor(
    @inject(TYPES.BulkUploadImagesUseCase) private bulkUploadUseCase: IBulkUploadImagesUseCase,
    @inject(TYPES.DeleteImageUseCase) private deleteImageUseCase: IDeleteImageUseCase,
    @inject(TYPES.FindUserImagesUseCase) private findUserImagesUseCase: IFindUserImagesUseCase,
    @inject(TYPES.EditImageUseCase) private editImageUseCase: IEditImageUseCase,
    @inject(TYPES.ReorderImageUseCase) private reorderImageUseCase: IReorderImageUseCase,
  ) {}

  /**
   * Handles bulk image upload via file + title.
   *
   * @route POST /images/bulk-upload
   * @param {Request} req - Contains `files` from Multer and `titles[]` in body.
   */
   async bulkUpload(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.decoded?.userId
      if (!userId) {
        throw new CustomError(HttpResMsg.UNAUTHORIZED, HttpResCode.UNAUTHORIZED)
      }

      const files = (req.files as { [fieldname: string]: Express.Multer.File[] })?.["files"] || []

      const normalize = (field: any) =>
        Array.isArray(field) ? field : field !== undefined ? [field] : []

      const titles = normalize(req.body.titles)
      const originalFileNames = normalize(req.body.originalFileNames)
      const mimeTypes = normalize(req.body.mimeTypes)
      const fileSizes = normalize(req.body.fileSizes).map(Number)

      if (
        titles.length !== files.length ||
        originalFileNames.length !== files.length ||
        mimeTypes.length !== files.length ||
        fileSizes.length !== files.length
      ) {
        throw new CustomError(ErrorMsg.INVALID_FILE_ARRAY, HttpResCode.BAD_REQUEST)
      }

      const dto = new BulkUploadDTO(
        userId,
        files,
        titles,
        originalFileNames,
        mimeTypes,
        fileSizes
      )

      await this.bulkUploadUseCase.execute(dto)

      sendResponse(res, HttpResCode.OK, SuccessMsg.IMAGES_UPLOADED)
    } catch (error) {
      next(error)
    }
  }

  /**
   * Handles image deletion.
   * 
   * @route DELETE /delete/:imageId
   * @param {Request} req - Express request object containing `imageId` in the route parameters.
   * @param {Response} res - Express response object used to send success response.
   * @param {NextFunction} next - Express next middleware function for error handling.
   * @returns {Promise<void>} Resolves when deletion is complete.
   */
  async deleteImage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      await this.deleteImageUseCase.execute(id);
      sendResponse(res, HttpResCode.OK, SuccessMsg.IMAGE_DELETED);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Retrieves user-uploaded images with optional filtering, sorting, and pagination.
   * 
   * @route GET /images/user
   * @param {Request} req - Express request object containing query params: `page`, `limit`, `search`, `sortBy`, `sortOrder`.
   *                        Also expects `userId` from decoded token (`req.decoded.userId`).
   * @param {Response} res - Express response object used to send retrieved images.
   * @param {NextFunction} next - Express next middleware function for error handling.
   * @returns {Promise<void>} Resolves with paginated image data.
   * @throws {CustomError} If `userId` is missing or unauthorized.
   */
  async findUserImages(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const { page, limit, search, sortBy, sortOrder } = req.query;
        const userId = req.decoded?.userId;
        if (!userId) {
          throw new CustomError(HttpResMsg.UNAUTHORIZED, HttpResCode.UNAUTHORIZED);
        } 

        const result = await this.findUserImagesUseCase.execute({
          userId,
          page: Number(page),
          limit: Number(limit),
          search: String(search),
          sortBy: String(sortBy),
          sortOrder: sortOrder === 'asc' ? 'asc' : 'desc',
        });

        sendResponse(res, HttpResCode.OK, SuccessMsg.IMAGES_FETCHED, result);
    } catch (error) {
        next(error);
    }
  }

  /**
   * Handles editing metadata of a single image.
   *
   * @route PATCH /images/edit/:imageId
   * @param {Request} req - Express request object containing `imageId` in params and update fields in body.
   * @param {Response} res - Express response object used to send success response.
   * @param {NextFunction} next - Express next middleware function for error handling.
   * @returns {Promise<void>} Resolves when image is successfully updated.
   */
  async editImage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params
      const userId = req.decoded?.userId
      if (!userId) {
        throw new CustomError(HttpResMsg.UNAUTHORIZED, HttpResCode.UNAUTHORIZED)
      }

      const file = req.file 
      console.log("🚀 ~ ImageController ~ editImage ~ file:", file)
      const title = req.body.title

      const originalFileName = req.body.originalFileName
      console.log("🚀 ~ ImageController ~ editImage ~ originalFileName:", originalFileName)
      const mimeType = req.body.mimeType
      console.log("🚀 ~ ImageController ~ editImage ~ mimeType:", mimeType)
      const fileSize = req.body.fileSize ? Number(req.body.fileSize) : undefined
      console.log("🚀 ~ ImageController ~ editImage ~ fileSize:", fileSize)

      await this.editImageUseCase.execute(id, {
        title,
        file,
        originalFileName,
        mimeType,
        fileSize,
      })

      sendResponse(res, HttpResCode.OK, SuccessMsg.IMAGE_UPDATED)
    } catch (error) {
      next(error)
    }
  }


  /**
   * Handles reordering of an image based on drag-and-drop position.
   *
   * @route PATCH /images/reorder
   * @param {Request} req - Express request object containing imageId, previousOrder, nextOrder.
   * @param {Response} res - Express response object used to send success response.
   * @param {NextFunction} next - Express next middleware function for error handling.
   * @returns {Promise<void>} Resolves when image order is updated.
   */
  async reorderImage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.decoded?.userId;
      if (!userId) {
        throw new CustomError(HttpResMsg.UNAUTHORIZED, HttpResCode.UNAUTHORIZED);
      }

      const { imageId, previousOrder, nextOrder } = req.body;
      const dto = new ReorderImageDTO(imageId, userId, previousOrder, nextOrder);

      await this.reorderImageUseCase.execute(dto);
      sendResponse(res, HttpResCode.OK, SuccessMsg.IMAGE_REORDERED);
    } catch (error) {
      next(error);
    }
  }
}