import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { Colors } from "../../../components/Global";
import { Feather } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { SignIn } from "../../../../redux/Features/Account";
import Spinner from "react-native-loading-spinner-overlay";
import AsyncStorage from "@react-native-async-storage/async-storage";
const Login = () => {
  useEffect(() => {
    async function GetToken() {
      const token = await AsyncStorage.getItem("token");
      console.log(token);
      if (token != null) {
        navigation.navigate("BottomTab");
      }
    }
    GetToken();
  }, []);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [secureTextEntry, setSecureTextEntry] = useState(false);

  ////////Login Function ///////
  const { LoginSuccess, loading, isError, errorMessage } = useSelector(
    (state) => state.Account
  );
  //console.log(LoginSuccess);
  useEffect(() => {
    if (LoginSuccess) {
      navigation.navigate("BottomTab");
    }
  }, [LoginSuccess, navigation]);
  const LoginFunction = () => {
    if (username !== "" && password !== "") {
      dispatch(SignIn({ username: username, password: password }));
    } else {
      Alert.alert("Fill the empty fields to continue ");
    }
  };
  return (
    <ScrollView
      className="flex-1 flex flex-col px-8 "
      contentContainerStyle={{ justifyContent: "center", flex: 1 }}
    >
      <Spinner visible={loading} color={Colors.appColor} size={30} />

      <View className="w-full justify-center flex flex-col ">
        <View className="py-7 pt-20">
          <Text className="text-3xl font-bold">Login</Text>
        </View>
        <View className="py-4 my-2">
          <View className="bg-white rounded-md my-2 z-10 shadow-md  px-4 py-1 flex-row justify-between items-center">
            <View>
              <Text className="text-gray-400">Username or Email</Text>
              <TextInput
                className=" "
                value={username}
                onChangeText={(e) => setUsername(e)}
              />
            </View>
            {username && (
              <AntDesign name="checkcircle" size={24} color={Colors.appColor} />
            )}
          </View>
          {/* password */}
          <View className="bg-white rounded-md my-1 z-10 shadow-md shadow-black px-4 py-1 flex-row justify-between items-center">
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
              {password !== "" && (
                <AntDesign
                  name="checkcircle"
                  size={24}
                  color={Colors.appColor}
                />
              )}
              <TouchableOpacity
                onPress={() => setSecureTextEntry(!secureTextEntry)}
              >
                <AntDesign name="eye" size={30} color={Colors.appColor} />
              </TouchableOpacity>
            </View>
          </View>
          {isError && (
            <Text className="text-orange-400 font-bold text-center ">
              {errorMessage}
            </Text>
          )}
          <TouchableOpacity className="self-end my-2 flex-row items-center">
            <Text className="text-gray-400">Forgot your password</Text>
            <TouchableOpacity>
              <Feather name="arrow-right" size={24} color={Colors.appColor} />
            </TouchableOpacity>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={() => LoginFunction()}
          className="py-3 rounded-full bg-appColor items-center"
        >
          <Text className="font-bold text-white">Sign In</Text>
        </TouchableOpacity>
        <View className="mt-14 items-center place-self-end justify-end">
          <Text className="text-gray-400">Or Login with Social Media</Text>
          <View className="flex flex-row gap-x-2 my-2">
            <TouchableOpacity className="bg-white w-14 h-14 items-center justify-center rounded-lg">
              <Image
                source={require("../../../../../assets/icons/google.png")}
                resizeMode="contain"
                className="rounded-md h-8 w-8"
              />
            </TouchableOpacity>
            <TouchableOpacity className="bg-white w-14 h-14 items-center justify-center rounded-lg">
              <Image
                resizeMode="contain"
                className="rounded-md h-8 w-8"
                source={require("../../../../../assets/icons/facebook.png")}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View className="flex flex-row items-center self-center gap-x-2 flex-end mt-7">
          <Text className="text-gray-500">New To Kaz ni Kaz?</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("Register")}
            className=""
          >
            <Text className="font-bold text-appColor">Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default Login;
