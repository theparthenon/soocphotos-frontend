import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { z } from 'zod';

export const UserSchema = z.object({
  id: z.number(),
  username: z.string(),
  email: z.string(),
  confidence: z.number(),
  confidence_person: z.number(),
  transcode_videos: z.boolean(),
  first_name: z.string(),
  last_name: z.string(),
  date_joined: z.string(),
  avatar: z.any().nullable(),
  photo_count: z.number(),
  avatar_url: z.any().nullable(),
  favorite_min_rating: z.number(),
  save_metadata_to_disk: z.string(),
  datetime_rules: z.string(),
  default_timezone: z.string(),
  password: z.string().optional(),
  is_superuser: z.boolean().optional(),
  face_recognition_model: z.string(),
  confidence_unknown_face: z.number(),
  min_cluster_size: z.number(),
  min_samples: z.number(),
  cluster_selection_epsilon: z.number(),
  llm_settings: z.any().nullable(),
});

export type User = z.infer<typeof UserSchema>;

export const ManageUser = z.object({
  confidence: z.number(),
  date_joined: z.string(),
  favorite_min_rating: z.number(),
  id: z.number(),
  last_login: z.string().nullable(),
  photo_count: z.number(),
  save_metadata_to_disk: z.string(),
  username: z.string().optional(),
  email: z.string().nullable(),
  first_name: z.string().nullable(),
  last_name: z.string().nullable(),
  password: z.string().optional(),
});

export const SimpleUser = z.object({
  id: z.number(),
  username: z.string(),
  first_name: z.string(),
  last_name: z.string(),
});

export type IUser = z.infer<typeof UserSchema>;
export type IManageUser = z.infer<typeof ManageUser>;

export const ApiUserListResponseSchema = z.object({
  count: z.number(),
  next: z.string().nullable(),
  previous: z.string().nullable(),
  results: z.array(UserSchema),
});

export const UserListSchema = z.array(UserSchema);
export type UserList = z.infer<typeof UserListSchema>;

export type IUserState = {
  userSelfDetails: IUser;
  error: Error | FetchBaseQueryError | string | null | undefined;
};
