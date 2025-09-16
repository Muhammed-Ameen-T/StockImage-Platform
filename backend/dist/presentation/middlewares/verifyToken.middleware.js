"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const custom_error_1 = require("../../utils/errors/custom.error");
const httpResponseCode_utils_1 = require("../../utils/constants/httpResponseCode.utils");
const env_config_1 = require("../../config/env.config");
const types_1 = require("../../core/types");
const inversify_config_1 = require("../../core/inversify.config");
const jwtService = inversify_config_1.container.get(types_1.TYPES.JwtService);
const verifyAccessToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const accessToken = authHeader?.split(' ')[1];
        if (!accessToken) {
            throw new custom_error_1.CustomError(httpResponseCode_utils_1.HttpResMsg.NO_ACCESS_TOKEN, httpResponseCode_utils_1.HttpResCode.UNAUTHORIZED);
        }
        try {
            const decoded = jsonwebtoken_1.default.verify(accessToken, env_config_1.env.ACCESS_TOKEN_SECRET);
            req.decoded = decoded;
            next();
        }
        catch (error) {
            if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
                const refreshToken = req.cookies.refreshToken;
                if (!refreshToken) {
                    throw new custom_error_1.CustomError(httpResponseCode_utils_1.HttpResMsg.REFRESH_TOKEN_REQUIRED, httpResponseCode_utils_1.HttpResCode.UNAUTHORIZED);
                }
                try {
                    const decodedRefresh = jsonwebtoken_1.default.verify(refreshToken, env_config_1.env.REFRESH_TOKEN_SECRET);
                    const userRepository = inversify_config_1.container.get(types_1.TYPES.UserRepository);
                    const user = await userRepository.findById(decodedRefresh.userId);
                    if (!user || !user._id) {
                        throw new custom_error_1.CustomError(httpResponseCode_utils_1.HttpResMsg.USER_NOT_FOUND, httpResponseCode_utils_1.HttpResCode.UNAUTHORIZED);
                    }
                    const newAccessToken = jwtService.generateAccessToken(user._id.toString());
                    res.setHeader('x-access-token', newAccessToken);
                    req.decoded = decodedRefresh;
                    next();
                }
                catch (refreshError) {
                    console.error('Refresh token error:', refreshError);
                    throw new custom_error_1.CustomError(httpResponseCode_utils_1.HttpResMsg.INVALID_OR_EXPIRED_REFRESH_TOKEN, httpResponseCode_utils_1.HttpResCode.UNAUTHORIZED);
                }
            }
            else {
                throw new custom_error_1.CustomError(httpResponseCode_utils_1.HttpResMsg.INVALID_ACCESS_TOKEN, httpResponseCode_utils_1.HttpResCode.UNAUTHORIZED);
            }
        }
    }
    catch (error) {
        next(error);
    }
};
exports.verifyAccessToken = verifyAccessToken;
