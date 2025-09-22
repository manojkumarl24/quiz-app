import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type Role = "teacher" | "student";

export interface User {
  id: string;
  username: string;
  role: Role;
  name?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
     login: (
      state,
      action: PayloadAction<{ username: string; role: Role; id?: string; name?: string }>
    ) => {
      state.isAuthenticated = true;
      state.user = {
        id: action.payload.id ?? action.payload.username,
        username: action.payload.username,
        role: action.payload.role,
        name: action.payload.name ?? action.payload.username,
      };
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
