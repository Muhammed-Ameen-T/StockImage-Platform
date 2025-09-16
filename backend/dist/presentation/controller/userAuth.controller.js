"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserAuthController = void 0;
// src/presentation/controllers/userAuth.controller.ts
require("reflect-metadata");
const inversify_1 = require("inversify");
const httpResponseCode_utils_1 = require("../../utils/constants/httpResponseCode.utils");
const sendResponse_utils_1 = require("../../utils/response/sendResponse.utils");
const types_1 = require("../../core/types");
const commonSuccessMsg_constants_1 = require("../../utils/constants/commonSuccessMsg.constants");
const auth_dto_1 = require("../../application/dtos/auth.dto");
const env_config_1 = require("../../config/env.config");
const custom_error_1 = require("../../utils/errors/custom.error");
/**
 * Controller for handling user authentication, including OTP-based registration, login,
 * Google authentication, token refreshing, and password reset functionalities.
 * @implements {IUserAuthController}
 */
let UserAuthController = class UserAuthController {
    /**
     * Constructs an instance of UserAuthController.
     * @param {ISendOtpUseCase} sendOtpUseCase - Use case for sending OTP to a user's email.
     * @param {IVerifyOtpUseCase} verifyOtpUseCase - Use case for verifying OTP and registering/logging in a user.
     * @param {ILoginUserUseCase} loginUserUseCase - Use case for user login.
     */
    constructor(sendOtpUseCase, verifyOtpUseCase, loginUserUseCase, changePasswordUseCase) {
        this.sendOtpUseCase = sendOtpUseCase;
        this.verifyOtpUseCase = verifyOtpUseCase;
        this.loginUserUseCase = loginUserUseCase;
        this.changePasswordUseCase = changePasswordUseCase;
    }
    /**
     * Sends an OTP to the provided email address for user registration or verification.
     * @param {Request} req - The Express request object, containing `email` in the body.
     * @param {Response} res - The Express response object.
     * @param {NextFunction} next - The Express next middleware function.
     * @returns {Promise<void>}
     */
    async sendOtp(req, res, next) {
        try {
            const { email } = req.body;
            await this.sendOtpUseCase.execute(email.trim());
            (0, sendResponse_utils_1.sendResponse)(res, httpResponseCode_utils_1.HttpResCode.OK, commonSuccessMsg_constants_1.SuccessMsg.OTP_SENT);
        }
        catch (error) {
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
    async verifyOtp(req, res, next) {
        try {
            const { name, email, phoneNumber, password, otp } = req.body;
            const dto = new auth_dto_1.VerifyOtpDTO(name, email, phoneNumber, otp, password);
            const result = await this.verifyOtpUseCase.execute(dto);
            res.cookie('refreshToken', result.refreshToken, {
                httpOnly: true,
                secure: env_config_1.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: parseInt(env_config_1.env.MAX_AGE, 10),
            });
            (0, sendResponse_utils_1.sendResponse)(res, httpResponseCode_utils_1.HttpResCode.OK, commonSuccessMsg_constants_1.SuccessMsg.USER_REGISTERED, {
                accessToken: result.accessToken,
                user: result.user,
            });
        }
        catch (error) {
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
    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const dto = new auth_dto_1.LoginDTO(email, password);
            const response = await this.loginUserUseCase.execute(dto);
            res.cookie('refreshToken', response.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: parseInt(process.env.MAX_AGE || '0', 10),
            });
            (0, sendResponse_utils_1.sendResponse)(res, httpResponseCode_utils_1.HttpResCode.OK, commonSuccessMsg_constants_1.SuccessMsg.USER_LOGGED_IN, {
                accessToken: response.accessToken,
                user: response.user,
            });
        }
        catch (error) {
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
    async changePassword(req, res, next) {
        try {
            const userId = req.decoded?.userId;
            if (!userId) {
                throw new custom_error_1.CustomError(httpResponseCode_utils_1.HttpResMsg.UNAUTHORIZED, httpResponseCode_utils_1.HttpResCode.UNAUTHORIZED);
            }
            const { oldPassword, newPassword } = req.body;
            const dto = new auth_dto_1.ChangePasswordDTO(userId, oldPassword, newPassword);
            await this.changePasswordUseCase.execute(dto);
            (0, sendResponse_utils_1.sendResponse)(res, httpResponseCode_utils_1.HttpResCode.OK, commonSuccessMsg_constants_1.SuccessMsg.PASSWORD_CHANGED);
        }
        catch (error) {
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
    async logout(req, res, next) {
        try {
            res.clearCookie('refreshToken');
            (0, sendResponse_utils_1.sendResponse)(res, httpResponseCode_utils_1.HttpResCode.OK, commonSuccessMsg_constants_1.SuccessMsg.USER_LOGGED_OUT);
        }
        catch (error) {
            next(error);
        }
    }
};
exports.UserAuthController = UserAuthController;
exports.UserAuthController = UserAuthController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.SendOtpUseCase)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.VerifyOtpUseCase)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.UserLoginUseCase)),
    __param(3, (0, inversify_1.inject)(types_1.TYPES.ChangePasswordUseCase)),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], UserAuthController);
