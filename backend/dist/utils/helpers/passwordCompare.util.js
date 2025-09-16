"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.comparePassword = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
/**
 * Compares a plain password with a hashed password.
 * @param plainPassword - The password from DTO (user input)
 * @param hashedPassword - The hashed password stored in DB
 * @returns boolean - true if match, false if not
 */
const comparePassword = async (plainPassword, hashedPassword) => {
    return await bcryptjs_1.default.compare(plainPassword, hashedPassword);
};
exports.comparePassword = comparePassword;
