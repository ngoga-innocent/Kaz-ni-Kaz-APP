import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Url from "../../../Url";

const initialState = {
  profile: undefined,
  loading: false,
  Registersuccess: false,
  LoginSuccess: false,
  errorMessage: "",
  isError: false,
};
export const SignUp = createAsyncThunk(
  "SignUp",
  async (kwargs, { rejectWithValue }) => {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    console.log(kwargs);
    const body = JSON.stringify(kwargs);
    const requestOptions = {
      method: "POST",
      headers: headers,
      body: body,
      redirect: "follow",
    };
    try {
      const res = await fetch(`${Url}/account/register`, requestOptions);
      const result=await res.json()
      if (!res.ok) {
        console.log(result)
        return rejectWithValue(result.detail);
      }
      
      return result;
    } catch (error) {
      console.log(error);
      return rejectWithValue("please check your internet connection");
    }
  }
);
export const SignIn = createAsyncThunk(
  "Login",
  async (kwargs, { rejectWithValue }) => {
    const myheaders = new Headers();
    myheaders.append("Content-Type", "application/json");
    const body = JSON.stringify(kwargs);
    const requestOptions = {
      headers: myheaders,
      method: "POST",
      body: body,
      redirect: "follow",
    };
    try {
      const res = await fetch(`${Url}/account/login`, requestOptions);
      if (!res.ok) {
        // console.log(await res.json());
        return rejectWithValue(await res.json());
      } else {
        // console.log(res.status);
        return await res.json();
      }
    } catch (error) {
      return rejectWithValue("Unexpected Error, please check your Internet");
    }
  }
);
export const Logout = createAsyncThunk(
  "Logout",
  async (_, { rejectWithValue }) => {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      return rejectWithValue("No Token Found");
    }
    const myheaders = new Headers();
    myheaders.append("Authorization", `Token ${token}`);
    const requestOptions = {
      method: "DELETE",
      headers: myheaders,
      redirect: "follow",
    };
    try {
      const response = await fetch(`${Url}/logout`, requestOptions);
      if (!response.ok) {
        return rejectWithValue(await response.json());
      }
      console.log(await response.json());
      // AsyncStorage.removeItem("token");
      return await response.json();
    } catch (error) {
      console.log(error);
      return rejectWithValue("Unexpected Error, please check your Internet");
    }
  }
);
export const getProfile = createAsyncThunk(
  "getProfile",
  async (_, { rejectWithValue }) => {
    const token = await AsyncStorage.getItem("token");
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      redirect: "follow",
    };
    if (token) {
      try {
        const res = await fetch(`${Url}/account/profile`, requestOptions);
        if (!res.ok) {
          await AsyncStorage.removeItem("token")
          return rejectWithValue(await res.json());
        }
        return await res.json();
      } catch (error) {
        console.log(error);
      }
    }
  }
);
export const updateProfileImage = createAsyncThunk(
  "updateProfileImage",
  async (kwargs, { rejectWithValue }) => {
    const token = await AsyncStorage.getItem("token");
    const myheaders = new Headers();
    myheaders.append("Authorization", `Token ${token}`);
    myheaders.append("Content-Type", "multipart/form-data");
    const formData = new FormData();
    if (kwargs?.profile) {
      formData.append("profile", {
        uri: kwargs?.profile?.uri,
        type: kwargs.profile?.mimeType,
        name: kwargs.profile?.fileName,
      });
    } else {
      formData.append("id_number", kwargs.id_number);
      formData.append("id_card", {
        uri: kwargs?.id_card?.uri,
        type: kwargs.id_card?.mimeType,
        name: kwargs.id_card?.fileName,
      });
      formData.append("selfie", {
        uri: kwargs?.selfie?.uri,
        type: kwargs.selfie?.mimeType,
        name: kwargs.selfie?.fileName,
      });
    }

    // console.log(formData);
    const requestOptions = {
      headers: myheaders,
      method: "PUT",
      body: formData,
      redirect: "follow",
    };
    try {
      const res = await fetch(`${Url}/account/profile`, requestOptions);
      const result = await res.json();
      if (!res.ok) {
        return rejectWithValue(result);
      }
      return result;
    } catch (error) {
      console.log("unexpected error: " + error);
      return rejectWithValue("Unexpected Error, please check your Internet");
    }
  }
);
export const EditProfile = createAsyncThunk(
  "EditProfile",
  async (kwargs, { rejectWithValue }) => {
    const token = await AsyncStorage.getItem("token");
    const myheaders = new Headers();
    myheaders.append("Authorization", `Token ${token}`);
    myheaders.append("Content-Type", "application/json");

    const body = JSON.stringify(kwargs);
    const requestOptions = {
      headers: myheaders,
      method: "PUT",
      body: body,
      redirect: "follow",
    };
    try {
      const res = await fetch(`${Url}/account/profile`, requestOptions);
      console.log(await res.json());
      if (!res.ok) {
        return rejectWithValue(await res.json());
      }
      return await res.json();
    } catch (error) {
      return rejectWithValue("Unexpected Error, please check your Internet");
    }
  }
);

