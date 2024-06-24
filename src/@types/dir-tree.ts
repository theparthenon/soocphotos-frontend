import { z, ZodType } from 'zod';

export interface DirTree {
  title: string;
  absolute_path: string;
  children: DirTree[];
}

export type DirTreeResponse = DirTree[];

export const DirTreeSchema: ZodType<DirTree> = z.lazy(() =>
  z.object({
    title: z.string(),
    absolute_path: z.string(),
    children: z.array(DirTreeSchema),
  })
);

export const DirTreeResponseSchema: ZodType<DirTreeResponse> = z.array(DirTreeSchema);
