import {
  SearchExamples,
  SearchExamplesResponseSchema,
  SearchPhotosResult,
  SearchPhotosSchema,
} from '@/@types/search';
import { api } from '@/api/api';
import { EndpointUrls, Endpoints } from '@/constants/api.constant';
import { getPhotosFlatFromGroupedByDate } from '@/utils/utils';

const searchApi = api
  .injectEndpoints({
    endpoints: (builder) => ({
      [Endpoints.searchExamples]: builder.query<SearchExamples, void>({
        query: () => EndpointUrls.tasksSearchExampleTerms,
        transformResponse: (response) => SearchExamplesResponseSchema.parse(response).results,
      }),
      [Endpoints.searchPhotos]: builder.query<SearchPhotosResult, string>({
        query: (query) => EndpointUrls.photosSearch + '?search=' + query,
        transformResponse: (response) => {
          try {
            const photosGroupedByDate = SearchPhotosSchema.parse(response).results;
            return {
              photosFlat: getPhotosFlatFromGroupedByDate(photosGroupedByDate),
              photosGroupedByDate,
            };
          } catch (e) {
            return {
              // @ts-ignore
              photosFlat: response.results,
              photosGroupedByDate: [],
            };
          }
        },
      }),
    }),
  })
  .enhanceEndpoints<'SearchExamples' | 'SearchPhotos'>({
    addTagTypes: ['SearchExamples', 'SearchPhotos'],
    endpoints: {
      [Endpoints.searchExamples]: {
        providesTags: ['SearchExamples'],
      },
      [Endpoints.searchPhotos]: {
        providesTags: ['SearchPhotos'],
      },
    },
  });

export const { useSearchExamplesQuery, useSearchPhotosQuery } = searchApi;
