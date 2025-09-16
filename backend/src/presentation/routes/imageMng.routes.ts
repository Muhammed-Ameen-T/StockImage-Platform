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
  ReorderImageSchema,
} from '../validation/imageMng.validation';
import { verifyAccessToken } from '../middlewares/verifyToken.middleware';
import { imageUpload, singleImageEditUpload, upload } from '../middlewares/multerUpload.middleware';

const imageController = container.get<IImageController>(TYPES.ImageMngController);

const router = Router();

router.post(
  '/bulk-upload',
  verifyAccessToken,
  imageUpload,
  // validateRequest(BulkUploadSchema),
  (req, res, next) => imageController.bulkUpload(req, res, next)
);

router.delete(
  '/delete/:id',
  verifyAccessToken,
  // validateRequest(DeleteImageSchema),
  (req, res, next) => imageController.deleteImage(req, res, next)
);

router.get(
  '/user',
  verifyAccessToken,
  (req, res, next) => imageController.findUserImages(req, res, next)
);
  
router.patch(
  '/edit/:id',
  verifyAccessToken,
  upload.single("file"),
  // validateRequest(EditImageSchema),
  (req, res, next) => imageController.editImage(req, res, next)
);

router.patch(
  '/reorder',
  verifyAccessToken,
  validateRequest(ReorderImageSchema),
  (req, res, next) => imageController.reorderImage(req, res, next)
);

export default router;