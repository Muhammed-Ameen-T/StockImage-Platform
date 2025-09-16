"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReorderImageSchema = exports.EditImageSchema = exports.FindUserImagesSchema = exports.DeleteImageSchema = exports.BulkUploadSchema = void 0;
const zod_1 = require("zod");
exports.BulkUploadSchema = zod_1.z.object({
    userId: zod_1.z.string().min(1, 'User ID is required'),
    images: zod_1.z
        .array(zod_1.z.object({
        title: zod_1.z.string().min(1, 'Title is required'),
        url: zod_1.z.string().url('Invalid image URL'),
    }))
        .min(1, 'At least one image must be provided'),
});
exports.DeleteImageSchema = zod_1.z.object({
    id: zod_1.z.string().min(1, 'Image ID is required'),
});
exports.FindUserImagesSchema = zod_1.z.object({
    page: zod_1.z.string().optional(),
    limit: zod_1.z.string().optional(),
    search: zod_1.z.string().optional(),
    sortBy: zod_1.z.string().optional(),
    sortOrder: zod_1.z.enum(['asc', 'desc']).optional(),
});
exports.EditImageSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, 'Title is required').optional(),
    url: zod_1.z.string().url('Invalid URL').optional(),
    order: zod_1.z.number().int().min(0).optional(),
});
exports.ReorderImageSchema = zod_1.z.object({
    imageId: zod_1.z.string().min(1, 'Image ID is required'),
    previousOrder: zod_1.z.number().optional(),
    nextOrder: zod_1.z.number().optional(),
});
