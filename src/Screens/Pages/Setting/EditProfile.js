import React, { useState } from "react";
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Alert,
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
export const EditProfileSetting = ({ setEditProfileModal }) => {
  const dispatch = useDispatch();
  const [profileImage, setProfile] = useState();
  const { profile, loading } = useSelector((state) => state.Account);
  console.log(profile);
  const [phoneNumber, setPhoneNumber] = useState();
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      dispatch(updateProfileImage({ profile: result.assets[0] }));
      setProfile(result.assets[0].uri);
    } else {
      Alert.alert("Edit Profile Cancelled");
    }
  };
  const updateprofilefunction = async () => {
    const result = await dispatch(EditProfile({ phone_number: phoneNumber }));
    if (EditProfile.fulfilled.match(result)) {
      Alert.alert("Profile Updated");
      setEditProfileModal();
    } else if (EditProfile.rejected.match(result)) {
      Alert.alert("Profile Not Updated");
      setEditProfileModal();
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
      <Text className="font-bold text-md">Edit Profile</Text>
      <TouchableOpacity onPress={() => pickImage()}>
        <Avatar
          source={{ uri: profileImage ? profileImage : profile?.user?.profile }}
          rounded
          size="xlarge"
          containerStyle={{ borderColor: Colors.appColor, borderWidth: 1 }}
        />
      </TouchableOpacity>
      <View className="w-[90%]">
        <Text>Username</Text>
        <TextInput
          editable={false}
          className="w-full bg-gray-200 py-3 rounded-md px-2"
          value={profile?.user?.username}
        />
      </View>
      <View className="w-[90%]">
        <Text>Email</Text>
        <TextInput
          editable={false}
          className="w-full bg-gray-200 py-3 rounded-md px-2"
          value={profile?.user?.email}
        />
      </View>
      <View className="w-[90%]">
        <Text>Phone Number:</Text>
        <TextInput
          className="w-full bg-gray-200 py-3 rounded-md px-2"
          value={phoneNumber}
          onChangeText={(e) => setPhoneNumber(e)}
          keyboardType="numeric"
          placeholder={profile?.user?.phone_number}
        />
      </View>
      <TouchableOpacity
        onPress={updateprofilefunction}
        className="w-[90%] py-4 items-center justify-center self-center bg-appColor shadow-sm shadow-black rounded-md z-10  my-2"
      >
        <Text className="text-white font-bold">Update Profile</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};
