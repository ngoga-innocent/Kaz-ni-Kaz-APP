import { createStackNavigator } from "@react-navigation/stack";
import Setting from "../Pages/Setting/Setting";
export default SettingNavigation = () => {
  const stack = createStackNavigator();
  return (
    <stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <stack.Screen name="Setting" component={Setting} />
    </stack.Navigator>
  );
};
