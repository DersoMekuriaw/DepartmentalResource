import { configureStore } from "@reduxjs/toolkit";
import resourceReducer from "./resourceSlice";
import courseReducer from "./courseSlice";

export const store = configureStore({
  reducer: {
    resources: resourceReducer,
    courses: courseReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
