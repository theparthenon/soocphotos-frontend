import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { BaseQueryFn, FetchArgs } from "@reduxjs/toolkit/query/react";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import sessionStorage from "redux-persist/es/storage/session";


import type { IApiDeleteUserPost, IApiLoginPost, IApiLoginResponse } from "@/@types/auth";
import { ApiLoginResponseSchema } from "@/@types/auth";
import type {
  IClusterFacesResponse,
  IDeleteFacesRequest,
  IDeleteFacesResponse,
  IIncompletePersonFaceListRequest,
  IIncompletePersonFaceListResponse,
  IPersonFaceListRequest,
  IPersonFaceListResponse,
  IScanFacesResponse,
  ISetFacesLabelRequest,
  ISetFacesLabelResponse,
  ITrainFacesResponse,
} from "@/@types/faces";
import { tokenReceived } from "@/store/auth/authSlice";
import type { RootState } from "@/store/store";
import type { IUploadOptions, IUploadResponse } from "@/@types/upload";
import { UploadExistResponse, UploadResponse } from "@/@types/upload";
import type { IManageUser, IUser, UserList } from "@/@types/user";
import { ApiUserListResponseSchema, ManageUser, UserSchema } from "@/@types/user";
import type {
  IGenerateEventAlbumsTitlesResponse,
  ImageTagResponseType,
  ServerStatsResponseType,
  StorageStatsResponseType,
} from "@/@types/utils";
import type { IWorkerAvailabilityResponse } from "@/@types/job";
import { EndpointUrls, Endpoints } from "@/constants/api.constant";
import { Server } from "./apiClient";
import session from "redux-persist/lib/storage/session";

const baseQuery = fetchBaseQuery({
  baseUrl: "/api/",
  prepareHeaders: async (headers, { endpoint }) => {
    const accessToken = await sessionStorage.getItem("access");
    if (accessToken !== null && endpoint !== "refresh") {
      headers.set("Authorization", `Bearer ${accessToken}`);
    }

    return headers;
  },
});

export const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    // Try to get a new token
    const refreshToken = await sessionStorage.getItem("refresh");

    if (refreshToken) {
      const refreshResult = (await baseQuery(
        { url: "/auth/token/refresh/", method: "POST", body: { refresh: refreshToken } },
        api,
        extraOptions
      )) as { data: { access: string } };

      if (refreshResult.data) {
        sessionStorage.setItem("access", refreshResult.data.access);

        // Retry the initial query
        result = await baseQuery(args, api, extraOptions);
      }
    }
  }

  return result;
};

