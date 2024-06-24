import { UserAlbumListResponseSchema, UserAlbumSchema } from '@/@types/albums/user';
import type {
  AddPhotoFromUserAlbumParams,
  CreateUserAlbumParams,
  DeleteUserAlbumParams,
  RemovePhotoFromUserAlbumParams,
  RenameUserAlbumParams,
  SetUserAlbumCoverParams,
  UserAlbum,
  UserAlbumList,
} from '@/@types/albums/user';
import { api } from '@/api/api';
import { EndpointUrls, Endpoints } from '@/constants/api.constant';
import { notification } from '@/services/notifications';

export const userAlbumsApi = api
  .injectEndpoints({
    endpoints: (builder) => ({
      [Endpoints.fetchUserAlbums]: builder.query<UserAlbumList, void>({
        query: () => EndpointUrls.albumsUserList,
        transformResponse: (response) => {
          if (!response) {
            throw new Error('Fetch user albums response is null');
          }
          return UserAlbumListResponseSchema.parse(response).results;
        },
      }),
      [Endpoints.fetchUserAlbum]: builder.query<UserAlbum, string>({
        query: (id) => `albums/user/${id}/`,
        transformResponse: (response) => {
          if (!response) {
            throw new Error('Fetch user album response is null');
          }
          return UserAlbumSchema.parse(response);
        },
      }),
      [Endpoints.deleteUserAlbum]: builder.mutation<void, DeleteUserAlbumParams>({
        query: ({ id }) => ({
          url: EndpointUrls.albumsUser + id + '/',
          method: 'DELETE',
          body: {},
        }),
        transformResponse: (response, meta, query) => {
          if (!query.albumTitle) {
            throw new Error('Delete user album query is missing album title');
          }
          notification.deleteAlbum(query.albumTitle);
        },
      }),
      [Endpoints.renameUserAlbum]: builder.mutation<void, RenameUserAlbumParams>({
        query: ({ id, newTitle }) => ({
          url: EndpointUrls.albumsUser + id + '/',
          method: 'PATCH',
          body: { title: newTitle },
        }),
        transformResponse: (response, meta, query) => {
          if (!query.title || !query.newTitle) {
            throw new Error('Rename user album query is missing title or new title');
          }
          notification.renameAlbum(query.title, query.newTitle);
        },
      }),
      [Endpoints.createUserAlbum]: builder.mutation<void, CreateUserAlbumParams>({
        query: ({ title, photos }) => ({
          url: EndpointUrls.albumsUserEdit,
          method: 'POST',
          body: { title, photos },
        }),
        transformResponse: (response, meta, query) => {
          if (!query.title || !query.photos) {
            throw new Error('Create user album query is missing title or photos');
          }
          notification.createAlbum(query.title, query.photos.length);
        },
      }),
      [Endpoints.removePhotoFromUserAlbum]: builder.mutation<void, RemovePhotoFromUserAlbumParams>({
        query: ({ id, photos }) => ({
          url: EndpointUrls.albumsUserEdit + id + '/',
          method: 'PATCH',
          body: { removedPhotos: photos },
        }),
        transformResponse: (response, meta, query) => {
          if (!query.title || !query.photos) {
            throw new Error('Remove photo from user album query is missing title or photos');
          }
          notification.removePhotosFromAlbum(query.title, query.photos.length);
        },
      }),
      [Endpoints.setUserAlbumCover]: builder.mutation<void, SetUserAlbumCoverParams>({
        query: ({ id, photo }) => ({
          url: EndpointUrls.albumsUserEdit + id + '/',
          method: 'PATCH',
          body: { cover_photo: photo },
        }),
        transformResponse: (response, meta, query) => {
          if (!query.photo) {
            throw new Error('Set user album cover query is missing photo');
          }
          notification.setCoverPhoto();
        },
      }),
      [Endpoints.addPhotoToUserAlbum]: builder.mutation<void, AddPhotoFromUserAlbumParams>({
        query: ({ id, title, photos }) => ({
          url: EndpointUrls.albumsUserEdit + id + '/',
          method: 'PATCH',
          body: { title, photos },
        }),
        transformResponse: (response, meta, query) => {
          if (!query.title || !query.photos) {
            throw new Error('Add photo to user album query is missing title or photos');
          }
          notification.addPhotosToAlbum(query.title, query.photos.length);
        },
      }),
    }),
  })
  .enhanceEndpoints<'UserAlbums' | 'UserAlbum' | 'SharedAlbumsByMe' | 'SharedAlbumsWithMe'>({
    addTagTypes: ['UserAlbums', 'UserAlbum', 'SharedAlbumsByMe', 'SharedAlbumsWithMe'],
    endpoints: {
      [Endpoints.fetchUserAlbums]: {
        providesTags: ['UserAlbums'],
      },
      [Endpoints.fetchUserAlbum]: {
        providesTags: ['UserAlbum'],
      },
      [Endpoints.deleteUserAlbum]: {
        invalidatesTags: ['UserAlbums'],
      },
      [Endpoints.renameUserAlbum]: {
        invalidatesTags: ['UserAlbums', 'UserAlbum'],
      },
      [Endpoints.createUserAlbum]: {
        invalidatesTags: ['UserAlbums'],
      },
      [Endpoints.removePhotoFromUserAlbum]: {
        invalidatesTags: ['UserAlbums', 'UserAlbum'],
      },
      [Endpoints.setUserAlbumCover]: {
        invalidatesTags: ['UserAlbums'],
      },
      [Endpoints.addPhotoToUserAlbum]: {
        invalidatesTags: ['UserAlbums', 'UserAlbum'],
      },
    },
  });

export const {
  useFetchUserAlbumsQuery,
  useFetchUserAlbumQuery,
  useLazyFetchUserAlbumQuery,
  useDeleteUserAlbumMutation,
  useRenameUserAlbumMutation,
  useCreateUserAlbumMutation,
  useRemovePhotoFromUserAlbumMutation,
  useSetUserAlbumCoverMutation,
  useAddPhotoToUserAlbumMutation,
} = userAlbumsApi;
