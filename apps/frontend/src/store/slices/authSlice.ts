import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { User } from "../../types/auth";
import { authApi } from "../api/authApi";

interface AuthResponse {
  user: User;
  access_token: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
    },
    setCredentials: (state, action: PayloadAction<AuthResponse>) => {
      if (action?.payload) {
        state.user = action.payload.user;
        state.token = action.payload.access_token;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      authApi.endpoints.login.matchFulfilled,
      (state, action: PayloadAction<AuthResponse>) => {
        if (action?.payload) {
          state.user = action.payload.user;
          state.token = action.payload.access_token;
        }
      },
    );
    builder.addMatcher(
      authApi.endpoints.register.matchFulfilled,
      (state, action: PayloadAction<AuthResponse>) => {
        if (action?.payload) {
          state.user = action.payload.user;
          state.token = action.payload.access_token;
        }
      },
    );
  },
});

export const { logout, setCredentials } = authSlice.actions;
export default authSlice.reducer;
