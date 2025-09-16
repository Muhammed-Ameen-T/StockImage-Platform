"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const inversify_config_1 = require("../../core/inversify.config");
const types_1 = require("../../core/types");
const validate_middleware_1 = require("../middlewares/validate.middleware");
const imageMng_validation_1 = require("../validation/imageMng.validation");
const verifyToken_middleware_1 = require("../middlewares/verifyToken.middleware");
const multerUpload_middleware_1 = require("../middlewares/multerUpload.middleware");
const imageController = inversify_config_1.container.get(types_1.TYPES.ImageMngController);
const router = (0, express_1.Router)();
router.post('/bulk-upload', verifyToken_middleware_1.verifyAccessToken, multerUpload_middleware_1.imageUpload, 
// validateRequest(BulkUploadSchema),
(req, res, next) => imageController.bulkUpload(req, res, next));
router.delete('/delete/:id', verifyToken_middleware_1.verifyAccessToken, 
// validateRequest(DeleteImageSchema),
(req, res, next) => imageController.deleteImage(req, res, next));
router.get('/user', verifyToken_middleware_1.verifyAccessToken, (req, res, next) => imageController.findUserImages(req, res, next));
router.patch('/edit/:id', verifyToken_middleware_1.verifyAccessToken, multerUpload_middleware_1.upload.single("file"), 
// validateRequest(EditImageSchema),
(req, res, next) => imageController.editImage(req, res, next));
router.patch('/reorder', verifyToken_middleware_1.verifyAccessToken, (0, validate_middleware_1.validateRequest)(imageMng_validation_1.ReorderImageSchema), (req, res, next) => imageController.reorderImage(req, res, next));
exports.default = router;
