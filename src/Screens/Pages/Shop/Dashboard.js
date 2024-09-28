import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  ScrollView,
  SafeAreaView,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { GetShopDetails, DeleteShop } from "../../../redux/Features/Shop";
import Spinner from "react-native-loading-spinner-overlay";
import { Colors } from "../../components/Global";
import { Avatar } from "react-native-elements";
import { LinearGradient } from "expo-linear-gradient";
import { Entypo } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";
export default Dashboard = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(GetShopDetails());
  }, []);
  const navigation = useNavigation();
  const { loading, shopDetails } = useSelector((state) => state.Shops);
  const { height, width } = Dimensions.get("screen");
  const [delete_shop, setDeleteShop] = useState(false);
  // console.log(shopDetails?.shop?.id);
  const DeleteShopFunction = async () => {
    const result = await dispatch(
      DeleteShop({
        id: shopDetails?.shop?.id,
      })
    );
    if (DeleteShop.fulfilled.match(result)) {
      Toast.show({
        text1: "Shop Deleted Successfully",
        type: "success",
        position: "top",
        visibilityTime: 8000,
      });
      navigation.navigate("Home");
    }
  };
  return (
    <SafeAreaView className="flex-1">
      <Modal
        visible={delete_shop}
        transparent
        className="flex-1"
        animationType="fade"
      >
        <View
          className="flex-1 items-center justify-center"
          style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
        >
          <View className="py-4 rounded-md px-6 max-w-[90%] flex flex-col items-center justify-center bg-white">
            <Text>
              Are You Sure You want to delete this Shop
              <Text className="font-bold text-lg">
                {shopDetails?.shop?.name}?
              </Text>
            </Text>
            <View className="flex flex-row gap-x-5">
              <TouchableOpacity
                onPress={() => DeleteShopFunction()}
                className="border w-[35%] py-2 rounded-md items-center bg-[#10644D]"
              >
                <Text className="text-white font-bold">Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setDeleteShop(false)}
                className="border w-[35%] py-2 rounded-md items-center bg-orange-500"
              >
                <Text className="text-white font-bold">No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Spinner visible={loading} color={Colors.appColor} size={32} />
      <ScrollView className="flex-1 w-[96%] mx-auto">
        <View
          className="w-[100%] flex overflow-hidden rounded-lg mt-14 relative "
          style={{
            height: height / 4.5,
          }}
        >
          <ImageBackground
            source={
              shopDetails?.shop?.thumbnail
                ? { uri: shopDetails?.shop?.thumbnail }
                : require("../../../../assets/icons/logo.png")
            }
            // source={require("../../../../assets/icons/logo.png")}
            className=""
            resizeMode="cover"
            style={{
              flex: 1,
              height: "100%",
              width: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.2)",
            }}
          >
            <View
              className="px-2 h-[100%] w-[100%] py-3 justify-end "
              style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}
            >
              <LinearGradient
                className="z-50 absolute top-2 right-5 px-2 py-2 rounded-lg"
                colors={["rgba(0,0,0,1)", "rgba(227,117,39,1) 91%"]}
              >
                <Text className=" font-bold text-lg text-white">
                  {shopDetails?.shop?.name}
                </Text>
              </LinearGradient>

              <View className="flex flex-row self-end items-end z-30 gap-x-2">
                <View className="flex flex-row gap-x-1 bg-appColor px-2 rounded-lg py-1 border-white border">
                  <Text className="font-bold">Likes:</Text>
                  <Text>{shopDetails?.shop?.like}</Text>
                </View>
                <View className="flex flex-row gap-x-1 bg-appColor px-2 rounded-lg py-1 border-white border">
                  <Text className="font-bold">Followers:</Text>
                  <Text>{shopDetails?.shop?.followers}</Text>
                </View>
              </View>
            </View>
          </ImageBackground>
          <View className="absolute bottom-0 left-5">
            <Avatar
              source={
                shopDetails?.shop?.thumbnail
                  ? { uri: shopDetails?.shop?.thumbnail }
                  : null
              }
              size="xlarge"
              rounded
              containerStyle={{ borderRadius: width, borderWidth: 1 }}
            />
          </View>
        </View>
        <View className="bg-white my-3 rounded-lg px-2">
          <View className="flex flex-row justify-between items-center my-1">
            <Text className="font-bold text-lg">Shop Details</Text>
            <TouchableOpacity className="">
              <Entypo name="share" size={24} color="black" />
            </TouchableOpacity>
          </View>
          <View>
            <View className="flex flex-row   my-1 gap-x-1 items-center">
              <Text>Shop Name:</Text>
              <Text className="text-gray-600 font-bold text-md ">
                {shopDetails?.shop?.name}
              </Text>
            </View>
            <View className="flex flex-row my-1  gap-x-1 items-center">
              <Text>Shop Tel:</Text>
              <Text className="text-gray-600 font-bold text-md ">
                {shopDetails?.shop?.contact}
              </Text>
            </View>
            <View className="flex my-1 flex-row gap-x-1 items-center">
              <Text>Shop Location:</Text>
              <Text className="text-gray-600  font-bold text-md">
                {shopDetails?.shop?.location}
              </Text>
            </View>
          </View>
        </View>

        <View className="bg-white flex flex-row ">
          <View className="bg-white my-3 rounded-lg px-2">
            <View className="flex flex-row justify-between items-center my-1">
              <Text className="font-bold text-lg">Shop Owner Details</Text>
              <TouchableOpacity className=""></TouchableOpacity>
            </View>
            <View>
              <View className="flex flex-row   my-1 gap-x-1 items-center">
                <Text>Username:</Text>
                <Text className="text-gray-600 font-bold text-md ">
                  {shopDetails?.shop?.owner?.username}
                </Text>
              </View>
              <View className="flex flex-row my-1  gap-x-1 items-center">
                <Text>Owner's Tel:</Text>
                <Text className="text-gray-600 font-bold text-md ">
                  {shopDetails?.shop?.owner?.phone_number}
                </Text>
              </View>
              <View className="flex my-1 flex-row gap-x-1 items-center">
                <Text>Owner Email:</Text>
                <Text className="text-gray-600  font-bold text-md">
                  {shopDetails?.shop?.owner?.email}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View className="bg-white my-2 px-2 rounded-lg">
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("CreateShop")}
          >
            <Text className="text-white font-bold">Add New Shop</Text>
            <Entypo name="chevron-right" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() =>
              navigation.navigate("CreateShop", {
                id: shopDetails?.shop?.id,
              })
            }
          >
            <Text className="text-white font-bold">Edit Shop</Text>
            <Entypo name="chevron-right" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setDeleteShop(true)}
            className="bg-red-600 my-4 py-3 px-2 rounded-md"
          >
            <Text className="text-white font-bold">Delete Shop</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  button: {
    backgroundColor: "grey",
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 5,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
