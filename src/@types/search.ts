import { z } from 'zod';
import { PigPhotoSchema } from './photos';

export const SearchExamplesSchema = z.array(z.string());

export const SearchExamplesResponseSchema = z.object({
  results: SearchExamplesSchema,
});

export type SearchExamples = z.infer<typeof SearchExamplesSchema>;

export const PhotosGroupedByDate = z.array(
  z.object({
    date: z.string(),
    location: z.string(),
    items: z.array(PigPhotoSchema),
  })
);

export const SearchPhotosSchema = z.object({
  results: PhotosGroupedByDate,
});

export const SearchPhotosResultScheme = z.object({
  photosFlat: z.array(PigPhotoSchema),
  photosGroupedByDate: PhotosGroupedByDate,
});

export type SearchPhotosResult = z.infer<typeof SearchPhotosResultScheme>;
