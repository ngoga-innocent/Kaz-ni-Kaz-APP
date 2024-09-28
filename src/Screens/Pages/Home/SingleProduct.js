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
  Share,
  Modal,
  Alert,
  TouchableWithoutFeedback,
  Pressable,
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
import { Octicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { SimpleLineIcons } from "@expo/vector-icons";
import { useSelector, useDispatch } from "react-redux";
import { Entypo } from "@expo/vector-icons";
import { useTheme } from "../../components/Functions/ThemeProvider";
import { deleteProduct, FetchProduct } from "../../../redux/Features/Product";
import Toast from "react-native-toast-message";
import { getProfile } from "../../../redux/Features/Account";
const SingleProduct = ({ route }) => {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const isDarkMode = theme === "dark";
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
  const { profile } = useSelector((state) => state.Account);
  console.log(product?.features);
  // console.log(profile);
  const { products } = useSelector((state) => state.Products);
  const product_category = product?.category;
  const RelatedProducts = products?.filter(
    (relatedProduct) =>
      relatedProduct.category == product_category &&
      relatedProduct.id != product.id
  );
  // console.log(RelatedProducts.length);
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
  const shareProduct = async (productId) => {
    try {
      const result = await Share.share({
        message: `Check out this product: https://kaznikazapi.onrender.com/product/${productId}`,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // Shared with activity type of result.activityType
        } else {
          // Shared
        }
      } else if (result.action === Share.dismissedAction) {
        // Dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };
  const deleteproductFunction = async () => {
    Alert.alert(
      "Delete Product",
      "Are you sure you want to delete this product?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: async () => {
            const result = await dispatch(
              deleteProduct({ product_id: product?.id })
            );
            console.log(result);
            if (deleteProduct.fulfilled.match(result)) {
              Toast.show({
                text1: "Product Deleted Successfully",
                type: "success",
                visibilityTime: 3000,
                position: "top",
                autoHide: true,
                topOffset: 100,
              });
              dispatch(FetchProduct());
              navigation.navigate("Homepage");
            } else if (deleteProduct.rejected.match(result)) {
              Toast.show({
                text1: "Failed to Delete Product",
                type: "error",
                visibilityTime: 3000,
                position: "top",
                autoHide: true,
                topOffset: 100,
              });
            }
          },
        },
      ],
      { cancelable: true }
    );
  };
  return (
    <ScrollView
      className={`flex-1 ${isDarkMode && "bg-darkcolor"}`}
      // contentContainerStyle={{
      //   flex: 1,
      // }}
      stickyHeaderIndices={[0]}
    >
      <View>
        <View
          className={`flex flex-row ${
            isDarkMode ? "bg-darkcolor" : "bg-white"
          } pt-14 pb-3 items-center justify-between px-4`}
        >
          <TouchableOpacity
            className={`${
              isDarkMode ? "bg-white" : "bg-black"
            } px-2 py-2 rounded-md`}
            onPress={() =>
              navigation.navigate("Home", {
                screen: "Homepage",
              })
            }
          >
            {/* <Ionicons name="caret-back" size={24} color={Colors.appColor} /> */}
            <Ionicons
              name="chevron-back"
              size={24}
              color={isDarkMode ? "#171716" : Colors.primary}
            />
          </TouchableOpacity>
          <Text className={`text-xl font-bold ${isDarkMode && "text-white"}`}>
            Product Details
          </Text>
          <TouchableOpacity onPress={() => shareProduct(product?.id)}>
            <Entypo
              name="share"
              size={24}
              color={isDarkMode ? "white" : "black"}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View className="z-50">
        <Toast />
      </View>
      <ScrollView
        ref={viewRef}
        className="bg-darkcolor"
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
        className={`bg-white ${
          isDarkMode ? "bg-transparent" : ""
        } flex-1   px-4 mx-1 py-2 rounded-3xl `}
        style={{ flex: 1, minHeight: height * 0.4 }}
      >
        <View className="flex flex-row items-center justify-between py-2">
          <View>
            <Text className={`text-lg font-bold ${isDarkMode && "text-white"}`}>
              {product?.name}
            </Text>
            <Text className="text-md font-bold text-appColor">
              Price: {product?.price} {product?.currency}
            </Text>
          </View>
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
        {/* Product Description */}
        <View>
          <TouchableOpacity className="flex flex-row items-center  my-2 ">
            <Text
              className={`font-bold text-md w-[50%] ${
                isDarkMode && "text-white"
              }`}
            >
              Category
            </Text>
            <Text
              className={`font-bold text-md text-slate-600 ${
                isDarkMode && "text-white"
              }`}
            >
              {product?.category_details?.name}
            </Text>
          </TouchableOpacity>
          {product?.features?.map((feature, index) => {
            return (
              <>
                <View
                  key={index}
                  style={{ height: 1, backgroundColor: Colors.appColor }}
                />
                <View className="flex flex-row">
                  <Text
                    className={`font-bold text-md w-[50%] ${
                      isDarkMode && "text-white"
                    }`}
                  >
                    {feature?.feature_options?.name}
                  </Text>
                  <Text>{feature?.option_details?.name}</Text>
                </View>
              </>
            );
          })}

          <View style={{ height: 1, backgroundColor: Colors.appColor }} />
          <TouchableOpacity className="flex flex-row items-center  my-1 ">
            <Text
              className={`font-bold text-md w-[50%] ${
                isDarkMode && "text-white"
              }`}
            >
              Owner
            </Text>
            <Text
              className={` font-bold text-md text-slate-600 ${
                isDarkMode && "text-white"
              }`}
            >
              {product?.uploader?.username}
            </Text>
          </TouchableOpacity>
          <View style={{ height: 1, backgroundColor: Colors.appColor }} />
          {product?.shop && (
            <>
              <TouchableOpacity className="flex flex-row items-center  my-1 ">
                <Text
                  className={`font-bold text-md w-[50%] ${
                    isDarkMode && "text-white"
                  }`}
                >
                  Shop
                </Text>
                <Text
                  className={`font-semibold text-md text-slate-600 ${
                    isDarkMode && "text-white"
                  }`}
                >
                  {product?.shop_details?.name}
                </Text>
              </TouchableOpacity>
              <View style={{ height: 1, backgroundColor: Colors.appColor }} />
            </>
          )}
          {product?.shop_details ? (
            <View className="bg-gray-200 rounded-lg px-3 py-2 my-2">
              <View className="flex flex-row items-start gap-x-4 ">
                <Image
                  source={{ uri: product?.shop_details?.thumbnail }}
                  className="w-14 h-14 rounded-full"
                />
                <View>
                  <View className="flex flex-row gap-x-2 items-center  ">
                    <Text className="font-semibold  ">
                      {product?.shop_details?.name}
                    </Text>
                    {product?.shop_details?.verified ? (
                      <MaterialIcons name="verified" size={15} color="green" />
                    ) : (
                      <Octicons name="unverified" size={15} color="red" />
                    )}
                  </View>
                  <Text>{product?.shop_details?.contact}</Text>
                </View>
              </View>
              <View className="flex flex-row items-center gap-x-2 justify-between my-2">
                <TouchableOpacity
                  onPress={() => phoneCall(product?.shop_details?.contact)}
                  className="py-2 bg-appColor rounded-full w-[45%] items-center justify-center gap-x-2 flex flex-row"
                >
                  <Ionicons name="call" size={20} color="white" />
                  <Text className="text-white font-bold text-md">Call</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setContactUs(!contactUs)}
                  className="py-2 bg-[#25d366] rounded-full w-[45%] items-center justify-center gap-x-2 flex flex-row"
                >
                  <MaterialIcons
                    name="quick-contacts-dialer"
                    size={24}
                    color="white"
                  />
                  <Text className="text-white font-bold text-md">Connect</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <>
              {product?.uploader?.id == profile?.user?.id ? (
                <>
                  <View className="bg-gray-200 rounded-lg px-3 py-2 my-2">
                    <View className="flex flex-row items-start gap-x-4 ">
                      <Image
                        source={{ uri: product?.uploader?.profile }}
                        className="w-14 h-14 rounded-full"
                      />
                      <View>
                        <View className="flex flex-row gap-x-2 items-center  ">
                          <Text className="font-semibold  ">
                            {product?.uploader?.username}
                          </Text>
                          {product?.uploader?.verified ? (
                            <MaterialIcons
                              name="verified"
                              size={15}
                              color="green"
                            />
                          ) : (
                            <View className="flex flex-row items-center gap-x-2">
                              <Octicons
                                name="unverified"
                                size={15}
                                color="red"
                              />
                              <Text className="text-xs font-bold">
                                Not Verified
                              </Text>
                            </View>
                          )}
                        </View>
                        <Text>{product?.uploader?.phone_number}</Text>
                      </View>
                    </View>
                    <View className="flex flex-row items-center gap-x-2 justify-between my-2">
                      <TouchableOpacity
                        onPress={() => Alert.prompt("")}
                        // className="py-2 bg-appColor rounded-full w-[45%] items-center justify-center gap-x-2 flex flex-row"
                      >
                        {/* <Feather name="edit" size={24} color="black" />
                        <Text className="text-white font-bold text-md">
                          Edit
                        </Text> */}
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => deleteproductFunction()}
                        className="py-2 bg-red-400 rounded-full w-[45%] items-center justify-center gap-x-2 flex flex-row"
                      >
                        <MaterialIcons name="delete" size={24} color="black" />
                        <Text className="text-white font-bold text-md">
                          Delete
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </>
              ) : (
                <>
                  <View className="bg-gray-200 rounded-lg px-3 py-2 my-2">
                    <View className="flex flex-row items-start gap-x-4 ">
                      <Image
                        source={{ uri: product?.uploader?.profile }}
                        className="w-14 h-14 rounded-full"
                      />
                      <View>
                        <View className="flex flex-row gap-x-2 items-center  ">
                          <Text className="font-semibold  ">
                            {product?.uploader?.username}
                          </Text>
                          {product?.uploader?.verified ? (
                            <MaterialIcons
                              name="verified"
                              size={15}
                              color="green"
                            />
                          ) : (
                            <View className="flex flex-row items-center gap-x-2 ">
                              <Text className="text-xs font-bold text-orange-500">
                                Not Verified
                              </Text>
                              <Octicons
                                name="unverified"
                                size={15}
                                color="red"
                              />
                            </View>
                          )}
                        </View>
                        <Text>{product?.uploader?.phone_number}</Text>
                      </View>
                    </View>
                    <View className="flex flex-row items-center gap-x-2 justify-between my-2">
                      <TouchableOpacity
                        onPress={() =>
                          phoneCall(product?.uploader?.phone_number)
                        }
                        className="py-2 bg-appColor rounded-full w-[45%] items-center justify-center gap-x-2 flex flex-row"
                      >
                        <Ionicons name="call" size={20} color="white" />
                        <Text className="text-white font-bold text-md">
                          Call
                        </Text>
                      </TouchableOpacity>

                      {/* <TouchableOpacity
                        onPress={() =>
                          Linking.openURL(
                            `whatsapp://send?text=Kaz ni Kaz request&phone=${product?.uploader?.phone_number}`
                          )
                        }
                        className="py-2 bg-[#25d366] rounded-full w-[45%] items-center justify-center gap-x-2 flex flex-row"
                      >
                        <FontAwesome name="whatsapp" size={24} color="black" />
                        <Text className="text-white font-bold text-md">
                          whatsapp
                        </Text>
                      </TouchableOpacity> */}
                      <TouchableOpacity
                        onPress={() => setContactUs(!contactUs)}
                        className="py-2 bg-[#25d366] rounded-full w-[45%] items-center justify-center gap-x-2 flex flex-row"
                      >
                        <MaterialIcons
                          name="quick-contacts-dialer"
                          size={24}
                          color="white"
                        />
                        <Text className="text-white font-bold text-md">
                          Connect
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </>
              )}
            </>
          )}
        </View>
        <View>
          <Text className={`font-bold text-lg ${isDarkMode && "text-white"}`}>
            Find Related Products
          </Text>
          <ScrollView>
            {RelatedProducts?.map((product, index) => {
              return (
                <TouchableOpacity
                  className="flex flex-row items-center gap-x-2  py-2"
                  key={index}
                  onPress={() =>
                    navigation.navigate("Home", {
                      screen: "singleProduct",
                      params: {
                        product: product,
                      },
                    })
                  }
                >
                  <Image
                    source={{ uri: product.thumbnail }}
                    style={{ width: 100, height: 100 }}
                    className="rounded-md"
                  />
                  <View>
                    <Text
                      className={`text-sm font-bold ${
                        isDarkMode && "text-white"
                      }`}
                    >
                      {product.name}
                    </Text>
                    <Text
                      className={`text-xs text-gray-500 ${
                        isDarkMode && "text-white"
                      }`}
                    >
                      Price: {product.price} Rwf
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </View>
      <Modal
        transparent
        animationType="slide"
        visible={contactUs}
        onRequestClose={() => setContactUs(false)}
        className="flex-1"
      >
        <View className="flex-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <Pressable style={{ flex: 1 }} onPress={() => setContactUs(false)}>
            <View className="absolute bottom-0 bg-white">
              <Pressable style={{}} onPress={() => {}}>
                <View style={{ flex: 1, justifyContent: "flex-end" }}>
                  <View
                    style={{
                      backgroundColor: "white",
                      borderTopLeftRadius: 20,
                      borderTopRightRadius: 20,
                      padding: 20,
                      alignItems: "center",
                    }}
                    className="flex flex-row flex-wrap items-center gap-x-2 justify-center"
                  >
                    <TouchableOpacity
                      onPress={() =>
                        Linking.openURL(
                          `whatsapp://send?text=Kaz ni Kaz request&phone=${product?.uploader?.phone_number}`
                        )
                      }
                      style={{
                        backgroundColor: "#25d366",
                        borderRadius: 50,
                        width: "45%",
                        padding: 10,
                        marginVertical: 10,
                        alignItems: "center",
                        flexDirection: "row",
                        justifyContent: "center",
                      }}
                    >
                      <FontAwesome name="whatsapp" size={24} color="white" />
                      <Text
                        style={{
                          color: "white",
                          fontWeight: "bold",
                          marginLeft: 10,
                        }}
                      >
                        WhatsApp
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => sendSms(product?.uploader?.phone_number)}
                      style={{
                        backgroundColor: "blue",
                        borderRadius: 50,
                        width: "45%",
                        padding: 10,
                        marginVertical: 10,
                        alignItems: "center",
                        flexDirection: "row",
                        justifyContent: "center",
                      }}
                    >
                      <MaterialIcons name="message" size={28} color="white" />
                      <Text
                        style={{
                          color: "white",
                          fontWeight: "bold",
                          marginLeft: 10,
                        }}
                      >
                        Message
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        dispatch(getProfile());
                        if (profile) {
                          setContactUs(!contactUs);
                          navigation.navigate("Chat", {
                            screen: "chatHome",
                            params: {
                              receiver_id: product?.uploader?.id,
                              
                                
                                receiver_username:product?.uploader?.username,
                                receiver_photo:product?.uploader?.profile,
                                receiver_online_status:product?.uploader?.online_status,
                                phone_number:product?.uploader?.phone_number
                            
                            },
                          });
                        } else {
                          setContactUs(!contactUs);
                          Alert.alert(
                            "You need to login to be able to chat with our Seller",
                            "To ensure the Safety of the conversations,You need to login first",
                            [
                              {
                                text: "Login",
                                onPress: () => navigation.navigate("logins"),
                              },
                            ]
                          );
                        }
                      }}
                      style={{
                        backgroundColor: Colors.appColor,
                        borderRadius: 50,
                        width: "45%",
                        padding: 10,
                        marginVertical: 10,
                        alignItems: "center",
                        flexDirection: "row",
                        justifyContent: "center",
                      }}
                    >
                      <Ionicons
                        name="chatbubbles-sharp"
                        size={28}
                        color="white"
                      />
                      <Text
                        style={{
                          color: "white",
                          fontWeight: "bold",
                          marginLeft: 10,
                        }}
                      >
                        Chat
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Pressable>
            </View>
          </Pressable>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default SingleProduct;
{
  /* <View className="flex flex-row items-center gap-x-2  py-2">
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
      )} */
}
