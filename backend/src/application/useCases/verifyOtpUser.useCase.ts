import { injectable, inject } from 'inversify';
import { JwtService } from '../../infrastructure/services/jwt.service';
import { RedisService } from '../../infrastructure/services/redis.service';
import { CustomError } from '../../utils/errors/custom.error';
import { User } from '../../domain/entities/user.entity';
import { hashPassword } from '../../utils/helpers/passwordHash.util';
import { HttpResCode } from '../../utils/constants/httpResponseCode.utils';
import { ErrorMsg } from '../../utils/constants/commonErrorMsg.constants';
import { AuthResponseDTO, VerifyOtpDTO } from '../dtos/auth.dto';
import { IVerifyOtpUseCase } from '../../domain/interfaces/useCases/verifyOtpUser.interface';
import { IUserRepository } from '../../domain/interfaces/repositories/user.repository';
import { TYPES } from '../../core/types';

/**
 * Use case for verifying OTP during user registration.
 * Validates the OTP, creates a new user, and generates authentication tokens.
 */
@injectable()
export class VerifyOtpUseCase implements IVerifyOtpUseCase {
  /**
   * Initializes the VerifyOtpUseCase with dependencies for user repository, JWT service, and Redis service.
   *
   * @param {IUserRepository} userReposiotry - Repository for user management.
   * @param {JwtService} jwtService - Service for JWT handling.
   * @param {RedisService} redisService - Service for storing and retrieving OTPs.
   */
  constructor(
    @inject(TYPES.UserRepository) private userReposiotry: IUserRepository,
    @inject(TYPES.JwtService) private jwtService: JwtService,
    @inject(TYPES.RedisService) private redisService: RedisService,
  ) {}

  /**
   * Executes the OTP verification process.
   * Checks if the stored OTP matches the provided OTP, registers the user, and generates authentication tokens.
   *
   * @param {VerifyOtpDTO} dto - DTO containing user details and OTP for verification.
   * @returns {Promise<AuthResponseDTO>} Returns authentication tokens and user details if OTP validation succeeds.
   * @throws {CustomError} If OTP is invalid or user creation fails.
   */
  async execute(dto: VerifyOtpDTO): Promise<AuthResponseDTO> {
    console.log(dto);
    const storedOtp = await this.redisService.get(`otp:${dto.email}`);

    console.log('storedOtp:', storedOtp);

    if (!storedOtp || storedOtp != dto.otp) {
      throw new CustomError(ErrorMsg.INVALID_OTP, HttpResCode.BAD_REQUEST);
    }

    await this.redisService.del(`otp:${dto.email}`);

    const hashedPassword = await hashPassword(dto.password);

    let user = new User(
      null,
      dto.name,
      dto.email,
      dto.phoneNumber,
      hashedPassword,
      new Date(),
      new Date(),
    );

    await this.userReposiotry.create(user);
    const createdUser = await this.userReposiotry.findByEmail(user.email.toLocaleLowerCase());
    console.log('newcreatedUser:', createdUser);
    if (!createdUser || !createdUser._id) {
      throw new CustomError(ErrorMsg.USER_NOT_FOUND, HttpResCode.INTERNAL_SERVER_ERROR);
    }

    const accessToken = this.jwtService.generateAccessToken(createdUser._id?.toString());
    const refreshToken = this.jwtService.generateRefreshToken(createdUser._id?.toString());

    return new AuthResponseDTO(accessToken, refreshToken, {
      id: createdUser._id?.toString(),
      email: createdUser.email,
      name: createdUser.name,
      phoneNumber: createdUser.phoneNumber,
    });
  }
}
