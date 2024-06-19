import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  Linking,
  RefreshControl,
} from "react-native";
import Header from "../Home/Header";
import { useSelector, useDispatch } from "react-redux";
import { fetchNews } from "../../../redux/Features/NewsSlice";

const NewsHome = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchNews());
  }, []);
  const handleRefresh = async () => {
    setRefreshing(true);
    const result = await dispatch(fetchNews());
    if (fetchNews.fulfilled.match(result)) {
      setRefreshing(false);
    }
  };
  const { height, width } = Dimensions.get("screen");
  const { news, loading } = useSelector((state) => state.News);
  const [refreshing, setRefreshing] = useState(false);
  console.log(news);
  return (
    <View className="flex-1">
      <Header />
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              handleRefresh();
            }}
          />
        }
        contentContainerStyle={{
          alignItems: "center",
        }}
      >
        {news?.map((item, index) => {
          return (
            <TouchableOpacity
              onPress={() => Linking.openURL(item?.link)}
              key={index}
              className="items-center w-[95%] rounded-lg justify-center flex flex-col overflow-hidden my-2"
            >
              <ImageBackground
                className="flex-1 w-[100%] rounded-lg relative self-center"
                style={{ height: height * 0.22 }}
                source={{ uri: item?.thumbnail }}
              >
                <View
                  className="absolute  w-[100%] h-[100%] rounded-lg px-4 py-2 justify-end"
                  style={{ backgroundColor: "rgba(85, 84, 81, 0.7)" }}
                >
                  <Text className="text-white font-bold max-w-[95%] ">
                    {item?.title}
                  </Text>
                  <Text className="text-white text-xs">
                    {item?.created_at?.split("T")[0]}
                  </Text>
                </View>
              </ImageBackground>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default NewsHome;
