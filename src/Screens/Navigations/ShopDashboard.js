import { createStackNavigator } from "@react-navigation/stack";
import Dashboard from "../Pages/Shop/Dashboard";
export const ShopDasboard = () => {
  const stack = createStackNavigator();
  return (
    <stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <stack.Screen name="Dasboard" component={Dashboard} />
    </stack.Navigator>
  );
};
