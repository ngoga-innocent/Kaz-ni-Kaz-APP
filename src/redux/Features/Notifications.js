import {
  createAsyncThunk,
  createSlice,
  isRejectedWithValue,
} from "@reduxjs/toolkit";
import Url from "../../../Url";

const initialState = {
  loading: false,
  isError: false,
  isSuccess: false,
  notifications: null,
  errorMessage: "",
};

export const fetchNotifications = createAsyncThunk(
  "fetchNotifications",
  async (kwargs, { rejectWithValue }) => {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    const requestOptions = {
      method: "GET",
      headers: headers,
      redirect: "follow",
    };
    try {
      const response = await fetch(
        `${Url}/account/notification`,
        requestOptions
      );
      const result = await response.json();
      if (!response.ok) {
        return rejectWithValue(result);
      }
      return result;
    } catch (error) {
      return rejectWithValue("Network error");
    }
  }
);
const NotificationSlice = createSlice({
  initialState,
  name: "notificationSlice",

  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.isSuccess = true;
        state.notifications = action.payload;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.isError = true;
        state.errorMessage = isRejectedWithValue(action)
          ? action.payload
          : "Failed to fetch notifications";
      });
  },
});
export default NotificationSlice.reducer;
