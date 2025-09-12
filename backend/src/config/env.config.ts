
import dotenv from 'dotenv';
import { HttpResCode } from '../utils/constants/httpResponseCode.utils';
import { CustomError } from '../utils/errors/custom.error';
import { EnvErrMsg } from '../utils/constants/envErrorMsg.constants';

dotenv.config();

export const env = {
  get PORT(): number {
    const port = process.env.PORT;
    if (!port) {
      throw new CustomError(EnvErrMsg.PORT_UNDEFINED, HttpResCode.INTERNAL_SERVER_ERROR);
    }
    const portNumber = parseInt(port, 10);
    if (isNaN(portNumber)) {
      throw new CustomError(EnvErrMsg.PORT_INVALID, HttpResCode.BAD_REQUEST);
    }
    return portNumber;
  },

  get NODE_ENV(): string {
    return process.env.NODE_ENV || 'development';
  },

  get MAX_AGE(): string {
    return process.env.MAX_AGE || '604800000';
  },

  get CLIENT_ORIGIN(): string {
    if (!process.env.CLIENT_ORIGIN) {
      throw new CustomError(EnvErrMsg.CLIENT_ORIGIN_UNDEFINED, HttpResCode.INTERNAL_SERVER_ERROR);
    }
    return process.env.CLIENT_ORIGIN;
  },

  get API_BASE_URL(): string {
    if (!process.env.API_BASE_URL) {
      throw new CustomError(EnvErrMsg.API_BASE_URL_UNDEFINED, HttpResCode.INTERNAL_SERVER_ERROR);
    }
    return process.env.API_BASE_URL;
  },

  get VITE_API_URL(): string {
    if (!process.env.VITE_API_URL) {
      throw new CustomError(EnvErrMsg.VITE_URL_UNDEFINED, HttpResCode.INTERNAL_SERVER_ERROR);
    }
    return process.env.VITE_API_URL;
  },

  get ACCESS_TOKEN_SECRET(): string {
    const secret = process.env.ACCESS_TOKEN_SECRET || process.env.JWT_SECRET;
    if (!secret) {
      throw new CustomError(
        EnvErrMsg.ACCESS_TOKEN_SECRET_UNDEFINED,
        HttpResCode.INTERNAL_SERVER_ERROR,
      );
    }
    return secret;
  },

  get REFRESH_TOKEN_SECRET(): string {
    if (!process.env.REFRESH_TOKEN_SECRET) {
      throw new CustomError(
        EnvErrMsg.REFRESH_TOKEN_SECRET_UNDEFINED,
        HttpResCode.INTERNAL_SERVER_ERROR,
      );
    }
    return process.env.REFRESH_TOKEN_SECRET;
  },

  get ACCESS_TOKEN_EXPIRY(): string {
    return process.env.ACCESS_TOKEN_EXPIRY || '15m';
  },

  get REFRESH_TOKEN_EXPIRY(): string {
    return process.env.REFRESH_TOKEN_EXPIRY || '7d'; 
  },

  get SESSION_SECRET(): string {
    if (!process.env.SESSION_SECRET) {
      throw new CustomError(EnvErrMsg.SESSION_SECRET_UNDEFINED, HttpResCode.INTERNAL_SERVER_ERROR);
    }
    return process.env.SESSION_SECRET;
  },

  get MONGO_URI(): string {
    if (!process.env.MONGO_URI) {
      throw new CustomError(EnvErrMsg.MONGO_URI_UNDEFINED, HttpResCode.INTERNAL_SERVER_ERROR);
    }
    return process.env.MONGO_URI;
  },

  get REDIS_HOST(): string {
    return process.env.REDIS_HOST || 'localhost';
  },

  get REDIS_PORT(): number {
    const port = process.env.REDIS_PORT || '6379';
    const portNumber = parseInt(port, 10);
    if (isNaN(portNumber)) {
      throw new CustomError(EnvErrMsg.REDIS_PORT_INVALID, HttpResCode.BAD_REQUEST);
    }
    return portNumber;
  },

  get REDIS_USERNAME(): string | undefined {
    return process.env.REDIS_USERNAME; 
  },
  get REDIS_URL(): string | undefined {
    return process.env.REDIS_URL;
  },

  get REDIS_PASSWORD(): string | undefined {
    return process.env.REDIS_PASSWORD; 
  },

  get CLOUDINARY_CLOUD_NAME(): string {
    if (!process.env.CLOUDINARY_CLOUD_NAME) {
      throw new CustomError(
        EnvErrMsg.CLOUDINARY_CLOUD_NAME_UNDEFINED,
        HttpResCode.INTERNAL_SERVER_ERROR,
      );
    }
    return process.env.CLOUDINARY_CLOUD_NAME;
  },

  get CLOUDINARY_API_KEY(): string {
    if (!process.env.CLOUDINARY_API_KEY) {
      throw new CustomError(
        EnvErrMsg.CLOUDINARY_API_KEY_UNDEFINED,
        HttpResCode.INTERNAL_SERVER_ERROR,
      );
    }
    return process.env.CLOUDINARY_API_KEY;
  },

  get CLOUDINARY_API_SECRET(): string {
    if (!process.env.CLOUDINARY_API_SECRET) {
      throw new CustomError(
        EnvErrMsg.CLOUDINARY_API_SECRET_UNDEFINED,
        HttpResCode.INTERNAL_SERVER_ERROR,
      );
    }
    return process.env.CLOUDINARY_API_SECRET;
  },

  get SMTP_HOST(): string {
    if (!process.env.SMTP_HOST) {
      throw new CustomError(EnvErrMsg.SMTP_HOST_UNDEFINED, HttpResCode.INTERNAL_SERVER_ERROR);
    }
    return process.env.SMTP_HOST;
  },

  get SMTP_PORT(): number {
    const port = process.env.SMTP_PORT || '587'; 
    const portNumber = parseInt(port, 10);
    if (isNaN(portNumber)) {
      throw new CustomError(EnvErrMsg.SMTP_PORT_INVALID, HttpResCode.BAD_REQUEST);
    }
    return portNumber;
  },

  get SMTP_SECURE(): boolean {
    return process.env.SMTP_SECURE === 'true'; 
  },

  get SMTP_USERNAME(): string {
    if (!process.env.NODEMAILER_EMAIL) {
      throw new CustomError(EnvErrMsg.SMTP_USERNAME_UNDEFINED, HttpResCode.INTERNAL_SERVER_ERROR);
    }
    return process.env.NODEMAILER_EMAIL;
  },

  get SMTP_PASSWORD(): string {
    if (!process.env.NODEMAILER_PASSWORD) {
      throw new CustomError(EnvErrMsg.SMTP_PASSWORD_UNDEFINED, HttpResCode.INTERNAL_SERVER_ERROR);
    }
    return process.env.NODEMAILER_PASSWORD;
  },
};
