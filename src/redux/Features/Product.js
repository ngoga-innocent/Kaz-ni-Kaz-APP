import AsyncStorage from "@react-native-async-storage/async-storage";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Url from "../../../Url";

const initialState = {
  products: [],
  loading: false,
  isError: false,
  categories: [],
  colors: [],
  features: [],
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
export const fetchFeatures = createAsyncThunk(
  "FetchFeatures",
  async (kwargs, { rejectWithValue }) => {
    const myheaders = new Headers();
    myheaders.append("Content-Type", "application/json");
    const requestOptions = {
      headers: myheaders,
      method: "GET",
      redirect: "follow",
    };
    try {
      const res = await fetch(
        `${Url}/product/category_features/${kwargs.category_id}`,
        requestOptions
      );
      if (!res.ok) {
        return rejectWithValue(await res.json());
      }
      const result = await res.json();
      console.log(result);
      return result;
    } catch (error) {
      console.log(error);
      return rejectWithValue(
        "failed to fetch Features please your internet Issue"
      );
    }
  }
);
export const UploadProduct = createAsyncThunk(
  "UploadProduct",
  async (kwargs, { rejectWithValue }) => {
    const token = await AsyncStorage.getItem("token");
    const myHeaders = new Headers();
    // console.log("currency", kwargs.currency);
    myHeaders.append("Authorization", `Token ${token}`);
    myHeaders.append("Content-Type", "multipart/form-data");
    const formData = new FormData();

    formData.append("name", kwargs.name);
    formData.append("price", kwargs.price);
    // formData.append("features", kwargs.features);
    if (kwargs?.features) {
      kwargs.features.forEach((item, index) => {
        // console.log("one itme", item);
        formData.append("features", item);
      });
    }
    formData.append("description", kwargs.description);
    if (kwargs.currency) {
      formData.append("currency", kwargs.currency);
    }

    formData.append("thumbnail", {
      uri: kwargs.thumbnail.uri,
      name: kwargs.thumbnail.fileName,
      type: kwargs.thumbnail.mimeType,
    });
    if (kwargs?.shop?.id) formData.append("shop", kwargs.shop.id);
    // console.log(kwargs.uploaded_images);
    kwargs.uploaded_images.forEach((item, index) => {
      // console.log("one itme", item);
      formData.append("product_images", {
        uri: item.uri,
        name: item.fileName,
        type: item.mimeType,
      });
    });
    console.log(kwargs.uploaded_images);
    kwargs?.colors?.forEach((color) => {
      formData.append("colors", color.id);
    });
    if (kwargs?.place) {
      formData.append("place", kwargs.place);
    }
    if (kwargs?.discount) {
      formData.append("discount", parseFloat(kwargs.discount));
    }
    // console.log(kwargs.uploaded_images);
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
      return rejectWithValue({
        detail: "unexpected Error check your netowrk",
      });
    }
  }
);
//Delete Product
export const deleteProduct = createAsyncThunk(
  "Delete Product",
  async (kwargs, { rejectWithValue }) => {
    const token = await AsyncStorage.getItem("token");
    const header = new Headers();
    header.append("Authorization", `Token ${token}`);
    header.append("Content-Type", "application/json");

    const requestOptions = {
      method: "DELETE",
      headers: header,
      redirect: "follow",
      body: JSON.stringify(kwargs),
    };
    try {
      const response = await fetch(`${Url}/product/`, requestOptions);
      const data = await response.json();
      console.log("deleting data", data);
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
    builder
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteProduct.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteProduct.rejected, (state) => {
        state.isError = true;

        state.loading = false;
      });
    // Fetch Features
    builder
      .addCase(fetchFeatures.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFeatures.fulfilled, (state, action) => {
        state.features = action.payload.features;
        state.loading = false;
      })
      .addCase(fetchFeatures.rejected, (state, action) => {
        state.loading = false;
      });
  },
});

export default ProductSlice.reducer;
