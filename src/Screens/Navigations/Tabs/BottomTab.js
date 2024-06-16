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
import Wallet from "../../Pages/Wallet/Wallet";
import SettingNavigation from "../SettingNavigation";
import { JobNavigation } from "../JobNavigation";
import { NewsNavigation } from "../NewsNavigation";
export default BottomTab = () => {
  const Tab = createBottomTabNavigator();
  const height = Dimensions.get("screen").height;
  const TabArr = [
    {
      route: "wallet",
      component: Wallet,
      icon: require("../../../../assets/icons/settingsicon.png"),
    },
    {
      route: "News",
      component: NewsNavigation,
      icon: require("../../../../assets/icons/journalism.png"),
    },
    {
      route: "Home",
      component: HomeNavigation,
      icon: require("../../../../assets/icons/settingsicon.png"),
    },
    {
      route: "Jobs",
      component: JobNavigation,
      icon: require("../../../../assets/icons/job-search.png"),
    },
    {
      route: "Settings",
      component: SettingNavigation,
      type: FontAwesome,
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
    // <Tab.Navigator
    //   initialRouteName="Home"
    //   screenOptions={{
    //     tabBarShowLabel: false,
    //     tabBarStyle: {
    //       position: "absolute",
    //       left: 0,
    //       right: 0,
    //       bottom: 0,
    //       height: height / 15,
    //       backgroundColor: Colors.primary,
    //       flexDirection: "row",
    //       justifyContent: "space-between",
    //     },
    //     headerShown: false,
    //   }}
    // >
    //   <Tab.Screen
    //     name="Wallet"
    //     component={Home}
    //     options={{
    //       tabBarButton: ({ props }) => {
    //         console.log(props);
    //       },
    //       tabBarIcon: ({ focused }) => {
    //         return (
    //           <Animatable.View
    //             key={focused ? "focused" : "unfocused"}
    //             transition={focused ? "opacity" : undefined}
    //             // animation={focused ? "pulse" : null}
    //             className={`items-center justify-center rounded-full ${
    //               focused ? "-top-5 z-10 bg-white " : null
    //             }`}
    //           >
    //             <Entypo
    //               name="wallet"
    //               size={focused ? height / 15 : height / 40}
    //               color={focused ? "blue" : "black"}
    //             />
    //             <Text className={`${focused ? "hidden" : undefined}`}>
    //               WALLET
    //             </Text>
    //           </Animatable.View>
    //           //   <TouchableOpacity className="items-center justify-center rounded-full">
    //           //     <Entypo name="wallet" size={24} color="black" />
    //           //     <Text>WALLET</Text>
    //           //   </TouchableOpacity>
    //         );
    //       },
    //     }}
    //   />

    //   <Tab.Screen
    //     name="News"
    //     component={Home}
    //     options={{
    //       tabBarIcon: ({ focused }) => {
    //         return (
    //           <Animatable.View
    //             key={focused ? "focused" : "unfocused"}
    //             transition={focused ? "opacity" : undefined}
    //             // animation={focused ? "pulse" : null}
    //             className={`items-center justify-center rounded-full ${
    //               focused ? "-top-5 z-10 bg-white " : null
    //             }`}
    //           >
    //             <Entypo
    //               name="modern-mic"
    //               size={focused ? height / 15 : height / 40}
    //               color={focused ? "blue" : "black"}
    //             />
    //             <Text className={`${focused ? "hidden" : undefined}`}>
    //               NEWS
    //             </Text>
    //           </Animatable.View>
    //           //   <TouchableOpacity className="items-center justify-center rounded-full">
    //           //     <Entypo name="modern-mic" size={24} color="black" />
    //           //     <Text>NEWS</Text>
    //           //   </TouchableOpacity>
    //         );
    //       },
    //     }}
    //   />
    //   <Tab.Screen
    //     name="Home"
    //     component={Home}
    //     options={{
    //       tabBarIcon: ({ focused }) => {
    //         return (
    //           <Animatable.View
    //             key={focused ? "focused" : "unfocused"}
    //             transition={focused ? "opacity" : undefined}
    //             // animation={focused ? "pulse" : null}
    //             className={`items-center justify-center rounded-full ${
    //               focused ? "-top-5 z-10 bg-white " : null
    //             }`}
    //           >
    //             <FontAwesome
    //               name="home"
    //               size={focused ? height / 15 : height / 40}
    //               color={focused ? "blue" : "black"}
    //             />
    //             <Text className={`${focused ? "hidden" : undefined}`}>
    //               HOME
    //             </Text>
    //           </Animatable.View>
    //           //   <TouchableOpacity className="items-center justify-center rounded-full">
    //           //     <FontAwesome name="home" size={24} color="black" />
    //           //     <Text>HOME</Text>
    //           //   </TouchableOpacity>
    //         );
    //       },
    //     }}
    //   />
    //   <Tab.Screen
    //     name="Jobs"
    //     component={Home}
    //     options={{
    //       tabBarIcon: ({ focused }) => {
    //         return (
    //           <Animatable.View
    //             animation={focused ? "zoomIn" : null}
    //             duration={4000}
    //             className={`items-center justify-center rounded-full ${
    //               focused ? "-top-5 z-10" : null
    //             }`}
    //           >
    //             <MaterialIcons
    //               name="work"
    //               size={focused ? height / 17 : height / 40}
    //               color={focused ? "blue" : "black"}
    //             />
    //             <Text className={`${focused ? "hidden" : null}`}>JOBS</Text>
    //           </Animatable.View>
    //           //   <TouchableOpacity className="items-center justify-center rounded-full">
    //           //     <MaterialIcons name="work" size={24} color="black" />
    //           //     <Text>JOBS</Text>
    //           //   </TouchableOpacity>
    //         );
    //       },
    //     }}
    //   />
    //   <Tab.Screen
    //     name="Settings"
    //     component={Home}
    //     options={{
    //       tabBarIcon: ({ focused }) => {
    //         return (
    //           <Animatable.View
    //             key={focused ? "focused" : "unfocused"}
    //             transition={focused ? "opacity" : undefined}
    //             // animation={focused ? "pulse" : null}
    //             className={`items-center justify-center rounded-full ${
    //               focused ? "-top-5 z-10 bg-white " : null
    //             }`}
    //           >
    //             <Ionicons
    //               name="settings"
    //               size={focused ? height / 15 : height / 40}
    //               color={focused ? "blue" : "black"}
    //             />
    //             <Text className={`${focused ? "hidden" : undefined}`}>
    //               SETTINGS
    //             </Text>
    //           </Animatable.View>
    //         );
    //       },
    //     }}
    //   />
    // </Tab.Navigator>
  );
};
const styles = StyleSheet.create({
  focused: {},
});
