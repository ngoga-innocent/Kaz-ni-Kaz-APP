import React,{useState} from "react";
import { View,TouchableOpacity,Text,TextInput,ScrollView,Dimensions } from "react-native"
import Toast from "react-native-toast-message";
import Header from "../Header";
import Url from "../../../../../Url";
import { useNavigation } from "@react-navigation/native";
import Spinner from "react-native-loading-spinner-overlay";
const ForgotPassword=()=>{
    const [email,setemail]=useState("")
    const [loading,setloading]=useState(false)
    const navigation=useNavigation();
    async function getOtp(){
        setloading(true)
        //Send OTP to the entered email
        const myHeaders=new Headers();
        myHeaders.append('Content-Type', 'application/json');
        const requestOptions={
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify({email:email}),
            redirect: 'follow',
        }
        const res=await fetch(`${Url}/account/otp_request`,requestOptions);
        const data=await res.json()
        if(!res.ok){
            
            setloading(false)
            Toast.show({
                text1: "OTP has been sent to your registered email.",
                type: "error",
                visibilityTime:10000
            });
            
            return
        }
        
        if(!data.success){
            setloading(false);
            Toast.show({
                text1: data.detail,
                type: "error",
                visibilityTime:10000,
                autoHide: false            
            });
            
            return
        }
        setloading(false);
        Toast.show({
            text1: data.detail,
            type: "success",
            visibilityTime:10000
        });
        navigation.navigate("verify_otp",{email:email})
    }
    const height=Dimensions.get("screen").height
    return (
        <ScrollView className={`flex-1`} stickyHeaderIndices={[1]}>
            <Spinner visible={loading} color="orange" />
            <View className="bg-white flex flex-row justify-between items-end py-2 px-2" style={{height:height*0.13}}>
                <Text className=" font-bold">Reset Password</Text>
                <Text className="text-2xl  font-bold">Kaz ni Kaz</Text>
                <TouchableOpacity onPress={()=>navigation.navigate('Login')} className="border px-3 border-gray-600 bg-gray-600 py-2 rounded-md">
                    <Text className="text-white font-bold">Login</Text>
                </TouchableOpacity>
            </View>
            <View className="px-2 mt-4">
                <TextInput value={email} onChangeText={(text)=>setemail(text)} placeholder="Enter Email" className="w-full border border-gray-400 py-3  px-3 rounded-md "/>
                <TouchableOpacity onPress={()=>getOtp()} className="bg-appColor rounded-md my-4 py-2 items-center justify-center">
                    <Text className="text-center text-white text-lg font-bold">Forgot Password?</Text>
                </TouchableOpacity>
            </View>
            <View className="z-50">
                <Toast />
            </View>
        </ScrollView>
    )
}
export default ForgotPassword;