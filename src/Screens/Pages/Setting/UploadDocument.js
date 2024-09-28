import React, { useState } from "react";
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
  Dimensions,
} from "react-native";
import { Avatar } from "react-native-elements";
import { Colors } from "../../components/Global";
import * as ImagePicker from "expo-image-picker";
import { useDispatch, useSelector } from "react-redux";
import {
  updateProfileImage,
  EditProfile,
} from "../../../redux/Features/Account";
import Spinner from "react-native-loading-spinner-overlay";
import Toast from "react-native-toast-message";
export const UploadDocuments = ({ setUploadDocs }) => {
  const dispatch = useDispatch();
  const [passportImage, setPassportImage] = useState();
  const { profile, loading } = useSelector((state) => state.Account);
  const [idNo, setIdNo] = useState();
  const [idCard, setIdCard] = useState();
  const [passport, setPassport] = useState();

  const { width, height } = Dimensions.get("screen");
  const [view_request, setViewRequest] = useState(false);
  const pickImage = async () => {
    const permision = await ImagePicker.requestCameraPermissionsAsync();
    if (permision) {
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        // aspect: [4, 3],
        quality: 1,
      });
      if (!result.canceled) {
        // dispatch(updateProfileImage({ profile: result.assets[0] }));
        setPassportImage(result.assets[0]);
        setPassport(result.assets[0].uri);
      } else {
        Alert.alert("Edit Profile Cancelled");
      }
    } else {
      Alert.alert("Permission Denied please try again ");
    }
  };
  // Update Profile
  const updateprofilefunction = async () => {
    const result = await dispatch(
      updateProfileImage({
        id_number: idNo,
        id_card: idCard,
        selfie: passportImage,
      })
    );
    console.log(result);
    if (updateProfileImage.fulfilled.match(result)) {
      Alert.alert("Document Submitted Successfully");
      setUploadDocs();
    } else if (updateProfileImage.rejected.match(result)) {
      Alert.alert("Document Not Sent");
    }
  };
  const UploadId = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      // aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setIdCard(result.assets[0]);
    }
  };
  // Hide Instruction
  const HideInstruction = () => {
    setViewRequest(!view_request);
  };
  return (
    <ScrollView
      className="flex-1 "
      contentContainerStyle={{
        alignItems: "center",
      }}
    >
      <Spinner visible={loading} color={Colors.appColor} />
      <View className="bg-gray-300 h-1 w-10 my-2 rounded-full" />
      <View className="z-50">
        <Toast />
      </View>
      <Text className="font-bold text-xl my-2">Uplaod Documents</Text>
      <TouchableOpacity
        onPress={() => HideInstruction()}
        className="w-[60%] py-2 bg-appColor my-2 self-end mx-3 rounded-md items-center justify-center"
      >
        <Text className="font-bold text-white">Guides</Text>
      </TouchableOpacity>
      <View className={`flex-col w-[100%] ${view_request ? "hidden" : "flex"}`}>
        <Text className="w-[90%] mx-auto">
          In order to Get Verified Kaz ni Kaz needs your official personal
          Documents including either Passport Or Id Card and even Id No
        </Text>
        <Text className="w-[90%] mx-auto my-2">
          Your National Identity Card picture and equivalent Id No should be
          clear, legible and complete. Please ensure your documents are in good
          condition and submitted id Number must match to the number on the
          uploaded Document. If you have any questions or concerns, feel free to
          contact our customer support team at +250782214360 or email us at
          kaznikaz@gmail.com.
        </Text>
        <Text className="w-[90%] mx-auto my-2">
          in order to ensure that the docuements are we request to user to
          upload his/her passport photo with the document in hands in order to
          avoid unnecessary inconvinience. The picture should be uploaded in the
          following forma with client Document visibility and face of the owner
          as shown on the Image below.
        </Text>
        <Text className="w-[90%] mx-auto">
          Note that this uploaded Documents can used in case of lawsuit as to
          ensure the security of the Client
        </Text>
      </View>
      <View>
        <Text className="w-[90%] mx-auto font-bold my-3">
          The Guide on how the passport Image Should be taken
        </Text>
        <Image
          source={require("../../../../assets/guide_selfie.png")}
          className=""
          style={{ width: width * 0.9, height: height * 0.3 }}
          resizeMode="contain"
        />
      </View>
      <View className="flex flex-row gap-x-3">
        <TouchableOpacity
          onPress={() => UploadId()}
          className="items-center border border-appColor py-2 w-[45%] self-center rounded-md my-2"
        >
          <Text>Upload Your National Id</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => pickImage()}
          className="items-center border border-appColor py-2 w-[45%] self-center rounded-md my-2"
        >
          <Text>Take a Passport photo</Text>
        </TouchableOpacity>
      </View>
      <View className="flex flex-row gap-x-2  w-[98%] mx-auto">
        {idCard && (
          <View className="flex-1 h-32 w-32">
            {idCard ? (
              <Image
                source={{ uri: idCard?.uri }}
                className="flex-1 w-[89%] border border-appColor rounded-md"
                resizeMode="contain"
              />
            ) : null}
          </View>
        )}
        {passportImage && (
          <View className=" flex-1 h-32 w-48">
            <Image
              source={{ uri: passportImage?.uri }}
              className=" flex-1 w-48 border   border-appColor rounded-md"
              resizeMode="contain"
            />
          </View>
        )}
      </View>
      <View className="w-[90%] items-start bg-white shadow-md shadow-black my-2 py-1 rounded-md px-2">
        <Text className="text-gray-300 font-bold text-xs">
          Add Your National Identity number
        </Text>
        <TextInput
          value={idNo}
          onChangeText={(e) => setIdNo(e)}
          placeholder="national Id number"
          keyboardType="numeric"
        />
      </View>

      <TouchableOpacity
        onPress={() => updateprofilefunction()}
        className="border border-appColor w-[90%] self-center items-center py-3 my-2 rounded-md bg-appColor"
      >
        <Text className="text-white font-bold text-lg">
          Request To be Verified
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};
