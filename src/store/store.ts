import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { createBrowserHistory } from "history";
import type { TypedUseSelectorHook } from "react-redux";
import { useDispatch, useSelector } from "react-redux";
import { combineReducers } from "redux";
import { createReduxHistoryContext } from "redux-first-history";
import { FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE, persistStore } from "redux-persist";

import { api } from "@/api/api";
import albums from "@/reducers/albumsReducer";
import { photos } from "@/reducers/photosReducer";
import { search } from "@/reducers/searchReducer";
import ui from "@/reducers/uiReducer";
import util from "@/reducers/utilReducer";
import { authReducer as auth } from "@/store/auth/authSlice";
import { commonReducer as common } from "@/store/base/commonSlice";
import { faceReducer as face } from "@/store/face/faceSlice";
import { photoDetailsReducer as photoDetails } from "./photos/photoDetailsSlice";
import { playerReducer as player } from "@/store/player/playerSlice";
import { userReducer as user } from "@/store/user/userSlice";
import { worker } from "@/store/worker/workerSlice";
import { errorMiddleware } from "./middleware/errorMiddleware";

const { createReduxHistory, routerMiddleware, routerReducer } = createReduxHistoryContext({
  history: createBrowserHistory(),
  reduxTravelling: true,
  showHistoryAction: true,
  savePreviousLocations: 100,
});

export const store = configureStore({
  reducer: combineReducers({
    router: routerReducer,
    albums,
    auth,
    common,
    face,
    photos,
    photoDetails,
    player,
    search,
    ui,
    user,
    util,
    worker,
    [api.reducerPath]: api.reducer,
  }),
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(routerMiddleware, api.middleware, errorMiddleware),
});

export const soocHistory = createReduxHistory(store);

persistStore(store);
setupListeners(store.dispatch);

export const selectSelf = (state: RootState): RootState => state;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
