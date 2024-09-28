import { createStackNavigator } from "@react-navigation/stack";
import Register from "../Pages/Home/LoginScreens/Register";
import Verified from "../Pages/Home/LoginScreens/Verified";
import Login from "../Pages/Home/LoginScreens/Login";
import ForgotPassword from "../Pages/Home/LoginScreens/ForgotPassword";
import OtpVerify from "../Pages/Home/LoginScreens/OtpVerify";
import ResetPassword from "../Pages/Home/LoginScreens/ResetPassword";
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
      <stack.Screen name="forgotpassword" component={ForgotPassword} />
      <stack.Screen name="verify_otp" component={OtpVerify} />
      <stack.Screen name="reset_password" component={ResetPassword} />
    </stack.Navigator>
  );
};
