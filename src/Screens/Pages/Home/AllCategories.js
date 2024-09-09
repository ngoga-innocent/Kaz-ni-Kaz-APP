import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import Header from "./Header";
import { TextInput } from "react-native-gesture-handler";
import { useSelector } from "react-redux";
import { Avatar } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../../components/Functions/ThemeProvider";
import { Colors } from "../../components/Global";
const AllCategories = () => {
  const { theme } = useTheme();

  const isDarkMode = theme === "dark";
  const { categories } = useSelector((state) => state.Products);
  const { height, width } = Dimensions.get("screen");
  const [childCategory, setChildCategory] = useState(
    categories?.filter((category) => category.parent != null)
  );
  const { products } = useSelector((state) => state.Products);
  const [search_param, setSearchParams] = useState();
  const navigation = useNavigation();

  const SideCategory = categories?.filter((category) => !category.parent);
  // console.log(products);
  const CategoryPress = (parent) => {
    const appended_categories = categories?.filter(
      (category) => category?.parent === parent.id
    );

    if (appended_categories.length > 0) {
      setChildCategory(appended_categories);
      // console.log("am appended", appended_categories);
    } else {
      const category_products = products?.filter(
        (product) => product.category == parent.id
      );
      console.log(category_products);

      navigation.navigate("Home", {
        screen: "allProduct",
        params: {
          products: category_products,
        },
      });
    }
  };
  const SearchCategory = (text) => {
    const filtered_categories = categories?.filter((category) =>
      category.name.toLowerCase().includes(text.toLowerCase())
    );
    setChildCategory(filtered_categories);
    setSearchParams(text);
  };
  return (
    <SafeAreaView className={`flex-1 ${isDarkMode && "bg-darkcolor"}`}>
      <View className="flex-1 pb-20" stickyHeaderIndices={[0]}>
        <View className="" style={{}}>
          <Header />

          <View
            className={`bg-white shadow-md shadow-black py-2 px-2 rounded-lg w-[90%] mx-auto`}
          >
            <TextInput
              placeholder="Search Category"
              value={search_param}
              onChangeText={(text) => SearchCategory(text)}
            />
          </View>
        </View>
        <View className="flex flex-row items-start ">
          <ScrollView className=" max-h-[98%] overflow-scroll my-2 w-[28%]">
            {SideCategory?.map((item, index) => {
              return (
                <TouchableOpacity
                  onPress={() => CategoryPress(item)}
                  key={index}
                  className="bg-slate-200 py-3 mb-1 items-center px-2"
                >
                  <Text>{item.name}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <ScrollView
            className="flex flex-row flex-wrap  max-h-[100%] overflow-scroll my-2 mb-24 pb-32 w-[85%]"
            contentContainerStyle={{
              flexDirection: "row",
              flex: 1,
              flexWrap: "wrap",
              // alignItems: "center",
              // justifyContent: "center",
            }}
          >
            {childCategory?.map((item, index) => {
              return (
                <TouchableOpacity
                  onPress={() => CategoryPress(item)}
                  key={index}
                  className="my-1 mx-2 w-[25%]  rounded-lg "
                  // style={{
                  //   width: width / 2.4,
                  //   height: height / 3.5,
                  //   borderRadius: 10, // adjust as needed
                  //   overflow: "hidden",
                  //   backgroundColor: "rgba(0,0,0,0.7)",
                  // }}
                >
                  <Avatar
                    source={{ uri: item.thumbnail }}
                    size="large"
                    rounded
                    containerStyle={{
                      borderWidth: 1,
                      borderColor: "gray",

                      backgroundColor: "white",
                    }}
                    imageProps={{
                      resizeMode: "contain",
                    }}
                  />
                  <Text
                    className={`${
                      isDarkMode && "text-white"
                    } text-center text-sm`}
                  >
                    {item.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AllCategories;
