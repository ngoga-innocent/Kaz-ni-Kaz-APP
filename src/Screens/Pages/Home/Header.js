import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { useSelector } from "react-redux";
import { FontAwesome6 } from "@expo/vector-icons";
import { useTheme } from "../../components/Functions/ThemeProvider";
import { Colors } from "../../components/Global";
export default Header = () => {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  const { wallet } = useSelector((state) => state.Wallet);
  return (
    <View>
      <View
        className={`flex-1 flex-row justify-between items-center  mb-2 ${
          isDarkMode ? "bg-black" : "bg-white"
        } px-2 rounded-lg py-2 pt-14`}
      >
        <Image
          source={require("../../../../assets/icon.png")}
          resizeMode="contain"
          className="w-14 h-14"
        />
        <Text
          className={`${isDarkMode ? "text-white" : null} text-2xl font-bold`}
        >
          Kazi Ni kazi
        </Text>
        <TouchableOpacity
          className="items-center"
          onPress={() =>
            navigation.navigate("BottomTab", {
              screen: "wallet",
            })
          }
        >
          <FontAwesome6 name="coins" size={30} color={Colors.appColor} />
          <Text
            className={`text-sm font-bold ${isDarkMode ? "text-white" : null}`}
          >
            {wallet?.amount} Rwf
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
