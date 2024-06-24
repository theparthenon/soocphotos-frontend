import { z } from 'zod';
import { SimpleUser } from './user';

export const JobDetailSchema = z.object({
  job_id: z.string(),
  queued_at: z.string(),
  finished: z.boolean(),
  finished_at: z.string().nullable(),
  started_at: z.string(),
  failed: z.boolean(),
  job_type_str: z.string(),
  job_type: z.number(),
  started_by: SimpleUser,
  result: z.object({
    progress: z.object({
      target: z.number(),
      current: z.number(),
    }),
  }),
  id: z.number(),
});

export type Job = z.infer<typeof JobDetailSchema>;

export const JobRequestSchema = z.object({
  pageSize: z.number().optional(),
  page: z.number().optional(),
});

export type JobRequest = z.infer<typeof JobRequestSchema>;

export const JobsResponseSchema = z
  .object({
    count: z.number(),
    next: z.string().nullable(),
    previous: z.string().nullable(),
    results: z.array(JobDetailSchema),
  })
  .optional();

export type JobsResponse = z.infer<typeof JobsResponseSchema>;

export const WorkerAvailabilityResponse = z.object({
  status: z.boolean(),
  queue_can_accept_job: z.boolean(),
  job_detail: JobDetailSchema.nullish(),
  id: z.number().optional(),
});

export type IJobDetailSchema = z.infer<typeof JobDetailSchema>;

export type IWorkerAvailabilityResponse = z.infer<typeof WorkerAvailabilityResponse>;
