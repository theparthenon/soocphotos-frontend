import { z } from "zod";

export const PhotoUpdateResponseSchema = z.object({
    image_hash: z.string(),
    hidden: z.boolean(),
    rating: z.number(),
    deleted: z.boolean(),
    video: z.boolean(),
    exif_timestamp: z.string(),
    timestamp: z.string(),
});

export type PhotoUpdateResponse = z.infer<typeof PhotoUpdateResponseSchema>;

export const StatusResponseSchema = z.object({
    status: z.boolean(),
});

export type StatusResponse = z.infer<typeof StatusResponseSchema>;