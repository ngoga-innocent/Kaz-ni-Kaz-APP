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
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import {} from "react-native-gesture-handler";
import { Feather } from "@expo/vector-icons";
import { Colors } from "../../../components/Global";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "react-native-loading-spinner-overlay";
import { useNavigation } from "@react-navigation/native";
import { SignUp } from "../../../../redux/Features/Account";
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
  const { loading, Registersuccess } = useSelector((state) => state.Account);
  if (Registersuccess) {
    navigation.navigate("Login");
  }
  async function Registerfunction() {
    if (username !== "" && email !== "" && password !== "") {
      dispatch(
        SignUp({
          username: username,
          first_name: first_name,
          last_name: last_name,
          email: email,
          password: password,
        })
      );
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

  return (
    <ScrollView className="flex-1 flex-col  px-5">
      <Spinner visible={loading} color={Colors.appColor} size={35} />
      <View className="" style={{ zIndex: 1000, elevation: 10 }}>
        <Text className=" text-3xl font-bold py-7 pt-20 z-50">Sign Up</Text>
      </View>
      <View className="py-4">
        <View className="bg-white rounded-md my-1 z-10 shadow-md shadow-black px-4 py-1 flex-row justify-between items-center">
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
        <View className="bg-white rounded-md my-1 z-10 shadow-md shadow-black px-4 py-1 flex-row justify-between items-center">
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
        <View className="bg-white rounded-md my-1 z-10 shadow-md shadow-black px-4 py-1 flex-row justify-between items-center">
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
        <View className="bg-white rounded-md my-1 z-10 shadow-md shadow-black px-4 py-1 flex-row justify-between items-center">
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
        <View className="bg-white rounded-md my-1 z-10 shadow-md shadow-black px-4 py-1 flex-row justify-between items-center">
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
        <View className="bg-white rounded-md my-1 z-10 shadow-md shadow-black px-4 py-1 flex-row justify-between items-center">
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
          <TouchableOpacity>
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
    </ScrollView>
  );
};

export default Register;
