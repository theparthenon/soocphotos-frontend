import {
  PlacesAlbumsResponseSchema,
  PlaceAlbumResponseSchema,
  LocationClustersResponseSchema,
} from '@/@types/albums/place';
import type { PlaceAlbumList, LocationClusters, PlaceAlbum } from '@/@types/albums/place';
import { api } from '@/api/api';
import { EndpointUrls, Endpoints } from '@/constants/api.constant';

export const placesAlbumsApi = api
  .injectEndpoints({
    endpoints: (builder) => ({
      [Endpoints.fetchPlacesAlbums]: builder.query<PlaceAlbumList, void>({
        query: () => EndpointUrls.albumsPlaceList,
        transformResponse: (response) => PlacesAlbumsResponseSchema.parse(response).results,
      }),
      [Endpoints.fetchPlaceAlbum]: builder.query<PlaceAlbum, string>({
        query: (album_id) => `albums/place/${album_id}/`,
        transformResponse: (response) => PlaceAlbumResponseSchema.parse(response).results,
      }),
      [Endpoints.fetchLocationClusters]: builder.query<LocationClusters, void>({
        query: () => EndpointUrls.visualLocationClusters,
        transformResponse: (response) => LocationClustersResponseSchema.parse(response),
      }),
    }),
  })
  .enhanceEndpoints<'PlaceAlbums'>({
    addTagTypes: ['PlaceAlbums'],
    endpoints: {
      [Endpoints.fetchPlacesAlbums]: {
        providesTags: ['PlaceAlbums'],
      },
    },
  });

export const { useFetchPlacesAlbumsQuery, useFetchLocationClustersQuery, useFetchPlaceAlbumQuery } =
  placesAlbumsApi;
