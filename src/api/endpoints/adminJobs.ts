import { JobsResponseSchema } from '@/@types/job';
import type { JobsResponse, JobRequest } from '@/@types/job';
import { api } from '@/api/api';
import { EndpointUrls, Endpoints } from '@/constants/api.constant';

const adminJobsApi = api
  .injectEndpoints({
    endpoints: (builder) => ({
      [Endpoints.jobs]: builder.query<JobsResponse, JobRequest>({
        query: ({ pageSize = 10, page = 0 }) => ({
          url: EndpointUrls.jobs + `?page=${page}&page_size=${pageSize}`,
        }),
        transformResponse: JobsResponseSchema.parse,
      }),
      [Endpoints.deleteJob]: builder.mutation<void, number>({
        query: (id) => ({
          method: 'DELETE',
          url: EndpointUrls.jobs + id + '/',
        }),
      }),
    }),
  })
  .enhanceEndpoints<'Jobs'>({
    addTagTypes: ['Jobs'],
    endpoints: {
      [Endpoints.jobs]: {
        providesTags: ['Jobs'],
      },
      [Endpoints.deleteJob]: {
        invalidatesTags: ['Jobs'],
      },
    },
  });

export const { useJobsQuery, useDeleteJobMutation } = adminJobsApi;
