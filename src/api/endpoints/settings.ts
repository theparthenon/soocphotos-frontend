import { SiteSettings, SiteSettingsSchema } from '@/@types/settings';
import { api } from '@/api/api';
import { EndpointUrls, Endpoints } from '@/constants/api.constant';

const settingsApi = api
  .injectEndpoints({
    endpoints: (builder) => ({
      [Endpoints.getSettings]: builder.query<SiteSettings, void>({
        query: () => EndpointUrls.siteSettings,
        transformResponse: (response) => SiteSettingsSchema.parse(response),
      }),
      [Endpoints.updateSettings]: builder.mutation<SiteSettings, Partial<SiteSettings>>({
        query: (body) => ({
          method: 'POST',
          url: EndpointUrls.siteSettings,
          body,
        }),
        transformResponse: (response) => SiteSettingsSchema.parse(response),
      }),
    }),
  })
  .enhanceEndpoints<'SiteSettings'>({
    addTagTypes: ['SiteSettings'],
    endpoints: {
      [Endpoints.getSettings]: {
        providesTags: ['SiteSettings'],
      },
      [Endpoints.updateSettings]: {
        invalidatesTags: ['SiteSettings'],
      },
    },
  });

export const { useGetSettingsQuery, useUpdateSettingsMutation } = settingsApi;
