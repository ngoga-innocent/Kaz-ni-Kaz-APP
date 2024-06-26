import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Dimensions,
  Alert,
  TextInput,
  TouchableWithoutFeedback,
  Modal,
} from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";
import { Colors } from "../../components/Global";
import { useSelector, useDispatch } from "react-redux";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import {
  FetchColors,
  UploadProduct,
  FetchProduct,
} from "../../../redux/Features/Product";
import { FetchWallet } from "../../../redux/Features/WalletSlice";
import Spinner from "react-native-loading-spinner-overlay";
import Toast from "react-native-toast-message";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const AddProduct = ({ navigation }) => {
  const dispatch = useDispatch();
  const { wallet } = useSelector((state) => state.Wallet);
  const { colors } = useSelector((state) => state.Products);
  const { categories, loading } = useSelector((state) => state.Products);
  const { height, width } = Dimensions.get("screen");
  const [thumbnail, setThumbanail] = useState("");
  const [otherImages, setOtherImages] = useState([]);
  const [CategoryPosition, setCategoryPosition] = useState({ y: 0 });
  const [categoryVisible, setCategoryVisible] = useState(false);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [choosenCategory, setChoosenCategory] = useState();
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState();
  const [discount, setDiscount] = useState();
  const [shownCategories, setShownCategories] = useState(categories);
  const Places = ["Normal", "Vip"];
  const ChooseThumbnail = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,

      quality: 1,
    });
    if (!result.canceled) {
      setThumbanail(result.assets[0]);
    } else {
      Alert.alert("Thumbanil Selection Cancelled");
    }
  };
  useEffect(() => {
    dispatch(FetchColors());
  }, []);
  const AddOtherImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      //   allowsEditing: true,
      allowsMultipleSelection: true,
    });
    if (!result.canceled) {
      setOtherImages((previous) => [...previous, ...result.assets]);
    }
  };
  const ShowCategory = (event) => {
    const y = event.nativeEvent.locationY - 18;
    setCategoryPosition({ y: y });
  };
  //////// ######## ADD PRODUCT FUNCTION ######################?///////////////////
  const UploadProductFunction = async () => {
    if (
      name !== "" &&
      price !== "" &&
      choosenCategory != null &&
      description !== ""
    ) {
      const result = await dispatch(
        UploadProduct({
          name: name,
          price: parseInt(price),
          description: description,
          thumbnail: thumbnail,
          uploaded_images: otherImages,
          categories: choosenCategory,
          colors: selectedColors,
          place: selectedPlace,
          discount: discount,
        })
      );
      if (UploadProduct.fulfilled.match(result)) {
        dispatch(FetchWallet());
        dispatch(FetchProduct());
        Toast.show({
          text1: "product Uploaded Successfully",
          type: "success",
          position: "top",
          visibilityTime: 12000,
          autoHide: true,
          topOffset: 60,
        });
        navigation.navigate("BottomTab", {
          screen: "home",
        });
      } else if (UploadProduct.rejected.match(result)) {
        console.log("rejected with", result.payload);
        Toast.show({
          text1: result.payload.detail,
          type: "error",
          position: "top",
          visibilityTime: 12000,
          autoHide: true,
          topOffset: 60,
        });
      }
    } else {
      Alert.alert("Check empty Fields");
    }
  };
  const handlePersist = (e) => {
    e.stopPropagation();
  };
  const handleCategoryPress = (parent) => {
    const childCategory = categories.filter(
      (category) => category.parent == parent.id
    );
    if (childCategory.length > 0) {
      setShownCategories(childCategory);
    } else {
      setChoosenCategory(parent);
      setCategoryVisible(false);
    }
    console.log(childCategory);
  };
  return (
    <SafeAreaView className="flex-1">
      <View className="z-50">
        <Toast />
      </View>
      <Spinner visible={loading} color={Colors.appColor} size={30} />
      <ScrollView className="flex-1" stickyHeaderIndices={[0]}>
        <View>
          <View className=" flex-1 flex-row justify-between items-center  mb-8 bg-white px-2 rounded-lg py-2 pt-14">
            <Image
              source={require("../../../../assets/icon.png")}
              resizeMode="contain"
              className="w-14 h-14"
            />
            <Text className="text-2xl font-bold">Kazi Ni kazi</Text>
            <TouchableOpacity
              className="items-center"
              onPress={() =>
                navigation.navigate("BottomTab", {
                  screen: "wallet",
                })
              }
            >
              <FontAwesome6 name="coins" size={30} color={Colors.appColor} />
              <Text className="text-sm font-bold">{wallet?.amount} Rwf</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View className="flex-1 h-[100%] relative">
          <View
            className="w-[90%] border rounded-md self-center items-center justify-center "
            style={{
              height: height / 5.1,
              width: "90%",
            }}
          >
            <Image
              source={
                thumbnail !== ""
                  ? { uri: thumbnail.uri }
                  : require("../../../../assets/icons/logo.png")
              }
              resizeMode="cover"
              className="rounded-md"
              style={{ flex: 1, width: "100%" }}
            />
            <TouchableOpacity
              onPress={() => ChooseThumbnail()}
              className="absolute z-50 border-appColor border py-2 px-2 rounded-md bg-transparent"
              style={{ backgroundColor: "rgba(0,0,1,0.4)" }}
            >
              <Text className="text-white font-bold">Add Thumbnail</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View className="w-[90%] self-center">
          <TouchableOpacity
            onPress={() => AddOtherImage()}
            className="py-2 px-3 rounded-md bg-slate-400 items-center my-3"
          >
            <Text className="">Add other Images</Text>
          </TouchableOpacity>
          <ScrollView horizontal className="gap-x-2 gap-b-2">
            {otherImages?.length > 0 &&
              otherImages.map((item, index) => {
                return (
                  <TouchableOpacity
                    key={index}
                    className="border rounded-md relative justify-center"
                    style={{
                      width: width * 0.3,
                      height: height * 0.15,
                    }}
                  >
                    <TouchableOpacity
                      onPress={() =>
                        setOtherImages(
                          otherImages.filter((item, index1) => index1 != index)
                        )
                      }
                      className="absolute py-2 px-2 z-50 self-center bg-transparent"
                      style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
                    >
                      <MaterialIcons
                        name="delete-forever"
                        size={35}
                        color="orange"
                      />
                    </TouchableOpacity>
                    <Image
                      className="rounded-md"
                      resizeMode="cover"
                      source={{ uri: item.uri }}
                      style={{ flex: 1 }}
                    />
                  </TouchableOpacity>
                );
              })}
          </ScrollView>
        </View>
        <View className="w-[90%] flex-1 self-center">
          <Text className="font-bold text-xl">Product Details</Text>
          <TextInput
            className="border w-[100%] py-2 px-2 rounded-md my-1 bg-transparent"
            placeholder="Name"
            keyboardType=""
            value={name}
            onChangeText={(e) => setName(e)}
          />
          <TextInput
            className="border w-[100%] py-2 px-2 rounded-md my-1"
            placeholder="Price"
            keyboardType="numeric"
            value={price}
            onChangeText={(e) => setPrice(e)}
          />
          <TouchableOpacity
            onPress={(e) => {
              setCategoryVisible(!categoryVisible);
              ShowCategory(e);
            }}
            className="items-center bg-slate-400 py-2 px-3 rounded-md flex justify-center flex-row "
          >
            <Text className="font-bold">
              {choosenCategory ? choosenCategory.name : "Choose Category"}
            </Text>
            <AntDesign name="caretdown" size={20} color="black" />
          </TouchableOpacity>
          {categoryVisible && (
            <Modal className="flex-1" transparent animation="slide">
              <TouchableWithoutFeedback
                className="flex-1"
                onPress={() => setCategoryVisible(false)}
              >
                <View
                  className="flex-1 flex flex-col"
                  style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                >
                  <TouchableWithoutFeedback onPress={handlePersist}>
                    <View className="bg-white h-[50%]  w-full absolute bottom-0 rounded-t-3xl items-center justify-center flex flex-col">
                      <ScrollView className="w-[100%] py-4 max-h-[90%] overflow-y-scroll">
                        {shownCategories.map((category, index) => {
                          return (
                            <TouchableOpacity
                              onPress={() => handleCategoryPress(category)}
                              className="w-[80%] self-center my-1 px-4 rounded-md py-3 bg-slate-300"
                              key={index}
                            >
                              <Text>{category.name}</Text>
                            </TouchableOpacity>
                          );
                        })}
                      </ScrollView>
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              </TouchableWithoutFeedback>
            </Modal>
            // <ScrollView
            //   className="h-32 flex-1  absolute z-50  bg-white w-full self-center overflow-scroll  rounded-lg shadow-md shadow-black"
            //   //   contentContainerStyle={{
            //   //     alignItems: "center",
            //   //     flex: 1,
            //   //   }}
            //   style={{
            //     top: CategoryPosition.y,
            //   }}
            // >
            //   <View>
            //     {categories
            //       ?.filter((category) => !category.parent)
            //       ?.map((item, index) => {
            //         return (
            //           <TouchableOpacity
            //             onPress={() => {
            //               setChoosenCategory(item);
            //               setCategoryVisible(!categoryVisible);
            //             }}
            //             key={index}
            //             className="py-1  w-[90%] my-1 items-center"
            //           >
            //             <Text>{item?.name}</Text>
            //           </TouchableOpacity>
            //         );
            //       })}
            //   </View>
            // </ScrollView>
          )}
          <Text>Choose Available Colors</Text>
          {colors && (
            <View className=" flex flex-row flex-wrap gap-2 py-2">
              {colors?.map((color, index) => {
                return (
                  <TouchableOpacity
                    onPress={() =>
                      selectedColors.includes(color)
                        ? setSelectedColors(
                            selectedColors.filter(
                              (selected) => selected.id !== color.id
                            )
                          )
                        : setSelectedColors([...selectedColors, color])
                    }
                    key={index}
                    className={`rounded-full h-8 w-8 border items-center justify-center`}
                    style={{
                      backgroundColor: color.color,
                    }}
                  >
                    {selectedColors?.includes(color) && (
                      <Feather name="check" size={24} color="black" />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
          <TextInput
            className="border w-[100%] py-2 px-2 rounded-md my-1 "
            style={{ height: height * 0.09, maxHeight: height * 0.2 }}
            placeholder="description"
            keyboardType=""
            multiline
            value={description}
            onChangeText={(e) => setDescription(e)}
          />
          <Text className="font-bold">
            Kaz ni Kaz wish to know how to classify your product please choose
            one
          </Text>
          <View className="flex flex-row gap-x-2 my-2">
            {Places?.map((place, index) => {
              return (
                <TouchableOpacity
                  onPress={() => setSelectedPlace(place)}
                  className={`py-2 px-4 rounded-md ${
                    selectedPlace == place ? "bg-appColor" : "bg-slate-400"
                  }`}
                  key={index}
                >
                  <Text>{place}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
          <TextInput
            className="border w-[100%] py-2 px-2 rounded-md my-1 "
            style={{}}
            placeholder="Add Any Discount in %"
            keyboardType="numeric"
            value={discount}
            onChangeText={(e) => setDiscount(e)}
          />
        </View>
        <TouchableOpacity
          onPress={() => UploadProductFunction()}
          className="w-[90%] mb-20 self-center items-center rounded-md bg-transparent border-appColor border py-3"
        >
          <Text className="font-bold ">Upload a Product</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddProduct;
