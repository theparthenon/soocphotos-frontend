import { z } from 'zod';

export type ServerStatsResponseType = z.infer<typeof ServerStatsResponse>;

// To-Do: Add a type for this
export const ServerStatsResponse = z.any();

export type StorageStatsResponseType = z.infer<typeof StorageStatsResponse>;

export const StorageStatsResponse = z.object({
  used_storage: z.number(),
  total_storage: z.number(),
  free_storage: z.number(),
});

export type ImageTagResponseType = z.infer<typeof ImageTagResponse>;

export const ImageTagResponse = z.object({
  image_tag: z.string(),
  git_hash: z.string(),
});

interface DirTreeItem {
  title: string;
  absolutePath?: string;
  children?: DirTreeItem[];
}

// cast to z.ZodType<Category>
export const DirTree: z.ZodType<DirTreeItem> = z.lazy(() =>
  z.object({
    title: z.string(),
    absolute_path: z.string().optional(),
    children: z.array(DirTree).optional(),
  })
);

export const DeleteMissingPhotosResponse = z.object({
  status: z.boolean(),
  // To-Do: Why is it not a number?!?!
  job_id: z.string().optional(),
});

export const GenerateEventAlbumsResponse = z.object({
  status: z.boolean(),
  // To-Do: Why is it not a number?!?!
  job_id: z.string().optional(),
});
export type IGenerateEventAlbumsTitlesResponse = z.infer<typeof GenerateEventAlbumsTitlesResponse>;
export const GenerateEventAlbumsTitlesResponse = z.object({
  status: z.boolean(),
  // To-Do: Why is it not a number?!?!
  job_id: z.string().optional(),
});

export const SearchTermExamples = z.array(z.string());

export const TimelinePoint = z.object({
  data: z.array(z.number()),
  color: z.string(),
  loc: z.string(),
  start: z.number(),
  end: z.number(),
});

export const LocationSunburstSchema = z.lazy(() =>
  z.object({
    name: z.string(),
    hex: z.string().optional(),
    children: z.array(LocationSunburstSchema).optional(),
  })
);

export type LocationSunburst = z.infer<typeof LocationSunburstSchema>;

export const LocationTimeline = z.array(TimelinePoint);

export const CountStatsSchema = z.object({
  num_photos: z.number(),
  num_missing_photos: z.number(),
  num_faces: z.number(),
  num_people: z.number(),
  num_unknown_faces: z.number(),
  num_labeled_faces: z.number(),
  num_inferred_faces: z.number(),
  num_albumauto: z.number(),
  num_albumdate: z.number(),
  num_albumuser: z.number(),
});

type CountStats = z.infer<typeof CountStatsSchema>;
export const COUNT_STATS_DEFAULTS: CountStats = {
  num_photos: 0,
  num_missing_photos: 0,
  num_faces: 0,
  num_people: 0,
  num_unknown_faces: 0,
  num_labeled_faces: 0,
  num_inferred_faces: 0,
  num_albumauto: 0,
  num_albumdate: 0,
  num_albumuser: 0,
};

export const PhotoMonthCountSchema = z.object({
  month: z.string(),
  count: z.number(),
});

export const PhotoMonthCountResponseSchema = z.array(PhotoMonthCountSchema);

export type PhotoMonthCountResponse = z.infer<typeof PhotoMonthCountResponseSchema>;

export const TimezonesSchema = z.string().array();

export type Timezones = z.infer<typeof TimezonesSchema>;

// To-Do: Why y?!?!
export const WordCloud = z.object({
  label: z.string(),
  y: z.number(),
});

export const WordCloudResponseSchema = z.object({
  captions: WordCloud.array(),
  people: WordCloud.array(),
  locations: WordCloud.array(),
});

export type WordCloudResponse = z.infer<typeof WordCloudResponseSchema>;
