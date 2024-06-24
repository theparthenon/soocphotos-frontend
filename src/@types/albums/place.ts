import { z } from 'zod';
import { DatePhotosGroupSchema, PhotoHashSchema } from '../photos';

export const AlbumInfoSchema = z.object({
  id: z.number(),
  title: z.string(),
  cover_photos: PhotoHashSchema.array(),
  photo_count: z.number(),
});

export const PlacesAlbumSchema = AlbumInfoSchema.extend({
  geolocation_level: z.number(),
});

export const PlacesAlbumListSchema = PlacesAlbumSchema.array();

export type PlaceAlbumList = z.infer<typeof PlacesAlbumListSchema>;

export const PlacesAlbumsResponseSchema = z.object({
  results: PlacesAlbumListSchema,
});

export const LocationClustersResponseSchema = z.array(z.array(z.union([z.number(), z.string()])));

export type LocationClusters = z.infer<typeof LocationClustersResponseSchema>;

export const PlaceAlbumSchema = z.object({
  id: z.string(),
  title: z.string(),
  grouped_photos: DatePhotosGroupSchema.array(),
});

export type PlaceAlbum = z.infer<typeof PlaceAlbumSchema>;

export const PlaceAlbumResponseSchema = z.object({ results: PlaceAlbumSchema });
