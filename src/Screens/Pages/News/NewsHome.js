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
import DateTimePicker from "@react-native-community/datetimepicker";
import { useTheme } from "../../components/Functions/ThemeProvider";
const NewsHome = () => {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(0);
  const [filterDate, setFilterDate] = useState(null);
  const [filteredNews, setFilteredNews] = useState([]);
  const [dateFilter, setDateFilter] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    dispatch(fetchNews());
  }, [dispatch]);

  const handleRefresh = async () => {
    setRefreshing(true);
    const result = await dispatch(fetchNews());
    if (fetchNews.fulfilled.match(result)) {
      setRefreshing(false);
    }
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || filterDate;
    setDateFilter(false);
    setFilterDate(currentDate);

    if (currentDate) {
      const formattedDate = currentDate.toISOString().split("T")[0];
      const filtered = news.filter(
        (item) => item.created_at.split("T")[0] === formattedDate
      );
      setFilteredNews(filtered);
    } else {
      setFilteredNews(news);
    }
  };

  const { height, width } = Dimensions.get("screen");
  const { news, loading } = useSelector((state) => state.News);

  useEffect(() => {
    setFilteredNews(news);
  }, [news]);

  const handleScroll = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const page = Math.round(offsetX / Dimensions.get("window").width);
    setCurrentPage(page);
  };

  const filter_list = ["Date"];

  return (
    <ScrollView
      className={`flex-1 ${isDarkMode && "bg-darkcolor"}`}
      stickyHeaderIndices={[0]}
    >
      <View>
        <Header />
      </View>

      <View className="relative">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          className="gap-3"
          onScroll={handleScroll}
        >
          {news?.map((item, index) => (
            <TouchableOpacity
              key={index}
              className="overflow-hidden rounded-2xl p-2"
              style={{
                width: width,
                height: height * 0.32,
              }}
            >
              <Image
                source={{ uri: item?.thumbnail }}
                className=" rounded-2xl overflow-hidden"
                style={{
                  width: width * 0.95,
                  height: height * 0.6,
                }}
              />
              <View
                className="absolute right-4 bottom-3 py-2 px-3 rounded-md max-w-[70%] "
                style={{
                  backgroundColor: "rgba(0,0,0,0.8)",
                }}
              >
                <Text className="text-white">{item?.title}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View
          className="flex flex-row gap-x-1 absolute bottom-2 px-4 rounded-md flex-wrap py-3"
          style={{
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          {news.map((item, index) => (
            <View
              key={index}
              className={`w-2 h-2 rounded-full ${
                currentPage === index ? "bg-appColor" : "bg-white"
              }`}
            />
          ))}
        </View>
      </View>

      <View className="flex flex-row max-w-[90%] items-center gap-x-3 self-end mx-4">
        <TouchableOpacity
          onPress={() => setFilteredNews(news)}
          className="items-center bg-slate-400 py-2 px-4 rounded-lg justify-center flex flex-col overflow-hidden my-2"
        >
          <Text>See All</Text>
        </TouchableOpacity>
        {filter_list.map((item, index) => (
          <TouchableOpacity
            onPress={() => setDateFilter(!dateFilter)}
            key={index}
            className="items-center bg-slate-400 py-2 px-4 rounded-lg justify-center flex flex-col overflow-hidden my-2"
          >
            <Text>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {dateFilter && (
        <DateTimePicker value={new Date()} mode="date" onChange={onChange} />
      )}

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        contentContainerStyle={{
          alignItems: "center",
        }}
      >
        {filteredNews.length > 0 ? (
          filteredNews?.map((item, index) => (
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
                  className="absolute w-[100%] h-[100%] rounded-lg px-4 py-2 justify-end"
                  style={{ backgroundColor: "rgba(85, 84, 81, 0.7)" }}
                >
                  <Text className="text-white font-bold max-w-[95%]">
                    {item?.title}
                  </Text>
                  <Text className="text-white text-xs">
                    {item?.created_at?.split("T")[0]}
                  </Text>
                </View>
              </ImageBackground>
            </TouchableOpacity>
          ))
        ) : (
          <Text>No News Found</Text>
        )}
      </ScrollView>
    </ScrollView>
  );
};

export default NewsHome;
