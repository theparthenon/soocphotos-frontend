import { Server } from '@/api/apiClient';
import { notification } from '@/services/notifications';
import { DeleteMissingPhotosResponse } from '@/@types/utils';

export function deleteMissingPhotos() {
  return function cb(dispatch) {
    dispatch({ type: 'DELETE_MISSING_PHOTOS' });
    dispatch({ type: 'SET_WORKER_AVAILABILITY', payload: false });
    dispatch({
      type: 'SET_WORKER_RUNNING_JOB',
      payload: { job_type_str: 'Delete Missing Photos' },
    });
    Server.get(`deletemissingphotos`)
      .then((response) => {
        const data = DeleteMissingPhotosResponse.parse(response.data);
        notification.deleteMissingPhotos();

        dispatch({
          type: 'DELETE_MISSING_PHOTOS_FULFILLED',
          payload: data,
        });
      })
      .catch((err) => {
        dispatch({ type: 'DELETE_MISSING_PHOTOS_REJECTED', payload: err });
      });
  };
}
