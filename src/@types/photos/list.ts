import { z } from "zod";

import { PigPhotoSchema } from "@/@types/photos";

export const PaginatedPhotosResponseSchema = z.object({
    count: z.number(),
    next: z.string().nullable(),
    previous: z.string().nullable(),
    results: PigPhotoSchema.array(),
});

export type PaginatedPhotosResponse = z.infer<typeof PaginatedPhotosResponseSchema>;