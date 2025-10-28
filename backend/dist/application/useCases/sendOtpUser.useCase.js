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
exports.SendOtpUseCase = void 0;
const inversify_1 = require("inversify");
const sendOtp_service_1 = require("../../infrastructure/services/sendOtp.service");
const redis_service_1 = require("../../infrastructure/services/redis.service");
const custom_error_1 = require("../../utils/errors/custom.error");
const commonErrorMsg_constants_1 = require("../../utils/constants/commonErrorMsg.constants");
const httpResponseCode_utils_1 = require("../../utils/constants/httpResponseCode.utils");
const otp_util_1 = require("../../utils/helpers/otp.util");
const types_1 = require("../../core/types");
/**
 * Use case for sending OTP for user authentication.
 * Handles OTP generation, storage in Redis, and email delivery.
 */
let SendOtpUseCase = class SendOtpUseCase {
    /**
     * Initializes the SendOtpUseCase with dependencies for user repository, email service, and Redis service.
     *
     * @param {IUserRepository} authRepository - Repository for user management.
     * @param {RedisService} redisService - Service for storing OTP temporarily in Redis.
     */
    constructor(_authRepository, _redisService) {
        this._authRepository = _authRepository;
        this._redisService = _redisService;
    }
    /**
     * Executes the OTP sending process.
     * Checks if a user already exists, generates an OTP, stores it in Redis, and sends it via email.
     *
     * @param {string} email - The user's email address to receive the OTP.
     * @returns {Promise<void>} Resolves once the OTP is successfully stored and emailed.
     * @throws {CustomError} If the user already exists, Redis fails, or the email service encounters an error.
     */
    async execute(email) {
        let user = await this._authRepository.findByEmail(email);
        if (user) {
            throw new custom_error_1.CustomError(commonErrorMsg_constants_1.ErrorMsg.USER_ALREADY_EXISTS, httpResponseCode_utils_1.HttpResCode.BAD_REQUEST);
        }
        const otp = (0, otp_util_1.generateOtp)(6);
        const otpKey = `otp:${email}`;
        try {
            await this._redisService.set(otpKey, otp, 300);
            console.log('SendOtpUseCase: Stored OTP in Redis:', { otpKey, otp });
        }
        catch (error) {
            console.error('SendOtpUseCase: Redis error:', error);
            throw new custom_error_1.CustomError(commonErrorMsg_constants_1.ErrorMsg.FAILED_STORING_OTP, httpResponseCode_utils_1.HttpResCode.INTERNAL_SERVER_ERROR);
        }
        try {
            await (0, sendOtp_service_1.sendOtp)(email, otp);
            console.log('SendOtpUseCase: OTP email sent to:', email);
        }
        catch (error) {
            console.error('SendOtpUseCase: Email service error:', error);
            throw new custom_error_1.CustomError(commonErrorMsg_constants_1.ErrorMsg.FAILED_SENDING_OTP, httpResponseCode_utils_1.HttpResCode.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.SendOtpUseCase = SendOtpUseCase;
exports.SendOtpUseCase = SendOtpUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.UserRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.RedisService)),
    __metadata("design:paramtypes", [Object, redis_service_1.RedisService])
], SendOtpUseCase);
