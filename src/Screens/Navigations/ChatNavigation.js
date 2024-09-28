import { createStackNavigator } from "@react-navigation/stack";
import Chat from "../Pages/Chat/Chat";
import AllChat from "../Pages/Chat/AllChat";

export const ChatNavigation = () => {
  const stack = createStackNavigator();
  return (
    <stack.Navigator
      initialRouteName=""
      screenOptions={{
        headerShown: false,
      }}
    >
      <stack.Screen name="chatHome" component={Chat} />
      <stack.Screen name="allChat" component={AllChat} />
    </stack.Navigator>
  );
};
