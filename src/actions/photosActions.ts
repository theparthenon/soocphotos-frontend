import axios from 'axios';
import type { Dispatch } from 'redux';
import { z } from 'zod';

// eslint-disable-next-line import/no-cycle
import { Server, serverAddress } from '@/api/apiClient';
import { photoDetailsApi } from '@/api/endpoints/photos/photoDetail';
// eslint-disable-next-line import/no-cycle
import { PhotosetType } from '@/reducers/photosReducer';
import { notification } from '@/services/notifications';
import type { AppDispatch } from '@/store/store';
import { getPhotosFlatFromGroupedByDate } from '@/utils/utils';
import type { DatePhotosGroup, Photo, PigPhoto, SimpleUser } from '@/@types/photos';
import { DatePhotosGroupSchema, PhotoSchema, PigPhotoSchema } from '@/@types/photos';
import { EndpointUrls } from '@/constants/api.constant';

export type UserPhotosGroup = {
  userId: number;
  photos: PigPhoto[];
};

const JobResponseSchema = z.object({
  status: z.boolean(),
  job_id: z.string(),
});

export const FETCH_PHOTOSET = 'FETCH_PHOTOSET';
export const FETCH_PHOTOSET_FULFILLED = 'FETCH_PHOTOSET_FULFILLED';
export const FETCH_PHOTOSET_REJECTED = 'FETCH_PHOTOSET_REJECTED';

const fetchPhotosetRejected = (err: string) => ({
  type: FETCH_PHOTOSET_REJECTED,
  payload: err,
});

export function downloadPhotos(image_hashes: string[]) {
  let fileUrl;

  const startDownloadProcess = () => {
    notification.downloadStarting();
    return Server.post(EndpointUrls.tasksPhotosDownload, {
      image_hashes,
    });
  };
  const checkDownloadStatus = (job_id) =>
    Server.get(`${EndpointUrls.tasksPhotosDownload}?job_id=${job_id}`)
      .then((response) => response.data.status)
      .catch((error) => console.error('Error checking download status:', error));

  const getDownloadFile = () =>
    axios.get<Blob>(`${serverAddress}/media/zip/${fileUrl}`, { responseType: 'blob' });

  const deleteDownloadFile = () =>
    Server.delete(EndpointUrls.tasksZipDelete + fileUrl)
      .then((response) => response.data.status)
      .catch((error) => {
        console.error('Error Deleting the file :', error);
      });

  return function () {
    startDownloadProcess()
      .then((response) => {
        fileUrl = response.data.url;
        let checkStatusInterval;

        const checkStatus = () => {
          checkDownloadStatus(response.data.job_id)
            .then((status) => {
              if (status === 'SUCCESS') {
                clearInterval(checkStatusInterval); // Stop checking once successful

                getDownloadFile()
                  .then((downlaod_response) => {
                    const downloadUrl = window.URL.createObjectURL(
                      new Blob([downlaod_response.data], { type: 'application/zip' })
                    );

                    const link = document.createElement('a');
                    link.href = downloadUrl;
                    link.setAttribute('download', 'file.zip');
                    document.body.appendChild(link);
                    link.click();
                    link.remove();
                    notification.downloadCompleted();
                    deleteDownloadFile();
                  })
                  .catch((error) => {
                    console.error('Error downloading:', error);
                  });
              } else if (status === 'FAILURE') {
                notification.downloadFailed();
                clearInterval(checkStatusInterval); // Stop checking on failure as well
                throw new Error('Download failed.');
              }
            })
            .catch((error) => {
              console.error('Error checking download status:', error);
            });
        };
        // Set up an interval to periodically check the download status
        checkStatusInterval = setInterval(checkStatus, 3000);
      })

      .catch((error) => {
        console.error('Error:', error);
      });
  };
}

const RecentlyAddedResponseDataSchema = z.object({
  results: PigPhotoSchema.array(),
  date: z.string(),
});
export const FETCH_RECENTLY_ADDED_PHOTOS = 'FETCH_RECENTLY_ADDED_PHOTOS';
export const FETCH_RECENTLY_ADDED_PHOTOS_FULFILLED = 'FETCH_RECENTLY_ADDED_PHOTOS_FULFILLED';
export const FETCH_RECENTLY_ADDED_PHOTOS_REJECTED = 'FETCH_RECENTLY_ADDED_PHOTOS_REJECTED';

