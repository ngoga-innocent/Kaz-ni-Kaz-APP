import {
  createStackNavigator,
  TransitionPresets,
} from "@react-navigation/stack";
import Splash from "../Pages/Splash";
import BottomTab from "./Tabs/BottomTab";
import { LoginNavigation } from "./LoginNavigation";
import ShopTab from "./Tabs/ShopTab";
import CreateShop from "../Pages/CreateShop";
export default RootNavigator = () => {
  const stack = createStackNavigator();
  return (
    <stack.Navigator
      initialRouteName="logins"
      screenOptions={{
        headerShown: false,
        ...TransitionPresets.SlideFromRightIOS,
      }}
    >
      <stack.Screen name="logins" component={LoginNavigation} />
      <stack.Screen name="Splash" component={Splash} />
      <stack.Screen name="BottomTab" component={BottomTab} />
      <stack.Screen name="ShopTab" component={ShopTab} />
      <stack.Screen name="CreateShop" component={CreateShop} />
    </stack.Navigator>
  );
};
