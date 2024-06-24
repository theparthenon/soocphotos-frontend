import { z } from "zod";

import { PhotoSchema } from "@/@types/photos";

export const DeletePhotosRequestSchema = z.object({
    image_hashes: z.array(z.string()),
    deleted: z.boolean(),
});

export type DeletePhotosRequest = z.infer<typeof DeletePhotosRequestSchema>;

export const DeleteDuplicatePhotoRequestSchema = z.object({
    image_hash: z.string(),
    path: z.string(),
});

export type DeleteDuplicatePhotoRequest = z.infer<typeof DeleteDuplicatePhotoRequestSchema>;

export const DeletePhotosResponseSchema = z.object({
    status: z.boolean(),
    results: PhotoSchema.array(),
    updated: PhotoSchema.array(),
    not_updated: PhotoSchema.array(),
});

export type DeletePhotosResponse = z.infer<typeof DeletePhotosResponseSchema>;

export const DeleteMissingPhotosResponseSchema = z.object({
    status: z.boolean(),
    job_id: z.string().optional(),
});

export type DeleteMissingPhotosResponse = z.infer<typeof DeleteMissingPhotosResponseSchema>;

export const PurgePhotosRequestSchema = z.object({
    image_hashes: z.array(z.string()),
});

export type PurgePhotosRequest = z.infer<typeof PurgePhotosRequestSchema>;

export const PurgePhotosResponseSchema = z.object({
    status: z.boolean(),
    results: z.string().array(),
    deleted: z.string().array(),
    not_deleted: z.string().array(),
});

export type PurgePhotosResponse = z.infer<typeof PurgePhotosResponseSchema>;