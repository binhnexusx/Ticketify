// redux/userSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getUser } from "@/services/profile";

interface UserState {
  data: any | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  data: null,
  loading: false,
  error: null
};

export const fetchUser = createAsyncThunk("user/fetchUser", async () => {
  const localUser = localStorage.getItem("user") || sessionStorage.getItem("user");
  if (!localUser) return null;

  const parsed = JSON.parse(localUser);
  const userId = parsed.user_id || parsed.id;
  if (!userId) return null;

  return await getUser(userId);
});

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearUser: (state) => {
      state.data = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Error fetching user";
      });
  }
});

export const { clearUser } = userSlice.actions;
export default userSlice.reducer;