export function fetchRecentlyAddedPhotos(dispatch: AppDispatch) {
  dispatch({ type: FETCH_RECENTLY_ADDED_PHOTOS });
  Server.get(EndpointUrls.photosRecentlyAdded)
    .then((response) => {
      const data = RecentlyAddedResponseDataSchema.parse(response.data);
      const photosFlat: PigPhoto[] = data.results;
      dispatch({
        type: FETCH_RECENTLY_ADDED_PHOTOS_FULFILLED,
        payload: {
          photosFlat,
          date: response.data.date,
        },
      });
    })
    .catch((error) => {
      dispatch({
        type: FETCH_RECENTLY_ADDED_PHOTOS_REJECTED,
        payload: error,
      });
    });
}

const PhotosUpdatedResponseSchema = z.object({
  status: z.boolean(),
  results: PhotoSchema.array(),
  updated: PhotoSchema.array(),
  not_updated: PhotoSchema.array(),
});

export const SET_PHOTOS_FAVORITE = 'SET_PHOTOS_FAVORITE';
export const SET_PHOTOS_FAVORITE_FULFILLED = 'SET_PHOTOS_FAVORITE_FULFILLED';
export const SET_PHOTOS_FAVORITE_REJECTED = 'SET_PHOTOS_FAVORITE_REJECTED';

export function setPhotosFavorite(image_hashes: string[], favorite: boolean) {
  return function (dispatch: Dispatch<any>) {
    dispatch({ type: SET_PHOTOS_FAVORITE });
    Server.post(EndpointUrls.tasksPhotosEditFavorite, {
      image_hashes,
      favorite,
    })
      .then((response) => {
        const data = PhotosUpdatedResponseSchema.parse(response.data);
        const updatedPhotos: Photo[] = data.updated;
        dispatch({
          type: SET_PHOTOS_FAVORITE_FULFILLED,
          payload: {
            image_hashes,
            favorite,
            updatedPhotos,
          },
        });
        // @ts-ignore
        dispatch(photoDetailsApi.endpoints.fetchPhotoDetails.initiate(image_hashes[0])).refetch();
        notification.togglePhotosFavorite(image_hashes.length, favorite);
      })
      .catch((err) => {
        dispatch({ type: SET_PHOTOS_FAVORITE_REJECTED, payload: err });
      });
  };
}

export const PHOTOS_FINAL_DELETED = 'PHOTOS_FINAL_DELETED';
export const PHOTOS_FINAL_DELETED_FULFILLED = 'PHOTOS_FINAL_DELETED_FULFILLED';
export const PHOTOS_FINAL_DELETED_REJECTED = 'PHOTOS_FINAL_DELETED_REJECTED';

export function finalPhotosDeleted(image_hashes: string[]) {
  return function cb(dispatch: Dispatch<any>) {
    dispatch({ type: PHOTOS_FINAL_DELETED });
    Server.delete(EndpointUrls.tasksPhotosEditDelete, {
      data: {
        image_hashes,
      },
    })
      .then((response) => {
        const data = PhotosUpdatedResponseSchema.parse(response.data);
        const updatedPhotos: Photo[] = data.updated;
        dispatch({
          type: PHOTOS_FINAL_DELETED_FULFILLED,
          payload: {
            image_hashes,
            updatedPhotos,
          },
        });
        notification.removePhotos(image_hashes.length);
      })
      .catch((err) => {
        dispatch({ type: PHOTOS_FINAL_DELETED_REJECTED, payload: err });
      });
  };
}

export function deleteDuplicateImage(image_hash: string, path: string) {
  return function cb(dispatch: Dispatch<any>) {
    dispatch({ type: PHOTOS_FINAL_DELETED });
    Server.delete(EndpointUrls.tasksPhotosEditDuplicateDelete, { data: { image_hash, path } })
      .then(() => notification.removePhotos(1))
      .catch((err) => dispatch({ type: PHOTOS_FINAL_DELETED_REJECTED, payload: err }));
  };
}

