import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Image,
  TouchableOpacity,
} from "react-native";
import auth from "@react-native-firebase/auth";
import { icons } from "../../constants";
import InfoBox from "@/components/InfoBox";
import { useGlobalContext } from "@/context/GlobalProvider";
import { useEffect, useState } from "react";
import { getCountOfAllMedia, getCountOfAllUsers, getCountOfPostsByUser, getCountOfUpdatedMedia, getCountOfUpdatedPostsByUser } from "@/lib/FIrebaseAPIS";

const Profile = () => {
  const [totalImages, setTotalImages] = useState(0);
  const [approvedImages, setApprovedImages] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const { user } = useGlobalContext();

  // Fetch total images and approved images count
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const totalImagesCount = await getCountOfAllMedia();
        const approvedImagesCount = await getCountOfUpdatedMedia();
        setTotalImages(totalImagesCount);
        setApprovedImages(approvedImagesCount);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };
    fetchStats();
  }, [user.uid]);

  // Fetch total users count
  useEffect(() => {
    const fetchTotalUsers = async () => {
      try {
        // const totalUsersCount = 10;
        const totalUsersCount = await getCountOfAllUsers();
        setTotalUsers(totalUsersCount);
      } catch (error) {
        console.error("Error fetching total users:", error);
      }
    };
    fetchTotalUsers();
  }, []);

  const logout = async () => {
    auth().signOut();
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <View className="w-full flex justify-center items-center mt-6 mb-12 px-4">
        <TouchableOpacity
          onPress={logout}
          className="flex w-full items-end mb-10"
        >
          <Image
            source={icons.logout}
            resizeMode="contain"
            className="w-6 h-6"
          />
        </TouchableOpacity>

        <View className="w-16 h-16 border border-secondary rounded-lg flex justify-center items-center">
          <Image
            source={{
              uri: "https://img.freepik.com/free-psd/3d-illustration-human-avatar-profile_23-2150671142.jpg",
            }}
            className="w-[90%] h-[90%] rounded-lg"
            resizeMode="cover"
          />
        </View>

        <InfoBox
          title={user?.username}
          containerStyles="mt-5"
          titleStyles="text-lg"
        />

        <View className="mt-5 flex flex-row">
          <InfoBox
            title={totalImages || 0}
            subtitle="Total Images"
            titleStyles="text-xl"
            containerStyles="mr-10"
          />
          <InfoBox
            title={approvedImages || 0}
            subtitle="Approved"
            titleStyles="text-xl"
          />
        </View>

        <View className="mt-5">
          <InfoBox
            title={totalUsers || 0}
            subtitle="Total Users"
            titleStyles="text-xl"
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Profile;
