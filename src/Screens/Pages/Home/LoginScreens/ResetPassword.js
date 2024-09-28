import React,{useState} from "react";
import { View,TouchableOpacity,Text,TextInput,ScrollView,Dimensions } from "react-native"
import Toast from "react-native-toast-message";
import Header from "../Header";
import Url from "../../../../../Url";
import { useNavigation } from "@react-navigation/native";
import Spinner from "react-native-loading-spinner-overlay";
const ResetPassword=({route})=>{
    const email = route?.params?.email
    const otp = route?.params?.otp
    const [password,setPassword]=useState("")
    const [confirmPassword,setConfirmPassword]=useState("")
    const [loading,setloading]=useState(false)
    const navigation=useNavigation();
    async function resetpassword() {
        setloading(true);
    
        // Validation: Check if password and confirm password match
        if (password !== confirmPassword) {
            setloading(false);
            Toast.show({
                text1: "Passwords do not match",
                type: "error",
                visibilityTime: 5000
            });
            return;  // Ensure early exit if passwords don't match
        }
    
        // Prepare request headers
        const myHeader = new Headers();
        myHeader.append("Content-Type", "application/json");
    
        // Prepare request body
        const body = JSON.stringify({
            "new_password": password,
            "otp_code": otp,
            "email": email
        });
    
        // Configure request options
        const requestOptions = {
            method: 'POST',
            headers: myHeader,
            body: body,
            redirect: 'follow',
        };
    
        try {
            // Make the API call
            const res = await fetch(`${Url}/account/reset_password`, requestOptions);
            const data = await res.json();
    
            // Handle non-200 response status
            if (!res.ok) {
                setloading(false);
                Toast.show({
                    text1: "Failed to reset password",
                    text2: data.detail || "An error occurred",  // Fallback message
                    type: "error",
                    visibilityTime: 5000
                });
                return;
            }
    
            // Handle success or failure based on data returned
            if (!data.success) {
                setloading(false);
                Toast.show({
                    text1: "Failed to reset password",
                    text2: data.detail || "An error occurred",  // Handle missing detail field
                    type: "error",
                    visibilityTime: 5000
                });
                return;
            }
    
            // Success case: show success toast and navigate to login
            setloading(false);
            Toast.show({
                text1: "Password reset successful",
                type: "success",
                visibilityTime: 5000
            });
            navigation.navigate('Login');  // Navigate to login screen
    
        } catch (error) {
            // Catch network errors or unexpected errors
            setloading(false);
            Toast.show({
                text1: "An error occurred",
                text2: error.message || "Unable to reset password",
                type: "error",
                visibilityTime: 5000
            });
        }
    }
    
    const height=Dimensions.get("screen").height
    return (
        <ScrollView className={`flex-1`} stickyHeaderIndices={[1]}>
            <Spinner visible={loading} color="orange" />
            <View className="bg-white flex flex-row justify-between items-end py-2 px-2" style={{height:height*0.13}}>
                <Text className=" font-bold">Reset Password</Text>
                <Text className="text-2xl  font-bold">Kaz ni Kaz</Text>
                <TouchableOpacity onPress={()=>navigation.navigate("Login")} className="border px-3 border-gray-600 bg-gray-600 py-2 rounded-md">
                    <Text className="text-white font-bold">Login</Text>
                </TouchableOpacity>
            </View>
            <View className="px-2 mt-4">
                <TextInput value={password} onChangeText={(text)=>setPassword(text)} placeholder="Enter new Password" className="w-full my-2 border border-gray-400 py-3  px-3 rounded-md "/>
                <TextInput value={confirmPassword} onChangeText={(text)=>setConfirmPassword(text)} placeholder="Confirm Password Password" className="w-full border border-gray-400 py-3  px-3 rounded-md "/>
                <TouchableOpacity onPress={()=>resetpassword()} className="bg-appColor rounded-md my-4 py-2 items-center justify-center">
                    <Text className="text-center text-white text-lg font-bold">Forgot Password?</Text>
                </TouchableOpacity>
            </View>
            <View className="z-50">
                <Toast />
            </View>
        </ScrollView>
    )
}
export default ResetPassword;