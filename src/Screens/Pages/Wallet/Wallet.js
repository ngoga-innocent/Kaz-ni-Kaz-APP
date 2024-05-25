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
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSelector, useDispatch } from "react-redux";
import { AntDesign } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import Spinner from "react-native-loading-spinner-overlay";
import {
  FetchWallet,
  MakeDeposit,
  MakeTransfer,
} from "../../../redux/Features/WalletSlice";
import { StatusBar } from "expo-status-bar";
const Wallet = () => {
  const [amount, setAmount] = useState();
  const [phoneNumber, setPhoneNumber] = useState();
  const [depositModal, setDepositModal] = useState(false);
  const [transferModal, setTransferModal] = useState(false);
  const [reciever, setReciever] = useState(
    "451c3c15-8b20-492d-a56f-b3d6e9c8fce0"
  );
  const dispatch = useDispatch();
  const { wallet, loading, isSuccess, walletHistory } = useSelector(
    (state) => state.Wallet
  );
  useEffect(() => {
    if (isSuccess) {
      setDepositModal(false);
      setTransferModal(false);
    }
  }, [isSuccess]);
  async function Copy() {
    await Clipboard.setStringAsync(wallet?.user_details?.id);
  }
  //////////////Deposit Function ///////////////////////

  const depositFunction = () => {
    if (amount !== "") {
      dispatch(MakeDeposit({ amount: parseInt(amount), action: "Deposit" }));
    } else {
      Alert.alert("Please fill in the Amount");
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
    <ScrollView stickyHeaderIndices={[2]}>
      <StatusBar autohide />
      <Spinner visible={loading} color={Colors.appColor} size={35} />
      <View>
        <View className=" flex-1 flex-row justify-between items-center  mb-8 bg-white px-2 rounded-lg py-2 pt-14">
          <Image
            source={require("../../../../assets/icon.png")}
            resizeMode="contain"
            className="w-14 h-14"
          />
          <Text className="text-2xl font-bold">Kazi Ni kazi</Text>
          <TouchableOpacity className="items-center">
            <FontAwesome6 name="coins" size={30} color={Colors.appColor} />
            <Text className="text-sm font-bold">{wallet?.amount} Rwf</Text>
          </TouchableOpacity>
        </View>
      </View>
      <LinearGradient
        className=" flex-1  w-[95%] py-6 items-center self-center rounded-md"
        // Button Linear Gradient
        colors={["#0014FF", "#8020EF", "#192f6a"]}
        locations={[0, 0.5, 1]}
      >
        <View className="items-center">
          <Text className="text-white font-bold my-1">Available Balance</Text>
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
            <TouchableOpacity className="rounded-full border border-white h-10 items-center justify-center w-10 rotate-45">
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
            <Text className="text-gray-300">{wallet?.user_details?.id}</Text>
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
                  backgroundColor: index % 2 == 0 ? "rgba(0,0,0,0.2)" : "white",
                }}
              >
                <Text>{item?.created_at?.split("T")[0]}</Text>
                <Text>{item?.amount} Rwf</Text>
                <Text>{item?.action}</Text>
                <Text>
                  {item?.created_at?.split("T")[1]?.split("Z")[0].split(".")[0]}
                </Text>
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
          <View className="absolute bg-white w-full rounded-t-3xl items-center  h-[45%] bottom-0">
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
          <View className="absolute bg-white w-full rounded-t-3xl items-center  h-[45%] bottom-0">
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
        </View>
      </Modal>
    </ScrollView>
  );
};
export default Wallet;
