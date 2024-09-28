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

import { MaterialIcons } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";
import HomeNavigation from "../HomeNavigation";

import { ShopDasboard } from "../ShopDashboard";
import { ShopProductNavigation } from "../ShopProduct";
export default ShopTab = () => {
  const Tab = createBottomTabNavigator();
  const height = Dimensions.get("screen").height;
  const TabArr = [
    {
      route: "MyShop",
      component: ShopProductNavigation,
      icon: require("../../../../assets/icons/product.png"),
    },
    {
      route: "Home",
      component: HomeNavigation,
      icon: require("../../../../assets/icons/dashboard.png"),
    },
    {
      route: "Dashboard",

      component: ShopDasboard,
      icon: require("../../../../assets/icons/settingsicon.png"),
    },
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
          <Image source={item.icon} className="w-9 h-9" resizeMode="contain" />
        </Animatable.View>
      </TouchableOpacity>
    );
  };
  return (
    <Tab.Navigator
      initialRouteName="Dashboard"
      backBehavior="slide"
      screenOptions={{
        tabBarStyle: {
          height: height / 15,
        },
        headerShown: false,
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
