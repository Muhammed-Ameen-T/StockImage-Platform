"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtService = void 0;
const jwt = __importStar(require("jsonwebtoken"));
const env_config_1 = require("../../config/env.config");
class JwtService {
    constructor() {
        this._accessSecret = env_config_1.env.ACCESS_TOKEN_SECRET;
        this._refreshSecret = env_config_1.env.REFRESH_TOKEN_SECRET;
        this._accessExpiry = env_config_1.env.ACCESS_TOKEN_EXPIRY;
        this._refreshExpiry = env_config_1.env.REFRESH_TOKEN_EXPIRY;
    }
    /**
     * Generates an access token for authentication.
     * @param {string} userId - The unique ID of the user.
     * @param {string} role - The role assigned to the user (e.g., admin, user).
     * @returns {string} A signed JWT access token.
     */
    generateAccessToken(userId) {
        return jwt.sign({ userId }, this._accessSecret, {
            expiresIn: this._accessExpiry,
        });
    }
    /**
     * Generates a refresh token for session renewal.
     * @param {string} userId - The unique ID of the user.
     * @param {string} role - The role assigned to the user.
     * @returns {string} A signed JWT refresh token.
     */
    generateRefreshToken(userId) {
        return jwt.sign({ userId }, this._refreshSecret, {
            expiresIn: this._refreshExpiry,
        });
    }
    /**
     * Verifies and decodes an access token.
     * @param {string} token - The JWT access token to verify.
     * @returns {{ userId: string }} The decoded payload containing the user's ID.
     * @throws {jwt.JsonWebTokenError} If the token is invalid or expired.
     */
    verifyAccessToken(token) {
        return jwt.verify(token, this._accessSecret);
    }
    /**
     * Verifies and decodes a refresh token.
     * @param {string} token - The JWT refresh token to verify.
     * @returns {{ userId: string }} The decoded payload containing the user's ID.
     * @throws {jwt.JsonWebTokenError} If the token is invalid or expired.
     */
    verifyRefreshToken(token) {
        return jwt.verify(token, this._refreshSecret);
    }
}
exports.JwtService = JwtService;
