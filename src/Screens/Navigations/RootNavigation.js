import {
  createStackNavigator,
  TransitionPresets,
} from "@react-navigation/stack";
import { Alert } from "react-native";
import Splash from "../Pages/Splash";
import BottomTab from "./Tabs/BottomTab";
import { LoginNavigation } from "./LoginNavigation";
import ShopTab from "./Tabs/ShopTab";
import CreateShop from "../Pages/CreateShop";
import Chat from "../Pages/Chat/Chat";
import { ChatNavigation } from "./ChatNavigation";
import React, { useEffect, useRef } from "react";
import { useNavigation } from "@react-navigation/native";
import NetInfo from "@react-native-community/netinfo";
export default RootNavigator = () => {
  const stack = createStackNavigator();
  const navigation = useNavigation();
  const [isConnected, setIsConnected] = React.useState(true);
  useEffect(() => {
    // Subscribe to network state updates
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
    });

    // Cleanup the listener on component unmount
    return () => {
      unsubscribe();
    };
  }, []);
  useEffect(() => {
    if (!isConnected) {
      Alert.alert(
        "Network Error",
        "No internet connection. Please check your network settings.",
        [{ text: "OK", onPress: () => navigation.navigate("Homepage") }]
      );
    }
  }, [isConnected]);
  return (
    <stack.Navigator
      // initialRouteName="logins"
      initialRouteName="Splash"
      screenOptions={{
        headerShown: false,
        ...TransitionPresets.SlideFromRightIOS,
      }}
    >
      <stack.Screen name="Chat" component={ChatNavigation} options={{}} />
      <stack.Screen name="logins" component={LoginNavigation} />
      <stack.Screen name="Splash" component={Splash} />
      <stack.Screen name="BottomTab" component={BottomTab} />
      <stack.Screen name="ShopTab" component={ShopTab} />
      <stack.Screen name="CreateShop" component={CreateShop} />
    </stack.Navigator>
  );
};
