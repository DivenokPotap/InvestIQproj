import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    isLoading: true,
    isAuthenticated: false,
  },
  reducers: {
    setAuth: (state, action) => {
      state.user = action.payload;
      state.isLoading = false
      state.isAuthenticated = true;
    },
    clearAuth: (state) => {
        state.user = null
        state.isLoading = false;
        state.isAuthenticated = false;
    },
  },
});

export const { setAuth, clearAuth } = authSlice.actions;
export const authReducer = authSlice.reducer;