import { z } from 'zod';
import { PhotoHashSchema } from '../photos';
import { PersonSchema } from '../people';
import { PhotoSimpleSchema } from '../albums';

export const AutoAlbumListSchema = z
  .object({
    id: z.number(),
    title: z.string(),
    timestamp: z.string(),
    photos: PhotoHashSchema, // TODO: This is a single photo, so the property name should be corrected. Perhaps cover_photo?
    photo_count: z.number(),
    favorited: z.boolean(),
  })
  .array();

export const AutoAlbumListResponseSchema = z.object({
  results: AutoAlbumListSchema,
});

export const AutoAlbumSchema = z.object({
  id: z.number(),
  title: z.string(),
  favorited: z.boolean(),
  timestamp: z.string(),
  created_on: z.string(),
  gps_lat: z.number().nullable(),
  people: PersonSchema.array(),
  gps_lon: z.number().nullable(),
  photos: PhotoSimpleSchema.array(),
});
export type AutoAlbum = z.infer<typeof AutoAlbumSchema>;

export const AutoAlbumInfoSchema = z.object({
  id: z.number(),
  title: z.string(),
  timestamp: z.string(),
  photos: PhotoHashSchema, // TODO: This is a single photo, so the property name should be corrected. Perhaps cover_photo?
  photo_count: z.number(),
  favorited: z.boolean(),
});
export type AutoAlbumInfo = z.infer<typeof AutoAlbumInfoSchema>;

// actions using new list view in backend

export const FetchAutoAlbumsListResponseSchema = z.object({
  results: AutoAlbumInfoSchema.array(),
});

export type AutoAlbumList = z.infer<typeof AutoAlbumListSchema>;
