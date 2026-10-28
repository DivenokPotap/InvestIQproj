import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./Auth/authSlice";
import { authApi } from "./Auth/authApi";

export const store = configureStore({
    reducer: {
        [authApi.reducerPath]: authApi.reducer, 
        auth: authReducer
    },
    middleware: (getDefaultMiddleware) => [
    ...getDefaultMiddleware(),
    (authApi.middleware)
    ]
})