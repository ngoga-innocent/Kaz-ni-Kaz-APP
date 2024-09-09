import React, { useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import Header from "../Home/Header";
import { useSelector, useDispatch } from "react-redux";
import { GetAllChat } from "../../../redux/Features/Chat";
import { Avatar } from "react-native-elements";
import { useIsFocused } from "@react-navigation/native";
const AllChat = ({ navigation }) => {
  const isFocused = useIsFocused();
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
  //   console.log(AllChats);
  //   console.log(AllChats);
  return (
    <View className="flex-1">
      <Header />
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={() => dispatch(GetAllChat())}
          />
        }
        className="max-h-[95%]  overflow-y-scroll"
        showsVerticalScrollIndicator={false}
      >
        {AllChats.map((chat, index) => (
          <TouchableOpacity
            onPress={() => {
              chat.user1?.id == profile?.user?.id
                ? navigation.navigate("Chat", {
                    screen: "chatHome",
                    params: {
                      receiver_id: chat?.user2?.id,
                    },
                  })
                : navigation.navigate("Chat", {
                    screen: "chatHome",
                    params: {
                      receiver_id: chat?.user1?.id,
                    },
                  });
            }}
            key={index}
            className="flex flex-row justify-between items-center px-3 bg-slate-300 py-2 mx-2 my-1 rounded-lg"
          >
            {chat.user1?.id == profile?.user?.id ? (
              <>
                <View className="flex flex-row items-center">
                  <Avatar
                    rounded
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
                {chat?.unread_messages_count > 0 && (
                  <View className="rounded-full bg-appColor items-center justify-center">
                    <Text className="text-xs p-2 font-bold">
                      {chat?.unread_messages_count}
                    </Text>
                  </View>
                )}
              </>
            ) : (
              <>
                <View className="flex flex-row items-center">
                  <Avatar
                    rounded
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
                {chat?.unread_messages_count > 0 && (
                  <View className="rounded-full bg-appColor items-center justify-center">
                    <Text className="text-xs p-2 font-bold">
                      {chat?.unread_messages_count}
                    </Text>
                  </View>
                )}
              </>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default AllChat;
