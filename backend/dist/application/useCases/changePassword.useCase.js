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
exports.ChangePasswordUseCase = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../core/types");
const passwordCompare_util_1 = require("../../utils/helpers/passwordCompare.util");
const passwordHash_util_1 = require("../../utils/helpers/passwordHash.util");
const custom_error_1 = require("../../utils/errors/custom.error");
const commonErrorMsg_constants_1 = require("../../utils/constants/commonErrorMsg.constants");
const httpResponseCode_utils_1 = require("../../utils/constants/httpResponseCode.utils");
/**
 * Use case for changing a user's password.
 */
let ChangePasswordUseCase = class ChangePasswordUseCase {
    constructor(_userRepository) {
        this._userRepository = _userRepository;
    }
    /**
     * Executes the password change process.
     * Validates old password and updates to new hashed password.
     *
     * @param userId - ID of the user requesting password change
     * @param oldPassword - Current password for verification
     * @param newPassword - New password to be set
     * @throws {CustomError} If user not found or old password mismatch
     */
    async execute(dto) {
        const user = await this._userRepository.findById(dto.userId);
        if (!user || !user._id) {
            throw new custom_error_1.CustomError(commonErrorMsg_constants_1.ErrorMsg.USER_NOT_FOUND, httpResponseCode_utils_1.HttpResCode.UNAUTHORIZED);
        }
        const isMatch = await (0, passwordCompare_util_1.comparePassword)(dto.oldPassword, user.password);
        if (!isMatch) {
            throw new custom_error_1.CustomError(commonErrorMsg_constants_1.ErrorMsg.PASSWORD_MISMATCH, httpResponseCode_utils_1.HttpResCode.UNAUTHORIZED);
        }
        const hashed = await (0, passwordHash_util_1.hashPassword)(dto.newPassword);
        await this._userRepository.updatePassword(dto.userId, hashed);
    }
};
exports.ChangePasswordUseCase = ChangePasswordUseCase;
exports.ChangePasswordUseCase = ChangePasswordUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.UserRepository)),
    __metadata("design:paramtypes", [Object])
], ChangePasswordUseCase);
