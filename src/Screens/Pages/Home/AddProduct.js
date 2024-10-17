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
  fetchFeatures,
} from "../../../redux/Features/Product";
import { FetchWallet } from "../../../redux/Features/WalletSlice";
import Spinner from "react-native-loading-spinner-overlay";
import Toast from "react-native-toast-message";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { GetUserShops } from "../../../redux/Features/Shop";
import Foundation from "@expo/vector-icons/Foundation";
const AddProduct = ({ navigation }) => {
  const dispatch = useDispatch();
  const { wallet } = useSelector((state) => state.Wallet);
  const { colors } = useSelector((state) => state.Products);
  const { Shops } = useSelector((state) => state.Shops);
  const { profile } = useSelector((state) => state.Account);

  const { categories, features, loading } = useSelector(
    (state) => state.Products
  );
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
  
  const [selectedCurrency, setSelectedCurrency] = useState();
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [showFeaturesoption, setShowFeaturesOptions] = useState(false);
  const [featureOptions, setFeatureOptions] = useState([]);
  const [shownCategories, setShownCategories] = useState(
    categories?.filter((category) => category.parent == null)
  );
  const [availableParentCategory,setAvailableparentCategory] = useState([])
  const [currentParentCategory,setCurrentParentCategory]=useState()
  const [selectedShop, setSelectedShop] = useState();
  const [showShop, setShowShop] = useState(false);
  const maxFilesize=1000*1024
  const Places = ["Normal", "Vip"];
  const currency = ["Rwf", "USD"];
  useEffect(() => {
    dispatch(GetUserShops());
  }, []);
  const ChooseThumbnail = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,

      quality: 1,
    });
    console.log("thumbnail",result)
    if(result.assets[0]?.fileSize >maxFilesize){
      Alert.alert("Image must not exceed 1mbs")
      return 
    }
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
    console.log(result)
    result?.assets.forEach(image => {
      if(image.fileSize>maxFilesize){
        Alert.alert(image?.fileName + 'Exceded maximum Image size allowed on kaz ni kaz')
        return
      }
      setOtherImages((previous) => [...previous, image]);
    });
    // if (!result.canceled) {
    //   setOtherImages((previous) => [...previous, ...result.assets]);
    // }
  };
  const ShowCategory = (event) => {
    const y = event.nativeEvent.locationY - 18;
    setCategoryPosition({ y: y });
  };
  //////// ######## ADD PRODUCT FUNCTION ######################?///////////////////
  const UploadProductFunction = async () => {
    let selectedOptions = [];
    if (selectedFeatures) {
      for (let i in selectedFeatures) {
        selectedOptions.push(selectedFeatures[i].id);
      }
    }

    if (
      name !== "" ||
      price !== "" ||
      choosenCategory != null ||
      description !== "" || !thumbnail 
    ) {
      const result = await dispatch(
        UploadProduct({
          name: name,
          price: parseInt(price),
          description: description,
          thumbnail: thumbnail,
          uploaded_images: otherImages,
          categories: choosenCategory,
          shop: selectedShop,
          colors: selectedColors,
          place: selectedPlace,
          discount: discount,
          currency: selectedCurrency,
          features: selectedOptions,
        })
      );
      if (UploadProduct.fulfilled.match(result)) {
        dispatch(FetchWallet());
        dispatch(FetchProduct());
        // setThumbanail()
        // setOtherImages([])
        // setSelectedColors([])
        // setDescription()
        // setName("")
        // setChoosenCategory()
        // setSelectedCurrency()
        // setSelectedFeatures()
        // setSelectedShop()
        // setSelectedPlace()
        // setDiscount()
        Toast.show({
          text1: "product Uploaded Successfully",
          type: "success",
          position: "top",
          visibilityTime: 12000,
          autoHide: true,
          topOffset: 60,
        });
        navigation.navigate("BottomTab", {
          screen: "Home",
          params: {
            screen: "Homepage",
          },
        });
      } else if (UploadProduct.rejected.match(result)) {
        console.log("rejected with", result);
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
  const handleCategoryBackPress=()=>{
    console.log(currentParentCategory)
    if(currentParentCategory.parent){
      setShownCategories(categories?.filter((category) => category.parent == currentParentCategory.parent))
      setCurrentParentCategory(categories?.find((category) => category.id == currentParentCategory.parent))
    }
    else{
      setShownCategories(categories?.filter((category)=>!category.parent))
    }
    // const childCategory = categories.filter(
    //   (category) => category.parent == parent.id
    // );
  }
  const handleCategoryPress = async (parent) => {
    const childCategory = categories.filter(
      (category) => category.parent == parent.id
    );
    if (childCategory.length > 0) {
      setShownCategories(childCategory);
      setCurrentParentCategory(parent);
    } else {
      // console.log(features);
      const result = await dispatch(
        fetchFeatures({
          category_id: parent.id,
        })
      );
      console.log(result);
      setChoosenCategory(parent);
      setCategoryVisible(false);
    }
    // console.log(childCategory);
  };
  const ChooseFeatureOption = (feature) => {
    setShowFeaturesOptions(true);
    setFeatureOptions(feature?.feature_options);
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
            <Text className="text-2xl font-bold">Kaz Ni kaz</Text>
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
        
          <>
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
                              otherImages.filter(
                                (item, index1) => index1 != index
                              )
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
              <View className="flex flex-row items-center gap-x-3 my-2">
                <Text className="font-bold">Choose Currency:</Text>
                {currency?.map((item, index) => {
                  return (
                    <TouchableOpacity
                      onPress={() => setSelectedCurrency(item)}
                      key={index}
                      className={`${
                        selectedCurrency === item
                          ? "bg-appColor"
                          : "bg-gray-400"
                      } px-4 py-2 rounded-md`}
                    >
                      <Text>{item}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
              <TextInput
                className="border w-[100%] py-2 px-2 rounded-md my-1"
                placeholder="Price"
                keyboardType="numeric"
                value={price}
                onChangeText={(e) => setPrice(e)}
              />
              <TouchableOpacity
                className="bg-slate-400 py-2 items-center rounded-md my-2"
                onPress={() => setShowShop(true)}
              >
                <Text className="font-bold items-center">
                  {selectedShop?.name || `Select Product Shop`}
                  <AntDesign name="caretdown" size={20} color="black" />
                </Text>
              </TouchableOpacity>
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
              {showShop && (
                <Modal className="flex-1" transparent animationType="slide">
                  <TouchableWithoutFeedback
                    className=""
                    onPress={() => setShowShop(false)}
                  >
                    <View
                      className="flex-1 flex flex-col relative justify-end"
                      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                    >
                      <TouchableWithoutFeedback
                        className="flex flex-col"
                        onPress={handlePersist}
                      >
                        <View className=" bg-white h-[50%] bottom-0 rounded-t-3xl">
                          <ScrollView
                            className="w-[100%] py-4 max-h-[90%] overflow-y-scroll"
                            contentContainerStyle={{ paddingVertical: 20 }}
                          >
                          {Shops?.shops?.length >0?<View className="w-[80%] mx-auto my-2 flex flex-row justify-between items-center">
                            <Text className="font-bold ">
                              Select The shop of your product
                            </Text>
                            <TouchableOpacity
                              onPress={() => {
                                setSelectedShop(null);
                                setShowShop(false);
                              }}
                              className="bg-amber-500 py-2 px-2 rounded-md "
                            >
                              <Text className="font-bold ">Clear</Text>
                            </TouchableOpacity>
                          </View>:<Text>Yoo have not yet created a shop,So the product will be personlized to your account</Text>}
                            {Shops?.shops?.map((shop, index) => {
                              return (
                                <TouchableOpacity
                                  onPress={() => {
                                    setSelectedShop(shop);
                                    setShowShop(false);
                                  }}
                                  className="w-[80%] self-center my-1 px-4 rounded-md py-3 bg-slate-300"
                                  key={index}
                                >
                                  <Text>{shop.name}</Text>
                                </TouchableOpacity>
                              );
                            })}
                          </ScrollView>
                        </View>
                      </TouchableWithoutFeedback>
                    </View>
                  </TouchableWithoutFeedback>
                </Modal>
              )}
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
                        <View className="bg-white h-[50%] py-5 flex-1  w-full absolute bottom-0 rounded-t-3xl items-center justify-center flex flex-col">
                          <ScrollView className="w-[100%] flex-1  overflow-y-scroll" stickyHeaderIndices={[0]}>
                            <View className="flex flex-row items-center justify-between bg-white z-50">
                            <TouchableOpacity
                              onPress={() => handleCategoryBackPress()}
                              className="bg-slate-400 py-2 px-3 rounded-md mx-6 "
                            >
                              <Text className="font-bold">Back</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              onPress={() => {
                                handleCategoryPress(choosenCategory)
                              }}
                              className="self-end mx-6 bg-green-700 py-2 px-4 rounded-md"
                            >
                              <Text className="font-bold text-white">Next</Text>
                            </TouchableOpacity>
                            </View>
                            {shownCategories.map((category, index) => {
                              return (
                                <TouchableOpacity
                                  onPress={() => setChoosenCategory(category)}
                                  className={`${category==choosenCategory?'bg-appColor':'bg-slate-300'} w-[80%] self-center my-1 px-4 rounded-md py-3 `}
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
                Kaz ni Kaz wish to know how to classify your product please
                choose one
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
              {features?.length > 0 && (
                <>
                  <Text className="font-bold ">
                    Additional Optional Features of Your Product
                  </Text>
                  <View classNam="flex flex-col gap-y-2">
                    {features?.map((feature, index) => {
                      const featureindex = selectedFeatures?.findIndex(
                        (option) => option.feature === feature?.id
                      );
                      return (
                        <View
                          key={index}
                          className="flex flex-row justify-between items-center gap-x-3 my-2"
                        >
                          <Text className="font-bold w-[20%] flex flex-wrap">
                            {feature?.name}
                          </Text>
                          <TouchableOpacity
                            onPress={() => ChooseFeatureOption(feature)}
                            className="w-[60%] py-2 rounded-md flex flex-col items-center justify-center border "
                          >
                            {featureindex != -1 ? (
                              <Text>{selectedFeatures[featureindex].name}</Text>
                            ) : (
                              <Text>Choose {feature?.name}</Text>
                            )}
                          </TouchableOpacity>
                        </View>
                      );
                    })}
                  </View>
                </>
              )}
            </View>
            <TouchableOpacity
              onPress={() => UploadProductFunction()}
              className="w-[90%] mb-20 self-center items-center rounded-md bg-transparent border-appColor border py-3"
            >
              <Text className="font-bold ">Upload a Product</Text>
            </TouchableOpacity>
          </>
        
        <Modal
          className="flex-1"
          transparent
          animation="slide"
          visible={showFeaturesoption}
        >
          <TouchableWithoutFeedback
            className="flex-1"
            onPress={() => setShowFeaturesOptions(false)}
          >
            <View
              className="flex-1 flex flex-col"
              style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            >
              <TouchableWithoutFeedback onPress={handlePersist}>
                <View className="bg-white h-[50%]  w-full absolute bottom-0 rounded-t-3xl items-center justify-center flex flex-col">
                  <TouchableOpacity
                    onPress={() => setShowFeaturesOptions(false)}
                    className="py-2 px-5 self-end mx-6 my-2 bg-appColor rounded-md items-center justify-center"
                  >
                    <Text className="font-bold text-white">Next</Text>
                  </TouchableOpacity>
                  <ScrollView className="w-[100%]  max-h-[100%] overflow-y-scroll">
                    {featureOptions?.map((option, index) => {
                      return (
                        <TouchableOpacity
                          onPress={() => {
                            // console.log(selectedFeatures);
                            const existingIndex = selectedFeatures.findIndex(
                              (selectedoOption) =>
                                selectedoOption.feature == option.feature
                            );

                            if (existingIndex !== -1) {
                              console.log(existingIndex);
                              // console.log(selectedFeatures[existingIndex]);
                              const newSelectedFeatures = [...selectedFeatures];
                              newSelectedFeatures[existingIndex] = option;
                              setSelectedFeatures(newSelectedFeatures);
                              console.log(newSelectedFeatures);
                            } else {
                              setSelectedFeatures((previous) => [
                                ...previous,
                                option,
                              ]);
                            }
                          }}
                          className="flex flex-row justify-between px-3 w-[80%] mx-auto py-2 bg-gray-200 rounded-md my-2  items-center"
                          key={index}
                        >
                          <Text>{option?.name}</Text>
                          {selectedFeatures?.includes(option) && (
                            <>
                              <Feather
                                name="check"
                                size={24}
                                color={Colors.appColor}
                              />
                            </>
                          )}
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddProduct;
