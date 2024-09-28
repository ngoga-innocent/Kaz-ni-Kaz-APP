import React, { useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl
} from "react-native";
import Header from "../Home/Header";
import { useSelector, useDispatch } from "react-redux";
import { GetAllChat } from "../../../redux/Features/Chat";
import { Avatar } from "react-native-elements";
import { useIsFocused } from "@react-navigation/native";
import { useTheme } from "../../components/Functions/ThemeProvider";
const AllChat = ({ navigation }) => {
  const isFocused = useIsFocused();
  const {theme}=useTheme();
  const isDarkMode = theme === "dark";
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(GetAllChat());
  }, [isFocused]);
  //   useEffect(() => {
  //     const interval = setInterval(() => {
  //       dispatch(GetAllChat());
  //     }, 2000);
  //     return () => clearInterval(interval);
  //   }, []);
  const { AllChats, loading } = useSelector((state) => state.Chat);
  const { profile } = useSelector((state) => state.Account);
  console.log("all chats available", AllChats);

  //   console.log(AllChats);
  return (
    <ScrollView className={`flex-1  ${isDarkMode ? "bg-darkColor" : null}`}>
      <Header />
      <Text className="text-xl font-bold text-start mx-4 text-gray-700">Supports</Text>
      <ScrollView
        horizontal
        className="mx-2 flex-1 gap-x-2 max-w-[98%] mx-auto w-[98%] my-2"
        showsHorizontalScrollIndicator
      >
        {AllChats?.Admins?.map((admin, index) => {

          return (
            <TouchableOpacity
              key={index}
              onPress={() => {
                navigation.navigate("Chat", {
                  screen: "chatHome",
                  params: {
                    receiver_id: admin?.id,
                    receiver_username:admin?.username,
                    receiver_photo:admin?.profile,
                    receiver_online_status:admin?.online_status,
                    phone_number:admin?.phone_number
                  }
                });
              }}
              className="flex flex-col items-center "
            >
              {admin?.profile?<Avatar rounded size="large" containerStyle={{borderWidth:2,borderColor:'gray'}} source={{ uri: admin.profile }} />:
              <Avatar rounded size="large" title={admin?.username?.slice(0,2)} containerStyle={{backgroundColor:'#26113d'}} />}
              <Text>{admin?.username}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      <Text className="text-xl font-bold text-start mx-4 text-gray-700">Chats</Text>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={() => dispatch(GetAllChat())}
          />
        }
        className=" flex-1 overflow-y-scroll bg-darkColor"
        showsVerticalScrollIndicator={false}
      >
        {AllChats?.rooms?.map((chat, index) => {
          const timestamp=chat?.timestamp
          console.log(chat?.timestamp)
          let time_for_last_message
          const today=new Date()
          if(new Date(timestamp).toDateString()==today.toDateString()){
            time_for_last_message=new Date(timestamp).toLocaleTimeString()
            console.log("today",new Date(timestamp).toTimeString())
          }else{
            console.log(new Date(timestamp).toLocaleDateString())
            time_for_last_message=new Date(timestamp).toLocaleDateString()
          }
          return(
            <TouchableOpacity
            onPress={() => {
              chat.user1?.id == profile?.detail?.id
                ? navigation.navigate("Chat", {
                    screen: "chatHome",
                    params: {
                      receiver_id: chat?.user2?.id,
                      receiver_username:chat?.user2?.username,
                      receiver_photo:chat?.user2?.profile,
                      receiver_online_status:chat?.user2?.online_status,
                      phone_number:chat?.user2?.phone_number
                    }
                  })
                : navigation.navigate("Chat", {
                    screen: "chatHome",
                    params: {
                      receiver_id: chat?.user1?.id,
                      receiver_username:chat?.user1?.username,
                      receiver_photo:chat?.user1?.profile,
                      receiver_online_status:chat?.user1?.online_status,
                      phone_number:chat?.user1?.phone_number
                    }
                  });
            }}
            key={index}
            className="flex flex-row justify-between items-center px-3 bg-slate-300 py-2 mx-2 my-1 rounded-lg"
          >
            {chat.user1?.id == profile?.detail?.id ? (
              <>
                <View className="flex flex-row items-center">
                  <Avatar
                    rounded
                    containerStyle={{borderColor:'gray',borderWidth:2}}
                    size="medium"
                    source={
                      chat?.user2?.profile
                        ? { uri: chat?.user2?.profile }
                        : require("../../../../assets/icon.png")
                    }
                  />
                  <View className="ml-3 max-w-[80%]">
                    <Text className=" font-bold">{chat?.user2?.username}</Text>
                    <Text>{chat?.last_message}</Text>
                  </View>
                </View>
                <View className="flex flex-row gap-x-1 items-center">
                  {chat?.unread_messages_count > 0 && (
                    <View className="rounded-full bg-appColor items-center justify-center">
                      <Text className="text-xs p-2 font-bold">
                        {chat?.unread_messages_count}
                      </Text>
                    </View>
                  )}
                  <Text>{time_for_last_message}</Text>
                </View>
              </>
            ) : (
              <>
                <View className="flex flex-row items-center">
                  <Avatar
                    rounded
                    containerStyle={{borderColor:'gray',borderWidth:2}}
                    size="medium"
                    source={
                      chat?.user1?.profile
                        ? { uri: chat?.user1?.profile }
                        : require("../../../../assets/icon.png")
                    }
                  />
                  <View className="ml-3 max-w-[80%]">
                    <Text className=" font-bold">{chat?.user1?.username}</Text>
                    <Text>{chat?.last_message}</Text>
                  </View>
                </View>
                <View className="flex flex-col">
                  {/* Last Message Time */}
                  <Text>{time_for_last_message}</Text>
                {chat?.unread_messages_count > 0 && (
                  <View className="rounded-full bg-appColor items-center justify-center">
                    <Text className="text-xs p-2 font-bold">
                      {chat?.unread_messages_count}
                    </Text>
                  </View>
                )}

                </View>
                
              </>
            )}
          </TouchableOpacity>
          )
        })}
      </ScrollView>
    </ScrollView>
  );
};

export default AllChat;
