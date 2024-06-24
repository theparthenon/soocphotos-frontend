import {
  ThingsAlbumList,
  ThingsAlbumListResponseSchema,
  ThingsAlbum,
  ThingsAlbumResponseSchema,
} from '@/@types/albums/things';
import { api } from '@/api/api';
import { EndpointUrls, Endpoints } from '@/constants/api.constant';

const thingsAlbumsApi = api
  .injectEndpoints({
    endpoints: (builder) => ({
      [Endpoints.fetchThingsAlbums]: builder.query<ThingsAlbumList, void>({
        query: () => EndpointUrls.albumsThingList,
        transformResponse: (response) => ThingsAlbumListResponseSchema.parse(response).results,
      }),
      [Endpoints.fetchThingsAlbum]: builder.query<ThingsAlbum, string>({
        query: (id) => EndpointUrls.albumsThing + id + '/',
        transformResponse: (response) => ThingsAlbumResponseSchema.parse(response).results,
      }),
    }),
  })
  .enhanceEndpoints<'ThingsAlbums' | 'ThingsAlbum'>({
    addTagTypes: ['ThingsAlbums', 'ThingsAlbum'],
    endpoints: {
      [Endpoints.fetchThingsAlbums]: {
        providesTags: ['ThingsAlbums'],
      },
      [Endpoints.fetchThingsAlbum]: {
        providesTags: ['ThingsAlbum'],
      },
    },
  });

export const { useLazyFetchThingsAlbumQuery, useFetchThingsAlbumsQuery } = thingsAlbumsApi;
