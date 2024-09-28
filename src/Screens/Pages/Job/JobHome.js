import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Header from "../Home/Header";
import { TextInput } from "react-native-gesture-handler";
import { FontAwesome } from "@expo/vector-icons";
import { useSelector, useDispatch } from "react-redux";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  AddJobSlice,
  DeleteJob,
  FetchJobs,
} from "../../../redux/Features/Jobs";
import Spinner from "react-native-loading-spinner-overlay";
import { Avatar } from "react-native-elements";
import * as Animatable from "react-native-animatable";
import { FontAwesome6 } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { Colors } from "../../components/Global";
import { AntDesign } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import Toast from "react-native-toast-message";
import { useTheme } from "../../components/Functions/ThemeProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
const JobHome = () => {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  const navigation=useNavigation();
  const insets = useSafeAreaInsets();
  const statusBarHeight = insets.top;
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(FetchJobs());
  }, []);
  const { loading, jobs } = useSelector((state) => state.Jobs);
  const [JobList,setJobList]=useState([])
  const [showJobDetails, setShowJobDetails] = useState(false);
  const [jobDetails, setJobDetails] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [jobTitle, setJobTitle] = useState(null);
  const [jobLocation, setJobLocation] = useState(null);
  const [jobDescription, setJobDescription] = useState(null);
  const [JobSlug, setJobSlug] = useState(null);
  const [showAddJob, setShowAddJob] = useState(null);
  const [search_job,setSearchJob]=useState("")
  const handlePersist = (event) => {
    event.stopPropagation();
  };
  useEffect(()=>{
    setJobList(jobs)
  },[])
  const { profile } = useSelector((state) => state.Account);
  const SearchJob = (text) => {
    setSearchJob(text);
    
    const filteredJobs = jobs.filter((job) => {
      const jobTitle = job.job_title.toLowerCase();
      const searchQuery = text.toLowerCase();
      return jobTitle.includes(searchQuery);
    });
    // update the job list with the filtered results
    setJobList(filteredJobs);
  };
  //Handle add job check for logged in
  async function CheckLogin(){
    if(await AsyncStorage.getItem('token') !=null){
      return true;
    }
    else{
      return false;
    }
  }
  const addThumbnail = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permission.granted) {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });
      if (!result.canceled) {
        setThumbnail(result.assets[0]);
      }
    } else {
      ImagePicker.requestMediaLibraryPermissionsAsync();
    }
  };
  const PostJobFunction = async () => {
    
    const result = await dispatch(
      AddJobSlice({
        job_title: jobTitle,
        job_slug: JobSlug,
        job_description: jobDescription,
        job_location: jobLocation,

        thumbnail: thumbnail,
      })
    );

    if (AddJobSlice.fulfilled.match(result)) {
      console.log(result);
      setJobDescription("");
      setThumbnail(null);
      setJobTitle("");
      setJobSlug("");
      setJobLocation("");
      Toast.show({
        text1: "Job Posted Successfully",
        type: "success",
        position: "top",
        visibilityTime: 8000,
        autoHide: true,
        topOffset: 100,
      });
      dispatch(FetchJobs());
    }
    setShowAddJob(false);
  };
  const DeleteJobFunction = async (id) => {
    const result = await dispatch(DeleteJob({ job_id: id }));
    if (DeleteJob.fulfilled.match(result)) {
      Toast.show({
        text1: "Job Deleted Successfully",
        type: "success",
        position: "top",
        visibilityTime: 8000,
        autoHide: true,
        topOffset: 100,
      });
      dispatch(FetchJobs());
    }
  };
  return (
    <View className={`flex-1 ${isDarkMode && "bg-darkcolor"}`}>
      <Header />
      <Spinner visible={loading} />
      <View className="z-50">
        <Toast />
      </View>
      <View className="bg-appColor h-[25%] rounded-b-3xl items-center justify-center flex flex-col">
        <Text className="w-[70%] text-center text-white my-4">
          Kaz ni Kaz is #1 Destination to find incredible Job Opportunity
        </Text>
        <View className="border border-white w-[90%] self-flex-center py-2 rounded-full px-3 flex flex-row items-center justify-between ">
          <TextInput
            placeholder="Search for a job"
            className="text-white max-w-[80%] "
            placeholderTextColor="white"
            value={search_job}
            onChangeText={(text)=>SearchJob(text)}
          />
          <FontAwesome name="search" size={20} color="white" />
        </View>
        <Text className="px-4 text-2xl font-bold my-2 self-start">
          All Jobs
        </Text>
      </View>

      <ScrollView
        className="flex-1 -mt-5"
        contentContainerStyle={{
          alignItems: "center",
        }}
      >
        {JobList?.length < 1 && (
          <Text className="text-lg font-bold my-7">
            No Job Available for Now
          </Text>
        )}
        {JobList?.map((job, index) => {
          return (
            <TouchableOpacity
              onPress={() => {
                setJobDetails(job);
                setShowJobDetails(true);
              }}
              key={index}
              className="bg-white w-[80%] py-3 rounded-lg my-2 px-2 flex flex-row relative"
            >
              <Avatar
                source={{ uri: job?.job_thumbnail }}
                size="medium"
                rounded
              />
              <View className="mx-2">
                <Text className="text-md font-bold max-w-[100%] ">
                  {job?.job_title}
                </Text>
                <Text className="text-xs max-w-[85%]">{job?.job_slug}</Text>
                <Text className="text-xs font-bold">{job?.job_location}</Text>
              </View>
              {profile?.user?.id == job?.job_provider?.id ? (
                <TouchableOpacity
                  onPress={() => {
                    DeleteJobFunction(job.id);
                  }}
                  className="self-center px-3 py-2 bg-red-400 absolute -right-4 rounded-md"
                >
                  <Text className="font-bold">Delete</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => {
                    setJobDetails(job);
                    setShowJobDetails(true);
                  }}
                  className="self-center px-3 py-2 bg-appColor absolute -right-4 rounded-md"
                >
                  <Text className="font-bold">View More</Text>
                </TouchableOpacity>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <TouchableOpacity
        onPress={async()=>{
          const isLoggeedIn=await CheckLogin();
          console.log(isLoggeedIn)
          !isLoggeedIn?navigation.navigate("logins"):setShowAddJob(true)}}
        className="absolute shadow-md shadow-black z-50 bottom-5 right-3"
      >
        <AntDesign name="pluscircle" size={60} color={Colors.appColor} />
      </TouchableOpacity>
      <Modal
        visible={showJobDetails}
        onRequestClose={() => setShowJobDetails(false)}
        className="flex-1"
        transparent
        animationType="slide"
      >
        <TouchableWithoutFeedback onPress={() => setShowJobDetails(false)}>
          <View
            className="flex-1"
            style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
          >
            <TouchableWithoutFeedback onPress={handlePersist}>
              <Animatable.View className="h-[60%] bg-white bottom-0 absolute rounded-t-2xl flex-end w-full">
                <View className="h-1 w-[10%] bg-slate-400 self-center my-2 rounded-full" />
                <ScrollView
                  className="max-h-[100%] h-[100%] px-3 pb-5 overflow-y-scroll"
                  contentContainerStyle={{
                    flex: 1,
                    maxHeight: "100%",
                    overflow: "scroll",
                  }}
                >
                  <Image
                    source={{ uri: jobDetails?.job_thumbnail }}
                    className="flex-1 h-[100%] w-[100%]"
                    resizeMode="contain"
                  />
                  <View className="flex flex-row items-center gap-x-2">
                    <MaterialIcons
                      name="title"
                      size={24}
                      color={Colors.appColor}
                    />
                    <Text className="text-lg font-bold">
                      {jobDetails?.job_title}
                    </Text>
                  </View>
                  <View>
                    <View className="flex flex-row items-center gap-x-2">
                      <MaterialIcons
                        name="subtitles-off"
                        size={24}
                        color={Colors.appColor}
                      />
                      <Text className="max-w-[90%]  text-xs">
                        {jobDetails?.job_description}
                      </Text>
                    </View>
                    <View className="flex flex-row items-center gap-x-2">
                      <FontAwesome6
                        name="magnifying-glass-location"
                        size={20}
                        color={Colors.appColor}
                      />
                      <Text className="font-bold">
                        {jobDetails?.job_location}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity className="bg-appColor py-3 items-center rounded-lg my-2">
                    <Text className="font-bold text-white">Get In Touch</Text>
                  </TouchableOpacity>
                </ScrollView>
              </Animatable.View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Add Job MODAL */}
      <Modal
        visible={showAddJob}
        onRequestClose={() => setShowAddJob(false)}
        className="flex-1"
        transparent
        animationType="slide"
      >
        <TouchableWithoutFeedback onPress={() => setShowAddJob(false)}>
          <View
            className="flex-1 flex flex-col justify-end "
            style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
          >
            <TouchableWithoutFeedback onPress={handlePersist}>
              <KeyboardAvoidingView
                className="h-[70%] max-h-[70%] overflow-y-scroll"
                behavior={Platform.OS === "ios" ? "padding" : "height"}
              >
                <Animatable.View className="h-[60%] bg-white bottom-0 absolute rounded-t-2xl flex-end w-full">
                  <View className="h-1 w-[10%] bg-slate-400 self-center my-4 rounded-full" />
                  <ScrollView
                    className="max-h-[100%] h-[100%] px-3 pb-5 overflow-y-scroll"
                    contentContainerStyle={{
                      flex: 1,
                      maxHeight: "100%",
                      overflow: "scroll",
                    }}
                  >
                    <KeyboardAwareScrollView
                      style={{ paddingHorizontal: 15, paddingBottom: 20 }}
                      contentContainerStyle={{ paddingBottom: 20 }}
                      extraScrollHeight={20}
                      enableOnAndroid={true}
                      keyboardShouldPersistTaps="handled"
                    >
                      <View className="bg-slate-300 py-3 rounded-md ">
                        <TextInput
                          value={jobTitle}
                          onChangeText={(text) => setJobTitle(text)}
                          className="px-2 max-w-[95%]"
                          placeholder="Add Job Title"
                        />
                      </View>
                      <View className="bg-slate-300 py-3 rounded-md my-2 ">
                        <TextInput
                          value={JobSlug}
                          onChangeText={(text) => setJobSlug(text)}
                          className="px-2 max-w-[95%]"
                          placeholder="Add Job Slug"
                        />
                      </View>
                      <View className="bg-slate-300 py-3 rounded-md my-2 ">
                        <TextInput
                          value={jobDescription}
                          onChangeText={(text) => setJobDescription(text)}
                          multiline
                          className="px-2 max-w-[95%] max-h-14"
                          placeholder="Add Job Description"
                        />
                      </View>
                      <View className="bg-slate-300 py-3 rounded-md my-2 ">
                        <TextInput
                          value={jobLocation}
                          onChangeText={(text) => setJobLocation(text)}
                          className="px-2 max-w-[95%] max-h-14"
                          placeholder="Add Job Location"
                        />
                      </View>
                      <TouchableOpacity
                        onPress={() => addThumbnail()}
                        className="bg-slate-300 py-3 rounded-lg my-2 flex flex-row justify-between  items-center gap-x-2 px-2 "
                      >
                        <Text>
                          {thumbnail
                            ? thumbnail?.fileName
                            : "Add Job Thumbnail"}
                        </Text>
                        <Entypo name="image" size={24} color="black" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => PostJobFunction()}
                        className="py-2 rounded-lg items-center justify-center bg-appColor my-3"
                      >
                        <Text className="text-white font-bold text-lg">
                          Post Job
                        </Text>
                      </TouchableOpacity>
                    </KeyboardAwareScrollView>
                  </ScrollView>
                </Animatable.View>
              </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};
export default JobHome;
