import { createStackNavigator } from "@react-navigation/stack";
import Splash from "../Pages/Splash";
import BottomTab from "./Tabs/BottomTab";
import { LoginNavigation } from "./LoginNavigation";
export default RootNavigator = () => {
  const stack = createStackNavigator();
  return (
    <stack.Navigator
      initialRouteName="logins"
      screenOptions={{
        headerShown: false,
      }}
    >
      <stack.Screen name="logins" component={LoginNavigation} />
      <stack.Screen name="Splash" component={Splash} />
      <stack.Screen name="BottomTab" component={BottomTab} />
    </stack.Navigator>
  );
};
