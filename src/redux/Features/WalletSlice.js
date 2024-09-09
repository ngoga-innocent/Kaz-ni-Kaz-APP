import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Url from "../../../Url";
const initialState = {
  wallet: {},
  walletHistory: [],
  loading: false,
  isError: false,
  isSuccess: false,
  errorMessage: "",
};
export const FetchWallet = createAsyncThunk(
  "FetchWallet",
  async (_, { rejectWithValue }) => {
    const token = await AsyncStorage.getItem("token");
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Token ${token}`);
    const requestOptions = {
      headers: myHeaders,
      redirect: "follow",
      method: "GET",
    };
    try {
      const res = await fetch(`${Url}/wallet`, requestOptions);
      if (!res.ok) {
        return rejectWithValue(await res.json());
      } else {
        return await res.json();
      }
    } catch (error) {
      return rejectWithValue(
        "unexpected Error!!! Please check your internet and try again"
      );
    }
  }
);
//////////Deposit ///////////////////////////////////
export const MakeDeposit = createAsyncThunk(
  "MakeDeposit",
  async (kwargs, { rejectWithValue }) => {
    const token = await AsyncStorage.getItem("token");
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Token ${token}`);
    myHeaders.append("x-api-key","KazniKazSecuritykey_0782214360")
    const body = JSON.stringify(kwargs);
    // console.log(body);
    const requestOptions = {
      headers: myHeaders,
      method: "PUT",
      body: body,
      redirect: "follow",
    };
    try {
      const res = await fetch(`${Url}/wallet/`, requestOptions);
      console.log(await res.json());
      if (!res.ok) {
        // console.log("errro", await res.json());
        return rejectWithValue(await res.json());
      }
      //   console.log("handled", await res.json());
      return await res.json();
    } catch (error) {
      //   console.log("unexpected error", error);
      return rejectWithValue(
        "unexpected Error!!please check your internet and try again"
      );
    }
  }
);
export const MakeTransfer = createAsyncThunk(
  "TransferFunds",
  async (kwargs, { rejectWithValue }) => {
    const token = await AsyncStorage.getItem("token");
    const myHeader = new Headers();
    myHeader.append("Authorization", `Token ${token}`);
    myHeader.append("Content-Type", "application/json");
    // console.log(kwargs);
    const requestOptions = {
      method: "PUT",
      body: JSON.stringify(kwargs),
      redirect: "follow",
      headers: myHeader,
    };
    try {
      const res = await fetch(`${Url}/wallet/`, requestOptions);
      const result = await res.json();
      //   console.log(result);
      if (!res.ok) {
        return rejectWithValue(result);
      }
      return result;
    } catch (error) {
      //   console.log("unxpected", error);
      return rejectWithValue(
        "Unexcepted error please check your internet and try again"
      );
    }
  }
);
const WalletSlice = createSlice({
  initialState,
  name: "WalletSlice",
  extraReducers: (builder) => {
    //Fetch Wallet Details
    builder
      .addCase(FetchWallet.pending, (state) => {
        state.loading = true;
      })
      .addCase(FetchWallet.fulfilled, (state, action) => {
        state.wallet = action.payload.wallet;
        state.walletHistory = action.payload.history;
        state.loading = false;
        // console.log(action.payload);
      })
      .addCase(FetchWallet.rejected, (state, action) => {
        state.isError = true;
        state.errorMessage = action.payload?.detail;
        state.loading = false;
        // console.log(action.payload?.detail);
      });
    builder
      .addCase(MakeDeposit.pending, (state) => {
        state.loading = true;
      })
      .addCase(MakeDeposit.fulfilled, (state, action) => {
        state.isSuccess = true;
        // console.log(action.payload.data.wallet);
        state.wallet = action.payload.data.wallet;
        state.walletHistory = [
          action.payload.data.history,
          ...state.walletHistory,
        ];
        state.loading = false;
      })
      .addCase(MakeDeposit.rejected, (state, action) => {
        state.isError = true;
        state.errorMessage = action.payload;
        state.loading = false;
      });
    ///################### Transfer #####################
    builder
      .addCase(MakeTransfer.pending, (state) => {
        state.loading = true;
      })
      .addCase(MakeTransfer.fulfilled, (state, action) => {
        state.isSuccess = true;
        // console.log(action.payload.data.wallet);
        state.wallet = action.payload.data.wallet;
        state.walletHistory = [
          action.payload.data.history,
          ...state.walletHistory,
        ];
        state.loading = false;
      })
      .addCase(MakeTransfer.rejected, (state, action) => {
        state.isError = true;
        state.errorMessage = action.payload;
        state.loading = false;
      });
  },
});
export default WalletSlice.reducer;