export const SET_PHOTOS_HIDDEN_FULFILLED = 'SET_PHOTOS_HIDDEN_FULFILLED';

export function setPhotosHidden(image_hashes: string[], hidden: boolean) {
  return function cb(dispatch: Dispatch<any>) {
    dispatch({ type: 'SET_PHOTOS_HIDDEN' });
    Server.post(EndpointUrls.tasksPhotosEditHide, {
      image_hashes,
      hidden,
    })
      .then((response) => {
        const data = PhotosUpdatedResponseSchema.parse(response.data);
        const updatedPhotos: Photo[] = data.updated;
        dispatch({
          type: SET_PHOTOS_HIDDEN_FULFILLED,
          payload: {
            image_hashes,
            hidden,
            updatedPhotos,
          },
        });
        notification.togglePhotosHidden(image_hashes.length, hidden);
        if (image_hashes.length === 1) {
          // @ts-ignore
          dispatch(photoDetailsApi.endpoints.fetchPhotoDetails.initiate(image_hashes[0])).refetch();
        }
      })
      .catch((err) => {
        dispatch({ type: 'SET_PHOTOS_HIDDEN_REJECTED', payload: err });
      });
  };
}

export function scanPhotos() {
  return function (dispatch: Dispatch<any>) {
    if (!dispatch) {
      throw new Error('dispatch is null or undefined');
    }

    dispatch({ type: 'SCAN_PHOTOS' });
    dispatch({ type: 'SET_WORKER_AVAILABILITY', payload: false });

    Server.get(EndpointUrls.tasksPhotosScan)
      .then((response) => {
        const jobResponse = JobResponseSchema.parse(response.data);
        notification.startPhotoScan();
        dispatch({ type: 'SCAN_PHOTOS_FULFILLED', payload: jobResponse });
      })
      .catch((err) => {
        if (err) {
          dispatch({ type: 'SCAN_PHOTOS_REJECTED', payload: err });
        } else {
          throw new Error('An unknown error occurred');
        }
      });
  };
}

export function scanUploadedPhotos() {
  return function (dispatch: Dispatch<any>) {
    dispatch({ type: 'SCAN_PHOTOS' });
    dispatch({ type: 'SET_WORKER_AVAILABILITY', payload: false });

    Server.get(EndpointUrls.tasksPhotosScanUploaded)
      .then((response) => {
        const jobResponse = JobResponseSchema.parse(response.data);
        notification.startUploadedPhotoScan();
        dispatch({ type: 'SCAN_PHOTOS_FULFILLED', payload: jobResponse });
      })
      .catch((err) => {
        dispatch({ type: 'SCAN_PHOTOS_REJECTED', payload: err });
      });
  };
}

export function scanAllPhotos() {
  return function (dispatch: Dispatch<any>) {
    dispatch({ type: 'SCAN_PHOTOS' });
    dispatch({ type: 'SET_WORKER_AVAILABILITY', payload: false });

    Server.get(EndpointUrls.tasksPhotosFullScan)
      .then((response) => {
        const jobResponse = JobResponseSchema.parse(response.data);
        notification.startFullPhotoScan();
        dispatch({ type: 'SCAN_PHOTOS_FULFILLED', payload: jobResponse });
      })
      .catch((err) => {
        dispatch({ type: 'SCAN_PHOTOS_REJECTED', payload: err });
      });
  };
}

const FetchPhotosByDateSchema = z.object({
  results: DatePhotosGroupSchema.array(),
});

export function fetchHiddenPhotos(dispatch: AppDispatch) {
  dispatch({ type: FETCH_PHOTOSET });
  Server.get('photos/hidden/', { timeout: 100000 })
    .then((response) => {
      const data = FetchPhotosByDateSchema.parse(response.data);
      const photosGroupedByDate: DatePhotosGroup[] = data.results;
      dispatch({
        type: FETCH_PHOTOSET_FULFILLED,
        payload: {
          photosGroupedByDate,
          photosFlat: getPhotosFlatFromGroupedByDate(photosGroupedByDate),
          photosetType: PhotosetType.HIDDEN,
        },
      });
    })
    .catch((err) => {
      dispatch(fetchPhotosetRejected(err));
    });
}

