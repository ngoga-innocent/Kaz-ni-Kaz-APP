import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Url from "../../../Url";
const initialState = {
  loading: false,
  jobs: [],
  isError: false,
  isSuccess: false,
  errorMessage: "",
};

export const FetchJobs = createAsyncThunk(
  "FetchJobs",
  async (_, { rejectWithValue }) => {
    const myheaders = new Headers();
    myheaders.append("Content-Type", "application/json");
    const requestOptions = {
      headers: myheaders,
      method: "GET",
      redirect: "follow",
    };
    try {
      const response = await fetch(`${Url}/jobs/`, requestOptions);
      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data);
      }
      console.log(data);
      return data;
    } catch (error) {
      console.log(error);
      return rejectWithValue("Unexpected Error");
    }
  }
);
export const AddJobSlice = createAsyncThunk(
  "AddJob",
  async (kwargs, { rejectWithValue }) => {
    try {
      // Retrieve the token from AsyncStorage
      const token = await AsyncStorage.getItem("token");

      // Create headers
      const myheaders = new Headers();
      myheaders.append("Content-Type", "multipart/form-data");
      myheaders.append("Accept", "application/json");
      myheaders.append("Authorization", `Token ${token}`);

      // Create form data
      const formData = new FormData();
      formData.append("job_title", kwargs.job_title);
      formData.append("job_description", kwargs.job_description);
      formData.append("job_slug", kwargs.job_slug);
      formData.append("job_location", kwargs.job_location);
      formData.append("job_thumbnail", {
        uri: kwargs.thumbnail.uri,
        name: kwargs.thumbnail.fileName,
        type: kwargs.thumbnail.mimeType,
      });

      // Request options
      const requestOptions = {
        headers: myheaders,
        method: "POST",
        redirect: "follow",
        body: formData,
      };

      // Perform the fetch request
      const response = await fetch(`${Url}/jobs/`, requestOptions);
      const data = await response.json();
      console.log(data);
      if (!response.ok) {
        return rejectWithValue(data);
      }

      return data;
    } catch (error) {
      console.error("Error:", error);
      return rejectWithValue("Unexpected Error");
    }
  }
);
export const DeleteJob = createAsyncThunk(
  "deleteJob",
  async (kwargs, { rejectWithValue }) => {
    const headers = new Headers({ "Content-Type": "application/json" });
    const requestOptions = {
      headers: headers,
      method: "DELETE",
      redirect: "follow",
    };
    try {
      const response = await fetch(
        `${Url}/jobs/${kwargs.job_id}`,
        requestOptions
      );
      if (!response.ok) {
        return rejectWithValue(await response.json());
      }
      return await response.json();
    } catch (error) {
      console.log(error);
      return rejectWithValue("Unexpected Error");
    }
  }
);

const JobSlice = createSlice({
  name: "JobSlice",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(FetchJobs.pending, (state) => {
        state.loading = true;
      })
      .addCase(FetchJobs.fulfilled, (state, action) => {
        state.jobs = action.payload.jobs;
        state.loading = false;
      })
      .addCase(FetchJobs.rejected, (state, action) => {
        state.isError = true;
        state.errorMessage = action.payload;
        state.loading = false;
      });
    builder
      .addCase(AddJobSlice.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(AddJobSlice.fulfilled, (state, action) => {
        state.isSuccess = true;
        state.loading = false;
      })
      .addCase(AddJobSlice.rejected, (state, action) => {
        state.errorMessage = action.payload;
        state.loading = false;
      });
    builder
      .addCase(DeleteJob.pending, (state) => {
        state.loading = true;
      })
      .addCase(DeleteJob.fulfilled, (state, action) => {
        state.isSuccess = true;
        state.loading = false;
      })
      .addCase(DeleteJob.rejected, (state, action) => {
        state.errorMessage = action.payload;
        state.loading = false;
      });
  },
});
export default JobSlice.reducer;
