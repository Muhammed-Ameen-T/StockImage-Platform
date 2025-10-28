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
exports.VerifyOtpUseCase = void 0;
const inversify_1 = require("inversify");
const jwt_service_1 = require("../../infrastructure/services/jwt.service");
const redis_service_1 = require("../../infrastructure/services/redis.service");
const custom_error_1 = require("../../utils/errors/custom.error");
const user_entity_1 = require("../../domain/entities/user.entity");
const passwordHash_util_1 = require("../../utils/helpers/passwordHash.util");
const httpResponseCode_utils_1 = require("../../utils/constants/httpResponseCode.utils");
const commonErrorMsg_constants_1 = require("../../utils/constants/commonErrorMsg.constants");
const auth_dto_1 = require("../dtos/auth.dto");
const types_1 = require("../../core/types");
/**
 * Use case for verifying OTP during user registration.
 * Validates the OTP, creates a new user, and generates authentication tokens.
 */
let VerifyOtpUseCase = class VerifyOtpUseCase {
    /**
     * Initializes the VerifyOtpUseCase with dependencies for user repository, JWT service, and Redis service.
     *
     * @param {IUserRepository} userReposiotry - Repository for user management.
     * @param {JwtService} jwtService - Service for JWT handling.
     * @param {RedisService} redisService - Service for storing and retrieving OTPs.
     */
    constructor(_userRepository, _jwtService, _redisService) {
        this._userRepository = _userRepository;
        this._jwtService = _jwtService;
        this._redisService = _redisService;
    }
    /**
     * Executes the OTP verification process.
     * Checks if the stored OTP matches the provided OTP, registers the user, and generates authentication tokens.
     *
     * @param {VerifyOtpDTO} dto - DTO containing user details and OTP for verification.
     * @returns {Promise<AuthResponseDTO>} Returns authentication tokens and user details if OTP validation succeeds.
     * @throws {CustomError} If OTP is invalid or user creation fails.
     */
    async execute(dto) {
        console.log(dto);
        const storedOtp = await this._redisService.get(`otp:${dto.email}`);
        console.log('storedOtp:', storedOtp);
        if (!storedOtp || storedOtp != dto.otp) {
            throw new custom_error_1.CustomError(commonErrorMsg_constants_1.ErrorMsg.INVALID_OTP, httpResponseCode_utils_1.HttpResCode.BAD_REQUEST);
        }
        await this._redisService.del(`otp:${dto.email}`);
        const hashedPassword = await (0, passwordHash_util_1.hashPassword)(dto.password);
        let user = new user_entity_1.User(null, dto.name, dto.email, dto.phoneNumber, hashedPassword, new Date(), new Date());
        await this._userRepository.create(user);
        const createdUser = await this._userRepository.findByEmail(user.email.toLocaleLowerCase());
        console.log('newcreatedUser:', createdUser);
        if (!createdUser || !createdUser._id) {
            throw new custom_error_1.CustomError(commonErrorMsg_constants_1.ErrorMsg.USER_NOT_FOUND, httpResponseCode_utils_1.HttpResCode.INTERNAL_SERVER_ERROR);
        }
        const accessToken = this._jwtService.generateAccessToken(createdUser._id?.toString());
        const refreshToken = this._jwtService.generateRefreshToken(createdUser._id?.toString());
        return new auth_dto_1.AuthResponseDTO(accessToken, refreshToken, {
            id: createdUser._id?.toString(),
            email: createdUser.email,
            name: createdUser.name,
            phoneNumber: createdUser.phoneNumber,
        });
    }
};
exports.VerifyOtpUseCase = VerifyOtpUseCase;
exports.VerifyOtpUseCase = VerifyOtpUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.UserRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.JwtService)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.RedisService)),
    __metadata("design:paramtypes", [Object, jwt_service_1.JwtService,
        redis_service_1.RedisService])
], VerifyOtpUseCase);
