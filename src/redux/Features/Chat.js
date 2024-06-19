import AsyncStorage from "@react-native-async-storage/async-storage";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
const initialState = {
  loading: false,
  isError: false,
  isSuccess: false,
  errorMessage: "",
  messages: [],
  AllChats: [],
};
export const getUserMessage = createAsyncThunk(
  "GetUserMessage",
  async (kwargs, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const headers = new Headers({ "Content-Type": "application/json" });
      headers.append("Authorization", `Token ${token}`);
      const requestOptions = {
        headers: headers,
        method: "GET",
        redirect: "follow",
      };
      const response = await fetch(
        `${Url}/chat/${kwargs.receiver_id}`,
        requestOptions
      );

      if (!response.ok) return rejectWithValue(await response.json());
      return await response.json();
    } catch (error) {
      console.log(error);
      return rejectWithValue("Error Occured");
    }
  }
);
export const SendChat = createAsyncThunk(
  "SendChat",
  async (kwargs, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const headers = new Headers();
      headers.append("Authorization", `Token ${token}`);
      headers.append("Content-Type", "multipart/form-data");
      const formData = new FormData();
      const message_type = kwargs.message_type;
      console.log(kwargs.message);
      formData.append("message_type", message_type);
      if (message_type == "message") {
        formData.append("message", kwargs.message);
      } else if (message_type == "image") {
        formData.append("image", {
          uri: kwargs.message.uri,
          type: kwargs.message.mimeType,
          name: kwargs.message.fileName,
        });
      } else if (message_type == "video") {
        formData.append("video", {
          uri: kwargs.message.uri,
          type: kwargs.message.mimeType,
          name: kwargs.message.fileName,
        });
      } else if (message_type == "audio") {
        formData.append("audio", {
          uri: kwargs.message.uri,
          type: kwargs.message.mimeType,
          name: kwargs.message.fileName,
        });
      } else if (message_type == "file") {
        formData.append("file", {
          uri: kwargs.message.uri,
          type: kwargs.message.mimeType,
          name: kwargs.message.fileName,
        });
      } else {
        return rejectWithValue("please append a message");
      }
      const requestOptions = {
        headers: headers,
        method: "POST",
        body: formData,
        redirect: "follow",
      };
      const response = await fetch(
        `${Url}/chat/${kwargs.receiver_id}`,
        requestOptions
      );
      if (!response.ok) return rejectWithValue(await response.json());

      return await response.json();
    } catch (error) {
      console.log(error);
      return rejectWithValue("Error Occured");
    }
  }
);
export const DeleteMessage = createAsyncThunk(
  "DeleteMessage",
  async (kwargs, { rejectWithValue }) => {
    const token = await AsyncStorage.getItem("token");
    const headers = new Headers();
    headers.append("Authorization", `Token ${token}`);
    headers.append("Content-Type", "application/json");
    try {
      const response = await fetch(`${Url}/chat/${kwargs.message_id}`, {
        method: "DELETE",
        headers: headers,
        redirect: "follow",
      });
      if (!response.ok) return rejectWithValue(await response.json());
      return await response.json();
    } catch (error) {
      console.log(error);
      return rejectWithValue("Error Occured");
    }
  }
);
export const EditMessage = createAsyncThunk(
  "EditMessage",
  async (kwargs, { rejectWithValue }) => {
    const token = await AsyncStorage.getItem("token");
    const headers = new Headers();
    headers.append("Authorization", `Token ${token}`);
    headers.append("Content-Type", "application/json");
    const requestOptions = {
      method: "PUT",
      headers: headers,
      // body: JSON.stringify(kwargs),
      redirect: "follow",
    };

    try {
      const response = await fetch(
        `${Url}/chat/${kwargs.message.id}`,
        requestOptions
      );
      if (!response.ok) return rejectWithValue(await response.json());
      return await response.json();
    } catch (error) {
      console.log(error);
      return rejectWithValue("Error Occured");
    }
  }
);
export const GetAllChat = createAsyncThunk(
  "GetAllChat",
  async (_, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const headers = new Headers();
      headers.append("Authorization", `Token ${token}`);
      headers.append("Content-Type", "application/json");
      const response = await fetch(`${Url}/chat/all_chats`, {
        method: "GET",
        headers: headers,
        redirect: "follow",
      });
      if (!response.ok) return rejectWithValue(await response.json());
      return await response.json();
    } catch (error) {
      console.log(error);
      return rejectWithValue("Error Occured");
    }
  }
);

const ChatSlice = createSlice({
  name: "ChatSlice",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(getUserMessage.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserMessage.fulfilled, (state, action) => {
        state.messages = action.payload.messages;
        // console.log(action.payload.messages);
        state.loading = false;
      })
      .addCase(getUserMessage.rejected, (state, action) => {
        state.isError = true;
        state.errorMessage = action.payload;
        state.loading = false;
      });
    builder
      .addCase(SendChat.pending, (state, action) => {
        console.log("pending");
      })
      .addCase(SendChat.fulfilled, (state, action) => {
        state.messages = [...state.messages, action.payload.message];
        // console.log(state.messages);
      })
      .addCase(SendChat.rejected, (state, action) => {
        state.isError = true;
        state.errorMessage = action.payload;
      });
    builder.addCase(DeleteMessage.pending, (state, action) => {
      state.loading = true;
    });
    builder
      .addCase(DeleteMessage.fulfilled, (state, action) => {
        state.isSuccess = true;
        state.loading = false;
        state.messages = state.messages.filter(
          (message) => message.id != action.payload.message.id
        );
      })
      .addCase(DeleteMessage.rejected, (state, action) => {
        state.isError = true;
        state.errorMessage = action.payload;
        state.loading = false;
      });
    builder
      .addCase(GetAllChat.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(GetAllChat.fulfilled, (state, action) => {
        state.AllChats = action.payload.rooms;
        state.loading = false;
      })
      .addCase(GetAllChat.rejected, (state, action) => {
        state.isError = true;
        state.errorMessage = action.payload;
        state.loading = false;
      });
    builder
      .addCase(EditMessage.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(EditMessage.fulfilled, (state, action) => {
        state.isSuccess = true;
        state.loading = false;
      })
      .addCase(EditMessage.rejected, (state, action) => {
        state.isError = true;
        state.errorMessage = action.payload;
        state.loading = false;
      });
  },
});

export default ChatSlice.reducer;
