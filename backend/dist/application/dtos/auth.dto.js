"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangePasswordDTO = exports.VerifyOtpDTO = exports.LoginDTO = exports.AuthResponseDTO = void 0;
class AuthResponseDTO {
    constructor(accessToken, refreshToken, user) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.user = user;
    }
}
exports.AuthResponseDTO = AuthResponseDTO;
class LoginDTO {
    constructor(email, password) {
        this.email = email;
        this.password = password;
    }
}
exports.LoginDTO = LoginDTO;
class VerifyOtpDTO {
    constructor(name, email, phoneNumber, otp, password) {
        this.name = name;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.otp = otp;
        this.password = password;
    }
}
exports.VerifyOtpDTO = VerifyOtpDTO;
class ChangePasswordDTO {
    constructor(userId, oldPassword, newPassword) {
        this.userId = userId;
        this.oldPassword = oldPassword;
        this.newPassword = newPassword;
    }
}
exports.ChangePasswordDTO = ChangePasswordDTO;
