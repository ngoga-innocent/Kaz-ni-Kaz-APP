import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchNotifications } from "../../../redux/Features/Notifications";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import { Colors } from "../../components/Global";
const NotificationPage = () => {
  const dispatch = useDispatch();
  const { notifications, loading } = useSelector(
    (state) => state.Notifications
  );
  const [selectedType, setSelectedType] = useState(0);
  const [filterNotifications, setFilterNotifications] = useState(
    notifications?.notifications
  );
  const notificationType = [
    "All Notifications",
    "My Notifications",
    "App Notifications",
  ];
  console.log(notifications);
  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);
  const FilterNotication = (type, index) => {
    console.log(type);
    if (type == "App Notifications") {
      setFilterNotifications(
        notifications?.notifications?.filter(
          (notification) => notification.type == "App"
        )
      );
    } else if (type === "My Notifications") {
      setFilterNotifications(
        notifications?.notifications?.filter(
          (notification) => notification.type == "Self"
        )
      );
    } else {
      setFilterNotifications(notifications?.notifications);
    }
    setSelectedType(index);
  };
  return (
    <ScrollView
      className="flex-1"
      refreshControl={
        <RefreshControl
          onRefresh={() => dispatch(fetchNotifications)}
          refreshing={loading}
        />
      }
    >
      <SafeAreaView className="py-12 px-5 bg-appColor flex flex-row justify-between items-center">
        <AntDesign name="arrowleft" size={24} color="white" />
        <TextInput className="py-2 bg-white w-[80%] shadow-sm shadow-black px-2 rounded-md" />
        <AntDesign name="filter" size={24} color="white" />
      </SafeAreaView>
      <View className="flex flex-row justify-center items-center my-2 ">
        {notificationType.map((type, index) => {
          return (
            <TouchableOpacity
              onPress={() => FilterNotication(type, index)}
              className={`${
                selectedType == index ? "bg-appColor" : "bg-[#5c5b5b]"
              } py-2 mx-1 px-2 rounded-md`}
              key={index}
            >
              <Text className="text-white font-bold">{type}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <View className="w-[95%] mx-auto">
        {filterNotifications?.length == 0 && (
          <Text>No notifation Available</Text>
        )}
        {filterNotifications?.map((notification, index) => {
          return (
            <TouchableOpacity
              className={`bg-[#5a5858] bg-opacity-50 py-2 my-1 rounded-lg px-2 flex flex-row gap-x-2`}
            >
              <Entypo name="info-with-circle" size={24} color="white" />
              <View className="w-[90%]">
                <Text className="text-white font-bold">
                  {notification?.notification_title}
                </Text>
                <Text className="my-1 text-slate-50 text-md">
                  {notification?.notification_body}
                </Text>
                <View className="flex-end self-end flex flex-row items-center gap-x-1">
                  <AntDesign
                    name="clockcircleo"
                    size={15}
                    color={Colors.appColor}
                  />
                  <Text className="text-white font-bold">
                    {notification?.timestamp?.split("T")[0]}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
};

export default NotificationPage;
