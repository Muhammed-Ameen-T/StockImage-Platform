import { injectable, inject } from 'inversify';
import { IChangePasswordUseCase } from '../../domain/interfaces/useCases/changePassword.interface';
import { IUserRepository } from '../../domain/interfaces/repositories/user.repository';
import { TYPES } from '../../core/types';
import { comparePassword } from '../../utils/helpers/passwordCompare.util';
import { hashPassword } from '../../utils/helpers/passwordHash.util';
import { CustomError } from '../../utils/errors/custom.error';
import { ErrorMsg } from '../../utils/constants/commonErrorMsg.constants';
import { HttpResCode } from '../../utils/constants/httpResponseCode.utils';
import { ChangePasswordDTO } from '../dtos/auth.dto';

/**
 * Use case for changing a user's password.
 */
@injectable()
export class ChangePasswordUseCase implements IChangePasswordUseCase {
  constructor(
    @inject(TYPES.UserRepository) private userRepository: IUserRepository
  ) {}

  /**
   * Executes the password change process.
   * Validates old password and updates to new hashed password.
   *
   * @param userId - ID of the user requesting password change
   * @param oldPassword - Current password for verification
   * @param newPassword - New password to be set
   * @throws {CustomError} If user not found or old password mismatch
   */
  async execute(dto: ChangePasswordDTO): Promise<void> {
    const user = await this.userRepository.findById(dto.userId);
    if (!user || !user._id) {
      throw new CustomError(ErrorMsg.USER_NOT_FOUND, HttpResCode.UNAUTHORIZED);
    }

    const isMatch = await comparePassword(dto.oldPassword, user.password);
    if (!isMatch) {
      throw new CustomError(ErrorMsg.PASSWORD_MISMATCH, HttpResCode.UNAUTHORIZED);
    }

    const hashed = await hashPassword(dto.newPassword);
    await this.userRepository.updatePassword(dto.userId, hashed);
  }
}
