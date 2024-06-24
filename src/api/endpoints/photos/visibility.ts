import { notification } from "@/services/notifications";
import { api } from "@/api/api";
import { photoDetailsApi } from "@/api/endpoints/photos/photoDetail";
import { EndpointUrls, Endpoints } from "@/constants/api.constant";
import { SetPhotosHiddenRequest, UpdatePhotosResponse } from "@/@types/photos/visibility";
import { UpdatedPhotosResponseSchema } from "@/@types/photos/favorite";


export const photoVisibilityApi = api.injectEndpoints({
    endpoints: builder => ({
        [Endpoints.setPhotosHidden]: builder.mutation<UpdatePhotosResponse, SetPhotosHiddenRequest>({
            query: ({ image_hashes, hidden }) => ({
                method: "POST",
                body: { image_hashes, hidden },
                url: EndpointUrls.tasksPhotosEditHide
            }),

            async onQueryStarted({ image_hashes, hidden }, { dispatch, queryFulfilled }) {
                dispatch({ type: "SET_PHOTOS_HIDDEN" });
                const response = await queryFulfilled;
                const { updated: updatedPhotos } = UpdatedPhotosResponseSchema.parse(response.data);
                dispatch({
                    type: "SET_PHOTOS_HIDDEN_FULFILLED",
                    payload: {
                        image_hashes,
                        hidden,
                        updatedPhotos
                    },
                });
                notification.togglePhotosHidden(image_hashes.length, false);

                if (image_hashes.length === 1) {
                    // TODO: invalidate tags when we have them
                    dispatch(photoDetailsApi.endpoints.fetchPhotoDetails.initiate(image_hashes[0])).refetch();
                }
            },
        }),
    }),
});

export const {
    useSetPhotosHiddenMutation
} = photoVisibilityApi;