import { z } from "zod";

import { PigPhotoSchema } from "@/@types/photos";

export const RecentlyAddedPhotosResponseSchema = z.object({
    results: PigPhotoSchema.array(),
    date: z.string(),
});

export type RecentlyAddedPhotosResponse = z.infer<typeof RecentlyAddedPhotosResponseSchema>;