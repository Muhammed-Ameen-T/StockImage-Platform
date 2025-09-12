import { comparePassword } from '../../utils/helpers/passwordCompare.util';
import { ErrorMsg } from '../../utils/constants/commonErrorMsg.constants';
import { HttpResCode } from '../../utils/constants/httpResponseCode.utils';
import { CustomError } from '../../utils/errors/custom.error';
import { JwtService } from '../../infrastructure/services/jwt.service';
import { ILoginUserUseCase } from '../../domain/interfaces/useCases/loginUser.interface';
import { AuthResponseDTO, LoginDTO } from '../dtos/auth.dto';
import { injectable, inject } from 'inversify'; 
import { IUserRepository } from '../../domain/interfaces/repositories/user.repository';
import { TYPES } from '../../core/types';

/**
 * Handles the user login process using dependency injection for authentication and database operations.
 */
@injectable()
export class LoginUserUseCase implements ILoginUserUseCase {
  /**
   * Initializes the LoginUserUseCase with injected dependencies.
   *
   * @param {IUserRepository} userRepository - Repository for user data retrieval.
   * @param {JwtService} jwtService - Service for JWT token generation.
   */
   constructor(
    @inject(TYPES.UserRepository) private userRepository: IUserRepository,
    @inject(TYPES.JwtService) private jwtService: JwtService,
  ) {}

  /**
   * Executes the login process.
   * Validates user credentials, checks blocking status, and generates authentication tokens.
   *
   * @param {LoginDTO} dto - Data Transfer Object containing email and password.
   * @returns {Promise<AuthResponseDTO>} Returns access and refresh tokens along with user details.
   * @throws {CustomError} If user is not found, blocked, or password mismatch occurs.
   */
  async execute(dto: LoginDTO): Promise<AuthResponseDTO> {
    const user = await this.userRepository.findByEmail(dto.email);
    if (!user || !user._id) {
      throw new CustomError(ErrorMsg.USER_NOT_FOUND, HttpResCode.UNAUTHORIZED);
    }

    const isMatch = await comparePassword(dto.password, user.password);

    if (!isMatch) {
      throw new CustomError(ErrorMsg.PASSWORD_MISMATCH, HttpResCode.UNAUTHORIZED);
    }

    const accessToken = this.jwtService.generateAccessToken(user._id?.toString());
    const refreshToken = this.jwtService.generateRefreshToken(user._id?.toString());

    return new AuthResponseDTO(accessToken, refreshToken, {
      id: user._id?.toString(),
      email: user.email,
      name: user.name,
      phoneNumber: user.phoneNumber,
    });
  }
}
