import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Modal,
  Switch,
  Alert,
} from "react-native";
import { Logout, getProfile } from "../../../redux/Features/Account";
import { useSelector, useDispatch } from "react-redux";
import { Avatar } from "react-native-elements";
import { Colors } from "../../components/Global";
import { Entypo } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { EditProfileSetting } from "./EditProfile";
import { UploadDocuments } from "./UploadDocument";
import { useTheme } from "../../components/Functions/ThemeProvider";
import { useTranslation } from "react-i18next";
import { GetUserShops, loading } from "../../../redux/Features/Shop";
import Spinner from "react-native-loading-spinner-overlay";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
const Setting = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { t, i18n } = useTranslation();
  // useEffect(() => {
  //   async function GetProfile() {
  //     const token = await AsyncStorage.getItem("token");
  //     if (token) {
  //       dispatch(getProfile());
  //     }
  //   }
  //   GetProfile();
  // }, []);
  const LogoutFunction = async () => {
    profile
      ? (await AsyncStorage.removeItem("token"),
        dispatch(getProfile()),
        navigation.navigate("Homepage"))
      : navigation.navigate("logins");
  };
  const language = [
    { name: "English", value: "en" },
    { name: "French", value: "fr" },
  ];
  const toggleLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === "dark";
  const { profile } = useSelector((state) => state.Account);
  const { Shops, loading } = useSelector((state) => state.Shops);
  // console.log(Shops);
  const [editProfileModal, setEditProfileModal] = useState(false);
  const [verificationModal, setVerificationModal] = useState(false);
  const [changePasswordModal, setChangePasswordModal] = useState(false);
  const [deleteAccountModal, setDeleteAccountModal] = useState(false);
  const [changeLanguageModal, setchangeLanguageModal] = useState(false);
  const [uploadDocs, setUploadDocs] = useState(false);
  const [shopsModal, setShopsModal] = useState(false);
  const SwitchAccount = async () => {
    const result = await dispatch(GetUserShops());
    // console.log(result);
    if (GetUserShops.fulfilled.match(result)) {
      setShopsModal(true);
    }
  };
  return (
    <View
      className={`${
        isDarkMode ? "bg-black" : null
      } flex-grow-1 flex-col flex-1`}
      style={styles.container}
    >
      <Spinner visible={loading} color={Colors.appColor} size={32} />
      <ScrollView className="flex-1">
        <TouchableOpacity
          onPress={() => navigation.navigate("notifications")}
          className="absolute top-14 right-8"
        >
          <Ionicons
            name="notifications-circle"
            size={Dimensions.get("screen").width * 0.1}
            color={Colors.appColor}
          />
        </TouchableOpacity>
        <View className="items-center pt-14 mt-5">
          <Avatar
            source={
              profile?.user?.profile
                ? { uri: profile?.user?.profile }
                : require("../../../../assets/icons/logo.png")
            }
            size="large"
            rounded
            containerStyle={{ borderColor: Colors.appColor, borderWidth: 1 }}
          />
        </View>
        <View className="py-3 w-[90%] my-5 z-10 shadow-sm shadow-black self-center bg-gray-200 px-2 rounded-md flex flex-row items-center justify-between">
          <View>
            <Text className="font-bold text-lg">{profile?.user?.username}</Text>
            <Text className="text-gray-600 text-xs">
              {profile?.user?.email}
            </Text>
            <Text className="text-gray-600 text-xs">
              {profile?.user?.phone_number}
            </Text>
          </View>
          {profile ? (
            <>
              <TouchableOpacity
                onPress={() => setEditProfileModal(true)}
                className=""
              >
                <Text className="text-appColor font-bold">{t("welcome")}</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity
                onPress={() => LogoutFunction()}
                className="self-center my-2 py-3 "
              >
                <Text className="text-red-700 font-bold text-lg">
                  {profile ? "Sign Out" : "Login"}
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
        <Text className=" text-gray-400 mx-4 font-bold">Account Setting</Text>
        <TouchableOpacity
          style={styles.settingButton}
          onPress={() => setVerificationModal(true)}
        >
          <Text className="font-bold">Verified</Text>
          <Text>{profile?.user?.verified ? "Yes" : "No"}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.settingButton}
          onPress={() => {
            SwitchAccount();
          }}
        >
          <Text className="font-bold">Switch Account</Text>
          <Entypo name="chevron-right" size={24} color="black" />
        </TouchableOpacity>
        <View className="mt-12">
          <Text className="mx-4 font-bold text-gray-400">App Setting</Text>
          <TouchableOpacity
            style={styles.settingButton}
            onPress={() => setchangeLanguageModal(true)}
          >
            <Text className="font-bold">Language</Text>
            <Entypo name="chevron-right" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity
            className="py-2"
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingHorizontal: "2%",
              borderRadius: Dimensions.get("screen").width / 60,
              width: "92%",
              alignSelf: "center",
              backgroundColor: "#E2E0E0",
              shadowColor: "#000",
              shadowRadius: 3,
              elevation: 5,
              shadowOffset: {
                width: 0,
                height: 2,
              },
              marginVertical: "1%",
            }}
          >
            <Text className="font-bold">Dark Mode</Text>
            <Switch
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={isDarkMode ? "#f5dd4b" : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleTheme}
              value={isDarkMode}
            />
          </TouchableOpacity>
        </View>
        <View className="my-14 w-[100%] self-center ">
          <Text className="text-gray-400 font-bold mx-4">Support</Text>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("Chat", {
                screen: "allChat",
              })
            }
            style={styles.settingButton}
          >
            <Text className="font-bold">Chat Support</Text>
            <AntDesign name="wechat" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </ScrollView>
      <TouchableOpacity
        onPress={() => LogoutFunction()}
        className="self-center my-2 py-3 "
      >
        <Text className="text-red-700 font-bold text-lg">
          {profile ? "Sign Out" : "Login"}
        </Text>
      </TouchableOpacity>
      {/* Modals Section for Setting */}
      <Modal
        visible={editProfileModal}
        transparent
        animationType="slide"
        className="flex-1"
        onRequestClose={() => setEditProfileModal(false)}
      >
        <View className="flex-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <View className="h-[85%] absolute bottom-0 w-full rounded-t-3xl bg-white">
            <EditProfileSetting
              setEditProfileModal={() => setEditProfileModal(false)}
            />
          </View>
        </View>
      </Modal>
      {/* requestOptions for Verificaion */}
      <Modal
        className="flex-1 "
        transparent
        visible={verificationModal}
        animationType="slide"
        onRequestClose={() => setVerificationModal(false)}
      >
        <View className="flex-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <View className="h-[30%] bg-white absolute bottom-0 w-full rounded-t-2xl items-center px-4">
            <View className="h-1 w-[20%] bg-gray-300 rounded-full my-2" />
            {profile?.user?.verified ? (
              <Text>Already Verified</Text>
            ) : (
              <View>
                <Text className="font-bold text-center">
                  Request For Verification
                </Text>
                <Text className="text-center my-2">
                  Please note that to get Verified you must share your National
                  Identity Card picture and equivalent Id No with Kaz ni Kaz and
                  your passport Photo
                </Text>
                <View className="flex flex-row gap-x-4 my-4">
                  <TouchableOpacity
                    onPress={() => setUploadDocs(true)}
                    className="w-[45%] items-center border border-appColor py-2 rounded-md"
                  >
                    <Text>I Agree</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setVerificationModal(false)}
                    className="w-[45%] items-center border border-appColor py-2 rounded-md"
                  >
                    <Text>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </View>
      </Modal>
      {/* Modal for Uploading Documents */}
      <Modal
        className="fle-1"
        transparent
        animationType="slide"
        visible={uploadDocs}
        onRequestClose={() => setUploadDocs(false)}
      >
        <View className="" style={styles.modal}>
          <View className="h-[75%] w-full bg-white absolute bottom-0 rounded-t-3xl  py-3">
            <UploadDocuments
              setUploadDocs={() => {
                setUploadDocs(false);
                setVerificationModal(false);
              }}
            />
          </View>
        </View>
      </Modal>
      {/* Theme Modal */}
      <Modal
        className="fle-1"
        transparent
        animationType="slide"
        visible={changeLanguageModal}
        onRequestClose={() => setchangeLanguageModal(false)}
      >
        <View className="" style={styles.modal}>
          <View className="min-h-[20%] w-full bg-white absolute bottom-0 rounded-t-3xl px-3 py-3">
            <TouchableOpacity>
              <Text className="font-bold text-xl">Choose Language</Text>
              {language.map((item, index) => {
                return (
                  <TouchableOpacity
                    className={`py-2 flex flex-row items-center gap-x-5 bg-gray-400 rounded-md my-1 w-[90%] self-center justify-between px-4`}
                    key={index}
                    onPress={() => {
                      toggleLanguage(item.value);
                      setchangeLanguageModal(false);
                    }}
                  >
                    <Text>{item?.name}</Text>
                    {i18n.language === item.value && (
                      <AntDesign name="check" size={24} color="black" />
                    )}
                  </TouchableOpacity>
                );
              })}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* Changing Account Modal */}
      <Modal
        className="flex-1"
        transparent
        visible={shopsModal}
        animationType="slide"
        onRequestClose={() => setShopsModal(false)}
      >
        <View
          className="flex-1 flex flex-col "
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <View
            className="absolute flex bottom-0 pl-4 py-4 w-full bg-white min-h-[20%] rounded-t-2xl"
            style={{}}
          >
            <Text className="text-xl font-bold my-2">Choose Shop Account</Text>
            {Shops?.shops?.length < 1 && (
              <TouchableOpacity
                onPress={() => navigation.navigate("CreateShop")}
                className="bg-gray-300 px-2 py-2 w-[70%]  rounded-lg"
              >
                <Text className="font-bold">Create Your First Shop</Text>
              </TouchableOpacity>
            )}
            {Shops?.shops?.map((item, index) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    AsyncStorage.setItem("shop_id", item.id);
                    navigation.navigate("ShopTab");
                    setShopsModal(false);
                  }}
                  key={index}
                  className="flex flex-row items-center my-1"
                >
                  <Avatar
                    source={{ uri: item?.thumbnail }}
                    rounded
                    size="large"
                    containerStyle={{
                      borderWidth: 1,
                      borderColor: Colors.appColor,
                    }}
                  />
                  <Text className="mx-2 font-bold">{item?.name}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </Modal>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexGrow: 1,
  },
  settingButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: "2%",

    backgroundColor: "white",
    paddingVertical: "5%",
    borderRadius: Dimensions.get("screen").width / 60,
    width: "92%",
    alignSelf: "center",
    backgroundColor: "#E2E0E0",
    shadowColor: "#000",
    shadowRadius: 3,
    elevation: 5,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    marginVertical: "1%",
  },
  modal: {
    backgroundColor: "rgba(0,0,0,0.5)",
    flex: 1,
  },
});
export default Setting;
