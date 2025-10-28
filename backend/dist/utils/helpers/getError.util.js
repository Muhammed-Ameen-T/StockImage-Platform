"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getErrorMessage = void 0;
/**
 * Utility function to safely get an error message from an unknown error object.
 * @param {unknown} error - The caught value.
 * @returns {string} The error message.
 */
const getErrorMessage = (error) => {
    if (error instanceof Error) {
        return error.message;
    }
    // Fallback for non-Error objects (e.g., plain strings, primitives)
    return String(error);
};
exports.getErrorMessage = getErrorMessage;
