"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TYPES = void 0;
exports.TYPES = {
    //Repositories
    UserRepository: Symbol.for("UserRepository"),
    ImageRepository: Symbol.for("ImageRepository"),
    //Services
    JwtService: Symbol.for("JwtService"),
    RedisService: Symbol.for("RedisService"),
    CloudinaryService: Symbol.for("CloudinaryService"),
    //Controllers
    UserAuthController: Symbol.for("UserAuthController"),
    ImageMngController: Symbol.for("ImageMngController"),
    //Use Cases
    UserLoginUseCase: Symbol.for("UserLoginUseCase"),
    SendOtpUseCase: Symbol.for("SendOtpUseCase"),
    VerifyOtpUseCase: Symbol.for("VerifyOtpUseCase"),
    BulkUploadImagesUseCase: Symbol.for("BulkUploadImagesUseCase"),
    DeleteImageUseCase: Symbol.for("DeleteImageUseCase"),
    ImageUseCase: Symbol.for("ImageUseCase"),
    FindUserImagesUseCase: Symbol.for("FindUserImagesUseCase"),
    EditImageUseCase: Symbol.for("EditImageUseCase"),
    ChangePasswordUseCase: Symbol.for("ChangePasswordUseCase"),
    ReorderImageUseCase: Symbol.for("ReorderImageUseCase"),
};