//Update Online Status
export const UpdateOnlineStatus=createAsyncThunk(
  "updateStatus",
  async(_,{rejectWithValue})=>{
      const token=await AsyncStorage.getItem("token");
      if(!token){
        return rejectWithValue("No Token Found");
      }
      const myHeaders=new Headers();
      myHeaders.append("Authorization",`Token ${token}`);
      myHeaders.append("Content-Type","application/json");
      const requestOptions={
        method:"POST",
        headers:myHeaders,
    
        redirect:"follow"
      }
      try {
          const res=await fetch(`${Url}/account/update_online_status`,requestOptions);
          const data=await res.json()
          console.log("Online status",data)
          if (!res.ok) {

            return rejectWithValue(data);
          }
         
          return data;
      } catch (error) {
        console.log("Error",error);
       return rejectWithValue({"detail":"Error Occured"}) 
      }
  }
)
const AccountSlice = createSlice({
  name: "Account",
  initialState,

  extraReducers: (builder) => {
    builder
      .addCase(SignUp.pending, (state) => {
        state.loading = true;
      })
      .addCase(SignUp.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.Registersuccess = true;
        // console.log(action.payload);
        state.loading = false;
      })
      .addCase(SignUp.rejected, (state, action) => {
        state.errorMessage = action?.payload?.detail;

        state.loading = false;
      });
    ///LOGIN reducers ////////////////////
    builder
      .addCase(SignIn.pending, (state) => {
        state.loading = true;
      })
      .addCase(SignIn.fulfilled, (state, action) => {
        AsyncStorage.setItem("token", action?.payload?.token);
        console.log("fulfilled", action.payload);
        state.profile = action.payload.user;
        state.LoginSuccess = true;
        state.loading = false;
      })
      .addCase(SignIn.rejected, (state, action) => {
        // console.log("rejected", action.payload.detail);
        state.isError = true;
        state.errorMessage = action?.payload?.detail;
        state.loading = false;
      });

    //GET PROFILE
    builder
      .addCase(getProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.loading = false;
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.isError = true;
        state.errorMessage = action.payload.detail;
        state.loading = false;
      });
    //UPDATE Profile
    builder
      .addCase(EditProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(EditProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.loading = false;
      })
      .addCase(EditProfile.rejected, (state, action) => {
        state.isError = true;
        state.errorMessage = action.payload.detail;
        state.loading = false;
      });
    builder.addCase(updateProfileImage.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateProfileImage.fulfilled, (state, action) => {
      state.profile = action.payload;
      state.loading = false;
    });
    builder.addCase(updateProfileImage.rejected, (state, action) => {
      state.isError = true;
      state.errorMessage = action.payload.detail;
      state.loading = false;
    });

    //LOGOUT
    builder
      .addCase(Logout.pending, (state) => {
        state.loading = true;
      })
      .addCase(Logout.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.loading = false;
      })
      .addCase(Logout.rejected, (state, action) => {
        state.isError = true;
        state.errorMessage = action.payload.detail;
        state.loading = false;
      });
      //Update Online Status
      builder.addCase(UpdateOnlineStatus.pending, (state) => {
        state.loading = true;
        console.log("updating status pending");
      })
      .addCase(UpdateOnlineStatus.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.loading = false;
        console.log("updating status fulfilled");
      })
      .addCase(UpdateOnlineStatus.rejected, (state, action) => {
        state.isError = true;
        state.errorMessage = action.payload.detail;
        state.loading = false;
        console.log("updating status rejected", action.payload);
      });
  },
});

export default AccountSlice.reducer;
