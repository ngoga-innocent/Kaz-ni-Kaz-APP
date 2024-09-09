import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Url from "../../../Url";
const initialState = {
  loading: false,
  our_ads: [],
  isError: false,
  isSuccess: false,
  errorMessage: "",
};

export const fetchOurAds = createAsyncThunk(
  "fetchOurAds",
  async (kwargs, { rejectWithValue }) => {
    const headers = new Headers({ "Content-Type": "application/json" });
    const requestOptions = {
      method: "GET",
      headers: headers,
      redirect: "follow",
    };
    try {
      const res = await fetch(`${Url}/product/our_ads`);
      const result = await res.json();
      if (!res.ok) {
        return rejectWithValue(result?.details);
      }
      return result;
    } catch (error) {
      console.log(error);
      return rejectWithValue("Unknow Error");
    }
  }
);

const ourAdsSlice = createSlice({
  initialState,
  name: "ourAds",

  extraReducers: (builder) => {
    builder
      .addCase(fetchOurAds.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOurAds.fulfilled, (state, action) => {
        state.our_ads = action.payload;
        state.loading = false;
      })
      .addCase(fetchOurAds.rejected, (state, action) => {
        state.isError = true;
        state.errorMessage = action.payload;
        state.loading = false;
      });
  },
});
export default ourAdsSlice.reducer;
