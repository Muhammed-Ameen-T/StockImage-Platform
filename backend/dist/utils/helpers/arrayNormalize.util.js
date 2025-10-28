"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeArray = void 0;
/**
 * Normalizes a field value (which might be a single string, an array of strings, or undefined)
 * into a consistent array format.
 * @template T - The expected array element type.
 * @param {T | T[] | undefined} field - The raw input field from the request body.
 * @returns {T[]} An array containing the normalized values.
 */
const normalizeArray = (field) => {
    if (Array.isArray(field)) {
        return field;
    }
    if (field === undefined || field === null) {
        return [];
    }
    return [field];
};
exports.normalizeArray = normalizeArray;
