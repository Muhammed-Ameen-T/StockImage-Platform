"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const httpResponseCode_utils_1 = require("../utils/constants/httpResponseCode.utils");
const custom_error_1 = require("../utils/errors/custom.error");
const envErrorMsg_constants_1 = require("../utils/constants/envErrorMsg.constants");
dotenv_1.default.config();
exports.env = {
    get PORT() {
        const port = process.env.PORT;
        if (!port) {
            throw new custom_error_1.CustomError(envErrorMsg_constants_1.EnvErrMsg.PORT_UNDEFINED, httpResponseCode_utils_1.HttpResCode.INTERNAL_SERVER_ERROR);
        }
        const portNumber = parseInt(port, 10);
        if (isNaN(portNumber)) {
            throw new custom_error_1.CustomError(envErrorMsg_constants_1.EnvErrMsg.PORT_INVALID, httpResponseCode_utils_1.HttpResCode.BAD_REQUEST);
        }
        return portNumber;
    },
    get NODE_ENV() {
        return process.env.NODE_ENV || 'development';
    },
    get MAX_AGE() {
        return process.env.MAX_AGE || '604800000';
    },
    get CLIENT_ORIGIN() {
        if (!process.env.CLIENT_ORIGIN) {
            throw new custom_error_1.CustomError(envErrorMsg_constants_1.EnvErrMsg.CLIENT_ORIGIN_UNDEFINED, httpResponseCode_utils_1.HttpResCode.INTERNAL_SERVER_ERROR);
        }
        return process.env.CLIENT_ORIGIN;
    },
    get API_BASE_URL() {
        if (!process.env.API_BASE_URL) {
            throw new custom_error_1.CustomError(envErrorMsg_constants_1.EnvErrMsg.API_BASE_URL_UNDEFINED, httpResponseCode_utils_1.HttpResCode.INTERNAL_SERVER_ERROR);
        }
        return process.env.API_BASE_URL;
    },
    get VITE_API_URL() {
        if (!process.env.VITE_API_URL) {
            throw new custom_error_1.CustomError(envErrorMsg_constants_1.EnvErrMsg.VITE_URL_UNDEFINED, httpResponseCode_utils_1.HttpResCode.INTERNAL_SERVER_ERROR);
        }
        return process.env.VITE_API_URL;
    },
    get ACCESS_TOKEN_SECRET() {
        const secret = process.env.ACCESS_TOKEN_SECRET || process.env.JWT_SECRET;
        if (!secret) {
            throw new custom_error_1.CustomError(envErrorMsg_constants_1.EnvErrMsg.ACCESS_TOKEN_SECRET_UNDEFINED, httpResponseCode_utils_1.HttpResCode.INTERNAL_SERVER_ERROR);
        }
        return secret;
    },
    get REFRESH_TOKEN_SECRET() {
        if (!process.env.REFRESH_TOKEN_SECRET) {
            throw new custom_error_1.CustomError(envErrorMsg_constants_1.EnvErrMsg.REFRESH_TOKEN_SECRET_UNDEFINED, httpResponseCode_utils_1.HttpResCode.INTERNAL_SERVER_ERROR);
        }
        return process.env.REFRESH_TOKEN_SECRET;
    },
    get ACCESS_TOKEN_EXPIRY() {
        return process.env.ACCESS_TOKEN_EXPIRY || '15m';
    },
    get REFRESH_TOKEN_EXPIRY() {
        return process.env.REFRESH_TOKEN_EXPIRY || '7d';
    },
    get SESSION_SECRET() {
        if (!process.env.SESSION_SECRET) {
            throw new custom_error_1.CustomError(envErrorMsg_constants_1.EnvErrMsg.SESSION_SECRET_UNDEFINED, httpResponseCode_utils_1.HttpResCode.INTERNAL_SERVER_ERROR);
        }
        return process.env.SESSION_SECRET;
    },
    get MONGO_URI() {
        if (!process.env.MONGO_URI) {
            throw new custom_error_1.CustomError(envErrorMsg_constants_1.EnvErrMsg.MONGO_URI_UNDEFINED, httpResponseCode_utils_1.HttpResCode.INTERNAL_SERVER_ERROR);
        }
        return process.env.MONGO_URI;
    },
    get REDIS_HOST() {
        return process.env.REDIS_HOST || 'localhost';
    },
    get REDIS_PORT() {
        const port = process.env.REDIS_PORT || '6379';
        const portNumber = parseInt(port, 10);
        if (isNaN(portNumber)) {
            throw new custom_error_1.CustomError(envErrorMsg_constants_1.EnvErrMsg.REDIS_PORT_INVALID, httpResponseCode_utils_1.HttpResCode.BAD_REQUEST);
        }
        return portNumber;
    },
    get REDIS_USERNAME() {
        return process.env.REDIS_USERNAME;
    },
    get REDIS_URL() {
        return process.env.REDIS_URL;
    },
    get REDIS_PASSWORD() {
        return process.env.REDIS_PASSWORD;
    },
    get CLOUDINARY_CLOUD_NAME() {
        if (!process.env.CLOUDINARY_CLOUD_NAME) {
            throw new custom_error_1.CustomError(envErrorMsg_constants_1.EnvErrMsg.CLOUDINARY_CLOUD_NAME_UNDEFINED, httpResponseCode_utils_1.HttpResCode.INTERNAL_SERVER_ERROR);
        }
        return process.env.CLOUDINARY_CLOUD_NAME;
    },
    get CLOUDINARY_API_KEY() {
        if (!process.env.CLOUDINARY_API_KEY) {
            throw new custom_error_1.CustomError(envErrorMsg_constants_1.EnvErrMsg.CLOUDINARY_API_KEY_UNDEFINED, httpResponseCode_utils_1.HttpResCode.INTERNAL_SERVER_ERROR);
        }
        return process.env.CLOUDINARY_API_KEY;
    },
    get CLOUDINARY_API_SECRET() {
        if (!process.env.CLOUDINARY_API_SECRET) {
            throw new custom_error_1.CustomError(envErrorMsg_constants_1.EnvErrMsg.CLOUDINARY_API_SECRET_UNDEFINED, httpResponseCode_utils_1.HttpResCode.INTERNAL_SERVER_ERROR);
        }
        return process.env.CLOUDINARY_API_SECRET;
    },
    get SMTP_HOST() {
        if (!process.env.SMTP_HOST) {
            throw new custom_error_1.CustomError(envErrorMsg_constants_1.EnvErrMsg.SMTP_HOST_UNDEFINED, httpResponseCode_utils_1.HttpResCode.INTERNAL_SERVER_ERROR);
        }
        return process.env.SMTP_HOST;
    },
    get SMTP_PORT() {
        const port = process.env.SMTP_PORT || '587';
        const portNumber = parseInt(port, 10);
        if (isNaN(portNumber)) {
            throw new custom_error_1.CustomError(envErrorMsg_constants_1.EnvErrMsg.SMTP_PORT_INVALID, httpResponseCode_utils_1.HttpResCode.BAD_REQUEST);
        }
        return portNumber;
    },
    get SMTP_SECURE() {
        return process.env.SMTP_SECURE === 'true';
    },
    get SMTP_USERNAME() {
        if (!process.env.NODEMAILER_EMAIL) {
            throw new custom_error_1.CustomError(envErrorMsg_constants_1.EnvErrMsg.SMTP_USERNAME_UNDEFINED, httpResponseCode_utils_1.HttpResCode.INTERNAL_SERVER_ERROR);
        }
        return process.env.NODEMAILER_EMAIL;
    },
    get SMTP_PASSWORD() {
        if (!process.env.NODEMAILER_PASSWORD) {
            throw new custom_error_1.CustomError(envErrorMsg_constants_1.EnvErrMsg.SMTP_PASSWORD_UNDEFINED, httpResponseCode_utils_1.HttpResCode.INTERNAL_SERVER_ERROR);
        }
        return process.env.NODEMAILER_PASSWORD;
    },
};
