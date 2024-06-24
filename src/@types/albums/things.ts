import { z } from 'zod';
import { PhotoHashSchema, DatePhotosGroupSchema } from '../photos';

export const ThingsAlbumListSchema = z
  .object({
    id: z.number(),
    title: z.string(),
    cover_photos: PhotoHashSchema.array(),
    photo_count: z.number(),
    thing_type: z.string(),
  })
  .array();

export const ThingsAlbumListResponseSchema = z.object({
  results: ThingsAlbumListSchema,
});

export const ThingsAlbumSchema = z.object({
  id: z.string(),
  title: z.string(),
  grouped_photos: DatePhotosGroupSchema.array(),
});

export const ThingsAlbumResponseSchema = z.object({
  results: ThingsAlbumSchema,
});

export type ThingsAlbumList = z.infer<typeof ThingsAlbumListSchema>;

export type ThingsAlbum = z.infer<typeof ThingsAlbumSchema>;
