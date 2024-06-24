import { DirTreeResponse, DirTreeResponseSchema } from '@/@types/dir-tree';
import { api } from '@/api/api';
import { EndpointUrls, Endpoints } from '@/constants/api.constant';

export const dirTreeApi = api
  .injectEndpoints({
    endpoints: (builder) => ({
      [Endpoints.fetchDirs]: builder.query<DirTreeResponse, string>({
        query: (path: string) => EndpointUrls.visualDirTree + '?path=' + path,
        transformResponse: (response: DirTreeResponse) => DirTreeResponseSchema.parse(response),
      }),
    }),
  })
  .enhanceEndpoints<'DirTree'>({
    addTagTypes: ['DirTree'],
    endpoints: {
      [Endpoints.fetchDirs]: {
        providesTags: ['DirTree'],
      },
    },
  });

export const { useLazyFetchDirsQuery } = dirTreeApi;
