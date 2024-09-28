import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { View, Text, Dimensions, ActivityIndicator } from "react-native";
import * as Animatable from "react-native-animatable";
import { Colors } from "../components/Global";
import { useSelector, useDispatch } from "react-redux";
import { FetchProduct } from "../../redux/Features/Product";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";
const Splash = () => {
  const { height, width } = Dimensions.get("screen");
  const dispatch = useDispatch();
  const navigation = useNavigation();
  // useEffect(() => {
  //   getProduct();
  // }, []);
  async function getProduct() {
    const result = await dispatch(FetchProduct());
    if (FetchProduct.fulfilled.match(result)) {
      navigation.navigate("BottomTab", {
        screen: "Home",
      });
    } else if (FetchProduct.rejected.match(result)) {
      Toast.show({
        text1: "Netowrk Error",
        text2: "Please Check your Network and try again",
        type: "error",
        position: "top",

        topOffset: 60,
      });
    }
  }
  return (
    <View className="flex-1 items-center justify-center flex flex-col">
      <StatusBar auto />
      <View className="z-50">
        <Toast />
      </View>
      <Animatable.View
        animation="pulse"
        duration={2000}
        iterationCount="infinite"
        className="rounded-full  border border-appColor items-center justify-center border-dashed"
        style={{ width: width * 0.8, height: width * 0.8 }}
      >
        <Animatable.View
          delay={2000}
          
          animation="pulse"
          iterationCount="infinite"
          className="rounded-full z-20 border border-appColor items-center justify-center"
          style={{ width: width * 0.6, height: width * 0.6 }}
        ></Animatable.View>
      </Animatable.View>
      <Animatable.Image
        animation="zoomIn"
        duration={2000}
        className="absolute rounded-full"
        source={require("../../../assets/icons/logo.png")}
        style={{
          width: width * 0.8,
          height: width * 0.8,
          backgroundColor: Colors.appColor,
        }}
      />
      <View className="my-10 absolute bottom-24">
        <ActivityIndicator size={30} color={Colors.appColor} />
      </View>
      <Animatable.View
        className="absolute bottom-20"
        animation="slideInDown"
        delay={2000}
        duration={3000}
        onAnimationEnd={()=> navigation.navigate("BottomTab", {
          screen: "Home",
        })}
      >
        <Text className="text-bold text-2xl text-appColor font-bold">
          KAZ NI KAZ
        </Text>
      </Animatable.View>
    </View>
  );
};

export default Splash;
