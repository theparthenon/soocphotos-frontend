import {
  Timezones,
  TimezonesSchema,
  LocationSunburst,
  LocationSunburstSchema,
  CountStats,
  CountStatsSchema,
  PhotoMonthCountResponse,
  PhotoMonthCountResponseSchema,
  WordCloudResponse,
  WordCloudResponseSchema,
} from '@/@types/utils';
import { api } from '@/api/api';
import { EndpointUrls, Endpoints } from '@/constants/api.constant';

export const util = api
  .injectEndpoints({
    endpoints: (builder) => ({
      [Endpoints.fetchTimezones]: builder.query<Timezones, void>({
        query: () => EndpointUrls.timezones,
        transformResponse: (response: string) => {
          try {
            const timezones = JSON.parse(response);
            return TimezonesSchema.parse(timezones);
          } catch (e) {
            return [];
          }
        },
      }),
      [Endpoints.fetchLocationTree]: builder.query<LocationSunburst, void>({
        query: () => EndpointUrls.visualLocationSunburst,
        transformResponse: (response) => LocationSunburstSchema.parse(response),
      }),
      [Endpoints.fetchCountStats]: builder.query<CountStats, void>({
        query: () => EndpointUrls.stats,
        transformResponse: (response) => CountStatsSchema.parse(response),
      }),
      [Endpoints.fetchWordCloud]: builder.query<WordCloudResponse, void>({
        query: () => EndpointUrls.visualWordCloud,
        async onQueryStarted(arg, { dispatch, queryFulfilled }) {
          /**
           * This is a workaround. For the time being we'll use redux store instead of cache.
           * The use of cached data is not working properly with Word Cloud component. This could be due to the timing.
           */
          dispatch({ type: 'FETCH_WORDCLOUD' });
          try {
            const { data } = await queryFulfilled;
            const payload = WordCloudResponseSchema.parse(data);
            dispatch({ type: 'FETCH_WORDCLOUD_FULFILLED', payload });
          } catch (error) {
            dispatch({ type: 'FETCH_WORDCLOUD_REJECTED', payload: error });
          }
        },
      }),
      [Endpoints.fetchPhotoMonthCount]: builder.query<PhotoMonthCountResponse, void>({
        query: () => EndpointUrls.tasksPhotosMonthCounts,
        transformResponse: (response: PhotoMonthCountResponse) =>
          PhotoMonthCountResponseSchema.parse(response),
      }),
    }),
  })
  .enhanceEndpoints<'Timezones' | 'LocationTree'>({
    addTagTypes: ['Timezones', 'LocationTree'],
    endpoints: {
      [Endpoints.fetchTimezones]: {
        providesTags: ['Timezones'],
      },
      [Endpoints.fetchLocationTree]: {
        providesTags: ['LocationTree'],
      },
    },
  });

export const {
  useFetchTimezonesQuery,
  useFetchLocationTreeQuery,
  useFetchCountStatsQuery,
  useFetchPhotoMonthCountQuery,
} = util;
