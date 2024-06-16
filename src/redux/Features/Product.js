import AsyncStorage from "@react-native-async-storage/async-storage";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Url from "../../../Url";

const initialState = {
  products: [],
  loading: false,
  isError: false,
  categories: [],
  colors: [],
  errorMessage: "",
};
export const FetchCategories = createAsyncThunk(
  "FetchCategory",
  async (_, { rejectWithValue }) => {
    const myheaders = new Headers();
    myheaders.append("Content-Type", "application/json");
    const requestOptions = {
      headers: myheaders,
      method: "GET",
      redirect: "follow",
    };

    try {
      const res = await fetch(`${Url}/product/categories`, requestOptions);
      if (!res.ok) {
        return rejectWithValue(await res.json());
      }
      // console.log("categories", await res.json());
      return await res.json();
    } catch (error) {
      return rejectWithValue("Please check your internet connection");
    }
  }
);
//Fetch Product /////////////////////
export const FetchProduct = createAsyncThunk(
  "FetchProduct",
  async (_, { rejectWithValue }) => {
    const myheaders = new Headers();
    myheaders.append("Content-Type", "application/json");
    const requestOptions = {
      headers: myheaders,
      method: "GET",
      redirect: "follow",
    };
    try {
      const res = await fetch(`${Url}/product`, requestOptions);
      if (!res.ok) {
        return rejectWithValue(await res.json());
      }
      return await res.json();
    } catch (error) {
      return rejectWithValue(
        "failed to fetch Product please your internet Issue"
      );
    }
  }
);
export const UploadProduct = createAsyncThunk(
  "UploadProduct",
  async (kwargs, { rejectWithValue }) => {
    const token = await AsyncStorage.getItem("token");
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Token ${token}`);
    myHeaders.append("Content-Type", "multipart/form-data");
    const formData = new FormData();
    formData.append("name", kwargs.name);
    formData.append("price", kwargs.price);
    formData.append("description", kwargs.description);

    formData.append("thumbnail", {
      uri: kwargs.thumbnail.uri,
      name: kwargs.thumbnail.fileName,
      type: kwargs.thumbnail.mimeType,
    });
    // console.log(kwargs.uploaded_images);
    kwargs.uploaded_images.forEach((item, index) => {
      // console.log("one itme", item);
      formData.append("product_images", {
        uri: item.uri,
        name: item.fileName,
        type: item.mimeType,
      });
    });
    // console.log(kwargs.uploaded_images);
    formData.append("colors", "86482554-0033-47db-bcb9-fbf6b44364a5");
    console.log(kwargs.categories);
    formData.append("category", kwargs.categories.id);
    const requestOptions = {
      method: "POST",
      body: formData,
      headers: myHeaders,
      redirect: "follow",
    };
    try {
      const res = await fetch(`${Url}/product/`, requestOptions);
      const data = await res.json();
      console.log(data);
      if (!res.ok) {
        return rejectWithValue(data);
      }
      return data;
    } catch (error) {
      console.log(error);
      return rejectWithValue("unexpected Error");
    }
  }
);
//Get Colors
export const FetchColors = createAsyncThunk(
  "FetchColors",
  async (_, { rejectWithValue }) => {
    const header = new Headers();
    header.append("Content-Type", "application/json");
    const requestOptions = {
      method: "GET",
      headers: header,
      redirect: "follow",
    };
    try {
      const response = await fetch(`${Url}/product/colors`, requestOptions);
      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data);
      } else {
        return data;
      }
    } catch (error) {
      console.log(error);
      return rejectWithValue("Unexpected Error");
    }
  }
);
const ProductSlice = createSlice({
  name: "Products",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(FetchCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(FetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload.category;
        // console.log("categories", action.payload);
        state.loading = false;
      })
      .addCase(FetchCategories.rejected, (state, action) => {
        state.errorMessage = action.payload;
        state.loading = false;
      });
    //////////////// Product /////
    builder
      .addCase(FetchProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(FetchProduct.fulfilled, (state, action) => {
        state.products = action.payload.products;
        state.loading = false;
      })
      .addCase(FetchProduct.rejected, (state, action) => {
        state.isError = true;
        state.errorMessage = action.payload;
        state.loading = false;
      });
    ///////Add Product /////
    builder.addCase(UploadProduct.pending, (state) => {
      state.loading = true;
    });
    builder
      .addCase(UploadProduct.fulfilled, (state, action) => {
        state.products.unshift(action.payload);
        state.loading = false;
      })
      .addCase(UploadProduct.rejected, (state, action) => {
        state.isError = true;
        state.errorMessage = action.payload;
        state.loading = false;
      });
    builder
      .addCase(FetchColors.pending, (state) => {
        state.loading = true;
      })
      .addCase(FetchColors.fulfilled, (state, action) => {
        state.colors = action.payload.colors;
        state.loading = false;
      })
      .addCase(FetchColors.rejected, (state, action) => {
        state.isError = true;
        state.errorMessage = action.payload;
        state.loading = false;
      });
  },
});

export default ProductSlice.reducer;
