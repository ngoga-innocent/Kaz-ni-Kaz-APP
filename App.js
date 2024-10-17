import "react-native-gesture-handler";
import 'react-native-reanimated'

import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import RootNavigation from "./src/Screens/Navigations/RootNavigation";
import { Provider } from "react-redux";
import { store } from "./src/redux/store";
import { ThemeProvider } from "./src/Screens/components/Functions/ThemeProvider";
import { I18nextProvider } from "react-i18next";
import i18n from "./src/Screens/components/Functions/i18n";
import React, { useEffect, useRef } from "react";
import { View, LogBox, Alert } from "react-native";
import { enableScreens } from "react-native-screens";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";
import "./firebaseconfig"
import firebase from "@react-native-firebase/app";
import { firebaseConfig } from "./firebaseconfig";
import messaging from "@react-native-firebase/messaging";
import registerNNPushToken from "native-notify";
// import firebase from "./firebaseconfig";
LogBox.ignoreAllLogs(); // Ignore log notifications

const ErrorBoundary = ({ children }) => {
  const [hasError, setHasError] = React.useState(false);

  const componentDidCatch = (error, info) => {
    console.log("Error Boundary Caught an Error:", error, info);
    setHasError(true);
  };

  if (hasError) {
    return (
      <View>
        <Text>Something went wrong.</Text>
      </View>
    );
  }

  return React.cloneElement(children, { componentDidCatch });
};
enableScreens();
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});



  try {
    firebase.initializeApp(firebaseConfig);
    console.log("Firebase initialized successfully.");
  } catch (error) {
    console.error("Firebase initialization error: ", error);
  }

// messaging().setBackgroundMessageHandler(async (remoteMessage) => {
//   console.log("Message handled in the background!", remoteMessage);
// });
messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log("Message handled in the background!", remoteMessage);
});

export default function App() {
  const [isConnected, setIsConnected] = React.useState(true);

  registerNNPushToken(22734, "opV1Kqdkod6xgN4Czd4mYy");
  useEffect(() => {
    console.log("App mounted");
  }, []);
  async function registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
        icon: require("./assets/icons/logo.png"),
      });
    }

    if (Device.isDevice) {
      const {
        status: existingStatus,
      } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        console.log("Failed to get push token for push notification!");
        return;
      }
      // Learn more about projectId:
      // https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid
      // EAS projectId is used here.
      try {
        const projectId =
          Constants?.expoConfig?.extra?.eas?.projectId ??
          Constants?.easConfig?.projectId;
        if (!projectId) {
          throw new Error("Project ID not found");
        }
        token = (
          await Notifications.getExpoPushTokenAsync({
            projectId,
          })
        ).data;
        console.log(token);
      } catch (e) {
        token = `${e}`;
      }
    } else {
      alert("Must use physical device for Push Notifications");
    }

    return token;
  }
  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);
  const notificationListener = useRef();
  const responseListener = useRef();
  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log("Authorization status:", authStatus);
    }
  }
  useEffect(() => {
    notificationListener.current = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log(notification);
      }
    );

    responseListener.current = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        console.log(response);
      }
    );
  }, []);

  useEffect(() => {
    if (requestUserPermission()) {
      messaging()
        .getToken()
        .then(async (token) => {
          console.log(token);
          await fetch(`${Url}/account/register_token`, {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ token }),
            redirect: "following",
          })
            .then((res) => res.json())
            .then((result) => console.log(result))
            .catch((error) => console.log(error));
        });
      //User open a message on the app but was in Quit State
      messaging()
        .getInitialNotification()
        .then((remoteMessage) => console.log(remoteMessage));
    }
    //User Open a message on the app but was in Background
    messaging().onNotificationOpenedApp((remoteMessage) => {
      console.log(remoteMessage);
    });
  }, []);

  // //ForeGround MESSAGE
  // useEffect(() => {
  //   const unsubscribe = messaging().onMessage(async (remoteMessage) => {
  //     // console.log(JSON.stringify(remoteMessage.notification.title));
  //     Alert.alert(
  //       remoteMessage.notification.title,
  //       remoteMessage.notification.body
  //     );
  //   });

  //   return unsubscribe;
  // }, []);
  //Request Permissions
//Updating Online status 

  return (
    <I18nextProvider i18n={i18n}>
      <ThemeProvider>
        <Provider store={store}>
          <View style={{ flex: 1 }}>
            <ErrorBoundary>
              <NavigationContainer>
                <StatusBar auto />
                <RootNavigation />
              </NavigationContainer>
            </ErrorBoundary>
          </View>
        </Provider>
      </ThemeProvider>
    </I18nextProvider>
  );
}
