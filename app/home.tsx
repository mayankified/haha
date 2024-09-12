import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGlobalContext } from "@/context/GlobalProvider";
import { icons } from "@/constants";
import { Redirect, router } from "expo-router";
import auth from "@react-native-firebase/auth";


const Home = () => {
  const { user,loading,isLogged } = useGlobalContext(); // Assuming logout is available from GlobalContext
//   const { isLogged, loading, user } = useGlobalContext();
  if (!loading && !isLogged) return <Redirect href="/signin" />;

  if(user.role === "admin") return <Redirect href="/adminprofile" />;
  const logout = async () => {
    auth().signOut();
  };

  return (
    <SafeAreaView className="bg-primary flex-1 justify-center items-center">
      {/* Logout Button */}
      <TouchableOpacity
        onPress={logout} // Call logout function when pressed
        className="flex w-full items-end mb-10"
      >
        <Image
          source={icons.logout}
          resizeMode="contain"
          className="w-6 h-6"
        />
      </TouchableOpacity>

      {/* Welcome Section */}
      <View className="mb-16">
        <Text className="text-3xl font-bold text-white mb-2">
          Welcome, {user?.username || "User"}!
        </Text>
        <Text className="text-lg text-gray-300">Ready to explore?</Text>
      </View>

      {/* Scan Button */}
      <TouchableOpacity
        onPress={() => router.push("/scanner")} // Navigate to CameraScreen
        activeOpacity={0.8}
        className="bg-secondary w-28 h-28 rounded-full justify-center items-center shadow-lg"
        style={{
          elevation: 12, // For Android shadow
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 4,
        }}
      >
        <Image
          source={icons.search}
          className="w-16 h-16 m-4"
          resizeMode="contain"
        />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Home;
