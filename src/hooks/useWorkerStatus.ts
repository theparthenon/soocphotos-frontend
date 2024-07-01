import { IWorkerAvailabilityResponse, IJobDetailSchema } from "@/@types/job";
import { useWorkerQuery, api } from "@/api/api";
import { dateAlbumsApi } from "@/api/endpoints/albums/date";
import { peopleAlbumsApi } from "@/api/endpoints/albums/people";
import { PhotosetType } from "@/reducers/photosReducer";
import { notification } from "@/services/notifications";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { selectUserSelfDetails } from "@/store/user/userSelectors";
import { useState, useEffect } from "react";

export enum WorkerState {
  SET_WORKER_AVAILABILITY = "set-worker-availability",
  SET_WORKER_RUNNING_JOB = "set-worker-running-job",
}

const defaultJobDetail: IJobDetailSchema = {
  id: 0,
  job_id: "",
  queued_at: "",
  finished: false,
  finished_at: "",
  started_at: "",
  failed: false,
  job_type_str: "",
  job_type: 0,
  started_by: {
    id: 0,
    username: "",
    first_name: "",
    last_name: "",
  },
  result: {
    progress: {
      target: 0,
      current: 0,
    },
  },
};

export function useWorkerStatus(): {
  currentData: IWorkerAvailabilityResponse | undefined;
  workerRunningJob: IJobDetailSchema;
} {
  const dispatch = useAppDispatch();
  const workerRunningJob = useAppSelector(state => state.worker.job_detail);

  const [hadPreviousJob, setHadPreviousJob] = useState(false);

  const user = useAppSelector(selectUserSelfDetails);
  const { data: currentData } = useWorkerQuery(undefined, { pollingInterval: 2000 });

  const [previousJob, setPreviousJob] = useState(currentData);

  useEffect(() => {
    if (currentData?.job_detail?.job_id !== previousJob?.job_detail?.job_id) {
      setPreviousJob(currentData);
    }
  }, [currentData, previousJob?.job_detail?.job_id]);

  useEffect(() => {
    if (hadPreviousJob && workerRunningJob !== undefined && currentData?.job_detail === null) {
      if (previousJob?.job_detail?.job_type_str !== undefined) {
        notification.jobFinished(workerRunningJob?.job_type_str, previousJob?.job_detail?.job_type_str);
      }
      if (workerRunningJob?.job_type_str.toLowerCase() === "train faces") {
        dispatch(api.endpoints.fetchIncompleteFaces.initiate({ inferred: false }));
        dispatch(api.endpoints.fetchIncompleteFaces.initiate({ inferred: true }));
        dispatch(peopleAlbumsApi.endpoints.fetchPeopleAlbums.initiate());
      }
      if (workerRunningJob?.job_type_str.toLowerCase() === "scan photos") {
        dispatch(
          dateAlbumsApi.endpoints.fetchDateAlbums.initiate({
            username: user.username,
            person_id: user.id,
            photosetType: PhotosetType.NONE,
          })
        );
      }
    }

    if (currentData?.job_detail) {
      dispatch({ type: WorkerState.SET_WORKER_AVAILABILITY, payload: false });
      dispatch({
        type: WorkerState.SET_WORKER_RUNNING_JOB,
        payload: currentData?.job_detail,
      });
    } else {
      dispatch({ type: WorkerState.SET_WORKER_AVAILABILITY, payload: true });
    }
  }, [
    currentData,
    dispatch,
    hadPreviousJob,
    previousJob?.job_detail?.job_type_str,
    user.id,
    user.username,
    workerRunningJob,
  ]);

  useEffect(() => {
    if (workerRunningJob) {
      setHadPreviousJob(true);
    }
  }, [workerRunningJob]);

  return { workerRunningJob, currentData };
}
