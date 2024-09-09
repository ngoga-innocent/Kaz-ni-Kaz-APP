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
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";
import { fetchOurAds } from "../../../redux/Features/OurAds";
import { LinearGradient } from "expo-linear-gradient";
// 15:2F:B8:6A:16:83:62:0F:D9:E6:F7:E6:E1:F8:BA:03:A3:5D:B6:80
const Home = () => {
  const focused = useIsFocused();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [currentPage, setCurrentPage] = useState(0);
  const [VipProducts, setVipProducts] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const scrollViewRef = useRef();
  const { theme } = useTheme();
  const isfocused = useIsFocused();
  const isDarkMode = theme === "dark";
  const { t, i18n } = useTranslation();
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
    CheckLoggedIn();
  }, [isfocused]);
  // console.log(loggedIn);
  async function CheckLoggedIn() {
    const token = await AsyncStorage.getItem("token");
    //
    if (token) {
      setLoggedIn(true);
    } else {
      setLoggedIn(false);
    }
  }
  useEffect(() => {
    dispatch(FetchProduct());
    dispatch(FetchCategories());
    dispatch(FetchWallet());
    dispatch(getProfile());
    dispatch(fetchOurAds());
  }, [isfocused]);
  const handlePageChange = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const page = Math.round(offsetX / Dimensions.get("window").width);
    setCurrentPage(page);
  };
  //Get Our Ads
  const { our_ads } = useSelector((state) => state.OurAds);
  // console.log("Our Ads", our_ads);
  //Fetch Products
  const { products, categories, loading } = useSelector(
    (state) => state.Products
  );
  const { wallet } = useSelector((state) => state.Wallet);
  // console.log(categories);
  const { profile } = useSelector((state) => state.Account);

  useEffect(() => {
    if (products.length > 0) {
      setVipProducts(products?.filter((product) => product?.place === "Vip"));
    }
  }, [products]);
  return (
    <SafeAreaView className={`flex-1 ${isDarkMode ? "bg-[#333332]" : null}`}>
      {/* <Spinner visible={loading} size={30} color={Colors.appColor} /> */}
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
              Kaz Ni kaz
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
              {loggedIn && (
                <Text
                  className={`text-sm font-bold ${
                    isDarkMode ? "text-white" : null
                  }`}
                >
                  {wallet?.amount} Rwf
                </Text>
              )}
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
          {our_ads?.oursAds?.map((item, index) => {
            // {VipProducts?.map((item, index) => {
            return (
              <View
                key={index}
                // className=" w-[100%]"
                className={`${isDarkMode ? "" : null}`}
                style={{ width: Dimensions.get("window").width, flex: 1 }}
              >
                <Image
                  source={{ uri: item?.thumbnail }}
                  className={`rounded-lg bg-white shadow-sm shadow-black items-center self-center `}
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
          {our_ads?.oursAds?.map((item, index) => {
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
        <View
          className={`border ${
            isDarkMode && "border-white "
          } w-[90%] self-center rounded-xl my-4 mt-9 py-2 relative`}
        >
          <View className="w-32 h-32 absolute -top-14 self-center">
            <Image
              source={require("../../../../assets/icons/logo.png")}
              className="w-[100%] h-[100%]"
            />
          </View>
          <View className="flex flex-row justify-between px-5 my-2">
            <Text className={`font-bold text-lg ${isDarkMode && "text-white"}`}>
              Sure Deals
            </Text>
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
          {!profile ? (
            <View className="flex flex-row items-center justify-between w-[80%] self-center">
              <TouchableOpacity
                className=" border py-2 items-center w-[30%] rounded-xl"
                onPress={() =>
                  navigation.navigate("logins", {
                    screen: "Register",
                  })
                }
              >
                <View className="flex flex-row items-center">
                  <Text className="text-blue-950 font-bold">Re</Text>
                  <Text className="text-appColor font-bold">gister</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                className=" border py-2 items-center w-[30%] rounded-xl"
                onPress={() =>
                  navigation.navigate("logins", {
                    screen: "Login",
                  })
                }
              >
                <View className="flex flex-row items-center">
                  <Text className="font-bold text-appColor">Sign</Text>
                  <Text className="font-bold">In</Text>
                </View>
              </TouchableOpacity>
            </View>
          ) : (
            <View className="self-center flex flex-row items-center gap-x-1 py-3">
              <Text
                className={`font-bold text-lg ${isDarkMode && "text-white"}`}
              >
                {t("welcome")}
              </Text>
              <Text
                className={`font-bold text-lg ${isDarkMode && "text-white"}`}
              >
                {profile?.user?.username}
              </Text>
            </View>
          )}
        </View>
        {/* Categories Sections */}
        <View className="flex flex-col py-2 items-center justify-between">
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("Home", {
                screen: "allCategory",
              })
            }
          >
            <Text className="text-xl text-appColor font-bold">Categories</Text>
          </TouchableOpacity>
          <View className="h-1 w-10 bg-gray-400 justify-end mt-3" />
        </View>

        {/* Featured Products */}
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handlePageChange}
          scrollEventThrottle={16}
          snapToInterval={Dimensions.get("window").width / 1.7}
          decelerationRate="normal"
          className="flex-1 my-3 "
          contentContainerStyle={{}}
        >
          {products
            ?.filter((product) => product.discount > 0)
            .map((item, index) => {
              return (
                <LinearGradient
                  className={`relative flex flex-row  border mx-4 rounded-lg `}
                  style={{
                    height: Dimensions.get("screen").height * 0.24,
                    width: Dimensions.get("screen").width * 0.91,
                    maxheight: Dimensions.get("screen").height * 0.24,
                    maxwidth: Dimensions.get("screen").width * 0.91,
                    overflow: "hidden",
                  }}
                  key={index}
                  colors={["#050101", "#050101"]}
                >
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
                    className={`  rounded-lg `}
                    style={{
                      height: Dimensions.get("screen").height * 0.24,
                      width: Dimensions.get("screen").width,
                      maxheight: Dimensions.get("screen").height * 0.24,
                      maxwidth: Dimensions.get("screen").width * 0.91,
                      overflow: "hidden",
                    }}
                  >
                    <Image
                      source={{ uri: item?.thumbnail }}
                      className="flex-1 h-[100%]"
                      resizeMode="cover"
                    />
                    <LinearGradient
                      colors={["rgba(0, 0, 0, 1)", "rgba(239, 68, 68, 0)"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      className="absolute top-0 flex flex-col  left-0 px-2 h-[120%] w-[100%] py-1 gap-y-2 rounded-bl-lg"
                    >
                      <Text className="text-white text-center text-lg font-bold">
                        {item?.name}
                      </Text>
                      <View>
                        <Text className="text-white">UP TO</Text>
                        <View className=" w-[30%] relative">
                          <Text className="text-white border z-50 border-white rounded-md text-2xl font-bold px-2">
                            {item?.discount}% OFF
                          </Text>
                          <Text className="text-sm text-white font-bold absolute -right-20 rounded-lg -bottom-6 bg-appColor py-2 px-6">
                            Discount
                          </Text>
                        </View>
                      </View>
                    </LinearGradient>
                    {/* <View className="flex flex-col absolute bg-gray-200 bg-opacity-10 h-[100%] px-9 justify-center skew-y-4">
                      
                    </View> */}
                  </TouchableOpacity>
                </LinearGradient>
              );
            })}
        </ScrollView>
        {/* vips Product */}
        {/* Admin */}
        <View className="flex flex-col">
          <Text
            className={`${
              isDarkMode ? "text-white" : "text-black"
            } text-lg font-bold`}
          >
            Featured Products
          </Text>
        </View>
        <View
          className="flex-1 flex flex-row flex-wrap  pb-8"
          style={{ flexWrap: "wrap" }}
        >
          {products
            ?.filter((product) => product.place == "Vip")
            ?.slice()
            ?.reverse()
            ?.slice(0, 50)
            ?.map((item, index) => {
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
                  <View className="absolute z-40 right-2 top-1 bg-white w-[32] h-[32] items-center justify-center rounded-full">
                    <MaterialIcons
                      name="favorite"
                      size={24}
                      color={Colors.appColor}
                    />
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
                        {item?.price} {item?.currency}
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
        <View className="flex flex-row justify-between py-2">
          <Text className={`text-xl font-bold ${isDarkMode && "text-white"}`}>
            Best Sells
          </Text>
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
            <Text className="text-lg font-bold text-appColor">See All</Text>
          </TouchableOpacity>
        </View>
        <View
          className="flex-1 flex flex-row flex-wrap items-center justify-center pb-8"
          style={{ flexWrap: "wrap" }}
        >
          {products
            ?.slice()
            ?.reverse()
            ?.slice(0, 50)
            ?.map((item, index) => {
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
                  <View className="absolute z-40 right-2 top-1 bg-white w-[32] h-[32] items-center justify-center rounded-full">
                    <MaterialIcons
                      name="favorite"
                      size={24}
                      color={Colors.appColor}
                    />
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
                        {item?.price} {item?.currency}
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
        onPress={() => {
          if (loggedIn) {
            navigation.navigate("addProduct");
          } else {
            navigation.navigate("logins");
          }
        }}
        className="absolute bottom-9 right-3 rounded-full h-14 w-14 z-50 shadow-md shadow-black bg-appColor items-center justify-center"
      >
        <Feather name="plus" size={40} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Home;
