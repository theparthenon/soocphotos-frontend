import { z } from "zod";

import { PhotoSchema } from "@/@types/photos";

export const UpdatePhotosResponseSchema = z.object({
    status: z.boolean(),
    results: PhotoSchema.array(),
    updated: PhotoSchema.array(),
    not_updated: PhotoSchema.array(),
});

export type UpdatePhotosResponse = z.infer<typeof UpdatePhotosResponseSchema>;

export const SetPhotosHiddenRequestSchema = z.object({
    image_hashes: z.array(z.string()),
    hidden: z.boolean(),
});

export type SetPhotosHiddenRequest = z.infer<typeof SetPhotosHiddenRequestSchema>;