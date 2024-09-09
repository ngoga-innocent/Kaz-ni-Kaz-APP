import { createStackNavigator } from "@react-navigation/stack";
import JobHome from "../Pages/Job/JobHome";

export const JobNavigation = () => {
  const stack = createStackNavigator();
  return (
    <stack.Navigator
      initialRouteName=""
      screenOptions={{
        headerShown: false,
      }}
    >
      <stack.Screen name="job" component={JobHome} />
    </stack.Navigator>
  );
};
