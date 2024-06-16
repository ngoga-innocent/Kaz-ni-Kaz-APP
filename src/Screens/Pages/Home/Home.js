import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
} from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";
import { Colors } from "../../components/Global";
import { useDispatch, useSelector } from "react-redux";
import { FetchCategories, FetchProduct } from "../../../redux/Features/Product";
import Spinner from "react-native-loading-spinner-overlay";
import { useNavigation } from "@react-navigation/native";
import { Avatar } from "react-native-elements";
import { FetchWallet } from "../../../redux/Features/WalletSlice";
import { getProfile } from "../../../redux/Features/Account";
import { useIsFocused } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "../../components/Functions/ThemeProvider";
const Home = () => {
  const focused = useIsFocused();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [currentPage, setCurrentPage] = useState(0);
  const scrollViewRef = useRef();
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  // Function to handle auto-sliding
  useEffect(() => {
    const timer = setInterval(() => {
      // Calculate the index of the next page
      const nextPage = (currentPage + 1) % products.length;
      // Scroll to the next page
      scrollViewRef.current.scrollTo({
        x: nextPage * Dimensions.get("window").width,
      });
      // Update the current page state
      setCurrentPage(nextPage);
    }, 5000);
    // Auto slide interval (adjust as needed)

    // Clear interval on component unmount
    return () => clearInterval(timer);
  }, [currentPage, products]);
  useEffect(() => {
    dispatch(FetchProduct());
    dispatch(FetchCategories());
    dispatch(FetchWallet());
    dispatch(getProfile());
  }, [dispatch]);
  const handlePageChange = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const page = Math.round(offsetX / Dimensions.get("window").width);
    setCurrentPage(page);
  };
  //Fetch Products
  const { products, categories, loading } = useSelector(
    (state) => state.Products
  );
  const { wallet } = useSelector((state) => state.Wallet);
  // console.log(categories);
  return (
    <SafeAreaView className={`flex-1 ${isDarkMode ? "bg-black" : null}`}>
      <Spinner visible={loading} size={30} color={Colors.appColor} />
      {/* <View className="mt-14" /> */}
      <ScrollView className="flex-1 px-2 " stickyHeaderIndices={[0]}>
        <View>
          <View
            className={`flex-1 flex-row justify-between items-center  mb-8 ${
              isDarkMode ? "bg-black" : "bg-white"
            } px-2 rounded-lg py-2 pt-14`}
          >
            <Image
              source={require("../../../../assets/icon.png")}
              resizeMode="contain"
              className="w-14 h-14"
            />
            <Text
              className={`${
                isDarkMode ? "text-white" : null
              } text-2xl font-bold`}
            >
              Kazi Ni kazi
            </Text>
            <TouchableOpacity
              className="items-center"
              onPress={() =>
                navigation.navigate("BottomTab", {
                  screen: "wallet",
                })
              }
            >
              <FontAwesome6 name="coins" size={30} color={Colors.appColor} />
              <Text
                className={`text-sm font-bold ${
                  isDarkMode ? "text-white" : null
                }`}
              >
                {wallet?.amount} Rwf
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handlePageChange}
          scrollEventThrottle={16}
          snapToInterval={Dimensions.get("window").width / 1.7}
          decelerationRate="normal"
          className="flex-1"
          contentContainerStyle={{
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {products?.map((item, index) => {
            return (
              <View
                key={index}
                // className=" w-[100%]"
                className={`${isDarkMode ? "" : null}`}
                style={{ width: Dimensions.get("window").width, flex: 1 }}
              >
                <Image
                  source={{ uri: item?.thumbnail }}
                  className={`rounded-lg bg-white shadow-sm shadow-black items-center self-center ${
                    currentPage !== index ? "scale-75" : null
                  }`}
                  resizeMode="cover"
                  style={{
                    width: Dimensions.get("window").width / 1.1,
                    flex: 1,
                    height: Dimensions.get("screen").height / 4.5,
                  }}
                />
              </View>
            );
          })}
        </ScrollView>
        <View className="flex flex-row gap-x-3 self-center my-2">
          {products?.map((item, index) => {
            return (
              <View
                key={index}
                className={`${
                  currentPage == index
                    ? "bg-appColor"
                    : isDarkMode
                    ? "bg-white"
                    : "bg-black"
                } w-2 h-2 rounded-full`}
                // className={`rounded-full w-3 h-3 ${
                //   index === currentPage
                // }?'bg-appColor':'border`}
              />
            );
          })}
        </View>
        <View className="border w-[90%] self-center rounded-xl my-2 mt-7 py-2 relative">
          <View className="w-32 h-32 absolute -top-14 self-center">
            <Image
              source={require("../../../../assets/icons/logo.png")}
              className="w-[100%] h-[100%]"
            />
          </View>
          <View className="flex flex-row justify-between px-5 my-2">
            <Text className="font-bold text-lg">Sure Deals</Text>
            <View className="mr-5 ">
              <View className="flex flex-row items-center">
                <Text className="text-blue-600 font-bold">K</Text>
                <Text className="text-appColor font-bold">A</Text>
                <Text className="font-bold">Z</Text>
              </View>
              <View className="flex flex-row items-center gap-x-1 ml-2">
                <View className="flex flex-row items-center">
                  <Text className="text-gray-600 font-bold">NI</Text>
                </View>
                <View className="flex flex-row items-center">
                  <Text className="text-blue-600 font-bold">KA</Text>
                  <Text className="text-gray-700 font-bold">Z</Text>
                </View>
              </View>
            </View>
          </View>
          <View className="flex flex-row items-center justify-between w-[80%] self-center">
            <TouchableOpacity className=" border py-2 items-center w-[30%] rounded-xl">
              <View className="flex flex-row items-center">
                <Text className="text-blue-950 font-bold">Re</Text>
                <Text className="text-appColor font-bold">gister</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity className=" border py-2 items-center w-[30%] rounded-xl">
              <View className="flex flex-row items-center">
                <Text className="font-bold text-appColor">Sign</Text>
                <Text className="font-bold">In</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        {/* Categories Sections */}
        <View className="flex flex-row py-2 items-center justify-between">
          <Text className="text-xl font-bold">Categories</Text>
          <View className="h-1 w-10 bg-gray-400 justify-end mt-10" />
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("Home", {
                screen: "allCategory",
              })
            }
          >
            <Text className="text-xl text-appColor font-bold">Sell All</Text>
          </TouchableOpacity>
        </View>

        <View className="items-center">
          <ScrollView
            className="gap-x-2 gap-y-1 flex  flex-wrap"
            contentContainerStyle={{
              alignItems: "center",
              justifyContent: "center",

              flexDirection: "row",
              flexWrap: "wrap",
            }}
          >
            {categories?.slice(0, 8)?.map((item, index) => {
              return (
                <TouchableOpacity
                  key={index}
                  className="items-center self-center w-[20%]"
                >
                  <Avatar
                    source={{ uri: item.thumbnail }}
                    size="medium"
                    rounded
                  />
                  <Text className={`${isDarkMode ? "text-white" : null}`}>
                    {item.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
        <View className="flex flex-row justify-between py-2">
          <Text className="text-xl font-bold">Best Sells</Text>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("Home", {
                screen: "allProduct",
                params: {
                  products: products,
                },
              })
            }
          >
            <Text className="text-lg font-bold text-appColor">Sell All</Text>
          </TouchableOpacity>
        </View>
        <View
          className="flex-1 flex flex-row flex-wrap items-center justify-center pb-8"
          style={{ flexWrap: "wrap" }}
        >
          {products?.map((item, index) => {
            return (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("Home", {
                    screen: "singleProduct",
                    params: {
                      product: item,
                    },
                  })
                }
                key={index}
                className="rounded-lg  mx-1 my-2 bg-white relative overflow-hidden"
                style={{
                  width: Dimensions.get("window").width / 2.28,
                  height: Dimensions.get("screen").height / 5,
                }}
              >
                <View className="absolute z-40 right-3">
                  <Text>Favorite</Text>
                </View>
                <ImageBackground
                  source={{ uri: item.thumbnail }}
                  resizeMode="cover"
                  className="flex-1 justify-end items-center rounded-lg"
                  style={{
                    height: "100%",
                    width: "100%",

                    flex: 1,
                  }}
                >
                  {/* <Image
                  source={{ uri: item.thumbnail }}
                  className="w-[100%] rounded-lg"
                  style={{
                    flex: 1,
                    borderRadius: 10,
                  }}
                  resizeMode="contain"
                /> */}
                  <View
                    className="py-1 rounded-lg my-1 flex-col-reverse items-center gap-x-3 px-3 w-[90%] mx-auto"
                    style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                  >
                    <Text className="font-bold text-white ">
                      ${item?.price}
                    </Text>
                    <Text className="font-bold  text-xs text-white">
                      {item?.name}
                    </Text>
                  </View>
                </ImageBackground>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("Home", {
            screen: "addProduct",
          })
        }
        className="absolute bottom-9 right-3 rounded-full h-14 w-14 z-50 shadow-md shadow-black bg-appColor items-center justify-center"
      >
        <Feather name="plus" size={40} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Home;
