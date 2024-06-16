import { createStackNavigator } from "@react-navigation/stack";
import NewsHome from "../Pages/News/NewsHome";

export const NewsNavigation = () => {
  const stack = createStackNavigator();
  return (
    <stack.Navigator
      initialRouteName=""
      screenOptions={{
        headerShown: false,
      }}
    >
      <stack.Screen name="news" component={NewsHome} />
    </stack.Navigator>
  );
};
