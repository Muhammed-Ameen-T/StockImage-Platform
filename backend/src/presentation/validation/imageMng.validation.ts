import { z } from 'zod';

export const BulkUploadSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  images: z
    .array(
      z.object({
        title: z.string().min(1, 'Title is required'),
        url: z.string().url('Invalid image URL'),
      })
    )
    .min(1, 'At least one image must be provided'),
});

export const DeleteImageSchema = z.object({
  id: z.string().min(1, 'Image ID is required'),
});

export const FindUserImagesSchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  search: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

export const EditImageSchema = z.object({
  title: z.string().min(1, 'Title is required').optional(),
  url: z.string().url('Invalid URL').optional(),
  order: z.number().int().min(0).optional(),
});

export const ReorderImageSchema = z.object({
  imageId: z.string().min(1, 'Image ID is required'),
  previousOrder: z.number().optional(),
  nextOrder: z.number().optional(),
});