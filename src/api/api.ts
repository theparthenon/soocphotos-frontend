import type { BaseQueryResult } from "@reduxjs/toolkit/dist/query/baseQueryTypes";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { BaseQueryFn, FetchArgs } from "@reduxjs/toolkit/query/react";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import type { IApiDeleteUserPost, IApiLoginPost, IApiLoginResponse } from "@/@types/auth";
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
import { API_URL, EndpointUrls, Endpoints } from "@/constants/api.constant";
import { Server } from "./apiClient";

const baseQuery = fetchBaseQuery({
  baseUrl: "/api/",
  credentials: "include",

  prepareHeaders: (headers, { getState, endpoint }) => {
    const { user } = getState() as RootState;
    const { access } = (getState() as RootState).auth;
    if (access !== null && user && endpoint !== "refresh") {
      headers.set("Authorization", `Bearer ${access.token}`);
    }
    return headers;
  },
});

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    // Try to get a new token
    const refreshToken: string | undefined = (api.getState() as RootState).auth?.refresh?.token;

    if (refreshToken) {
      const refreshResult = await baseQuery(
        {
          url: EndpointUrls.authRefresh,
          method: "POST",
          body: {
            refresh: refreshToken,
          },
        },
        api,
        extraOptions
      );

      if (refreshResult.data) {
        // Store the new token
        api.dispatch(tokenReceived(refreshResult.data));

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
  endpoints: (builder) => ({
    [Endpoints.login]: builder.mutation<IApiLoginResponse, IApiLoginPost>({
      query: (body) => ({
        url: EndpointUrls.authObtain,
        method: "POST",
        body,
      }),
      transformResponse: (result: BaseQueryResult<any>) => {
        Server.defaults.headers.common.Authorization = `Bearer ${result.access}`;

        return result;
      },
    }),
    [Endpoints.generateAutoAlbumTitle]: builder.query<IGenerateEventAlbumsTitlesResponse, void>({
      query: () => ({
        url: EndpointUrls.tasksAutoAlbumGenerateTitle,
      }),
    }),
    [Endpoints.fetchPredefinedRules]: builder.query<any[], void>({
      query: () => EndpointUrls.tasksRulesPredefined,
      transformResponse: (response: string) => JSON.parse(response),
    }),
    [Endpoints.fetchUserSelfDetails]: builder.query<IUser, string>({
      query: userId => EndpointUrls.user + userId + "/",
      transformResponse: (response: string) => UserSchema.parse(response),
      providesTags: (result, error, id) => [{ type: "UserSelfDetails" as const, id }],
    }),
    [Endpoints.fetchUserList]: builder.query<UserList, void>({
      query: () => ({
        url: EndpointUrls.user,
        method: "GET",
      }),
      transformResponse: (response: string) => ApiUserListResponseSchema.parse(response).results,
      providesTags: ["UserList"],
    }),
    [Endpoints.manageUpdateUser]: builder.mutation<IManageUser, IManageUser>({
      query: (body) => ({
        method: "PATCH",
        body,
        url: EndpointUrls.userManage + body.id + "/",
      }),
      transformResponse: (response) => ManageUser.parse(response),
      invalidatesTags: ["UserList"],
    }),
    [Endpoints.deleteUser]: builder.mutation<any, IApiDeleteUserPost>({
      query: (body) => ({
        method: "DELETE",
        body,
        url: EndpointUrls.userDelete + body.id + "/",
      }),
      invalidatesTags: ["UserList"],
    }),
    [Endpoints.uploadExists]: builder.query<boolean, string>({
      query: (hash) => EndpointUrls.photosExists + hash,
      transformResponse: (response: string) => UploadExistResponse.parse(response).exists,
    }),
    [Endpoints.uploadFinished]: builder.mutation<void, FormData>({
      query: (form_data) => ({
        url: EndpointUrls.tasksUploadComplete,
        method: "POST",
        body: form_data,
      }),
    }),
    [Endpoints.upload]: builder.mutation<IUploadResponse, IUploadOptions>({
      query: (options) => ({
        url: EndpointUrls.tasksUpload,
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
        url: EndpointUrls.tasksQueueAvailability,
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
        url: EndpointUrls.tasksFacesCluster,
      }),
    }),
    [Endpoints.rescanFaces]: builder.query<IScanFacesResponse, void>({
      query: () => ({
        url: EndpointUrls.tasksFacesScan,
        method: "POST",
      }),
    }),
    [Endpoints.trainFaces]: builder.mutation<ITrainFacesResponse, void>({
      query: () => ({
        url: EndpointUrls.tasksFacesTrain,
        method: "POST",
      }),
    }),
    [Endpoints.deleteFaces]: builder.mutation<IDeleteFacesResponse, IDeleteFacesRequest>({
      query: ({ faceIds }) => ({
        url: EndpointUrls.tasksFacesDelete,
        method: "POST",
        body: { face_ids: faceIds },
      }),
    }),
    [Endpoints.setFacesPersonLabel]: builder.mutation<
      ISetFacesLabelResponse,
      ISetFacesLabelRequest
    >({
      query: ({ faceIds, personName }) => ({
        url: EndpointUrls.tasksFacesLabel,
        method: "POST",
        body: { person_name: personName, face_ids: faceIds },
      }),
    }),
    [Endpoints.fetchServerStats]: builder.query<ServerStatsResponseType, void>({
      query: () => ({
        url: EndpointUrls.statsServer,
      }),
    }),
    [Endpoints.fetchStorageStats]: builder.query<StorageStatsResponseType, void>({
      query: () => ({
        url: EndpointUrls.statsStorage,
      }),
    }),
    [Endpoints.fetchImageTag]: builder.query<ImageTagResponseType, void>({
      query: () => ({
        url: EndpointUrls.visualImageTag,
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
