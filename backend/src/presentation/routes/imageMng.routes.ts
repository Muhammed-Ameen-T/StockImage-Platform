import { Router } from 'express';
import { container } from '../../core/inversify.config';
import { IImageController } from '../../domain/interfaces/controllers/imageMng.controller.interface';
import { TYPES } from '../../core/types';
import { validateRequest } from '../middlewares/validate.middleware';
import {
  BulkUploadSchema,
  DeleteImageSchema,
  EditImageSchema,
  FindUserImagesSchema,
} from '../validation/imageMng.validation';
import { verifyAccessToken } from '../middlewares/verifyToken.middleware';

const imageController = container.get<IImageController>(TYPES.ImageMngController);

const router = Router();

router.post(
  '/bulk-upload',
  validateRequest(BulkUploadSchema),
  (req, res, next) => imageController.bulkUpload(req, res, next)
);

router.delete(
  '/delete/:imageId',
  validateRequest(DeleteImageSchema),
  (req, res, next) => imageController.deleteImage(req, res, next)
);

router.get(
  '/user',
  verifyAccessToken,
  validateRequest(FindUserImagesSchema),
  (req, res, next) => imageController.findUserImages(req, res, next)
);
  
router.get(
  '/edit/:imageId',
  verifyAccessToken,
  validateRequest(EditImageSchema),
  (req, res, next) => imageController.editImage(req, res, next)
);

export default router;