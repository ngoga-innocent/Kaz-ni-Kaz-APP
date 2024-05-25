import React, { Component } from "react";
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
const AllCategories = () => {
  const { categories } = useSelector((state) => state.Products);
  const { height, width } = Dimensions.get("screen");
  return (
    <SafeAreaView className="flex-1">
      <ScrollView className="flex-1 pb-28" stickyHeaderIndices={[0]}>
        <View className="" style={{}}>
          <Header />

          <View
            className={`bg-white shadow-md shadow-black py-2 px-2 rounded-lg w-[90%] mx-auto`}
          >
            <TextInput placeholder="Search Category" />
          </View>
        </View>
        <View className="flex flex-row flex-wrap gap-x-4 items-center my-2 w-full  justify-center pb-20 ">
          {categories?.map((item, index) => {
            return (
              <ImageBackground
                source={{ uri: item.thumbnail }}
                resizeMode="cover"
                key={index}
                className=" my-2 justify-end items-center py-4 rounded-lg  "
                style={{
                  width: width / 2.4,
                  height: height / 4.5,
                  backgroundColor: 'rgba("255,255,255,1")',
                }}
              >
                <TouchableOpacity className="flex-1 justify-end">
                  <Text className="text-white font-bold text-2xl">
                    {item?.name}
                  </Text>
                </TouchableOpacity>
              </ImageBackground>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AllCategories;
