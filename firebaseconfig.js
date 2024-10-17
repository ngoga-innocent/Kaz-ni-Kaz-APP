import { initializeApp } from "firebase/app";
// import { getMessaging, onMessage } from "firebase/messaging";
import firebase from '@react-native-firebase/app';
// Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyAZ0SrgLmDTYLpI7GWaff_g4uPCf4ZOOUs",
  authDomain: "kaz-ni-kaz.firebaseapp.com",
  projectId: "kaz-ni-kaz",
  storageBucket: "kaz-ni-kaz.appspot.com",
  databaseURL: "",
  messagingSenderId: "139154356857",
  appId: "1:139154356857:web:f5f120b6ff9b1b1d28b2a8",
  measurementId: "G-4HVDFZDBQE",
};

// Initialize Firebase

if (!firebase.apps.length > 0) {
  const app =firebase.initializeApp(firebaseConfig);
} else {
  app=firebase.app(); // if already initialized, use that one
}

export default app;
