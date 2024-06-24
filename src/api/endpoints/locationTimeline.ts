import { LocationTimelineSchema, type LocationTimeline } from '@/@types/location';
import { api } from '@/api/api';
import { EndpointUrls, Endpoints } from '@/constants/api.constant';

export const locationTimelineApi = api.injectEndpoints({
  endpoints: (builder) => ({
    [Endpoints.locationTimeline]: builder.query<LocationTimeline, void>({
      query: () => EndpointUrls.tasksLocationTimeline,
      transformResponse: (response: LocationTimeline) => LocationTimelineSchema.parse(response),
    }),
  }),
});

export const { useLocationTimelineQuery } = locationTimelineApi;