export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Albums", "Faces", "PeopleAlbums", "Photos", "UserList", "UserSelfDetails"],
  endpoints: builder => ({
    [Endpoints.login]: builder.mutation<IApiLoginResponse, IApiLoginPost>({
      query: body => ({
        url: "/auth/token/obtain/",
        method: "POST",
        body,
      }),
      transformResponse: (response: IApiLoginResponse) => {
        const data = ApiLoginResponseSchema.parse(response);
        sessionStorage.setItem("access", data.access);
        sessionStorage.setItem("refresh", data.refresh);

        return data;
      },
    }),
    [Endpoints.generateAutoAlbumTitle]: builder.query<IGenerateEventAlbumsTitlesResponse, void>({
      query: () => ({
        url: "/generate/auto-album-title/",
      }),
    }),
    [Endpoints.fetchPredefinedRules]: builder.query<any[], void>({
      query: () => "/rules/predefined/",
      transformResponse: (response: string) => JSON.parse(response),
    }),
    [Endpoints.fetchUserSelfDetails]: builder.query<IUser, string>({
      query: userId => `/user/${userId}/`,
      transformResponse: (response: string) => UserSchema.parse(response),
      providesTags: (result, error, id) => [{ type: "UserSelfDetails" as const, id }],
    }),
    [Endpoints.fetchUserList]: builder.query<UserList, void>({
      query: () => ({
        url: "/user/",
        method: "GET",
      }),
      transformResponse: (response: string) => ApiUserListResponseSchema.parse(response).results,
      providesTags: ["UserList"],
    }),
    [Endpoints.manageUpdateUser]: builder.mutation<IManageUser, IManageUser>({
      query: (body) => ({
        method: "PATCH",
        body,
        url: `/user/manage/${body.id}/`,
      }),
      transformResponse: (response) => ManageUser.parse(response),
      invalidatesTags: ["UserList"],
    }),
    [Endpoints.deleteUser]: builder.mutation<any, IApiDeleteUserPost>({
      query: (body) => ({
        method: "DELETE",
        body,
        url: `/user/delete/${body.id}/`,
      }),
      invalidatesTags: ["UserList"],
    }),
    [Endpoints.uploadExists]: builder.query<boolean, string>({
      query: hash => `/photos/exists/${hash}/`,
      transformResponse: (response: string) => UploadExistResponse.parse(response).exists,
    }),
    [Endpoints.uploadFinished]: builder.mutation<void, FormData>({
      query: form_data => ({
        url: "/upload/complete/",
        method: "POST",
        body: form_data,
      }),
    }),
    [Endpoints.upload]: builder.mutation<IUploadResponse, IUploadOptions>({
      query: options => ({
        url: "/upload/",
        method: "POST",
        body: options.form_data,
        headers: {
          "Content-Range": `bytes ${options.offset}-${options.offset + options.chunk_size - 1}/${options.chunk_size}`,
        },
      }),
      transformResponse: (response: IUploadResponse) => UploadResponse.parse(response),
    }),
    [Endpoints.worker]: builder.query<IWorkerAvailabilityResponse, void>({
      query: () => ({
        url: "/queue-availability/",
        method: "GET",
      }),
    }),
    [Endpoints.incompleteFaces]: builder.query<IIncompletePersonFaceListResponse, IIncompletePersonFaceListRequest>({
      query: ({ inferred = false }) => ({
        url: `faces/incomplete/?inferred=${inferred}`,
      }),
      providesTags: ["Faces"],
    }),
    [Endpoints.fetchFaces]: builder.query<IPersonFaceListResponse, IPersonFaceListRequest>({
      query: ({ person, page = 0, inferred = false, orderBy = "confidence" }) => ({
        url: `faces/?person=${person}&page=${page}&inferred=${inferred}&order_by=${orderBy}`,
      }),
      providesTags: ["Faces"],
    }),
    [Endpoints.clusterFaces]: builder.query<IClusterFacesResponse, void>({
      query: () => ({
        url: "/faces/cluster/",
      }),
    }),
    [Endpoints.rescanFaces]: builder.query<IScanFacesResponse, void>({
      query: () => ({
        url: "/faces/scan/",
        method: "POST",
      }),
    }),
    [Endpoints.trainFaces]: builder.mutation<ITrainFacesResponse, void>({
      query: () => ({
        url: "/faces/train/",
        method: "POST",
      }),
    }),
    [Endpoints.deleteFaces]: builder.mutation<IDeleteFacesResponse, IDeleteFacesRequest>({
      query: ({ faceIds }) => ({
        url: "/faces/delete/",
        method: "POST",
        body: { face_ids: faceIds },
      }),
    }),
    [Endpoints.setFacesPersonLabel]: builder.mutation<
      ISetFacesLabelResponse,
      ISetFacesLabelRequest
    >({
      query: ({ faceIds, personName }) => ({
        url: "/faces/label/",
        method: "POST",
        body: { person_name: personName, face_ids: faceIds },
      }),
    }),
    [Endpoints.fetchServerStats]: builder.query<ServerStatsResponseType, void>({
      query: () => ({
        url: "/stats/server/",
      }),
    }),
    [Endpoints.fetchStorageStats]: builder.query<StorageStatsResponseType, void>({
      query: () => ({
        url: "/stats/storage/",
      }),
    }),
    [Endpoints.fetchImageTag]: builder.query<ImageTagResponseType, void>({
      query: () => ({
        url: "/image-tag/",
      }),
    }),
  }),
});

export const {
  useFetchUserListQuery,
  useFetchPredefinedRulesQuery,
  useFetchIncompleteFacesQuery,
  useLoginMutation,
  useWorkerQuery,
  useDeleteUserMutation,
  useManageUpdateUserMutation,
  useFetchServerStatsQuery,
  useFetchStorageStatsQuery,
  useFetchImageTagQuery,
} = api;
