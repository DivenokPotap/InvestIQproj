import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: null,
  },
  reducers: {
      setAuthToken:(state, action) => {
    state.token = action.payload;
    },
      clearToken:(state) => {
        state.token = null
    },
  },
});

export const { setAuthToken, clearToken } = authSlice.actions;
export const authReducer = authSlice.reducer;