import { User } from '@/@types/user';
import { api } from '@/api/api';
import { EndpointUrls, Endpoints } from '@/constants/api.constant';
import { notification } from '@/services/notifications';

export const userApi = api
  .injectEndpoints({
    endpoints: (builder) => ({
      [Endpoints.updateAvatar]: builder.mutation<User, { id: string; data: FormData }>({
        query: ({ id, data }) => ({
          url: EndpointUrls.user + id + '/',
          method: 'PATCH',
          body: data,
        }),
        async onQueryStarted(_, { queryFulfilled }) {
          const { data } = await queryFulfilled;
          notification.updateUser(data.username);
        },
      }),
      [Endpoints.updateUser]: builder.mutation<User, User>({
        query: (user) => ({
          url: EndpointUrls.user + user.id + '/',
          method: 'PATCH',
          body: user,
        }),
        async onQueryStarted(_, { queryFulfilled }) {
          const { data } = await queryFulfilled;
          notification.updateUser(data.username);
        },
      }),
    }),
  })
  .enhanceEndpoints<'UserSelfDetails' | 'UserList'>({
    endpoints: {
      [Endpoints.updateAvatar]: {
        invalidatesTags: ['UserSelfDetails', 'UserList'],
      },
      [Endpoints.updateUser]: {
        invalidatesTags: ['UserSelfDetails', 'UserList'],
      },
    },
  });

export const { useUpdateAvatarMutation, useUpdateUserMutation } = userApi;
