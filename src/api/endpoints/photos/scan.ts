import { notification } from "@/services/notifications";
import { api } from "@/api/api";
import { EndpointUrls, Endpoints } from "@/constants/api.constant";
import { JobResponse, JobResponseSchema } from "@/@types/photos/scan";

export const photosScanApi = api.injectEndpoints({
    endpoints: builder => ({
        [Endpoints.scanPhotos]: builder.mutation<JobResponse, void>({
            query: () => ({
                method: "POST",
                body: {},
                url: EndpointUrls.tasksPhotosScan
            }),

            async onQueryStarted(_args, { queryFulfilled, dispatch }) {
                dispatch({ type: "SCAN_PHOTOS" });
                dispatch({ type: "SET_WORKER_AVAILABILITY", payload: false });
                const response = await queryFulfilled;
                const jobResponse = JobResponseSchema.parse(response.data);
                notification.startPhotoScan();
                dispatch({ type: "SCAN_PHOTOS_FULFILLED", payload: jobResponse });
            },
        }),
        [Endpoints.rescanPhotos]: builder.mutation<JobResponse, void>({
            query: () => ({
                method: "POST",
                body: {},
                url: EndpointUrls.tasksPhotosFullScan
            }),

            async onQueryStarted(_args, { queryFulfilled, dispatch }) {
                dispatch({ type: "SCAN_PHOTOS" });
                dispatch({ type: "SET_WORKER_AVAILABILITY", payload: false });
                const response = await queryFulfilled;
                const jobResponse = JobResponseSchema.parse(response.data);
                notification.startFullPhotoScan();
                dispatch({ type: "SCAN_PHOTOS_FULFILLED", payload: jobResponse });
            },
        }),
    }),
});

export const {
    useScanPhotosMutation,
    useRescanPhotosMutation
} = photosScanApi;