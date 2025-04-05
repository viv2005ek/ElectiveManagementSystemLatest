import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "../../axiosInstance.ts";
import { UserRole } from "../../types/UserTypes.ts";

interface User {
  firstName: string;
  lastName: string;
  role: UserRole;
}

interface UserState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  loading: false,
  error: null,
};

// Async thunk to fetch user details
export const fetchUser = createAsyncThunk<User, void, { rejectValue: string }>(
  "auth/fetchUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/auth/me", {
        withCredentials: true,
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        (error as { response?: { data?: { message?: string } } }).response?.data
          ?.message || "Failed to fetch user",
      );
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(
        fetchUser.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.loading = false;
          state.error = action.payload || "Failed to fetch user";
        },
      );
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