const PaginatedPigPhotosSchema = z.object({
  count: z.number(),
  next: z.string().nullable(),
  previous: z.string().nullable(),
  results: PigPhotoSchema.array(),
});
export const FETCH_NO_TIMESTAMP_PHOTOS_PAGINATED = 'FETCH_NO_TIMESTAMP_PHOTOS_PAGINATED';
export const FETCH_NO_TIMESTAMP_PHOTOS_PAGINATED_FULFILLED =
  'FETCH_NO_TIMESTAMP_PHOTOS_PAGINATED_FULFILLED';
export const FETCH_NO_TIMESTAMP_PHOTOS_PAGINATED_REJECTED =
  'FETCH_NO_TIMESTAMP_PHOTOS_PAGINATED_REJECTED';

export function fetchNoTimestampPhotoPaginated(dispatch: AppDispatch, page: number) {
  dispatch({ type: FETCH_NO_TIMESTAMP_PHOTOS_PAGINATED });
  Server.get(`${EndpointUrls.photosNoTimestamp}?page=${page}`, { timeout: 100000 })
    .then((response) => {
      const data = PaginatedPigPhotosSchema.parse(response.data);
      const photosFlat: PigPhoto[] = data.results;
      const photosCount = data.count;
      dispatch({
        type: FETCH_NO_TIMESTAMP_PHOTOS_PAGINATED_FULFILLED,
        payload: {
          photosFlat,
          page,
          photosCount,
        },
      });
    })
    .catch((err) => {
      console.error(err);
      dispatch({
        type: FETCH_NO_TIMESTAMP_PHOTOS_PAGINATED_REJECTED,
        payload: err,
      });
    });
}

export function generatePhotoIm2txtCaption(image_hash: string) {
  return function cb(dispatch: Dispatch<any>) {
    dispatch({ type: 'GENERATE_PHOTO_CAPTION' });
    Server.post(EndpointUrls.tasksPhotosEditCaptionGenerate, { image_hash }, { timeout: 200000 })
      .then(() => {
        dispatch({ type: 'GENERATE_PHOTO_CAPTION_FULFILLED' });
        // @ts-ignore
        dispatch(photoDetailsApi.endpoints.fetchPhotoDetails.initiate(image_hash)).refetch();
      })
      .catch((error) => {
        dispatch({ type: 'GENERATE_PHOTO_CAPTION_REJECTED', payload: error });
      });
  };
}

export function savePhotoCaption(image_hash: string, caption?: string | undefined) {
  return function cb(dispatch: Dispatch<any>) {
    Server.post(EndpointUrls.tasksPhotosEditCaptionSave, { image_hash, caption })
      .then(() => {
        dispatch({ type: 'SAVE_PHOTO_CAPTION_FULFILLED' });
        // @ts-ignore
        dispatch(photoDetailsApi.endpoints.fetchPhotoDetails.initiate(image_hash)).refetch();
        notification.savePhotoCaptions();
      })
      .catch((error) => {
        dispatch({ type: 'SAVE_PHOTO_CAPTION_REJECTED' });
        console.error(error);
      });
  };
}

export function editPhoto(image_hash: string, photo_details: any) {
  return function cb(dispatch: Dispatch<any>) {
    dispatch({ type: 'EDIT_PHOTO' });
    Server.patch(EndpointUrls.photosEdit + image_hash, photo_details)
      .then(() => {
        dispatch({ type: 'EDIT_PHOTO_FULFILLED' });
        notification.updatePhoto();
        // @ts-ignore
        dispatch(photoDetailsApi.endpoints.fetchPhotoDetails.initiate(image_hash)).refetch();
      })
      .catch((error) => {
        dispatch({ type: 'EDIT_PHOTO_REJECTED', payload: error });
      });
  };
}
