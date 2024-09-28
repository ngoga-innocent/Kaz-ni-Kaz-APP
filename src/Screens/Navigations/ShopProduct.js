import { createStackNavigator } from "@react-navigation/stack";

import ShopProduct from "../Pages/Shop/ShopProduct/ShopProduct";
export const ShopProductNavigation = () => {
  const stack = createStackNavigator();
  return (
    <stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <stack.Screen name="shop_product" component={ShopProduct} />
    </stack.Navigator>
  );
};
