import _ from 'lodash';

import { api } from '@/api/api';
import { EndpointUrls, Endpoints } from '@/constants/api.constant';
import { notification } from '@/services/notifications';
import { People, PeopleResponseSchema } from '@/@types/albums/people';

export const peopleAlbumsApi = api
  .injectEndpoints({
    endpoints: (builder) => ({
      [Endpoints.fetchPeopleAlbums]: builder.query<People, void>({
        query: () => "people/?page_size=1000",
        transformResponse: (response) => {
          const people = PeopleResponseSchema.parse(response).results.map((item) => ({
            key: item.id.toString(),
            value: item.name,
            text: item.name,
            video: !!item.video,
            face_count: item.face_count,
            face_photo_url: item.face_photo_url ?? '',
            face_url: item.face_url ?? '',
          }));
          return _.orderBy(people, ['text', 'face_count'], ['asc', 'desc']);
        },
      }),
      [Endpoints.renamePersonAlbum]: builder.mutation<
        void,
        { id: string; personName: string; newPersonName: string }
      >({
        query: ({ id, newPersonName }) => ({
          url: `people/${id}/`,
          method: 'PATCH',
          body: { newPersonName },
        }),
        transformResponse: (response, meta, query) => {
          notification.renamePerson(query.personName, query.newPersonName);
        },
      }),
      [Endpoints.deletePersonAlbum]: builder.mutation<void, string>({
        query: (id) => ({
          url: `people/${id}/`,
          method: 'DELETE',
        }),
        transformResponse: () => {
          notification.deletePerson();
        },
      }),
      [Endpoints.setPersonAlbumCover]: builder.mutation<void, { id: string; cover_photo: string }>({
        query: ({ id, cover_photo }) => ({
          url: `people/${id}/`,
          method: 'PATCH',
          body: { cover_photo },
        }),
        transformResponse: () => {
          notification.setCoverPhoto();
        },
      }),
    }),
  })
  .enhanceEndpoints<'PeopleAlbums'>({
    addTagTypes: ['PeopleAlbums'],
    endpoints: {
      [Endpoints.fetchPeopleAlbums]: {
        providesTags: ['PeopleAlbums'],
      },
      [Endpoints.renamePersonAlbum]: {
        invalidatesTags: ['PeopleAlbums', 'Faces'],
      },
      [Endpoints.deletePersonAlbum]: {
        invalidatesTags: ['PeopleAlbums', 'Faces'],
      },
    },
  });

export const {
  useFetchPeopleAlbumsQuery,
  useRenamePersonAlbumMutation,
  useDeletePersonAlbumMutation,
  useSetPersonAlbumCoverMutation,
} = peopleAlbumsApi;
