import { configureStore } from "@reduxjs/toolkit";
import { userDataSlice } from "./userDataSlice";
import { userTokenSlice } from "./userTokenSlice";

export const store = configureStore({
  reducer: {
    userData: userDataSlice.reducer,
    userToken: userTokenSlice.reducer,
  },
});
