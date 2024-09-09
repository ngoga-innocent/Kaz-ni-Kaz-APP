import React, { useState, useEffect } from "react";
import { FontAwesome6 } from "@expo/vector-icons";
import { Colors } from "../../components/Global";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Image,
  Modal,
  TextInput,
  Alert,
  TouchableWithoutFeedback,
  RefreshControl,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSelector, useDispatch } from "react-redux";
import { AntDesign } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { useIsFocused } from "@react-navigation/native";
import Spinner from "react-native-loading-spinner-overlay";
import {
  FetchWallet,
  MakeDeposit,
  MakeTransfer,
} from "../../../redux/Features/WalletSlice";
import { useTheme } from "../../components/Functions/ThemeProvider";
import { StatusBar } from "expo-status-bar";
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
const Wallet = () => {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  const [amount, setAmount] = useState();
  const [phoneNumber, setPhoneNumber] = useState();
  const [depositModal, setDepositModal] = useState(false);
  const [WithdrawModal, setWithdrawModal] = useState(false);
  const [transferModal, setTransferModal] = useState(false);
  const [reciever, setReciever] = useState(
    "451c3c15-8b20-492d-a56f-b3d6e9c8fce0"
  );
  const navigation = useNavigation();
  const [loggedIn, setLoggedIn] = useState(false);
  const dispatch = useDispatch();
  const { wallet, loading, isSuccess, walletHistory } = useSelector(
    (state) => state.Wallet
  );
  // console.log(walletHistory);
  useEffect(() => {
    if (isSuccess) {
      setDepositModal(false);
      setTransferModal(false);
    }
  }, [isSuccess]);
  async function Copy() {
    await Clipboard.setStringAsync(wallet?.user_details?.id);
  }
  const focused = useIsFocused();
  useEffect(() => {
    CheckLoggedIn();
  }, [focused]);
  ////////////////////////CHECK LOGGED IN //////////////////////////
  async function CheckLoggedIn() {
    const token = await AsyncStorage.getItem("token");
    if (token) {
      setLoggedIn(true);
    } else {
      setLoggedIn(false);
    }
  }
  //////////////Deposit Function ///////////////////////

  const depositFunction = async () => {
    if (amount !== "" && phoneNumber != "") {
      const result = await dispatch(
        MakeDeposit({
          amount: parseInt(amount),
          phone_number: phoneNumber,
          action: "Deposit",
        })
      );
      if (MakeDeposit.fulfilled.match(result)) {
        setDepositModal(false);
      }
      if (MakeDeposit.rejected.match(result)) {
        setDepositModal(false);
        // console.log(result);
        Toast.show({
          text1: "Deposit in process ",
          type: "info",
          visibilityTime: 8000,
          position: "top",
          autoHide: true,
        });
      }
    } else {
      Alert.alert("Please fill in the empty Fields");
    }
  };
  ///////////////////Withdraw /////////////////
  const withdrawFunction = async () => {
    if (amount > wallet.amount) {
      Toast.show({
        text1: "Withdraw Failed ",
        text2: "Insuficient Amount",
        type: "error",
        visibilityTime: 8000,
        position: "top",
        autoHide: true,
      });
      setWithdrawModal(false);
      return;
    }
    if (amount !== "" && phoneNumber != "") {
      const result = await dispatch(
        MakeDeposit({
          // reciever: wallet?.user_details?.id,
          action: "Withdraw",
          amount: parseInt(amount),
          phone_number: phoneNumber,
        })
      );
      if (MakeDeposit.fulfilled.match(result)) {
        setWithdrawModal(false);
      }
      if (MakeDeposit.rejected.match(result)) {
        console.log(result);
        setWithdrawModal(false);
        // Toast.show({
        //   text1: "Withdraw Failed ",
        //   type: "error",
        //   visibilityTime: 8000,
        //   position: "top",
        //   autoHide: true,
        // });
      }
    } else {
      Alert.alert("fill all Fields");
    }
  };
  ///////////////////Transfer /////////////////
  const Transfer = () => {
    if (amount !== "") {
      dispatch(
        MakeTransfer({
          reciever: reciever,
          action: "Transfer",
          amount: parseInt(amount),
        })
      );
    } else {
      Alert.alert("fill all Fields");
    }
  };
  return (
    <ScrollView
      stickyHeaderIndices={[2]}
      className={`${isDarkMode && "bg-darkcolor"}`}
      refreshControl={
        <RefreshControl
          onRefresh={() => dispatch(FetchWallet())}
          refreshing={loading}
        />
      }
    >
      <StatusBar autohide />

      <Spinner visible={loading} color={Colors.appColor} size={35} />
      <View>
        <View
          className={`flex-1 flex-row justify-between items-center  mb-8   px-2 rounded-lg py-2 pt-14 ${
            isDarkMode ? "bg-darkcolor" : "bg-white"
          }`}
        >
          <Image
            source={require("../../../../assets/icon.png")}
            resizeMode="contain"
            className="w-14 h-14"
          />
          <Text className={`text-2xl font-bold ${isDarkMode && "text-white"}`}>
            Kaz Ni kaz
          </Text>
          <TouchableOpacity className="items-center">
            <FontAwesome6 name="coins" size={30} color={Colors.appColor} />
            <Text className={`text-sm font-bold ${isDarkMode && "text-white"}`}>
              {wallet?.amount} Rwf
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View className="z-50">
        <Toast />
      </View>
      {!loggedIn ? (
        <View className="flex-1 w-full items-center">
          <Text>Please Login To View Your Wallet </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("logins")}
            className="w-[85%] py-2 rounded-md bg-appColor my-3 items-center justify-center"
          >
            <Text className="text-white font-bold">Login</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <LinearGradient
            className=" flex-1  w-[95%] py-6 items-center self-center rounded-md"
            // Button Linear Gradient
            colors={["#0014FF", "#8020EF", "#192f6a"]}
            locations={[0, 0.5, 1]}
          >
            <View className="items-center">
              <Text className="text-white font-bold my-1">
                Available Balance
              </Text>
              <Text className="font-bold text-lg text-white py-1">
                {wallet?.amount} Rwf
              </Text>
            </View>
            <View className=" py-2 flex-1 gap-x-3 flex-row items-center justify-between">
              <View className="items-center gap-y-1">
                <TouchableOpacity
                  onPress={() => setDepositModal(true)}
                  className="rounded-full border border-white h-10 items-center justify-center w-10 rotate-45"
                >
                  <AntDesign
                    name="arrowup"
                    size={24}
                    color="white"
                    className="rotate-45"
                  />
                </TouchableOpacity>
                <Text className="text-white text-xs font-bold">Deposit</Text>
              </View>
              <View className="items-center gap-y-1">
                <TouchableOpacity
                  onPress={() => setWithdrawModal(true)}
                  className="rounded-full border border-white h-10 items-center justify-center w-10 rotate-45"
                >
                  <AntDesign
                    name="arrowdown"
                    size={24}
                    color="white"
                    className="rotate-45"
                  />
                </TouchableOpacity>
                <Text className="text-white text-xs font-bold">Withdraw</Text>
              </View>
              <View className="items-center gap-y-1">
                <TouchableOpacity
                  onPress={() => setTransferModal(true)}
                  className="rounded-full border border-white h-10 items-center justify-center w-10 rotate-45"
                >
                  <AntDesign name="arrowsalt" size={24} color="white" />
                </TouchableOpacity>
                <Text className="text-white text-xs font-bold">Transfer</Text>
              </View>
            </View>
            <View className="items-center my-2">
              <Text className="text-white font-bold">Wallet No</Text>
              <View className="flex flex-row gap-x-1 items-center">
                <Text className="text-gray-300">
                  {wallet?.user_details?.id}
                </Text>
                <TouchableOpacity onPress={() => Copy()}>
                  <AntDesign name="copy1" size={24} color="gray" />
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>
          <ScrollView className="px-[4%] py-4 bg-white flex-1 my-2 rounded-t-2xl">
            <Text className="font-bold ">Recent Activities</Text>
            {walletHistory?.length > 0 ? (
              walletHistory?.map((item, index) => {
                return (
                  <TouchableOpacity
                    key={index}
                    className={`flex flex-row justify-between py-2 items-center my-1 rounded-md px-2`}
                    style={{
                      backgroundColor:
                        index % 2 == 0 ? "rgba(0,0,0,0.2)" : "white",
                    }}
                  >
                    <Text>{item?.created_at?.split("T")[0]}</Text>
                    <Text>{item?.amount} Rwf</Text>
                    <Text>{item?.action}</Text>
                    <Text>
                      {
                        item?.created_at
                          ?.split("T")[1]
                          ?.split("Z")[0]
                          .split(".")[0]
                      }
                    </Text>
                    <Text>{item?.status?.slice(0, 7)}</Text>
                  </TouchableOpacity>
                );
              })
            ) : (
              <Text>No history</Text>
            )}
          </ScrollView>
          {/* ##############################33 Deposit Modal ##############################  */}
          <Modal
            transparent
            style={{}}
            animationType="slide"
            visible={depositModal}
            onRequestClose={() => setDepositModal(false)}
          >
            <View
              className="flex-1 "
              style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            >
              <TouchableOpacity
                className="flex-1 "
                onPress={() => setDepositModal(false)}
              >
                <View className="absolute bg-white w-full rounded-t-3xl items-center  h-[45%] bottom-0">
                  <TouchableWithoutFeedback className="flex-1">
                    <View className="flex-1 w-full items-center">
                      <View className="h-1 w-[20%] bg-slate-400 rounded-full my-3" />
                      <TextInput
                        keyboardType="numeric"
                        className="w-[90%] px-2 border border-gray-400 py-2 rounded-md mt-4 required:"
                        placeholder="Phone Number"
                        value={phoneNumber}
                        onChangeText={(e) => setPhoneNumber(e)}
                      />
                      <TextInput
                        keyboardType="numeric"
                        className="w-[90%] px-2 border border-gray-400 py-2 rounded-md mt-4"
                        placeholder="Amount"
                        value={amount}
                        onChangeText={(e) => setAmount(e)}
                      />
                      <TouchableOpacity
                        onPress={() => depositFunction()}
                        className="bg-appColor w-[90%] items-center py-4 rounded-md my-3"
                      >
                        <Text className="text-white font-bold">Deposit</Text>
                      </TouchableOpacity>
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              </TouchableOpacity>
            </View>
          </Modal>
          {/* ######################## Transfer Modal ################## */}
          <Modal
            transparent
            style={{}}
            animationType="slide"
            visible={transferModal}
            onRequestClose={() => setTransferModal(false)}
          >
            <View
              className="flex-1 "
              style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            >
              <TouchableOpacity
                className="flex-1"
                onPress={() => setTransferModal(false)}
              >
                <View className="absolute bg-white w-full rounded-t-3xl items-center  h-[45%] bottom-0">
                  <TouchableWithoutFeedback>
                    <View className="flex-1 w-full items-center">
                      <View className="h-1 w-[20%] bg-slate-400 rounded-full my-3" />
                      <TextInput
                        keyboardType=""
                        className="w-[90%] px-2 border border-gray-400 py-2 rounded-md mt-4 required:"
                        placeholder="Reciever Address"
                        value={reciever}
                        onChangeText={(e) => setReciever(e)}
                      />
                      <TextInput
                        keyboardType="numeric"
                        className="w-[90%] px-2 border border-gray-400 py-2 rounded-md mt-4"
                        placeholder="Amount"
                        value={amount}
                        onChangeText={(e) => setAmount(e)}
                      />
                      <TouchableOpacity
                        onPress={() => Transfer()}
                        className="bg-appColor w-[90%] items-center py-4 rounded-md my-3"
                      >
                        <Text className="text-white font-bold">Transfer</Text>
                      </TouchableOpacity>
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              </TouchableOpacity>
            </View>
          </Modal>
          {/* Withdrwa Modal */}
          <Modal
            transparent
            style={{}}
            animationType="slide"
            visible={WithdrawModal}
            onRequestClose={() => setWithdrawModal(false)}
          >
            <View
              className="flex-1 "
              style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            >
              <TouchableOpacity
                className="flex-1"
                onPress={() => setWithdrawModal(false)}
              >
                <View className="absolute bg-white w-full rounded-t-3xl items-center  h-[45%] bottom-0">
                  <TouchableWithoutFeedback>
                    <View className="flex-1 w-full items-center">
                      <View className="h-1 w-[20%] bg-slate-400 rounded-full my-3" />
                      <TextInput
                        keyboardType="numeric"
                        className="w-[90%] px-2 border border-gray-400 py-2 rounded-md mt-4 required:"
                        placeholder="Phone Number"
                        value={phoneNumber}
                        onChangeText={(e) => setPhoneNumber(e)}
                      />
                      <TextInput
                        keyboardType="numeric"
                        className="w-[90%] px-2 border border-gray-400 py-2 rounded-md mt-4"
                        placeholder="Amount"
                        value={amount}
                        onChangeText={(e) => setAmount(e)}
                      />
                      <TouchableOpacity
                        onPress={() => withdrawFunction()}
                        className="bg-appColor w-[90%] items-center py-4 rounded-md my-3"
                      >
                        <Text className="text-white font-bold">Withdraw</Text>
                      </TouchableOpacity>
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              </TouchableOpacity>
            </View>
          </Modal>
        </>
      )}
    </ScrollView>
  );
};
export default Wallet;
