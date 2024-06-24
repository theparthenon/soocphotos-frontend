import { z } from 'zod';

export const SiteSettingsSchema = z.object({
  allow_registration: z.boolean(),
  allow_upload: z.boolean(),
  skip_patterns: z.string(),
  heavyweight_process: z.number(),
  map_api_key: z.string(),
  map_api_provider: z.string(),
  captioning_model: z.string(),
  llm_model: z.string(),
});

export type SiteSettings = z.infer<typeof SiteSettingsSchema>;
