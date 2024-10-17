import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  RefreshControl,
  Linking,
  Platform
} from "react-native";
import Header from "../Home/Header";
import { Ionicons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { EvilIcons } from "@expo/vector-icons";
import { useSelector, useDispatch } from "react-redux";
import {
  DeleteMessage,
  EditMessage,
  getUserMessage,
  SendChat,
} from "../../../redux/Features/Chat";
import * as ImagePicker from "expo-image-picker";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { Video, ResizeMode } from "expo-av";
import { Colors } from "../../components/Global";
import { Avatar } from "react-native-elements";
const Chat = ({ route }) => {
  //Use State
  const [message, setMessage] = useState(null);
  const [tempMessages, setTempMessages] = useState([]);
  const [showAddFile, setShowAddFile] = useState(false);
  const [showFilePlacement, setFilePlacement] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState();
  const [isSelectedMessage, setIsSelectedMessage] = useState(false);
  
  const dispatch = useDispatch();
  const receiver_id = route?.params?.receiver_id;
  const receiver_username=route?.params?.receiver_username;
  const receiver_profile=route?.params?.receiver_photo;
  const receiver_phone_number=route?.params?.phone_number;
  const online_status=new Date(route?.params?.receiver_online_status || null);
  // console.log("online_status",route?.params?.receiver_online_status)
  let status="last Active "+ route?.params?.receiver_online_status?.split("T")[0];
  const time=new Date().toISOString();
  console.log(online_status)
  console.log(time)
  const formatTime = (timeStr) => {
    const date = new Date(timeStr);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  };
  if(((new Date() - online_status)/1000) < 5){
    status="online";
  }
  else if (route?.params?.receiver_online_status?.split("T")[0] === time.split("T")[0]) {
    // const time = route?.params?.receiver_online_status?.split("T")[1]?.split("Z")[0]?.split(":")?.slice(0, 2).join(":");
    status = "Last Active " + formatTime(route?.params?.receiver_online_status);
  }
  else{
    status="Last Active " +route?.params?.receiver_online_status?.split("T")[0]
  }
  
  useEffect(() => {
    dispatch(getUserMessage({ receiver_id: receiver_id }));
  }, []);
  const ScrollViewRef = useRef();
  useEffect(() => {
    if (ScrollViewRef.current) {
      ScrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(getUserMessage({ receiver_id: receiver_id }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);
  //Use Selector
  const { messages, loading } = useSelector((state) => state.Chat);
  const { profile } = useSelector((state) => state.Account);
  // console.log(profile);
  ///Handle Reading Messges
  const unread_messages = messages.filter(
    (message) => !message.is_read && message?.receiver?.id == profile?.user?.id
  );

  const { width, height } = Dimensions.get("screen");

  //Handle Send Message
  const sendMessage = async () => {
    if (message) {
      const tempMessage = {
        id: Date.now(),
        message: message,
        message_type: "text",
        tempory: true,
        sender: profile?.detail,
      };
      setTempMessages([...tempMessages, tempMessage]);
      dispatch(
        SendChat({
          receiver_id: receiver_id,
          message: message,
          message_type: "text",
        })
      )
        .unwrap()
        .then((result) => {
          setTempMessages(
            tempMessages.filter((message) => !message.id == tempMessage.id)
          );
        });

      setMessage(null);
    }
  };
  const handleShowAddFile = (event) => {
    setFilePlacement(event.nativeEvent.locationY);
    setShowAddFile(!showAddFile);
  };
  //Handle Send Image Message
  const HandleImageMessage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      // aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const tempMessage = {
        id: Date.now(),
        image: result.assets[0].uri,
        message_type: result.assets[0].type,
        tempory: true,
        sender: profile,
      };
      setTempMessages([...tempMessages, tempMessage]);
      dispatch(
        SendChat({
          receiver_id: receiver_id,
          message: result.assets[0],
          message_type: "video",
        })
      )
        .unwrap()
        .then((result) => {
          setTempMessages(
            tempMessages.filter((message) => !message.id == tempMessage.id)
          );
        });
      setMessage(null);
    }
  };
  const handleDeleteMessage = () => {
    if (selectedMessage !== null) {
      dispatch(
        DeleteMessage({
          message_id: selectedMessage,
        })
      )
        .unwrap()
        .then((result) => {
          setSelectedMessage("");
          setIsSelectedMessage(false);
        })
        .catch((error) => console.log(error));
    }
  };
  //Phone cALL HANDLER FUNCTION
  const phoneCall = async (phone_number) => {
    if (Platform.OS === "android") {
      try {
        const supported = await Linking.canOpenURL(`tel:${phone_number}`);
        if (supported) {
          await Linking.openURL(`tel:${phone_number}`);
        } else {
          console.log("Can't handle url");
        }
      } catch (e) {
        console.log("Error", e);
      }
    } else {
      try {
        const supported = await Linking.canOpenURL(`telprompt:${phone_number}`);
        if (supported) {
          await Linking.openURL(`telprompt:${phone_number}`);
        } else {
          console.log("Can't handle url");
        }
      } catch (e) {
        console.log("Error", e);
      }
    }
  };
  return (
    <View className="flex-1 relative ">
      {/* <Header /> */}
      
      <View className="flex flex-col bg-white justify-end pb-2 px-2" style={{height:height*0.13}}>
        <View className="flex flex-row justify-between items-center">
        <View className="flex flex-row items-center ">
            <Avatar title={receiver_username?.slice(0,2)} containerStyle={{backgroundColor:'green',borderWidth:2,borderColor:'gray'}} rounded size="medium" />
            <View className="mx-2">
              <Text className="font-bold text-lg">{receiver_username}</Text>
              <Text>{status}</Text>
            </View>
        </View>
        {receiver_phone_number  && <View className="flex flex-row items-center gap-x-2">
          <TouchableOpacity
            onPress={() =>
              Linking.openURL(
                `whatsapp://send?text=Kaz ni Kaz request&phone=${receiver_phone_number}`
              )
            }
            className="flex items-center justify-center w-[40] h-[40] rounded-full bg-[#075e54] hover:bg-gray-400"
          >
            <FontAwesome5 name="whatsapp" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => phoneCall(receiver_phone_number)}
            className="flex items-center justify-center w-[40] h-[40] rounded-full bg-[#212d5e] hover:bg-gray-400"
          >
           <FontAwesome5 name="phone-alt" size={24} color="white" />
          </TouchableOpacity>
        </View>}
        </View>
      </View>
      {isSelectedMessage && (
        <View className="flex flex-row justify-between absolute h-40 z-30  items-center bg-black w-full py-2 self-center ">
          <TouchableOpacity
            onPress={() => {
              setIsSelectedMessage(false);
              setIsSelectedMessage(null);
            }}
            className="z-50 bg-white w-[40] h-[40] rounded-full  items-center justify-center"
          >
            <EvilIcons name="arrow-left" size={34} color="black" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleDeleteMessage()}
            className=" z-50 bg-red-700 w-[40] h-[40] rounded-full  items-center justify-center"
          >
            <MaterialIcons name="delete" size={34} color="white" />
          </TouchableOpacity>
        </View>
      )}
      <View className="flex-1 justify-end flex flex-col pb-5  ">
        <ScrollView
          // refreshControl={
          //   <RefreshControl
          //     refreshing={loading}
          //     onRefresh={() =>
          //       dispatch(getUserMessage({ receiver_id: receiver_id }))
          //     }
          //   />
          // }
          ref={ScrollViewRef}
          showsVerticalScrollIndicator={false}
          className="mx-2 overflow-y-scroll max-h-[90%]"
          contentContainerStyle={{
            // maxHeight: height * 0.6,
            overflow: "scroll",
          }}
        >
          {[...messages, ...tempMessages]?.map((message, index) => {
            
            return (
              <TouchableOpacity
                onLongPress={() => {
                  if (selectedMessage?.id === message?.id) {
                    setSelectedMessage();
                    setIsSelectedMessage(false);
                  } else {
                    setSelectedMessage(message?.id);
                    setIsSelectedMessage(true);
                  }
                }}
                onPress={() => {
                  setShowAddFile(false);
                }}
                key={index}
                
                className={`w-auto max-w-[80%]  flex flex-col  px-3 ${
                  message?.sender?.id == profile?.detail?.id
                    ? `self-end items-end  ${
                        message?.message_type == "text" && "bg-appColor"
                      }  my-1 py-2 rounded-3xl px-3`
                    : `self-start  my-1 py-2 rounded-3xl px-3 ${
                        message?.message_type == "text" && "bg-slate-400"
                      }`
                }  `}
              >
                
                  <Text className=''>{message?.message}</Text>
              
                {message?.message_type == "image" && (
                  <Image
                    source={{ uri: message?.image }}
                    className=" rounded-lg"
                    style={{
                      width: width * 0.7,
                      height: height * 0.2,
                      alignSelf: "flex-end",
                    }}
                    // resizeMode="contain"
                  />
                )}
                {/* {message?.message_type == "text" && (
                  <Text>{message?.message}</Text>
                )} */}
                {message?.message_type == "video" && (
                  <Video
                    source={{ uri: message?.video }}
                    style={{
                      width: width * 0.7,
                      height: height * 0.2,
                      alignSelf: "flex-end",
                    }}
                    useNativeControls
                    resizeMode={ResizeMode.COVER}
                    showPoster
                    shouldPlay={false}
                    isLooping
                  />
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
        {showAddFile && (
          <View
            className="bg-white py-3   px-4 rounded-2xl w-[60%] z-20 shadow-sm shadow-black self-center flex flex-row gap-x-2 flex-wrap "
            style={{
              position: "absolute",

              right: width * 0.2,
              bottom: showFilePlacement + height * 0.08,
            }}
          >
            <TouchableOpacity
              onPress={() => HandleImageMessage()}
              className="bg-[#c416a6]  rounded-full items-center justify-center py-2 px-2"
              style={{
                width: width * 0.14,
                height: width * 0.14,
              }}
            >
              <Entypo name="images" size={30} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              className="bg-[#c41651] rounded-full items-center justify-center py-2 px-2"
              style={{
                width: width * 0.14,
                height: width * 0.14,
              }}
            >
              <Entypo name="camera" size={30} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              className="bg-[#4e65e3] rounded-full items-center justify-center py-2 px-2"
              style={{
                width: width * 0.14,
                height: width * 0.14,
              }}
            >
              <AntDesign name="filetext1" size={30} color="white" />
            </TouchableOpacity>
          </View>
        )}
        <View className="py-2 rounded-3xl w-[98%] self-center gap-x-2  flex flex-row px-2 items-end">
          <View className="flex-1 bg-white rounded-3xl flex flex-row items-center">
            <TextInput
              autoFocus
              value={message}
              onChangeText={(e) => setMessage(e)}
              className="py-3 px-2 w-[87%] max-h-24 bg-white rounded-3xl"
              multiline
              placeholder="Type message..."
            />
            <TouchableOpacity onPress={handleShowAddFile}>
              <MaterialIcons name="attach-file" size={24} color="black" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={() => sendMessage()}
            className="rounded-full bg-black w-10 h-10 items-center justify-center"
          >
            <Ionicons name="send" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Chat;
