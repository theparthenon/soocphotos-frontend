import { z } from 'zod';

export const SimpleUserSchema = z.object({
  id: z.number(),
  username: z.string(),
  first_name: z.string(),
  last_name: z.string(),
});
export type SimpleUser = z.infer<typeof SimpleUserSchema>;

export enum MediaType {
  IMAGE = 'image',
  VIDEO = 'video',
  MOTION_PHOTO = 'motion_photo',
}

export const PigPhotoSchema = z.object({
  id: z.string(),
  url: z.string().optional(),
  location: z.string().optional(),
  date: z.string().optional().nullable(),
  birthTime: z.string().optional(),
  type: z.nativeEnum(MediaType).default(MediaType.IMAGE),
  video_length: z.string().optional(),
  rating: z.number().default(0),
  owner: SimpleUserSchema.optional(),
  isTemp: z.boolean().default(false),
});
export type PigPhoto = z.infer<typeof PigPhotoSchema>;

export const PhotoHashSchema = z.object({
  image_hash: z.string(),
  video: z.boolean(),
});

export const PeopleSchema = z.object({
  name: z.string(),
  face_url: z.string(),
  face_id: z.number(),
});

export const PhotoSchema = z.object({
  exif_gps_lat: z.number().nullable(),
  exif_gps_lon: z.number().nullable(),
  exif_timestamp: z.string().nullable(),
  search_captions: z.string().nullable(),
  search_location: z.string().nullable(),
  captions_json: z.any().nullable(),
  big_thumbnail_url: z.string().nullable(),
  thumbnail_url: z.string().nullable(),
  geolocation_json: z.any().nullable(),
  exif_json: z.any().nullable(),
  people: PeopleSchema.array(),
  image_hash: z.string(),
  image_path: z.string().array(),
  rating: z.number(),
  hidden: z.boolean(),
  deleted: z.boolean(),
  size: z.number(),
  similar_photos: z.object({ image_hash: z.string(), type: z.nativeEnum(MediaType) }).array(),
  video: z.boolean(),
  owner: SimpleUserSchema,
  height: z.number().nullable(),
  width: z.number().nullable(),
});
export type Photo = z.infer<typeof PhotoSchema>;

export const DatePhotosGroupSchema = z.object({
  date: z.string().nullable(),
  year: z.number().nullable().optional(),
  month: z.number().nullable().optional(),
  location: z.string().nullable(),
  items: PigPhotoSchema.array(),
});
export type DatePhotosGroup = z.infer<typeof DatePhotosGroupSchema>;

export const IncompleteDatePhotosGroupSchema = DatePhotosGroupSchema.extend({
  id: z.string(),
  incomplete: z.boolean(),
  numberOfItems: z.number(),
});
export type IncompleteDatePhotosGroup = z.infer<typeof IncompleteDatePhotosGroupSchema>;

export type PhotoSliceState = {
  photoDetails: { [key: string]: Photo };
};

export type PhotosUpdatedResponseType = z.infer<typeof PhotosUpdatedResponseSchema>;

export const PhotosUpdatedResponseSchema = z.object({
  status: z.boolean(),
  results: PhotoSchema.array(),
  updated: PhotoSchema.array(),
  not_updated: PhotoSchema.array(),
});

export type PhotosUpdatedRequestType = z.infer<typeof PhotosUpdatedRequestSchema>;

export const PhotosUpdatedRequestSchema = z.object({
  image_hashes: z.array(z.string()),
  deleted: z.boolean(),
});

export type UserPhotosGroup = {
  userId: number;
  photos: PigPhoto[];
};

export type PhotoGroup = {
  id: string;
  page: number;
  items?: PigPhoto[];
};

