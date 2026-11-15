import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./Auth/authSlice";
import { authApi } from "./Auth/authApi";
import { trackerApi } from "./Tracker/trackerApi";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    auth: authReducer,
    [trackerApi.reducerPath]: trackerApi.reducer,
  },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware().concat(
      authApi.middleware,
      trackerApi.middleware),
});
