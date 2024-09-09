import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Url from "../../../Url";
const initialState = {
  news: [],
  loading: false,
  isError: false,
  isSuccess: false,
  errorMessage: "",
};
export const fetchNews = createAsyncThunk(
  "FetchNews",
  async (_, { rejectWithValue }) => {
    const headers = new Headers({ "Content-Type": "application/json" });
    const requestOptions = {
      method: "GET",
      headers: headers,
      redirect: "follow",
    };
    try {
      const response = await fetch(`${Url}/news/`, requestOptions);
      const data = await response.json();
      console.log(data);
      if (!response.ok) return rejectWithValue(data);
      return data;
    } catch (error) {
      console.log(error);
      return rejectWithValue("Unexpected error");
    }
  }
);
const NewsSlice = createSlice({
  name: "news",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(fetchNews.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNews.fulfilled, (state, action) => {
        state.news = action.payload.news;
        state.loading = false;
        state.isError = false;
        state.isSuccess = true;
      })
      .addCase(fetchNews.rejected, (state, action) => {
        state.isError = true;
        state.loading = false;
        state.isSuccess = false;
        state.errorMessage = action.payload;
      });
  },
});

export default NewsSlice.reducer;
