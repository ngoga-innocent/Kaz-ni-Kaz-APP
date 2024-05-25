import { createStackNavigator } from "@react-navigation/stack";
import Home from "../Pages/Home/Home";
import SingleProduct from "../Pages/Home/SingleProduct";
import AddProduct from "../Pages/Home/AddProduct";
import AllCategories from "../Pages/Home/AllCategories";
export default HomeNavigation = () => {
  const stack = createStackNavigator();
  return (
    <stack.Navigator
      initialRouteName="Homepage"
      screenOptions={{
        headerShown: false,
      }}
    >
      <stack.Screen name="Homepage" component={Home} />
      <stack.Screen name="singleProduct" component={SingleProduct} />
      <stack.Screen name="addProduct" component={AddProduct} />
      <stack.Screen name="allCategory" component={AllCategories} />
    </stack.Navigator>
  );
};
