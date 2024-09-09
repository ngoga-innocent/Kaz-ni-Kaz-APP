import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React, { useEffect, useRef } from "react";
import {
  Dimensions,
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  Image,
} from "react-native";
import Home from "../../Pages/Home/Home";
import { Colors } from "../../components/Global";
import * as Animatable from "react-native-animatable";
import HomeNavigation from "../HomeNavigation";
import Wallet from "../../Pages/Wallet/Wallet";
import SettingNavigation from "../SettingNavigation";
import {JobNavigation} from "../JobNavigation";
import {NewsNavigation} from "../NewsNavigation";
import { FontAwesome, Entypo, Ionicons, MaterialIcons,FontAwesome5,Foundation } from "@expo/vector-icons";
import { useTheme } from "../../components/Functions/ThemeProvider";
// Define your tab navigator
const BottomTab = () => {
  const {theme}=useTheme();
  const Tab = createBottomTabNavigator();
  const height = Dimensions.get("screen").height;
  const isDarkMode = theme === "dark";
  // Mapping configuration for icons
  const TabArr = [
    {
      route: "wallet",
      component: Wallet,
      iconType: FontAwesome5,
      iconName: "wallet",
    },
    {
      route: "News",
      component: NewsNavigation,
      iconType: Foundation,
      iconName: "burst-new",
    },
    {
      route: "Home",
      component: HomeNavigation,
      iconType: MaterialIcons,
      iconName: "dashboard",
    },
    {
      route: "Jobs",
      component: JobNavigation,
      iconType: Entypo,
      iconName: "briefcase",
    },
    {
      route: "Settings",
      component: SettingNavigation,
      iconType: MaterialIcons,
      iconName: "settings",
    },
  ];

  // TabButton component to handle the rendering of icons
  const TabButton = (props) => {
    const viewRef = useRef(null);
    const { item, onPress, accessibilityState } = props;
    const focused = accessibilityState.selected;

    useEffect(() => {
      if (focused) {
        viewRef.current.animate({ 0: { scale: 1 }, 1: { scale: 1.5 } });
      } else {
        viewRef.current.animate({ 0: { scale: 1.5 }, 1: { scale: 1 } });
      }
    }, [focused]);

    // Render the correct icon based on the mapping configuration
    const IconComponent = item.iconType;

    return (
      <TouchableOpacity
        onPress={onPress}
        className={`flex-1 z-20 justify-center items-center pt-4` }
      >
        <Animatable.View
          ref={viewRef}
          className={` ${
            focused ? "" : null
          } rounded-full items-center justify-center`}
        >
          <IconComponent
            name={item.iconName}
            size={height *0.033}
            color={focused ? Colors.appColor : `${isDarkMode?'white':'#171716'}`}
          />
        </Animatable.View>
      </TouchableOpacity>
    );
  };

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: height / 12,
          backgroundColor:isDarkMode?'#171716':null
        },
        tabBarHideOnKeyboard: true,
      }}
    >
      {TabArr.map((item, index) => {
        return (
          <Tab.Screen
            key={index}
            name={item.route}
            component={item.component}
            options={{
              tabBarShowLabel: false,
              tabBarButton: (props) => <TabButton {...props} item={item} />,
            }}
          />
        );
      })}
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  focused: {},
});

export default BottomTab;
