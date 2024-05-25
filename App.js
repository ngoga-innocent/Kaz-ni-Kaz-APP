import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import RootNavigation from "./src/Screens/Navigations/RootNavigation";
import { Provider } from "react-redux";
import { store } from "./src/redux/store";
import { ThemeProvider } from "./src/Screens/components/Functions/ThemeProvider";
import { I18nextProvider } from "react-i18next";
import i18n from "./src/Screens/components/Functions/i18n";
export default function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <ThemeProvider>
        <Provider store={store}>
          <NavigationContainer>
            <StatusBar auto />
            <RootNavigation />
          </NavigationContainer>
        </Provider>
      </ThemeProvider>
    </I18nextProvider>
  );
}
