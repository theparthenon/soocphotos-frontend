import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type CommonState = {
  currentRouteKey: string;
};

export const initialState: CommonState = {
  currentRouteKey: '',
};

const commonSlice = createSlice({
  name: 'common',
  initialState,
  reducers: {
    setCurrentRouteKey: (state, action: PayloadAction<string>) => {
      state.currentRouteKey = action.payload;
    },
  },
});

export const { reducer: commonReducer, actions: commonActions } = commonSlice;
export const { setCurrentRouteKey } = commonSlice.actions;
