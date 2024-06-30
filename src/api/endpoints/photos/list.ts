import { PaginatedPhotosResponse, PaginatedPhotosResponseSchema } from "@/@types/photos/list";
import { api } from "@/api/api";
import { Endpoints } from "@/constants/api.constant";

export const photoListApi = api.injectEndpoints({
    endpoints: builder => ({
      [Endpoints.fetchPhotosWithoutTimestamp]: builder.query<PaginatedPhotosResponse, number>({
        query: page => `photos/without-timestamp/?page=${page}`,
        async onQueryStarted(page, { dispatch, queryFulfilled }) {
          dispatch({ type: "FETCH_NO_TIMESTAMP_PHOTOS_PAGINATED" });
          const response = await queryFulfilled;
          try {
            const data = PaginatedPhotosResponseSchema.parse(response.data);
            dispatch({
              type: "FETCH_NO_TIMESTAMP_PHOTOS_PAGINATED_FULFILLED",
              payload: { photosFlat: data.results, page, photosCount: data.count },
            });
          } catch (e) {
            dispatch({ type: "FETCH_NO_TIMESTAMP_PHOTOS_PAGINATED_REJECTED", payload: e });
          }
        },
      }),
    }),
});

export const { useLazyFetchPhotosWithoutTimestampQuery } = photoListApi;
