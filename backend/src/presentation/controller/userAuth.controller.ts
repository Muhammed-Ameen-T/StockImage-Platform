// src/presentation/controllers/userAuth.controller.ts
import 'reflect-metadata';
import { NextFunction, Request, Response } from 'express';
import { injectable, inject } from 'inversify';
import { IUserAuthController } from '../../domain/interfaces/controllers/userAuth.controller.interface';
import { ISendOtpUseCase } from '../../domain/interfaces/useCases/sentOtpUser.interface';
import { ILoginUserUseCase } from '../../domain/interfaces/useCases/loginUser.interface';
import { IVerifyOtpUseCase } from '../../domain/interfaces/useCases/verifyOtpUser.interface';
import { HttpResCode, HttpResMsg } from '../../utils/constants/httpResponseCode.utils';
import { sendResponse } from '../../utils/response/sendResponse.utils';
import { TYPES } from '../../core/types';
import { SuccessMsg } from '../../utils/constants/commonSuccessMsg.constants';
import { ChangePasswordDTO, LoginDTO, VerifyOtpDTO } from '../../application/dtos/auth.dto';
import { env } from '../../config/env.config';
import { CustomError } from '../../utils/errors/custom.error';
import { IChangePasswordUseCase } from '../../domain/interfaces/useCases/changePassword.interface';


/**
 * Controller for handling user authentication, including OTP-based registration, login,
 * Google authentication, token refreshing, and password reset functionalities.
 * @implements {IUserAuthController}
 */
@injectable()
export class UserAuthController implements IUserAuthController {
  /**
   * Constructs an instance of UserAuthController.
   * @param {ISendOtpUseCase} sendOtpUseCase - Use case for sending OTP to a user's email.
   * @param {IVerifyOtpUseCase} verifyOtpUseCase - Use case for verifying OTP and registering/logging in a user.
   * @param {ILoginUserUseCase} loginUserUseCase - Use case for user login.
   */
  constructor(
    @inject(TYPES.SendOtpUseCase) private sendOtpUseCase: ISendOtpUseCase,
    @inject(TYPES.VerifyOtpUseCase) private verifyOtpUseCase: IVerifyOtpUseCase,
    @inject(TYPES.UserLoginUseCase) private loginUserUseCase: ILoginUserUseCase,
    @inject(TYPES.ChangePasswordUseCase) private changePasswordUseCase: IChangePasswordUseCase,
  ) {}

  /**
   * Sends an OTP to the provided email address for user registration or verification.
   * @param {Request} req - The Express request object, containing `email` in the body.
   * @param {Response} res - The Express response object.
   * @param {NextFunction} next - The Express next middleware function.
   * @returns {Promise<void>}
   */
  async sendOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email } = req.body;

      await this.sendOtpUseCase.execute(email.trim());

      sendResponse(res, HttpResCode.OK, SuccessMsg.OTP_SENT);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Verifies the OTP and completes user registration or login, setting a refresh token cookie.
   * @param {Request} req - The Express request object, containing `name`, `email`, `password`, and `otp` in the body.
   * @param {Response} res - The Express response object.
   * @param {NextFunction} next - The Express next middleware function.
   * @returns {Promise<void>}
   */
  async verifyOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name, email, phoneNumber, password, otp } = req.body;

      const dto = new VerifyOtpDTO(name, email, phoneNumber, otp, password);
      const result = await this.verifyOtpUseCase.execute(dto);
      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: parseInt(env.MAX_AGE , 10),
      });
      sendResponse(res, HttpResCode.OK, SuccessMsg.USER_REGISTERED, {
        accessToken: result.accessToken,
        user: result.user,
      });
    } catch (error) {
      next(error);
    }
  }
  

  /**
   * Handles user login, authenticates credentials, and sets a refresh token cookie.
   * @param {Request} req - The Express request object, containing `email` and `password` in the body.
   * @param {Response} res - The Express response object.
   * @param {NextFunction} next - The Express next middleware function.
   * @returns {Promise<void>}
   */
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;

      const dto = new LoginDTO(email, password);
      const response = await this.loginUserUseCase.execute(dto);

      res.cookie('refreshToken', response.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: parseInt(process.env.MAX_AGE || '0', 10),
      });

      sendResponse(res, HttpResCode.OK, SuccessMsg.USER_LOGGED_IN, {
        accessToken: response.accessToken,
        user: response.user,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Handles password change for authenticated users.
   *
   * @route PATCH /auth/change-password
   * @param {Request} req - Express request object containing `decoded.userId` and password fields in body.
   * @param {Response} res - Express response object used to send success response.
   * @param {NextFunction} next - Express next middleware function for error handling.
   * @returns {Promise<void>} Resolves when password is successfully changed.
   */
  async changePassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.decoded?.userId;
      if (!userId) {
        throw new CustomError(HttpResMsg.UNAUTHORIZED, HttpResCode.UNAUTHORIZED);
      }
      
      const { oldPassword, newPassword } = req.body;
      const dto = new ChangePasswordDTO(userId, oldPassword, newPassword);
      await this.changePasswordUseCase.execute(dto);
      sendResponse(res, HttpResCode.OK, SuccessMsg.PASSWORD_CHANGED);
    } catch (error) {
      next(error);
    }
  }


  /**
   * Logs out the user by clearing the refresh token cookie.
   * @param {Request} req - The Express request object.
   * @param {Response} res - The Express response object.
   * @param {NextFunction} next - The Express next middleware function.
   * @returns {Promise<void>}
   */
  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      res.clearCookie('refreshToken');
      sendResponse(res, HttpResCode.OK, SuccessMsg.USER_LOGGED_OUT);
    } catch (error) {
      next(error);
    }
  }
}
