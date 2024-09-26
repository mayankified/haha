import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGlobalContext } from "@/context/GlobalProvider";
import { icons } from "@/constants";
import { Redirect, router } from "expo-router";
import auth from "@react-native-firebase/auth";

const Home = () => {
  const { user, loading, isLogged } = useGlobalContext();

  // Redirect if user is not logged in or loading
  if (!loading && !isLogged) return <Redirect href="/signin" />;

  // Redirect admin users
  if (user.role === "admin") return <Redirect href="/adminprofile" />;

  // Function to handle logout
  const logout = async () => {
    auth().signOut();
  };

  return (
    <SafeAreaView className="flex-1 bg-primary px-4">
      {/* Header with Logout Button */}
      <View className="flex-row justify-end mt-4 mr-4">
        <TouchableOpacity onPress={logout} className="flex-row items-center">
          <Image source={icons.logout} resizeMode="contain" className="w-6 h-6" />
          <Text className="text-white text-lg ml-2">Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <View className="flex-1 justify-center items-center">
        {/* Welcome Section */}
        <View className="mb-10 items-center">
          <Text className="text-4xl font-bold text-white mb-2">
            Welcome, {user?.username || "User"}!
          </Text>
          <Text className="text-xl text-gray-300">Ready to explore?</Text>
        </View>

        {/* Conditionally render Scan Button based on user.isAuth */}
        {user.isAuth ? (
          <TouchableOpacity
            onPress={() => router.push("/scanner")}
            activeOpacity={0.8}
            className="bg-secondary w-36 h-36 rounded-full justify-center items-center shadow-lg"
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
              className="w-16 h-16 mb-2"
              resizeMode="contain"
            />
            <Text className="text-white text-3xl mt-2 font-semibold">Scan</Text>
          </TouchableOpacity>
        ) : (
          <Text className="text-xl text-gray-300 mt-4">
            Your account is not authorized to scan.
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Home;
