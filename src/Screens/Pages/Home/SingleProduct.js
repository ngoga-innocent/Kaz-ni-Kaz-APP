import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Linking,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../components/Global";
import { AntDesign } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import * as Animated from "react-native-animatable";
import { Avatar } from "react-native-elements";
import * as SMS from "expo-sms";
import { useNavigation } from "@react-navigation/native";
const SingleProduct = ({ route }) => {
  //console.log("selected Product", route?.params?.product);
  const viewRef = useRef();
  const navigation = useNavigation();
  const product_desc = ["Description", "Shop/Seller"];
  const { width, height } = Dimensions.get("screen");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [contactUs, setContactUs] = useState(false);
  const handleScroll = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / Dimensions.get("screen").width);
    setFocusedIndex(index);
  };

  const product = route?.params?.product;

  const [focusedIndex, setFocusedIndex] = useState(
    Math.round(product?.uploaded_images?.length / 2)
  );
  // const handleMomentumScrollEnd = () => {
  //   const index = Math.round(
  //     viewRef.current.contentOffset.x / Dimensions.get("screen").width
  //   );
  //   setFocusedIndex(index);
  //   const scrollToX = index * Dimensions.get("screen").width;
  //   viewRef.current.scrollTo({ x: scrollToX, animated: true });
  // };
  const sendSms = async (phone_number) => {
    const isAvailable = await SMS.isAvailableAsync();
    console.log(phone_number);
    if (isAvailable) {
      await SMS.sendSMSAsync(phone_number, "Kaz ni Kaz Request Support");
    }
  };
  const phoneCall = async (phone_number) => {
    if (Platform.OS === "android") {
      try {
        const supported = await Linking.canOpenURL(`tel:${phone_number}`);
        if (supported) {
          await Linking.openURL(`tel:${phone_number}`);
        } else {
          console.log("Can't handle url");
        }
      } catch (e) {
        console.log("Error", e);
      }
    } else {
      try {
        const supported = await Linking.canOpenURL(`telprompt:${phone_number}`);
        if (supported) {
          await Linking.openURL(`telprompt:${phone_number}`);
        } else {
          console.log("Can't handle url");
        }
      } catch (e) {
        console.log("Error", e);
      }
    }
  };
  return (
    <ScrollView
      className="flex-1 "
      // contentContainerStyle={{
      //   flex: 1,
      // }}
      stickyHeaderIndices={[0]}
    >
      <View>
        <View className="flex flex-row bg-white pt-14 pb-3 items-center justify-between px-4">
          <TouchableOpacity
            className="bg-black px-2 py-2 rounded-md"
            onPress={() =>
              navigation.navigate("Home", {
                screen: "Homepage",
              })
            }
          >
            {/* <Ionicons name="caret-back" size={24} color={Colors.appColor} /> */}
            <Ionicons name="chevron-back" size={24} color={Colors.primary} />
          </TouchableOpacity>
          <Text className="text-xl font-bold">Product Details</Text>
          <TouchableOpacity></TouchableOpacity>
        </View>
      </View>
      <ScrollView
        ref={viewRef}
        className=""
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={Dimensions.get("screen").width / 4}
        onScroll={handleScroll}
        // onMomentumScrollEnd={handleMomentumScrollEnd}
        //snapToInterval={Dimensions.get("screen").width} // Snap to the width of the screen
        snapToAlignment="center"
      >
        {product?.uploaded_images?.map((item, index) => {
          return (
            <View
              key={index}
              className={`py-2 rounded-md   justify-center self-center `}
              style={{
                width: width,
                flex: 0.6,
                height: height / 2.3,
                paddingHorizontal: "1%",
              }}
              // style={{
              //   flex: 1,
              //   alignSelf: "center",
              //   justifyContent: "center",
              //   height: Dimensions.get("screen").height / 2.3,
              //   width: Dimensions.get("screen").width / 1.1,
              // }}
            >
              <Image
                source={{ uri: item.image }}
                style={{ flex: 1 }}
                className="rounded-md "
                resizeMode="cover"
              />
            </View>
          );
        })}
      </ScrollView>
      <View
        className="bg-white flex-1   px-4 mx-1 py-2 rounded-md"
        style={{ flex: 1, minHeight: height * 0.4 }}
      >
        <View className="flex flex-row items-center justify-between py-2">
          <Text className="text-xl">{product?.name}</Text>
          <Text className="text-lg font-bold">Price: {product?.price} Rwf</Text>
          <TouchableOpacity className="px-2 py-2 bg-appColor rounded-md">
            <AntDesign name="heart" size={20} color="white" />
          </TouchableOpacity>
        </View>
        <View className="flex flex-row gap-x-1">
          <AntDesign name="star" size={17} color={Colors.appColor} />
          <AntDesign name="star" size={17} color={Colors.appColor} />
          <AntDesign name="star" size={17} color={Colors.appColor} />
          <AntDesign name="star" size={17} color={Colors.appColor} />
        </View>
        <View className="flex flex-row items-center gap-x-2  py-2">
          {product_desc.map((item, index) => {
            return (
              <TouchableOpacity
                className={`${
                  selectedIndex == index
                    ? "w-[70%]  py-2  rounded-md"
                    : "w-[30%]"
                }`}
                key={index}
                onPress={() => setSelectedIndex(index)}
              >
                <Text
                  className={`font-bold ${
                    selectedIndex == index ? "text-black" : "text-gray-500"
                  }`}
                >
                  {item}
                </Text>
                {selectedIndex === index && (
                  <View className="h-1 w-[50%] bg-appColor" />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
        {selectedIndex == 0 && (
          <ScrollView
            className=" flex-1 w-full overflow-scroll"
            contentContainerStyle={{}}
          >
            <Text>{product?.description}</Text>

            <Text className="font-bold text-md mt-2">Available Colors</Text>
            <View className="flex flex-row flex-wrap w-[100%] my-2">
              {product?.colors_details?.map((item, index) => {
                return (
                  <View
                    key={index}
                    className="rounded-full w-10 h-10"
                    style={{
                      borderColor: "",
                      backgroundColor: item.color,
                    }}
                  />
                );
              })}
            </View>
          </ScrollView>
        )}
        {selectedIndex == 1 && (
          <ScrollView
            className="flex-1 w-full"
            contentContainerStyle={{
              alignItems: "center",
            }}
          >
            <Avatar
              source={{
                uri:
                  product?.shop == null
                    ? product?.uploader?.profile_image
                    : product?.shop?.thumbnail,
              }}
              size="large"
              rounded
              containerStyle={{
                borderColor: Colors.appColor,
                borderWidth: 1,
              }}
            />
            <View className="flex flex-row items-center justify-start  gap-x-1">
              <Text className="font-bold text-lg">Owner:</Text>
              {product?.shop == null ? (
                <Text>{product?.uploader?.username} </Text>
              ) : null}
            </View>
            <View className="flex flex-row items-center  gap-x-1">
              <Text className="font-bold text-lg">Email:</Text>
              {product?.shop == null ? (
                <Text>{product?.uploader?.email} </Text>
              ) : null}
            </View>
            <View className="flex flex-row items-center  gap-x-1">
              <Text className="font-bold text-lg">phone:</Text>
              {product?.shop == null ? (
                <Text>
                  {product?.uploader?.phone_number || "No added number"}{" "}
                </Text>
              ) : null}
            </View>
          </ScrollView>
        )}
        <TouchableOpacity
          onPress={() => setContactUs(!contactUs)}
          className="py-3 bg-appColor  mb-8 items-center w-[100%] self-center rounded-md border border-white"
        >
          <Text className="text-white font-bold text-lg">Get In Touch</Text>
        </TouchableOpacity>
      </View>

      {contactUs && (
        <Animated.View
          // transition="opacity"
          animation="slideInDown"
          // delay={2000}
          easing="ease-in-out"
          duration={2000}
          className="absolute px-4 z-20 py-2 rounded-md bottom-11 right-4"
          style={{
            backgroundColor: "rgba(0,0,0,0.4) ",
            zIndex: 20,
            elevation: 0,
          }}
        >
          <TouchableOpacity
            onPress={() =>
              Linking.openURL(
                `whatsapp://send?text=Kaz ni Kaz request&phone=25${product?.uploader?.phone_number}`
              )
            }
          >
            <FontAwesome name="whatsapp" size={40} color="green" />
          </TouchableOpacity>
          <View className="h-1 w-[100%] bg-black" />
          <TouchableOpacity
            onPress={() => sendSms(product?.uploader?.phone_number)}
          >
            <MaterialIcons name="message" size={40} color="blue" />
          </TouchableOpacity>
          <View className="h-1 w-[100%] bg-black my-1 " />
          <TouchableOpacity
            onPress={() => phoneCall(product?.uploader?.phone_number)}
          >
            <Feather name="phone-call" size={40} color="#1d588d" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("Chat", {
                screen: "chatHome",
                params: {
                  receiver_id: product?.uploader?.id,
                },
              })
            }
          >
            <Text>Chat</Text>
          </TouchableOpacity>
          <View className="h-1 w-[100%] bg-black mt-1" />
          <TouchableOpacity
            onPress={() => setContactUs(!contactUs)}
            className="bg-red-400 items-center justify-center rounded-full h-10 mt-2 w-10 "
          >
            <FontAwesome name="close" size={30} color="white" />
          </TouchableOpacity>
        </Animated.View>
      )}
    </ScrollView>
  );
};

export default SingleProduct;
