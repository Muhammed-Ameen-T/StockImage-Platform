"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = void 0;
const httpResponseCode_utils_1 = require("../../utils/constants/httpResponseCode.utils");
const sendResponse_utils_1 = require("../../utils/response/sendResponse.utils");
/**
 * Middleware to validate request body using a Zod schema.
 * Responds with a 400 Bad Request if validation fails.
 *
 * @template T - Zod schema type
 * @param {ZodType<T>} schema - The Zod schema used for validation.
 * @returns {Function} Express middleware function.
 */
const validateRequest = (schema) => {
    return (req, res, next) => {
        const result = schema.safeParse(req.body);
        if (!result.success) {
            const errorMessage = result.error.issues
                .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
                .join(', ');
            (0, sendResponse_utils_1.sendResponse)(res, httpResponseCode_utils_1.HttpResCode.BAD_REQUEST, errorMessage);
            return;
        }
        next();
    };
};
exports.validateRequest = validateRequest;
