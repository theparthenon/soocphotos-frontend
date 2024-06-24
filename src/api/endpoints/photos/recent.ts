import { PigPhotoSchema } from "@/@types/photos";
import { RecentlyAddedPhotosResponse, RecentlyAddedPhotosResponseSchema } from "@/@types/photos/recent";
import { api } from "@/api/api";
import { EndpointUrls, Endpoints } from "@/constants/api.constant";

export const photosRecentApi = api.injectEndpoints({
    endpoints: builder => ({
        [Endpoints.fetchRecentlyAddedPhotos]: builder.query<RecentlyAddedPhotosResponse, void>({
            query: () => EndpointUrls.photosRecentlyAdded,

            async onQueryStarted(_args, { queryFulfilled, dispatch }) {
                dispatch({ type: "FETCH_RECENTLY_ADDED_PHOTOS" });
                const response = await queryFulfilled;
                const { results: photosFlat, date } = RecentlyAddedPhotosResponseSchema.parse(response.data);
                dispatch({
                    type: "FETCH_RECENTLY_ADDED_PHOTOS_FULFILLED",
                    payload: { photosFlat, date },
                });
            },
        }),
    }),
})
.enhanceEndpoints<"RecentlyAddedPhotos">({
    addTagTypes: ["RecentlyAddedPhotos"],
    endpoints: {
        [Endpoints.fetchRecentlyAddedPhotos]: {
            providesTags: ["RecentlyAddedPhotos"],
        },
    },
});

export const {
    useLazyFetchRecentlyAddedPhotosQuery
} = photosRecentApi;