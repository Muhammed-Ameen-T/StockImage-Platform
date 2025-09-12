import { Container } from "inversify"
import { ImageRepository } from "../infrastructure/repositories/image.repository"
import { IImageRepository } from "../domain/interfaces/repositories/image.repository"
import { UserRepository } from "../infrastructure/repositories/user.repository"
import { IUserRepository } from "../domain/interfaces/repositories/user.repository"
import { JwtService } from "../infrastructure/services/jwt.service"
import { LoginUserUseCase } from "../application/useCases/loginUser.useCase"
import { ILoginUserUseCase } from "../domain/interfaces/useCases/loginUser.interface"
import { RedisService } from "../infrastructure/services/redis.service"
import { SendOtpUseCase } from "../application/useCases/sendOtpUser.useCase"
import { ISendOtpUseCase } from "../domain/interfaces/useCases/sentOtpUser.interface"
import { IVerifyOtpUseCase } from "../domain/interfaces/useCases/verifyOtpUser.interface"
import { VerifyOtpUseCase } from "../application/useCases/verifyOtpUser.useCase"
import { IUserAuthController } from "../domain/interfaces/controllers/userAuth.controller.interface"
import { TYPES } from "./types"
import { UserAuthController } from "../presentation/controller/userAuth.controller"
import { IBulkUploadImagesUseCase } from "../domain/interfaces/useCases/bulkImageUpload.interface"
import { IDeleteImageUseCase } from "../domain/interfaces/useCases/deleteImage.interface"
import { BulkUploadImagesUseCase } from "../application/useCases/bulkUploadImages.useCase"
import { DeleteImageUseCase } from "../application/useCases/deleteImage.useCase"
import { IImageController } from "../domain/interfaces/controllers/imageMng.controller.interface"
import { ImageController } from "../presentation/controller/imageMng.controller"
import { IFindUserImagesUseCase } from "../domain/interfaces/useCases/findUserImages.interface"
import { FindUserImagesUseCase } from "../application/useCases/findUserImage.useCase"
import { EditImageUseCase } from "../application/useCases/editImage.useCase"
import { IEditImageUseCase } from "../domain/interfaces/useCases/editImage.interface"
import { ChangePasswordUseCase } from "../application/useCases/changePassword.useCase"
import { IChangePasswordUseCase } from "../domain/interfaces/useCases/changePassword.interface"

const container = new Container()

// Repositories
container.bind<IUserRepository>(TYPES.UserRepository).to(UserRepository);
container.bind<IImageRepository>(TYPES.ImageRepository).to(ImageRepository);

// Services
container.bind<JwtService>(TYPES.JwtService).to(JwtService);
container.bind<RedisService>(TYPES.RedisService).to(RedisService);

// UseCases
container.bind<ILoginUserUseCase>(TYPES.UserLoginUseCase).to(LoginUserUseCase);
container.bind<ISendOtpUseCase>(TYPES.SendOtpUseCase).to(SendOtpUseCase);
container.bind<IVerifyOtpUseCase>(TYPES.VerifyOtpUseCase).to(VerifyOtpUseCase);
container.bind<IBulkUploadImagesUseCase>(TYPES.BulkUploadImagesUseCase).to(BulkUploadImagesUseCase);
container.bind<IDeleteImageUseCase>(TYPES.DeleteImageUseCase).to(DeleteImageUseCase);
container.bind<IFindUserImagesUseCase>(TYPES.FindUserImagesUseCase).to(FindUserImagesUseCase);
container.bind<IEditImageUseCase>(TYPES.EditImageUseCase).to(EditImageUseCase);
container.bind<IChangePasswordUseCase>(TYPES.ChangePasswordUseCase).to(ChangePasswordUseCase);

// Controllers
container.bind<IUserAuthController>(TYPES.UserAuthController).to(UserAuthController);
container.bind<IImageController>(TYPES.ImageMngController).to(ImageController);

export { container }