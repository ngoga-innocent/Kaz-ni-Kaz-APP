import React, { Component } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
} from "react-native";
import Header from "../../Home/Header";
import { useDispatch, useSelector } from "react-redux";
import { GetShopDetails } from "../../../../redux/Features/Shop";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons } from "@expo/vector-icons";
import { Colors } from "../../../components/Global";
import { useNavigation } from "@react-navigation/native";
const ShopProduct = () => {
  const dispatch = useDispatch();
  const shop = useSelector((state) => state.Shops.shopDetails.shop_products);
  const navigation = useNavigation();
  //   const [shop_products, setShopProducts] = React.useState([]);
  React.useEffect(() => {
    async function GetShopProducts() {
      const id = await AsyncStorage.getItem("shop_id");
      if (id) {
        dispatch(GetShopDetails({ id }));
      } else {
        console.log("No shop id found");
      }
    }
    GetShopProducts();
  }, []);

  return (
    <View className="flex-1">
      <Header title="Product" />
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("Home", {
            screen: "addProduct",
          })
        }
        className="py-2 px-3 bg-appColor rounded-md w-[50%] items-center mx-4 self-end border-white z-10 shadow-sm my-1"
      >
        <Text className="font-bold">Add New Product</Text>
      </TouchableOpacity>
      <ScrollView
        className="flex flex-row flex-wrap px-2 max-h-[90%] overflow-y-scroll"
        contentContainerStyle={{
          flexDirection: "row",
          flexWrap: "wrap",
        }}
      >
        {shop.length > 0 ? (
          shop?.map((item, index) => {
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
                      ${item?.price}
                    </Text>
                    <Text className="font-bold  text-xs text-white">
                      {item?.name}
                    </Text>
                  </View>
                </ImageBackground>
              </TouchableOpacity>
            );
          })
        ) : (
          <Text>You Have no Product Consider adding one </Text>
        )}
      </ScrollView>
    </View>
  );
};

export default ShopProduct;
