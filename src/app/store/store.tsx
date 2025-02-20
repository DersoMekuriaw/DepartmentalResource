import { configureStore } from "@reduxjs/toolkit";
import resourceReducer from "./resourceSlice";

export const store = configureStore({
  reducer: {
    resources: resourceReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
