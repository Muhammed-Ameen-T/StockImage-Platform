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
exports.LoginUserUseCase = void 0;
const passwordCompare_util_1 = require("../../utils/helpers/passwordCompare.util");
const commonErrorMsg_constants_1 = require("../../utils/constants/commonErrorMsg.constants");
const httpResponseCode_utils_1 = require("../../utils/constants/httpResponseCode.utils");
const custom_error_1 = require("../../utils/errors/custom.error");
const jwt_service_1 = require("../../infrastructure/services/jwt.service");
const auth_dto_1 = require("../dtos/auth.dto");
const inversify_1 = require("inversify");
const types_1 = require("../../core/types");
/**
 * Handles the user login process using dependency injection for authentication and database operations.
 */
let LoginUserUseCase = class LoginUserUseCase {
    /**
     * Initializes the LoginUserUseCase with injected dependencies.
     *
     * @param {IUserRepository} userRepository - Repository for user data retrieval.
     * @param {JwtService} jwtService - Service for JWT token generation.
     */
    constructor(userRepository, jwtService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }
    /**
     * Executes the login process.
     * Validates user credentials, checks blocking status, and generates authentication tokens.
     *
     * @param {LoginDTO} dto - Data Transfer Object containing email and password.
     * @returns {Promise<AuthResponseDTO>} Returns access and refresh tokens along with user details.
     * @throws {CustomError} If user is not found, blocked, or password mismatch occurs.
     */
    async execute(dto) {
        const user = await this.userRepository.findByEmail(dto.email);
        if (!user || !user._id) {
            throw new custom_error_1.CustomError(commonErrorMsg_constants_1.ErrorMsg.USER_NOT_FOUND, httpResponseCode_utils_1.HttpResCode.UNAUTHORIZED);
        }
        const isMatch = await (0, passwordCompare_util_1.comparePassword)(dto.password, user.password);
        if (!isMatch) {
            throw new custom_error_1.CustomError(commonErrorMsg_constants_1.ErrorMsg.PASSWORD_MISMATCH, httpResponseCode_utils_1.HttpResCode.UNAUTHORIZED);
        }
        const accessToken = this.jwtService.generateAccessToken(user._id?.toString());
        const refreshToken = this.jwtService.generateRefreshToken(user._id?.toString());
        return new auth_dto_1.AuthResponseDTO(accessToken, refreshToken, {
            id: user._id?.toString(),
            email: user.email,
            name: user.name,
            phoneNumber: user.phoneNumber,
        });
    }
};
exports.LoginUserUseCase = LoginUserUseCase;
exports.LoginUserUseCase = LoginUserUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.UserRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.JwtService)),
    __metadata("design:paramtypes", [Object, jwt_service_1.JwtService])
], LoginUserUseCase);
