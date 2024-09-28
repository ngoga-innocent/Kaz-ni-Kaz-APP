import React, { useState, useRef, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Dimensions
} from "react-native";
import Toast from "react-native-toast-message";
import Header from "../Header";
import Url from "../../../../../Url";
import { useNavigation } from "@react-navigation/native";
import Spinner from "react-native-loading-spinner-overlay";
const OtpVerify = ({ route }) => {
    const navigation=useNavigation();
  const email = route?.params?.email;
  const [loading, setloading] = useState(false);
  const height = Dimensions.get("screen").height;
  const [otp, setOtp] = useState(["", "", "", "", "", ""]); // 6-digit OTP
  const [timer, setTimer] = useState(30); // Countdown timer for resending OTP
  const inputs = useRef([]);
  // Focus next input field after a digit is entered
  const handleChangeText = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
    if (text && index < 5) {
      inputs.current[index + 1].focus();
    }
  };
  useEffect(() => {
    if (timer > 0) {
      const intervalId = setInterval(() => {
        setTimer((timer) => timer - 1);
      }, 1000);
      return () => clearInterval(intervalId);
    }
  }, [timer]);
  //Verify OTP
  async function VerifyOtp() {
    setloading(true);
    //Send OTP to the entered email
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify({ otp: otp.join(""), email: email }),
      redirect: "follow"
    };
    const res = await fetch(`${Url}/account/check_otp`, requestOptions);
    const data = await res.json();
    console.log(data)
    if (!res.ok) {
      setloading(false);
      Toast.show({
        text1: data.detail,
        type: "error",
        visibilityTime: 10000
      });

      return;
    }

    if (!data.success) {
      setloading(false);
      Toast.show({
        text1: data.detail,
        type: "error",
        visibilityTime: 10000,
        autoHide: false
      });
      return;
    }
    setloading(false);
    Toast.show({
        text1: "OTP verified successfully",
        type: "success",
        visibilityTime: 10000
      
    })
    navigation.navigate("reset_password",{
        email:email,
        otp:otp.join("")
    });

  }
  //Resending OTP
  async function getOtp() {
    setloading(true);
    //Send OTP to the entered email
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify({ email: email }),
      redirect: "follow"
    };
    const res = await fetch(`${Url}/account/otp_request`, requestOptions);
    const data = await res.json();
    if (!res.ok) {
      setloading(false);
      Toast.show({
        text1: "OTP has been sent to your registered email.",
        type: "error",
        visibilityTime: 10000
      });

      return;
    }

    if (!data.success) {
      setloading(false);
      Toast.show({
        text1: data.detail,
        type: "error",
        visibilityTime: 10000,
        autoHide: false
      });

      return;
    }
    setloading(false);
    Toast.show({
      text1: data.detail,
      type: "success",
      visibilityTime: 10000
    });
    
  }
  // Resend OTP
  const resendOtp = async () => {
    if (timer === 0) {
      setTimer(30); // Reset the timer
      // Logic for resending OTP
       getOtp();
    }
  };
  // Function to handle OTP submission
  const handleSubmitOtp = async() => {
    const otpCode = otp.join("");
     VerifyOtp();
    
    // Add OTP verification logic here
  };

  return (
    <ScrollView stickyHeaderIndices={[1]} className={`flex-1`}>
      <Spinner visible={loading} color="orange" />
      <View
        className="bg-white flex flex-row mb-10 justify-between items-end py-2 px-2"
        style={{ height: height * 0.16 }}
      >
        <Text className=" font-bold">Reset Password</Text>
        <Text className="text-2xl  font-bold">Kaz ni Kaz</Text>
        <TouchableOpacity onPress={()=>navigation.navigate('Login')} className="border px-3 border-gray-600 bg-gray-600 py-2 rounded-md">
          <Text className="text-white font-bold">Login</Text>
        </TouchableOpacity>
      </View>
      <View className="z-50">
        <Toast />
      </View>
      <View style={styles.container}>
        <Text style={styles.title}>Enter OTP</Text>
        <Text style={styles.subtitle}>
          We have sent a One-Time Password (OTP) to your phone. Please enter it
          below.
        </Text>

        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              value={digit}
              onChangeText={(text) => handleChangeText(text, index)}
              style={styles.otpInput}
              maxLength={1}
              keyboardType="number-pad"
              ref={(ref) => (inputs.current[index] = ref)}
            />
          ))}
        </View>

        <TouchableOpacity
          className="bg-appColor"
          style={styles.submitButton}
          onPress={handleSubmitOtp}
        >
          <Text style={styles.submitText}>Submit OTP</Text>
        </TouchableOpacity>

        <View style={styles.resendContainer}>
          {timer > 0 ? (
            <Text style={styles.resendText}>Resend OTP in {timer}s</Text>
          ) : (
            <TouchableOpacity onPress={resendOtp}>
              <Text style={styles.resendButton}>Resend OTP</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </ScrollView>
  );
};
export default OtpVerify;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
    marginBottom: 30
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20
  },
  otpInput: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    textAlign: "center",
    fontSize: 18,
    backgroundColor: "#fff"
  },
  submitButton: {
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20
  },
  submitText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold"
  },
  resendContainer: {
    alignItems: "center",
    marginTop: 20
  },
  resendText: {
    color: "#666",
    fontSize: 16
  },
  resendButton: {
    color: "#10644D", // Your preferred primary color
    fontWeight: "bold",
    fontSize: 16
  }
});
