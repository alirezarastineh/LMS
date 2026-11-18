import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import type { IUser } from "@/app/types/lms";

interface AuthState {
  token: string;
  user: IUser | null;
}

const initialState: AuthState = {
  token: "",
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    userRegistration: (state, action: PayloadAction<{ token: string }>) => {
      state.token = action.payload.token;
    },

    userLoggedIn: (
      state,
      action: PayloadAction<{ accessToken: string; user: IUser }>
    ) => {
      state.token = action.payload.accessToken;
      state.user = action.payload.user;
    },

    userLoggedOut: (state) => {
      state.token = "";
      state.user = null;
    },
  },
});

export const { userRegistration, userLoggedIn, userLoggedOut } =
  authSlice.actions;

export default authSlice.reducer;
