import { createSlice } from '@reduxjs/toolkit';

import type { Photo, PhotoSliceState } from '@/@types/photos';
import { photoDetailsApi } from '@/api/endpoints/photos/photoDetail';

const initialState: PhotoSliceState = {
  photoDetails: {},
};

const photoDetailsSlice = createSlice({
  name: 'photoDetails',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addMatcher(
        photoDetailsApi.endpoints.fetchPhotoDetails.matchFulfilled,
        (state, { payload }) => {
          const newPhotoDetails = { ...state.photoDetails };
          const photoDetails: Photo = payload;
          newPhotoDetails[photoDetails.image_hash] = photoDetails;
          return {
            photoDetails: newPhotoDetails,
          };
        }
      )
      .addDefaultCase((state) => state);
  },
});

export const { reducer: photoDetailsReducer, actions: photoDetailsActions } = photoDetailsSlice;
