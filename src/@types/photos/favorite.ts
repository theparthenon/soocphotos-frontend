import { z } from "zod";

import { PhotoSchema } from "@/@types/photos";

export const FavoritePhotosRequestSchema = z.object({
    image_hashes: z.string().array(),
    favorite: z.boolean(),
});

export type FavoritePhotosRequest = z.infer<typeof FavoritePhotosRequestSchema>;

export const UpdatedPhotosResponseSchema = z.object({
    status: z.boolean(),
    results: PhotoSchema.array(),
    updated: PhotoSchema.array(),
    not_updated: PhotoSchema.array(),
});

export type UpdatedPhotosResponse = z.infer<typeof UpdatedPhotosResponseSchema>;