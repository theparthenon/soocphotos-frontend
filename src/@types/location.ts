import { z } from 'zod';

export const LocationTimelineSchema = z.array(
  z.object({
    data: z.array(z.number()),
    color: z.string(),
    loc: z.string(),
    start: z.number(),
    end: z.number(),
  })
);

export type LocationTimeline = z.infer<typeof LocationTimelineSchema>;
