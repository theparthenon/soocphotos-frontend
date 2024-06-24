import { notification } from "@/services/notifications";
import { api } from "@/api/api";
import { photoDetailsApi } from "@/api/endpoints/photos/photoDetail";
import { Endpoints, EndpointUrls } from "@/constants/api.constant";
import { FavoritePhotosRequest, UpdatedPhotosResponse, UpdatedPhotosResponseSchema } from "@/@types/photos/favorite";

export const photosFavoriteApi = api.injectEndpoints({
    endpoints: builder => ({
        [Endpoints.setFavoritePhotos]: builder.mutation<UpdatedPhotosResponse, FavoritePhotosRequest>({
            query: ({ image_hashes, favorite }) => ({
                method: "POST",
                body: {
                    image_hashes,
                    favorite
                },
                url: EndpointUrls.tasksPhotosEditFavorite
            }),

            async onQueryStarted({ image_hashes, favorite }, { dispatch, queryFulfilled }) {
                dispatch({ type: "SET_PHOTOS_FAVORITE" });
                const response = await queryFulfilled;
                const data = UpdatedPhotosResponseSchema.parse(response.data);
                dispatch({
                    type: "SET_PHOTOS_FAVORITE_FULFILLED",
                    payload: {
                        image_hashes,
                        favorite,
                        updatedPhotos: data.updated
                    },
                });
                // TODO: invalidate tags when we have them
                dispatch(photoDetailsApi.endpoints.fetchPhotoDetails.initiate(image_hashes[0])).refetch();
                notification.togglePhotosFavorite(image_hashes.length, favorite);
            },
        }),
    }),
});

export const {
    useSetFavoritePhotosMutation
} = photosFavoriteApi;