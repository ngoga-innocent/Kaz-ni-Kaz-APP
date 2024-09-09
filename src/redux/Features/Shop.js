import React from "react";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Url from "../../../Url";

const initialState = {
  loading: false,
  isError: false,
  isSuccess: false,
  errorMessage: "",
  Shops: [],
  shopDetails: null,
};
export const GetUserShops = createAsyncThunk(
  "GetUserShops",
  async (_, { rejectWithValue }) => {
    const token = await AsyncStorage.getItem("token");
    const headers = new Headers();
    headers.append("Authorization", `Token ${token}`);
    headers.append("Content-Type", "application/json");
    const requestOptions = {
      method: "GET",
      headers: headers,
      redirect: "follow",
    };
    try {
      const res = await fetch(`${Url}/product/user_shops`, requestOptions);

      const data = await res.json();
      console.log(data);
      if (!res.ok) return rejectWithValue(data);
      return data;
    } catch (error) {
      console.log(error);
      return rejectWithValue("Error Occured");
    }
  }
);
export const GetShopDetails = createAsyncThunk(
  "ShopDetails",
  async (_, { rejectWithValue }) => {
    const token = await AsyncStorage.getItem("token");
    const shop_id = await AsyncStorage.getItem("shop_id");

    const headers = new Headers();
    headers.append("Authorization", `Token ${token}`);
    headers.append("Content-Type", "application/json");
    const requestOptions = {
      method: "GET",
      headers: headers,
      redirect: "follow",
    };
    try {
      const res = await fetch(`${Url}/product/shop/${shop_id}`, requestOptions);
      const data = await res.json();
      console.log(data);
      if (!res.ok) {
        return rejectWithValue(data);
      }
      return data;
    } catch (error) {
      console.error(error);
      return rejectWithValue("Unknown error Occured ");
    }
  }
);
export const CreateShopFunction = createAsyncThunk(
  "CreateShopFunction",
  async (kwargs, { rejectWithValue }) => {
    const token = await AsyncStorage.getItem("token");
    const header = new Headers();
    header.append("Authorization", `Token ${token}`);
    header.append("Content-type", "multipart/form-data");
    const formData = new FormData();
    formData.append("thumbnail", {
      uri: kwargs?.thumbnail?.uri,
      type: kwargs.thumbnail?.mimeType,
      name: kwargs.thumbnail?.fileName,
    });
    formData.append("name", kwargs.name);
    formData.append("location", kwargs.location);
    formData.append("contact", kwargs.contact);
    const requestOptions = {
      method: "POST",
      headers: header,
      body: formData,
      redirect: "follow",
    };
    try {
      const res = await fetch(`${Url}/product/shop`, requestOptions);
      const data = await res.json();
      console.log(data);
      if (!res.ok) {
        return rejectWithValue(data);
      }
      return data;
    } catch (error) {
      console.error(error);
      return rejectWithValue("Error Occured");
    }
  }
);
export const UpdateShop = createAsyncThunk(
  "UpdateShop",
  async (kwargs, { rejectWithValue }) => {
    const token = await AsyncStorage.getItem("token");
    const header = new Headers();
    header.append("Authorization", `Token ${token}`);
    header.append("Content-type", "multipart/form-data");
    const formData = new FormData();

    if (kwargs.thumbnail?.uri) {
      formData.append("thumbnail", {
        uri: kwargs.thumbnail.uri,
        type: kwargs.thumbnail.mimeType || "image/jpeg",
        name: kwargs.thumbnail.fileName || "thumbnail.jpg",
      });
    }

    formData.append("name", kwargs.name);
    formData.append("location", kwargs.location);
    formData.append("contact", kwargs.contact);

    const requestOptions = {
      method: "PUT", // Use PUT or PATCH for updates
      headers: header,
      body: formData,
      redirect: "follow",
    };

    try {
      const res = await fetch(
        `${Url}/product/shop/${kwargs.id}`,
        requestOptions
      ); // Ensure the URL is correct
      const data = await res.json();

      if (!res.ok) {
        return rejectWithValue(data);
      }
      console.log(data);
      return data;
    } catch (error) {
      console.error("UpdateShop Error:", error);
      return rejectWithValue("Error Occurred");
    }
  }
);
export const DeleteShop = createAsyncThunk(
  "DeleteShop",
  async (kwargs, { rejectWithValue }) => {
    const token = await AsyncStorage.getItem("token");
    const shop_id = await AsyncStorage.getItem("shop_id");
    if (!token) {
      return rejectWithValue("No Token Found");
    }
    if (!shop_id) {
      return rejectWithValue("No Shop Found");
    }
    const headers = new Headers();
    headers.append("Authorization", `Token ${token}`);
    headers.append("Content-Type", "application/json");
    const requestOptions = {
      method: "DELETE",
      headers: headers,
      redirect: "follow",
    };
    try {
      const response = await fetch(
        `${Url}/product/shop/${kwargs.id}`,
        requestOptions
      );
      const data = await response.json();
      console.log(data);
      if (!response.ok) {
        return rejectWithValue(data);
      }
      return data;
    } catch (error) {
      console.error(error);
      return rejectWithValue("Error Occured");
    }
  }
);
const GetUserShop = createSlice({
  name: "shop",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(GetUserShops.pending, (state) => {
        state.loading = true;
      })
      .addCase(GetUserShops.fulfilled, (state, action) => {
        state.Shops = action.payload;
        state.loading = false;
      })
      .addCase(GetUserShops.rejected, (state, action) => {
        state.isError = true;
        state.errorMessage = action.payload;
        state.loading = false;
      });
    //Shop Details
    builder
      .addCase(GetShopDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(GetShopDetails.fulfilled, (state, action) => {
        state.shopDetails = action.payload;
        state.loading = false;
      })
      .addCase(GetShopDetails.rejected, (state, action) => {
        state.isError = true;
        state.errorMessage = action.payload;
        state.loading = false;
      });
    //Create a new Shopp
    builder
      .addCase(CreateShopFunction.pending, (state) => {
        state.loading = true;
      })
      .addCase(CreateShopFunction.fulfilled, (state, action) => {
        state.isSuccess = true;
        state.loading = false;
      })
      .addCase(CreateShopFunction.rejected, (state, action) => {
        state.isError = true;
        state.errorMessage = action.payload;
        state.loading = false;
      });
    //Update Shop
    builder
      .addCase(UpdateShop.pending, (state) => {
        state.loading = true;
      })
      .addCase(UpdateShop.fulfilled, (state, action) => {
        state.isSuccess = true;
        state.loading = false;
      })
      .addCase(UpdateShop.rejected, (state, action) => {
        state.isError = true;
        state.errorMessage = action.payload;
        state.loading = false;
        console.log(action.payload);
      });
    //DELETE SHOP
    builder
      .addCase(DeleteShop.pending, (state) => {
        state.loading = true;
      })
      .addCase(DeleteShop.fulfilled, (state, action) => {
        state.isSuccess = true;
        state.loading = false;
      })
      .addCase(DeleteShop.rejected, (state, action) => {
        state.isError = true;
        state.errorMessage = action.payload;
        state.loading = false;
      });
  },
});

export default GetUserShop.reducer;
