import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  Platform,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import {} from "react-native-gesture-handler";
import { Feather } from "@expo/vector-icons";
import { Colors } from "../../../components/Global";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "react-native-loading-spinner-overlay";
import { useNavigation } from "@react-navigation/native";
import { SignUp } from "../../../../redux/Features/Account";
import * as AppleAuthentication from "expo-apple-authentication";
import * as SecureStore from "expo-secure-store";

import { GoogleSignin } from "@react-native-google-signin/google-signin";
import Toast from "react-native-toast-message";
const Register = () => {
  const navigation = useNavigation();
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [email, setemail] = useState("");
  const [username, setusername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone_number, setPhoneNumber] = useState("");
  const [confPassLoading, setConfPassLoading] = useState(false);
  const [PassErrMessage, setPassErrMessage] = useState("");
  const [acceptedpass, setpassAccepted] = useState(false);
  const [secureTextEntry, setSecureTextEntry] = useState(false);
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [user,setUser]=useState({})
  const dispatch = useDispatch();
  useEffect(() => {
    if (confirmPassword !== "" && confirmPassword !== password) {
      setConfPassLoading(true);
    } else {
      setConfPassLoading(false);
    }
  }, [confirmPassword]);
  useEffect(() => {
    if (password !== "") {
      const acceptedpass = CheckPassword(password);
      if (acceptedpass) {
        setpassAccepted(true);
      }
    }
  }, [password]);
  //////////////////////////////////////////// Registration Function /////////////////////////////////////////
  const { loading, Registersuccess, errorMessage } = useSelector(
    (state) => state.Account
  );
  // if (Registersuccess) {
  //   navigation.navigate("Login");
  // }
  async function Registerfunction() {
    if (username !== "" && email !== "" && password !== "") {
      const result = await dispatch(
        SignUp({
          username: username,
          first_name: first_name,
          last_name: last_name,
          email: email,
          password: password,
          phone_number:phone_number
        })
      );
      if (SignUp.fulfilled.match(result)) {
        navigation.navigate("Login");
      } else {
        console.log(result?.payload);
        Alert.alert(result?.payload);
      }
    } else {
      Alert.alert("Check the Empty Field on the Form to continue");
    }
  }
  function CheckPassword(password1) {
    console.log(password1);
    const password = password1;
    if (password.length >= 8) {
      if (/[A-Z]/.test(password)) {
        if (/[a-z]/.test(password)) {
          if (/[0-9]/.test(password)) {
            if (/[^A-Za-z0-9]/.test(password)) {
              setPassErrMessage("");
              return true;
            } else {
              setPassErrMessage("use atleast one special character");
              return false;
            }
          } else {
            setPassErrMessage("use at least one number");
            return false;
          }
        } else {
          setPassErrMessage("Use at least one lower character");
          return false;
        }
      } else {
        setPassErrMessage("use At least one Capital Character");
        return false;
      }
    } else {
      setPassErrMessage("Password should be at least 8 characters");
      return false;
    }
  }

  function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }
  async function saveUserData(user) {
    const userString = JSON.stringify(user); // Convert the object to a string
    await SecureStore.setItemAsync("appleuser", userString);
  }

  async function getUserData() {
    const userString = await SecureStore.getItemAsync("appleuser");
    if (userString) {
      const found_user=JSON.parse(userString);
      setUser(found_user);
      console.log("found user",found_user)
      return found_user // Convert the string back into an object
    }
    return null; // Handle case where no data is found
  }

  async function onAppleButtonPress() {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      
      // signed in with Full Name
      if (credential?.identityToken) {
        
        //Credentials has full name and Email
        if (
          credential?.fullName?.familyName != null &&
          credential?.fullName?.givenName != null &&
          credential?.email != null
        ) {
         
          const appleuser = {
            familyName: credential.fullName.familyName.split(" ")[0],
            givenName: credential.fullName.givenName?.split(" ")[0],
            email: credential.email,
          };
          await saveUserData(appleuser);
          setUser(appleuser)
        } else {
          //To be handle when the return has no complete profile data
          const user = await getUserData();
          
          if (user== null) {
            Toast.show({
              text1: "Failed to Sign  up with Apple",
              text2:
                "Please consider Completing the form or update your Apple account Profile",
              type: "error",
              position: "top",
              visibilityTime: 8000,
              autoHide: true,
              topOffset: 100,
            });
            return;
          }
        }
        console.log(user)
        //Dispacth Register A user on Backend Database using Redux
        const result = await dispatch(
          SignUp({
            username: user?.email?.split("@")[0],
            first_name: user?.familyName?.split(" ")[0],
            last_name: user?.givenName,
            phone_number:"",
            email: user?.email,
            password: user?.email + "@KazniKaz@2024",
            // signup_type: "Google",
          })
        );
        if (SignUp.fulfilled.match(result)) {
          
          Toast.show({
            text1: "Registered Successfully",
            type: "success",
            visibilityTime: 8000,
            autoHide: true,
            position: "top",
          });
          navigation.navigate("logins");
        } else if (SignUp.rejected.match(result)) {
          console.log(result.payload)
          Toast.show({
            text1: result?.payload?.split("by")[0],
            
            type: "error",
            position: "top",
            visibilityTime: 8000,
            autoHide: true,
            topOffset: 100,
          });
        }
      }
    } catch (e) {
      if (e.code === "ERR_REQUEST_CANCELED") {
        Toast.show({
          text1: "canceled Signing up with apple",
          
          type: "error",
          position: "top",
          visibilityTime: 8000,
          autoHide: true,
          topOffset: 100,
        });
        // handle that the user canceled the sign-in flow
      } else {
        // handle other errors
      }
    }
  }
  const GoogleSigninFunction = async () => {
    try {
      GoogleSignin.configure({
        webClientId:
          "850627398929-be3d8jqne5c4j59c0pqe59uftr3p4qmv.apps.googleusercontent.com", // client ID of type WEB for your server. Required to get the `idToken` on the user object, and for offline access.
        scopes: ["profile"], // what API you want to access on behalf of the user, default is email and profile
        offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
        hostedDomain: "", // specifies a hosted domain restriction
        forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
      });
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log("logged in data",userInfo.data)
      if (userInfo?.data?.idToken) {
        // console.log(userInfo.user);
        const result = await dispatch(
          SignUp({
            username: userInfo?.data?.user?.givenName?.split(" ")[0] || userInfo?.data?.user?.email?.split("@")[0],
            first_name: userInfo?.data?.user.familyName,
            last_name: userInfo?.data?.user.givenName,
            email: userInfo?.data?.user.email,
            password: userInfo?.data?.user.email + "@" + userInfo?.data?.user.familyName,
            // signup_type: "Google",
          })
        );
        if (SignUp.fulfilled.match(result)) {
          Alert.alert("signup success");
          Toast.show({
            text1: "Registered Successfully",
            type: "success",
            visibilityTime: 8000,
            autoHide: true,
            position: "top",
          });
          navigation.navigate("logins");
        }else if(SignUp.rejected.match(result)){
          console.log("error details",result?.payload)
          Toast.show({
            text1:"login Error",
            text2: result?.payload?.split("by")[0],
            type: "error",
            position: "top",
            visibilityTime: 8000,
            autoHide: true,
            })
        }
      }
    } catch (error) {
      if (isErrorWithCode(error)) {
        Toast.show({
            text1:"login Error",
            
            type: "error",
            position: "top",
            visibilityTime: 8000,
            autoHide: true,
            })
      } else {
        Toast.show({
            text1:"login Error",
            
            type: "error",
            position: "top",
            visibilityTime: 8000,
            autoHide: true,
            })
        // an error that's not related to google sign in occurred
      }
    }
  };

  return (
    <ScrollView className="flex-1 flex-col  px-5">
      <Spinner visible={loading} color={Colors.appColor} size={35} />
      <View className="" style={{ zIndex: 1000, elevation: 10 }}>
        <Text className=" text-3xl font-bold py-7 pt-20 z-50">Sign Up</Text>
        <View className="z-50">
        <Toast />
        </View>
      </View>
      <View className="py-4">
        <View className="bg-white rounded-md my-1  px-4 py-1 flex-row justify-between items-center">
          <View>
            <Text className="text-gray-400">First Name</Text>
            <TextInput
              className=" "
              value={first_name}
              onChangeText={(e) => setFirstName(e)}
            />
          </View>
          {first_name && (
            <AntDesign name="checkcircle" size={24} color={Colors.appColor} />
          )}
        </View>

        {/* LastName */}
        <View className="bg-white rounded-md my-1  px-4 py-1 flex-row justify-between items-center">
          <View>
            <Text className="text-gray-400">Last Name</Text>
            <TextInput
              className=" "
              value={last_name}
              onChangeText={(e) => setLastName(e)}
            />
          </View>
          {last_name && (
            <AntDesign name="checkcircle" size={24} color={Colors.appColor} />
          )}
        </View>
        {/* username */}
        <View className="bg-white rounded-md my-1 px-4 py-1 flex-row justify-between items-center">
          <View>
            <Text className="text-gray-400">Username</Text>
            <TextInput
              className=" "
              value={username}
              onChangeText={(e) => setusername(e)}
            />
          </View>
          {username !== "" && (
            <AntDesign name="checkcircle" size={24} color={Colors.appColor} />
          )}
        </View>
        {/* LastName */}
        <View className="bg-white rounded-md my-1  px-4 py-1 flex-row justify-between items-center">
          <View>
            <Text className="text-gray-400">Email</Text>
            <TextInput
              className=" "
              value={email}
              onChangeText={(e) => setemail(e)}
            />
          </View>
          {email !== "" && validateEmail(email) ? (
            <AntDesign name="checkcircle" size={24} color={Colors.appColor} />
          ) : null}
        </View>
        {!validateEmail(email) && (
          <Text className="text-orange-200 font-bold">Invalid Email</Text>
        )}
        {/* phone Number */}
        <View className="bg-white rounded-md px-4 py-1 flex-row justify-between items-center">
          <View>
            <Text className="text-gray-400">Phone Number</Text>
            <TextInput
              className=" "
              value={phone_number}
              onChangeText={(e) => setPhoneNumber(e)}
            />
          </View>
          {phone_number !== "" && (
            <AntDesign name="checkcircle" size={24} color={Colors.appColor} />
          )}
        </View>

        {/* password */}
        <View className="bg-white rounded-md my-1  px-4 py-1 flex-row justify-between items-center">
          <View>
            <Text className="text-gray-400">Password</Text>
            <TextInput
              className=" "
              secureTextEntry={secureTextEntry}
              value={password}
              onChangeText={(e) => setPassword(e)}
            />
          </View>

          <View className="flex flex-row gap-x-2">
            {acceptedpass && (
              <AntDesign name="checkcircle" size={24} color={Colors.appColor} />
            )}
            <TouchableOpacity
              onPress={() => setSecureTextEntry(!secureTextEntry)}
            >
              <AntDesign name="eye" size={30} color={Colors.appColor} />
            </TouchableOpacity>
          </View>
        </View>
        {!acceptedpass && (
          <Text className="text-orange-200 font-bold">{PassErrMessage}</Text>
        )}

        {/* password */}
        <View className="bg-white rounded-md my-1  px-4 py-1 flex-row justify-between items-center">
          <View>
            <Text className="text-gray-400">Confirm Password</Text>
            <TextInput
              className=" "
              secureTextEntry={secureTextEntry}
              value={confirmPassword}
              onChangeText={(e) => setConfirmPassword(e)}
            />
          </View>
          {confPassLoading ? (
            <ActivityIndicator color={Colors.appColor} size={20} />
          ) : (
            <AntDesign name="checkcircle" size={24} color={Colors.appColor} />
          )}
        </View>
        {confPassLoading && (
          <Text className="text-orange-200 font-bold">
            Password doesn't match
          </Text>
        )}

        <TouchableOpacity
          onPress={() => navigation.navigate("Login")}
          className="self-end my-2 flex-row items-center"
        >
          <Text className="text-gray-400">Already Have an account</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Feather name="arrow-right" size={24} color={Colors.appColor} />
          </TouchableOpacity>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        onPress={() => Registerfunction()}
        className="py-3 rounded-full bg-appColor items-center"
      >
        <Text className="font-bold text-white">Sign Up</Text>
      </TouchableOpacity>
      <View className="mt-14 items-center">
        <Text className="text-gray-400">Or Sign up with Social Media</Text>
        <View className="flex flex-row gap-x-2 my-2">
          <TouchableOpacity
            onPress={() => GoogleSigninFunction()}
            className="bg-white w-14 h-14 items-center justify-center rounded-lg"
          >
            <Image
              source={require("../../../../../assets/icons/google.png")}
              resizeMode="contain"
              className="rounded-md h-8 w-8"
            />
          </TouchableOpacity>
          {Platform.OS == "ios" && (
            <TouchableOpacity
              onPress={() => onAppleButtonPress()}
              className="bg-white w-14 h-14 items-center justify-center rounded-lg"
            >
              <Image
                source={require("../../../../../assets/icons/Apple-Logo.jpg")}
                resizeMode="contain"
                className="rounded-md h-8 w-8"
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

export default Register;
