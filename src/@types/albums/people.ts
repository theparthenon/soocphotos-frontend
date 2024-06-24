import { z } from 'zod';

export const PersonResponseSchema = z.object({
  name: z.string(),
  face_url: z.string().nullable(),
  face_count: z.number(),
  face_photo_url: z.string().nullable(),
  video: z.boolean().optional(),
  id: z.number(),
  newPersonName: z.string().optional(),
  cover_photo: z.string().optional(),
});

export const PeopleSchema = z
  .object({
    key: z.string(),
    value: z.string(),
    text: z.string(),
    video: z.boolean(),
    face_count: z.number(),
    face_photo_url: z.string(),
    face_url: z.string(),
  })
  .array();

export type People = z.infer<typeof PeopleSchema>;

export const PeopleResponseSchema = z.object({
  count: z.number().optional(),
  next: z.string().nullable().optional(),
  previous: z.string().nullable().optional(),
  results: PersonResponseSchema.array(),
});
