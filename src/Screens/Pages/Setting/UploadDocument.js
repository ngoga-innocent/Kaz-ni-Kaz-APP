import React, { useState } from "react";
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
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
export const UploadDocuments = ({ setUploadDocs }) => {
  const dispatch = useDispatch();
  const [passportImage, setPassportImage] = useState(profile?.user?.profile);
  const { profile, loading } = useSelector((state) => state.Account);
  const [idNo, setIdNo] = useState();
  const [idCard, setIdCard] = useState();
  const [passport, setPassport] = useState();
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
      } else {
        Alert.alert("Edit Profile Cancelled");
      }
    } else {
      Alert.alert("Permission Denied please try again ");
    }
  };
  const updateprofilefunction = async () => {
    const result = await dispatch(
      updateProfileImage({
        id_number: idNo,
        id_card: idCard,
        selfie: passportImage,
      })
    );
    if (updateProfileImage.fulfilled.match(result)) {
      Alert.alert("Profile Updated");
      setUploadDocs();
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
  return (
    <ScrollView
      className="flex-1 "
      contentContainerStyle={{
        alignItems: "center",
      }}
    >
      <Spinner visible={loading} color={Colors.appColor} />
      <View className="bg-gray-300 h-1 w-10 my-2 rounded-full" />
      <Text className="font-bold text-xl">Uplaod Documents</Text>
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
          <Text>Take a Passport</Text>
        </TouchableOpacity>
      </View>
      {idCard && (
        <View className="flex flex-row gap-x-2 h-32 mx-2">
          {idCard ? (
            <Image
              source={{ uri: idCard?.uri }}
              className="flex-1 border border-appColor rounded-md"
              resizeMode="contain"
            />
          ) : null}
          <Image
            source={{ uri: passportImage?.uri }}
            className="flex-1 border border-appColor rounded-md"
            resizeMode="contain"
          />
        </View>
      )}
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
        <Text className="text-white font-bold text-lg">Upload Documents</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};
