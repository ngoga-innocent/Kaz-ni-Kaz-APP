import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import react, { useEffect, useRef } from "react";
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
import { FontAwesome } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";
import HomeNavigation from "../HomeNavigation";

import SettingNavigation from "../SettingNavigation";
import { ShopDasboard } from "../ShopDashboard";
export default ShopTab = () => {
  const Tab = createBottomTabNavigator();
  const height = Dimensions.get("screen").height;
  const TabArr = [
    {
      route: "Dashboard",
      component: ShopDasboard,
      icon: require("../../../../assets/icons/settingsicon.png"),
    },
    {
      route: "MyShop",
      component: Home,
      icon: require("../../../../assets/icons/journalism.png"),
    },
    {
      route: "Settings",
      component: HomeNavigation,
      icon: require("../../../../assets/icons/settingsicon.png"),
    },
    {
      route: "Chat",
      component: Home,
      icon: require("../../../../assets/icons/job-search.png"),
    },
    // {
    //   route: "Settings",
    //   component: SettingNavigation,
    //   type: FontAwesome,
    //   icon: require("../../../../assets/icons/settingsicon.png"),
    // },
  ];
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
    return (
      <TouchableOpacity
        onPress={onPress}
        className={`flex-1 z-20 justify-center items-center bg-black `}
      >
        <Animatable.View
          ref={viewRef}
          className={` ${
            focused ? "-top-6 bg-black" : null
          } rounded-full  items-center justify-center`}
        >
          <Image
            source={item.icon}
            className="w-10 h-10"
            resizeMode="contain"
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
          height: height / 15,
        },
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
              tabBarIcon: ({ focused }) => {
                return (
                  <Image
                    source={item.icon}
                    className="w-8 h-8"
                    resizeMode="contain"
                  />
                );
              },
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
