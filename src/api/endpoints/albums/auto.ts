import { AutoAlbum, AutoAlbumSchema } from '@/@types/albums';
import { AutoAlbumList, AutoAlbumListResponseSchema } from '@/@types/albums/auto';
import { api } from '@/api/api';
import { EndpointUrls, Endpoints } from '@/constants/api.constant';
import { notification } from '@/services/notifications';

export const autoAlbumsApi = api
  .injectEndpoints({
    endpoints: (builder) => ({
      [Endpoints.fetchAutoAlbums]: builder.query<AutoAlbumList, void>({
        query: () => EndpointUrls.albumsAutoList,
        transformResponse: (response) => AutoAlbumListResponseSchema.parse(response).results,
      }),
      [Endpoints.fetchAutoAlbum]: builder.query<AutoAlbum, string>({
        query: (id) => EndpointUrls.albumsAuto + id + '/',
        transformResponse: (response) => AutoAlbumSchema.parse(response),
      }),
      [Endpoints.deleteAutoAlbum]: builder.mutation<void, { id: string; albumTitle: string }>({
        query: ({ id }) => ({
          url: EndpointUrls.albumsAuto + id + '/',
          method: 'DELETE',
          body: {},
        }),
        transformResponse: (response, meta, query) => {
          notification.deleteAlbum(query.albumTitle);
        },
      }),
      [Endpoints.deleteAllAutoAlbums]: builder.mutation<void, void>({
        query: () => ({
          url: EndpointUrls.tasksAutoAlbumDeleteAll,
          method: 'POST',
          body: {},
        }),
        transformResponse: () => {
          notification.deleteAutogeneratedAlbums();
        },
      }),
      [Endpoints.generateAutoAlbums]: builder.mutation<void, void>({
        query: () => ({
          url: EndpointUrls.tasksAutoAlbumGenerate,
          method: 'POST',
          body: {},
        }),
        transformResponse: () => {
          notification.generateEventAlbums();
        },
      }),
    }),
  })
  .enhanceEndpoints<'AutoAlbums' | 'AutoAlbum'>({
    addTagTypes: ['AutoAlbums', 'AutoAlbum'],
    endpoints: {
      [Endpoints.fetchAutoAlbums]: {
        providesTags: ['AutoAlbums'],
      },
      [Endpoints.fetchAutoAlbum]: {
        providesTags: ['AutoAlbum'],
      },
      [Endpoints.deleteAutoAlbum]: {
        invalidatesTags: ['AutoAlbums', 'AutoAlbum'],
      },
      [Endpoints.deleteAllAutoAlbums]: {
        invalidatesTags: ['AutoAlbums', 'AutoAlbum'],
      },
      [Endpoints.generateAutoAlbums]: {
        invalidatesTags: ['AutoAlbums', 'AutoAlbum'],
      },
    },
  });

export const {
  useFetchAutoAlbumsQuery,
  useLazyFetchAutoAlbumQuery,
  useDeleteAutoAlbumMutation,
  useDeleteAllAutoAlbumsMutation,
  useGenerateAutoAlbumsMutation,
} = autoAlbumsApi;
