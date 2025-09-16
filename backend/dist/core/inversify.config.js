"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.container = void 0;
const inversify_1 = require("inversify");
const image_repository_1 = require("../infrastructure/repositories/image.repository");
const user_repository_1 = require("../infrastructure/repositories/user.repository");
const jwt_service_1 = require("../infrastructure/services/jwt.service");
const loginUser_useCase_1 = require("../application/useCases/loginUser.useCase");
const redis_service_1 = require("../infrastructure/services/redis.service");
const sendOtpUser_useCase_1 = require("../application/useCases/sendOtpUser.useCase");
const verifyOtpUser_useCase_1 = require("../application/useCases/verifyOtpUser.useCase");
const types_1 = require("./types");
const userAuth_controller_1 = require("../presentation/controller/userAuth.controller");
const bulkUploadImages_useCase_1 = require("../application/useCases/bulkUploadImages.useCase");
const deleteImage_useCase_1 = require("../application/useCases/deleteImage.useCase");
const imageMng_controller_1 = require("../presentation/controller/imageMng.controller");
const findUserImage_useCase_1 = require("../application/useCases/findUserImage.useCase");
const editImage_useCase_1 = require("../application/useCases/editImage.useCase");
const changePassword_useCase_1 = require("../application/useCases/changePassword.useCase");
const reorderImage_useCase_1 = require("../application/useCases/reorderImage.useCase");
const cloudinary_service_1 = require("../infrastructure/services/cloudinary.service");
const container = new inversify_1.Container();
exports.container = container;
// Repositories
container.bind(types_1.TYPES.UserRepository).to(user_repository_1.UserRepository);
container.bind(types_1.TYPES.ImageRepository).to(image_repository_1.ImageRepository);
// Services
container.bind(types_1.TYPES.JwtService).to(jwt_service_1.JwtService);
container.bind(types_1.TYPES.RedisService).to(redis_service_1.RedisService);
container.bind(types_1.TYPES.CloudinaryService).to(cloudinary_service_1.CloudinaryService);
// UseCases
container.bind(types_1.TYPES.UserLoginUseCase).to(loginUser_useCase_1.LoginUserUseCase);
container.bind(types_1.TYPES.SendOtpUseCase).to(sendOtpUser_useCase_1.SendOtpUseCase);
container.bind(types_1.TYPES.VerifyOtpUseCase).to(verifyOtpUser_useCase_1.VerifyOtpUseCase);
container.bind(types_1.TYPES.BulkUploadImagesUseCase).to(bulkUploadImages_useCase_1.BulkUploadImagesUseCase);
container.bind(types_1.TYPES.DeleteImageUseCase).to(deleteImage_useCase_1.DeleteImageUseCase);
container.bind(types_1.TYPES.FindUserImagesUseCase).to(findUserImage_useCase_1.FindUserImagesUseCase);
container.bind(types_1.TYPES.EditImageUseCase).to(editImage_useCase_1.EditImageUseCase);
container.bind(types_1.TYPES.ChangePasswordUseCase).to(changePassword_useCase_1.ChangePasswordUseCase);
container.bind(types_1.TYPES.ReorderImageUseCase).to(reorderImage_useCase_1.ReorderImageUseCase);
// Controllers
container.bind(types_1.TYPES.UserAuthController).to(userAuth_controller_1.UserAuthController);
container.bind(types_1.TYPES.ImageMngController).to(imageMng_controller_1.ImageController);
