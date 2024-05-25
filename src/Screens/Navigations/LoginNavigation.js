import { createStackNavigator } from "@react-navigation/stack";
import Register from "../Pages/Home/LoginScreens/Register";
import Verified from "../Pages/Home/LoginScreens/Verified";
import Login from "../Pages/Home/LoginScreens/Login";
export const LoginNavigation = () => {
  const stack = createStackNavigator();
  return (
    <stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
      }}
    >
      <stack.Screen name="Register" component={Register} />
      <stack.Screen name="Login" component={Login} />
      <stack.Screen name="GetVerified" component={Verified} />
    </stack.Navigator>
  );
};
