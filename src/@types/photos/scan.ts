import { z } from "zod";

export const JobResponseSchema = z.object({
    status: z.boolean(),
    job_id: z.string(),
});

export type JobResponse = z.infer<typeof JobResponseSchema>;