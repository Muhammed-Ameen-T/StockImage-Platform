import { injectable, inject } from 'inversify';
import { sendOtp } from '../../infrastructure/services/sendOtp.service';
import { RedisService } from '../../infrastructure/services/redis.service';
import { CustomError } from '../../utils/errors/custom.error';
import { ErrorMsg } from '../../utils/constants/commonErrorMsg.constants';
import { HttpResCode } from '../../utils/constants/httpResponseCode.utils';
import { IUserRepository } from '../../domain/interfaces/repositories/user.repository';
import { generateOtp } from '../../utils/helpers/otp.util';
import { ISendOtpUseCase } from '../../domain/interfaces/useCases/sentOtpUser.interface';
import { TYPES } from '../../core/types';

/**
 * Use case for sending OTP for user authentication.
 * Handles OTP generation, storage in Redis, and email delivery.
 */
@injectable()
export class SendOtpUseCase implements ISendOtpUseCase {
  /**
   * Initializes the SendOtpUseCase with dependencies for user repository, email service, and Redis service.
   *
   * @param {IUserRepository} authRepository - Repository for user management.
   * @param {RedisService} redisService - Service for storing OTP temporarily in Redis.
   */
  constructor(
    @inject(TYPES.UserRepository) private authRepository: IUserRepository,
    @inject(TYPES.RedisService) private redisService: RedisService,
  ) {}

  /**
   * Executes the OTP sending process.
   * Checks if a user already exists, generates an OTP, stores it in Redis, and sends it via email.
   *
   * @param {string} email - The user's email address to receive the OTP.
   * @returns {Promise<void>} Resolves once the OTP is successfully stored and emailed.
   * @throws {CustomError} If the user already exists, Redis fails, or the email service encounters an error.
   */
  async execute(email: string): Promise<void> {
    let user = await this.authRepository.findByEmail(email);
    if (user) {
      throw new CustomError(ErrorMsg.USER_ALREADY_EXISTS, HttpResCode.BAD_REQUEST);
    }

    const otp = generateOtp(6);
    const otpKey = `otp:${email}`;

    try {
      await this.redisService.set(otpKey, otp, 300);
      console.log('SendOtpUseCase: Stored OTP in Redis:', { otpKey, otp });
    } catch (error) {
      console.error('SendOtpUseCase: Redis error:', error);
      throw new CustomError(
        ErrorMsg.FAILED_STORING_OTP,
        HttpResCode.INTERNAL_SERVER_ERROR,
      );
    }

    try {
      await sendOtp(email, otp);
      console.log('SendOtpUseCase: OTP email sent to:', email);
    } catch (error) {
      console.error('SendOtpUseCase: Email service error:', error);
      throw new CustomError(
        ErrorMsg.FAILED_SENDING_OTP,
        HttpResCode.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
