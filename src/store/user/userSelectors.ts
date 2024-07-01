import { createSelector } from "@reduxjs/toolkit";

import type { RootState } from "@/store/store";
import { selectSelf } from "@/store/store";

export const selectUserSelfDetails = createSelector(
  selectSelf,
  (state: RootState) => state.user.userSelfDetails
);
