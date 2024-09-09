import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  TextInput,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { FontAwesome6 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Toast from "react-native-toast-message";
import { useSelector, useDispatch } from "react-redux";
import {
  CreateShopFunction,
  GetShopDetails,
  UpdateShop,
} from "../../redux/Features/Shop";
import { useNavigation } from "@react-navigation/native";
import Spinner from "react-native-loading-spinner-overlay";
import { Colors } from "../components/Global";
const CreateShop = ({ route }) => {
  const dispatch = useDispatch();
  const [thumbnail, setThumbnail] = useState();
  const [name, setName] = useState();
  const [contact, setContact] = useState();
  const [location, setLocation] = useState();
  const { height, width } = Dimensions.get("screen");
  const { shopDetails, loading } = useSelector((state) => state.Shops);
  const { id } = route.params || {};
  const navigation = useNavigation();
  // console.log(route?.params);
  useEffect(() => {
    if (shopDetails && id) {
      setName(shopDetails?.shop?.name);
      setContact(shopDetails?.shop?.contact);
      setLocation(shopDetails?.shop?.location);
      setThumbnail({ uri: shopDetails?.shop?.thumbnail });
    }
  }, [shopDetails, id]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,

      quality: 1,
    });
    if (!result.canceled) {
      setThumbnail(result.assets[0]);
    } else {
      Alert.alert("Create Shop Cancelled");
    }
  };
  const HandleUpdate = async () => {
    // console.log(location);
    const result = await dispatch(
      UpdateShop({
        id: route.params.id,
        name: name,
        contact: contact,
        location: location,
        thumbnail: thumbnail,
      })
    );
    // console.log(result);
    if (UpdateShop.fulfilled.match(result)) {
      Toast.show({
        text1: "Shop Created Successfully",
        text2: "Thanks for Update a shop on Kaz ni Kaz",
        type: "success",
        position: "top",
        visibilityTime: 8000,
        autoHide: true,
        topOffset: 100,
      });
      navigation.navigate("Dashboard");
    } else if (UpdateShop.rejected.match(result)) {
      Toast.show({
        text1: "Failed to Update  shop",
        text2: "Failed to Update  shop please try again",
        type: "error",
        position: "top",
        visibilityTime: 8000,
        autoHide: true,
        topOffset: 100,
      });
    }
  };
  //Create a shop

  const HandleCreateShop = async () => {
    const result = await dispatch(
      CreateShopFunction({
        name: name,
        contact: contact,
        location: location,
        thumbnail: thumbnail,
      })
    );
    if (CreateShopFunction.fulfilled.match(result)) {
      Toast.show({
        text1: "Shop Created Successfully",
        text2: "Thanks for creating a shop on Kaz ni Kaz",
        type: "success",
        position: "top",
        visibilityTime: 8000,
        autoHide: true,
        topOffset: 100,
      });
      navigation.navigate("Dashboard");
    } else if (CreateShopFunction.rejected.match(result)) {
      Toast.show({
        text1: "Failed to create your new shop",
        text2: "Failed to create your new shop please try again",
        type: "error",
        position: "top",
        visibilityTime: 8000,
        autoHide: true,
        topOffset: 100,
      });
    }
  };

  return (
    <ScrollView>
      <View className="z-20">
        <Toast />
      </View>
      <Spinner visible={loading} color={Colors.appColor} />
      <View className="mt-14 flex items-center px-2">
        <LinearGradient
          colors={["rgba(0,0,0,1)", "rgba(227,117,39,1) 91%"]}
          className="w-full items-center py-2 my-2 rounded-md"
        >
          <Text className="text-white font-vold font-bold text-xl">
            {route?.params?.id ? "Update Shop" : "Create New Shop"}
          </Text>
        </LinearGradient>

        <View
          className="w-[100%] border border-appColor items-center justify-center overflow-hidden rounded-md relative"
          style={{ height: height / 2.8 }}
        >
          <Image
            source={{ uri: thumbnail?.uri }}
            style={{
              flex: 1,
              width: "100%",
              height: "100%",
            }}
            resizeMode="cover"
          />
          {!thumbnail && (
            <TouchableOpacity
              onPress={() => pickImage()}
              className="my-1 absolute bg-appColor border-appColor border py-2 px-2 rounded-md"
            >
              <Text className="text-white font-bold">Add Shop thumbnail</Text>
            </TouchableOpacity>
          )}
          {thumbnail && (
            <TouchableOpacity
              onPress={() => pickImage()}
              className="my-1  right-2 top-2 absolute bg-appColor border-appColor border py-2 px-2 rounded-md"
            >
              <Text className="text-white font-bold">Edit thumbnail</Text>
            </TouchableOpacity>
          )}
        </View>
        <View className="my-2 flex w-[100%]">
          <View className="bg-white px-2 rounded-md shadow-sm shadow-black my-1">
            <Text className="text-gray-300">Enter Shop Name</Text>
            <TextInput
              className="w-[100%] py-2 "
              value={name}
              onChangeText={(e) => setName(e)}
            />
          </View>
          <View className="bg-white px-2 rounded-md shadow-sm shadow-black my-1">
            <Text className="text-gray-300">Enter Shop Contact</Text>
            <TextInput
              className="w-[100%] py-2 "
              value={contact}
              onChangeText={(e) => setContact(e)}
            />
          </View>
          <View className="bg-white px-2 rounded-md shadow-sm shadow-black my-1">
            <Text className="text-gray-300">Enter Shop Location</Text>
            <TextInput
              className="w-[100%] py-2 "
              value={location}
              onChangeText={(text) => setLocation(text)}
            />
          </View>
          <TouchableOpacity
            onPress={() =>
              route?.params?.id ? HandleUpdate() : HandleCreateShop()
            }
            className="bg-appColor items-center my-4 py-3 px-2 rounded-md"
          >
            <Text className="text-white font-bold">
              {route?.params?.id ? "Update Shop" : "Create Shop"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default CreateShop;
