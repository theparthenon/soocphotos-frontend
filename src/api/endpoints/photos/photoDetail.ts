import type { Photo } from "@/@types/photos";
import { notification } from "@/services/notifications";
import { api } from "@/api/api";
import { Endpoints } from "@/constants/api.constant";
import { PhotoUpdateResponse, PhotoUpdateResponseSchema, StatusResponseSchema } from "@/@types/photos/photoDetail";
import { StatusResponse } from "@/@types/photos/download";

export const photoDetailsApi = api.injectEndpoints({
    endpoints: builder => ({
        [Endpoints.fetchPhotoDetails]: builder.query<Photo, string>({
            query: hash => `photos/${hash}/`
        }),
        [Endpoints.updatePhoto]: builder.mutation<PhotoUpdateResponse, { id: string; data: Partial<Photo> }>({
            query: ({ id, data }) => ({
                method: "PATCH",
                body: data,
                url: `photos/edit/${id}/`
            }),
            async onQueryStarted(_, { queryFulfilled, dispatch }) {
                dispatch({ type: "EDIT_PHOTO" });

                try {
                    const response = await queryFulfilled;
                    const data = PhotoUpdateResponseSchema.parse(response.data);

                    dispatch({ type: "EDIT_PHOTO_FULFILLED" });
                    notification.updatePhoto();
                    dispatch(photoDetailsApi.endpoints.fetchPhotoDetails.initiate(data.image_hash)).refetch();
                } catch (e) {
                    dispatch({
                        type: "EDIT_PHOTO_REJECTED",
                        payload: e
                    });
                }
            },
        }),
        [Endpoints.savePhotoCaption]: builder.mutation<StatusResponse, { id: string; caption: string }>({
            query: ({ id, caption }) => ({
                method: "POST",
                body: { image_hash: id, caption },
                url: "/photos/edit/caption/save/"
            }),
            async onQueryStarted({ id }, { queryFulfilled, dispatch }) {
                const response = await queryFulfilled;

                StatusResponseSchema.parse(response.data);
                dispatch(photoDetailsApi.endpoints.fetchPhotoDetails.initiate(id)).refetch();
                notification.savePhotoCaptions();
            },
        }),
        [Endpoints.generateImageToTextCaption]: builder.mutation<void, { id: string }>({
            query: ({ id }) => ({
                method: "POST",
                body: { image_hash: id },
                url: "/photos/edit/caption/generate/"
            }),
            async onQueryStarted({ id }, { queryFulfilled, dispatch }) {
                const response = await queryFulfilled;

                StatusResponseSchema.parse(response.data);
                dispatch(photoDetailsApi.endpoints.fetchPhotoDetails.initiate(id)).refetch();
            },
        }),
    }),
});

export const {
    useUpdatePhotoMutation,
    useSavePhotoCaptionMutation,
    useGenerateImageToTextCaptionMutation,
    useFetchPhotoDetailsQuery
} = photoDetailsApi;