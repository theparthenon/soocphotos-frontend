import { notification } from "@/services/notifications";
import { api } from "@/api/api";
import { Endpoints, EndpointUrls } from "@/constants/api.constant";
import { DeleteDuplicatePhotoRequest, DeleteMissingPhotosResponse, DeleteMissingPhotosResponseSchema, DeletePhotosRequest, DeletePhotosResponse, DeletePhotosResponseSchema, PurgePhotosRequest, PurgePhotosResponse, PurgePhotosResponseSchema } from "@/@types/photos/delete";

export const photoDeleteApi = api.injectEndpoints({
    endpoints: builder => ({
        [Endpoints.markPhotosDeleted]: builder.mutation<DeletePhotosResponse, DeletePhotosRequest>({
            query: ({ image_hashes, deleted }) => ({
                method: "POST",
                body: { image_hashes, deleted },
                url: EndpointUrls.tasksPhotosEditSetDeleted
            }),
            async onQueryStarted({ deleted }, { queryFulfilled
            }) {
                const response = await queryFulfilled;
                const data = DeletePhotosResponseSchema.parse(response.data);
                notification.togglePhotoDelete(deleted, data.updated.length);
            },
        }),
        [Endpoints.purgeDeletedPhotos]: builder.mutation<PurgePhotosResponse, PurgePhotosRequest>({
            query: ({ image_hashes }) => ({
                method: "DELETE",
                body: { image_hashes },
                url: EndpointUrls.tasksPhotosEditDelete
            }),
            async onQueryStarted(_args, { queryFulfilled }) {
                const response = await queryFulfilled;
                const data = PurgePhotosResponseSchema.parse(response.data);
                notification.removePhotos(data.deleted.length);
            },
        }),
        [Endpoints.deleteDuplicatePhoto]: builder.mutation<void, DeleteDuplicatePhotoRequest>({
            query: ({ image_hash, path }) => ({
                method: "DELETE",
                body: { image_hash, path },
                url: EndpointUrls.tasksPhotosEditDuplicateDelete
            }),
            async onQueryStarted(_args, { queryFulfilled }) {
                await queryFulfilled;
                notification.removePhotos(1);
            },
        }),
        [Endpoints.deleteMissingPhotos]: builder.mutation<DeleteMissingPhotosResponse, void>({
            query: () => ({
                method: "POST",
                body: {},
                url: EndpointUrls.tasksPhotosDeleteMissing
            }),
            async onQueryStarted(_, { queryFulfilled, dispatch }) {
                dispatch({ type: "DELETE_MISSING_PHOTOS" });
                dispatch({ type: "SET_WORKER_AVAILABILITY", payload: false });
                dispatch({
                    type: "SET_WORKER_RUNNING_JOB",
                    payload: { job_type_str: "Delete Missing Photos" },
                });
                const response = await queryFulfilled;
                const payload = DeleteMissingPhotosResponseSchema.parse(response.data);
                dispatch({ type: "DELETE_MISSING_PHOTOS_FULFILLED", payload});
            },
        }),
    }),
});

export const {
    useMarkPhotosDeletedMutation,
    usePurgeDeletedPhotosMutation,
    useDeleteDuplicatePhotoMutation,
    useDeleteMissingPhotosMutation
} = photoDeleteApi;