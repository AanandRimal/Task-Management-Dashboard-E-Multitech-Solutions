import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type AuthUser = {
  email: string;
  name: string;
};

export type AuthState = {
  user: AuthUser | null;
  token: string | null;
  status: "idle" | "authenticated" | "loading";
};

const initialState: AuthState = {
  user: null,
  token: null,
  status: "idle",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess(
      state,
      action: PayloadAction<{ user: AuthUser; token: string }>,
    ) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.status = "authenticated";
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.status = "idle";
    },
    setAuthLoading(state, action: PayloadAction<boolean>) {
      state.status = action.payload ? "loading" : state.token ? "authenticated" : "idle";
    },
  },
});

export const { loginSuccess, logout, setAuthLoading } = authSlice.actions;
export const authReducer = authSlice.reducer;

export const selectIsAuthenticated = (state: { auth: AuthState }) =>
  Boolean(state.auth.token);

export const selectAuthUser = (state: { auth: AuthState }) => state.auth.user;
