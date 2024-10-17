import React, { useState } from "react";
import {
  TextInput,
  View,
  Text,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { EvilIcons } from "@expo/vector-icons";
import { Rating } from "react-native-elements";
import { Entypo } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { Fontisto } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";
import { useDispatch, useSelector } from "react-redux";
import { PanGestureHandler } from "react-native-gesture-handler";
import { FontAwesome } from "@expo/vector-icons";
import { Colors } from "../../components/Global";
import Animated from "react-native-reanimated";
import { FetchProduct } from "../../../redux/Features/Product";
import {
  FetchCategories,
  FetchColors,
  fetchFeatures,
} from "../../../redux/Features/Product";
const AllProducts = ({ route }) => {
  const dispatch = useDispatch();
  const { products } = route?.params || useSelector(state=>state?.Products);

  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { height, width } = Dimensions.get("screen");
  const statusBarHeight = insets.top;
  //   const ratings = [1, 2, 3, 4, 5];
  ///States
  const [gridDisplay, setGrid] = useState(false);
  const [filteredProduct, setFilteredProducts] = useState(products);

  const initialRatings = products.reduce((acc, product) => {
    acc[product.id] = 4; // Initialize all ratings to 0 or any default value
    return acc;
  }, {});
  const handleRating = (productId, rating) => {
    setRatings((prevRatings) => ({
      ...prevRatings,
      [productId]: rating,
    }));
  };
  const { loading, colors, categories } = useSelector(
    (state) => state.Products
  );
  const { features } = useSelector((state) => state.Products);
  const [ratings, setRatings] = useState(initialRatings);
  const [filter, setFilter] = useState(false);
  const [minPrice, setMinPrice] = useState();
  const [maxPrice, setMaxPrice] = useState();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [searchText, setSearchText] = useState("");
  const [showCategory, setShowCategory] = useState(false);
  const [parentCategory, setParentCategory] = useState();
  const [childCategory, setChildCategory] = useState([]);
  const [choosenChildCategory, setChoosenChildCategory] = useState();
  const [showChildCategory, setShowChildCategory] = useState(false);
  const [seeChildCategory, setSeeChildCategory] = useState(false);
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [seeFeatures, setSeeFeatures] = useState(false);
  const [page,setPage]=useState(1)
  const [filteringCategory, setFilteringCategory] = useState(
    categories?.filter((category) => !category.parent)
  );
  const closeModal = () => {
    setFilter(false);
  };
  //Use Selector //////////////////////////////////////////////////////////////////////////

  const stopPropagation = (event) => {
    event.stopPropagation();
  };
  ///Filtering Functions //////////////////////////////////////////////////////////////////////////
  const applyFilters = () => {
    const min = parseFloat(minPrice);
    const max = parseFloat(maxPrice);

    const filtered = products.filter((product) => {
      // Check if the product matches the price criteria
      const matchesPrice =
        (!isNaN(min) ? product.price >= min : true) &&
        (!isNaN(max) ? product.price <= max : true);

      // Check if the product matches the category criteria
      const matchesCategory = selectedCategory
        ? product.category === selectedCategory.id
        : true;

      // Check if the product matches the color criteria
      const matchesColor = selectedColor
        ? product.colors.includes(selectedColor)
        : true;
      // Check if the product matches the feature criteria
      const matchesFeature = selectedFeatures.some((feature) =>
        product.features.includes(feature)
      );

      // Check if the product matches the search criteria

      // Check if
      // Product must match all criteria to be included

      return matchesPrice && matchesCategory && matchesColor && matchesFeature;
    });

    setFilteredProducts(filtered);
  };
  const ResetFilter = () => {
    setMinPrice("");
    setMaxPrice("");
    setSelectedCategory();
    setSelectedColor();
    setChildCategory();
    setParentCategory();
    setChoosenChildCategory();
    setShowChildCategory(false);
    setSeeFeatures(false);
    setSelectedFeatures([]);

    setFilteredProducts(products);
  };
  const handleSearch = () => {
    if (searchText.length > 0) {
      setFilteredProducts(
        products.filter((product) => product.name.includes(searchText))
      );
    } else {
      setFilteredProducts(products);
    }
  };
  const handleCategoryPress = (choosenCategory) => {
    // console.log(category);
    // console.log(categories);
    setSelectedCategory(choosenCategory);
    if (categories?.length < 0) {
      dispatch(FetchCategories());
    }
    dispatch(fetchFeatures({ category_id: choosenCategory.id }));
    const children = categories?.filter(
      (category) => category.parent === choosenCategory.id
    );

    if (children.length > 0) {
      setParentCategory(choosenCategory);
      setChildCategory(children);
      setShowCategory(false);
      setShowChildCategory(true);
    } else {
      setSelectedCategory(choosenCategory);
      setShowCategory(false);
    }
  };
  const handleScroll = ({ nativeEvent }) => {
    const { contentOffset, contentSize, layoutMeasurement } = nativeEvent;

    // Calculate if the user is at the bottom of the ScrollView
    const isCloseToBottom = contentOffset.y + layoutMeasurement.height >= contentSize.height - 20;
    
    if (isCloseToBottom && !loading) {
      dispatch(FetchProduct(page + 1))
      setPage((prevPage) => prevPage + 1);
      // products=useSelector(state=>state.Products)
      setFilteredProducts(products)
    }
  };
  const truncateText = (text, maxLength) => {
    if (!text) return "No description available.";
    if (text.length <= maxLength) return text;
  
    // Truncate at maxLength, and then remove any partial word at the end
    return text.substr(0, text.lastIndexOf(" ", maxLength)) + "...";
  };
  return (
    <View className=" flex-1" style={{ flex: 1 }}>
      <Modal
        visible={filter}
        animationType="slide"
        transparent
        onRequestClose={closeModal}
      >
        <TouchableWithoutFeedback onPress={closeModal} style={{ flex: 1 }}>
          <View
            style={{ flex: 1, backgroundColor: "rgba(0, 0, 0, 0.5)" }}
            className="relative"
          >
            <TouchableWithoutFeedback onPress={stopPropagation}>
              <Animated.View
                animation="slideInRight"
                iterationCount={1}
                duration={100}
                easing="ease-in-out"
                style={{
                  backgroundColor: "white",
                  width: "80%",
                  flex: 1,
                  alignSelf: "flex-end",
                }}
              >
                <View className="flex flex-row items-center justify-between px-3 pt-2">
                  <Text>Filter</Text>
                  <TouchableOpacity
                    className="flex flex-row items-center"
                    onPress={() => {
                      ResetFilter();
                      setFilter(false);
                    }}
                  >
                    <Ionicons name="refresh" size={24} color="black" />
                    <Text clsassName="font-bold">Reset</Text>
                  </TouchableOpacity>
                </View>
                <ScrollView className="px-3 my-20">
                  <View>
                    <Text className="font-bold">Price Range</Text>
                    <View className="flex flex-row gap-x-2 my-2 items-center">
                      <TextInput
                        value={minPrice}
                        onChangeText={(e) => setMinPrice(e)}
                        placeholder="Min"
                        className="bg-slate-200 w-[40%] py-2 rounded-full items-center px-2 justify-center text-center"
                      />
                      <Text>~</Text>
                      <TextInput
                        value={maxPrice}
                        onChangeText={(e) => setMaxPrice(e)}
                        placeholder="Max"
                        className="bg-slate-200 w-[40%] py-2 rounded-full items-center px-2 justify-center text-center"
                      />
                    </View>
                  </View>
                  <View className="relative">
                    <Text className="font-bold">Category</Text>
                    <View className="flex flex-row gap-x-2 my-2 items-center">
                      <TouchableOpacity
                        onPress={() => {
                          dispatch(FetchCategories());
                          setShowCategory(!showCategory);
                        }}
                        className="bg-slate-200 py-2 w-[80%] items-center justify-center rounded-full flex flex-row"
                      >
                        <Text>
                          {parentCategory?.name ||
                            selectedCategory?.name ||
                            "Category"}
                        </Text>
                        <Entypo
                          name="chevron-small-down"
                          size={24}
                          color="black"
                        />
                      </TouchableOpacity>
                    </View>
                    {showCategory && (
                      <ScrollView
                        scrollEnabled
                        className="flex flex-col bg-white  z-50 w-[80%]   gap-1 px-2"
                      >
                        {filteringCategory?.map((category, index) => {
                          return (
                            <TouchableOpacity
                              key={index}
                              className={` py-2 px-3 rounded-md    ${
                                selectedCategory == category
                                  ? "bg-[#10644D]"
                                  : "bg-slate-200"
                              }`}
                              onPress={() => handleCategoryPress(category)}
                            >
                              <Text>{category.name}</Text>
                            </TouchableOpacity>
                          );
                        })}
                      </ScrollView>
                    )}
                  </View>
                  {showChildCategory && (
                    <View className="ml-12 mt-2">
                      <TouchableOpacity
                        onPress={() => {
                          setSeeChildCategory(!seeChildCategory);
                        }}
                        className="flex flex-row bg-slate-300 py-2 px-2 rounded-full w-[80%] justify-center items-center"
                      >
                        <Text>
                          {choosenChildCategory?.name || "Choose sub category"}
                        </Text>
                        <Entypo
                          name="chevron-small-down"
                          size={24}
                          color="black"
                        />
                      </TouchableOpacity>
                      {seeChildCategory &&
                        childCategory?.map((item, index) => {
                          return (
                            <TouchableOpacity
                              onPress={() => {
                                dispatch(
                                  fetchFeatures({
                                    category_id: item.id,
                                  })
                                );
                                setChoosenChildCategory(item);
                                setSeeChildCategory(false);
                                setSelectedCategory(item);
                                setSeeFeatures(true);
                              }}
                              key={index}
                              className={`py-2 px-3 rounded-md my-1  ${
                                choosenChildCategory == item
                                  ? "bg-appColor"
                                  : "bg-slate-200"
                              }`}
                              // onPress={() => handleRating(item.id, 1)}
                            >
                              <Text>{item.name}</Text>
                            </TouchableOpacity>
                          );
                        })}
                    </View>
                  )}
                  {seeFeatures && (
                    <View>
                      {features?.map((feature, index) => {
                        return (
                          <View key={index}>
                            <Text className="font-bold">{feature.name}</Text>
                            <View
                              className="flex  flex-row flex-wrap gap-y-2 my-1 gap-x-2 items-center"
                              style={{
                                flex: 1,
                              }}
                            >
                              {feature?.feature_options?.map(
                                (option, index) => {
                                  return (
                                    <TouchableOpacity
                                      onPress={() => {
                                        // console.log(selectedFeatures);
                                        const existingIndex = selectedFeatures.findIndex(
                                          (selectedoOption) =>
                                            selectedoOption.feature ==
                                            option.feature
                                        );

                                        if (existingIndex !== -1) {
                                          console.log(existingIndex);
                                          // console.log(selectedFeatures[existingIndex]);
                                          const newSelectedFeatures = [
                                            ...selectedFeatures,
                                          ];
                                          newSelectedFeatures[
                                            existingIndex
                                          ] = option;
                                          setSelectedFeatures(
                                            newSelectedFeatures
                                          );
                                          console.log(newSelectedFeatures);
                                        } else {
                                          setSelectedFeatures((previous) => [
                                            ...previous,
                                            option,
                                          ]);
                                        }
                                      }}
                                      key={index}
                                      className={`py-1 px-2 rounded-md  ${
                                        selectedFeatures.includes(option)
                                          ? "bg-appColor"
                                          : "bg-slate-200"
                                      }`}
                                      // onPress={() =>
                                      //   handleRating(feature.id, option)
                                      // }
                                    >
                                      <Text>{option?.name}</Text>
                                    </TouchableOpacity>
                                  );
                                }
                              )}
                            </View>
                          </View>
                        );
                      })}
                    </View>
                  )}
                  <View>
                    <Text className="font-bold">Shop</Text>
                    <View className="flex flex-row gap-x-2 my-2 items-center">
                      <TouchableOpacity className="bg-slate-200 py-2 w-[80%] items-center justify-center rounded-full flex flex-row">
                        <Text>Shop</Text>
                        <Entypo
                          name="chevron-small-down"
                          size={24}
                          color="black"
                          className="self-end"
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View>
                    <Text className="font-bold">Color</Text>
                    <TouchableOpacity
                      onPress={() => dispatch(FetchColors())}
                      className="bg-slate-200 py-2 w-[80%] items-center justify-center rounded-full flex flex-row"
                    >
                      <Text>Colors</Text>
                      <Entypo
                        name="chevron-small-down"
                        size={24}
                        color="black"
                        className="self-end"
                      />
                    </TouchableOpacity>
                    <ScrollView
                      className="flex gap-x-2 my-1"
                      contentContainerStyle={{
                        flex: 1,
                        flexDirection: "row",
                        flexWrap: "wrap",

                        alignItems: "center",
                      }}
                    >
                      {colors.map((color, index) => {
                        return (
                          <TouchableOpacity
                            onPress={() => setSelectedColor(color)}
                            key={index}
                            className={`${
                              selectedColor == color
                                ? "bg-[#10644D]"
                                : "bg-slate-200"
                            } py-2 px-3 gap-x-2 rounded-full`}
                          >
                            <Text>{color.color}</Text>
                          </TouchableOpacity>
                        );
                      })}
                    </ScrollView>
                  </View>
                </ScrollView>
                <TouchableOpacity
                  onPress={() => {
                    applyFilters();
                    setFilter(false);
                  }}
                  className="w-[95%] self-center mx-auto rounded-md absolute bottom-1 py-3 items-center bg-appColor"
                >
                  <Text>Filter</Text>
                </TouchableOpacity>
              </Animated.View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      <View
        className="flex w-[100%] flex-row justify-between my-2 px-5 items-center "
        style={{ marginTop: statusBarHeight + 5 }}
      >
        <View className="flex-1 flex-row  items-center bg-white rounded-md py-2  ">
          <EvilIcons name="search" size={24} color="black" />
          <TextInput
            className="flex-1 max-w-[80%] overscroll-x-contain"
            placeholder="What are you looking For?"
            value={searchText}
            onChangeText={(search) => setSearchText(search)}
            onEndEditing={() => handleSearch()}
          />
        </View>
      </View>
      <View className="flex flex-row justify-between my-2 px-2">
        <TouchableOpacity>
          <Text>Best Match</Text>
        </TouchableOpacity>
        <View className="flex flex-row gap-x-2 items-center">
          <TouchableOpacity onPress={() => setGrid(!gridDisplay)}>
            {!gridDisplay ? (
              <Ionicons name="grid-sharp" size={24} color={Colors.appColor} />
            ) : (
              <FontAwesome name="th-list" size={24} color={Colors.appColor} />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setFilter(!filter)}
            className="flex flex-row items-center"
          >
            <Fontisto name="filter" size={24} color="orange" />
            <Text>Filter</Text>
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView
        contentContainerStyle={{
          flexDirection: gridDisplay ? "row" : "column",
          flexWrap: gridDisplay ? "wrap" : "no-wrap",
          alignItems: gridDisplay ? "center" : "flex-start",
          justifyContent: gridDisplay ? "center" : "flex-start",
          paddingHorizontal: gridDisplay ? 10 : null,
        }}
        onScroll={handleScroll}
      >
        {filteredProduct?.length < 1 && (
          <Text className="text-center mx-3">No Product Available</Text>
        )}
        {filteredProduct?.map((product, index) => {
          return (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("Home", {
                  screen: "singleProduct",
                  params: {
                    product: product,
                  },
                })
              }
              // onLongPress={() => Alert.alert("Long Pressed hhh")}
              key={index}
              className={`  ${
                gridDisplay
                  ? "w-[44%] bg-white my-1 mx-1 rounded-md"
                  : "my-1 mx-2 flex-1 w-[100%] flex-row"
              } `}
            >
              <View
                className={`${
                  gridDisplay
                    ? "w-[90%] h-24 items-center justify-center flex flex-col"
                    : "w-[30%] h-32 rounded-md bg-white relative flex flex-col items-center justify-center"
                }`}
              >
                <Image
                  source={{ uri: product.thumbnail }}
                  className="flex-1 h-[100%] w-[100%] rounded-md "
                  resizeMode={gridDisplay ? "cover" : ""}
                />
                {product?.discount && (
                  <View className="absolute top-0 left-0 rounded-br-2xl py-2 px-2 bg-orange-400 items-center justify-center">
                    <Text className="font-bold text-white text-xs">
                      {product?.discount}%
                    </Text>
                  </View>
                )}
              </View>
              <View className="px-2 w-[70%]">
                <Text className="font-bold">{product?.name}</Text>
                {!gridDisplay && (
                 <Text>{truncateText(product?.description, 400)}</Text>
                )}
                <Text className="font-bold">{product?.price} USD</Text>
                <View className="flex flex-row">
                  {[...Array(5)].map((_, index) => {
                    return (
                      <TouchableOpacity
                        key={index}
                        onPress={() => handleRating(product.id, index + 1)}
                      >
                        <Entypo
                          name="star"
                          size={16}
                          color={
                            ratings[product.id] > index ? "orange" : "black"
                          }
                        />
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};
export default AllProducts;
