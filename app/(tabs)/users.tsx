import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGlobalContext } from "@/context/GlobalProvider";

import SearchInput from "@/components/SearchInput";
import EmptyState from "@/components/EmptyState";
import { getUsersFromFirestore, updateUserStatus } from "@/lib/FIrebaseAPIS";
import { images } from "@/constants";

// Define the types for the user properties
interface User {
  id: string;
  username: string;
  email?: string;
  phoneNumber?: string;
  isAuth: boolean;
}

const users = () => {
  const { user } = useGlobalContext();
  const [users, setUsers] = useState<User[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"approved" | "unapproved">(
    "unapproved"
  );

  // Fetch users from Firestore
  const fetchUsers = async () => {
    try {
      const allUsers = await getUsersFromFirestore();
      setUsers(allUsers as any);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Refresh handler to refetch users
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchUsers();
    setRefreshing(false);
  };

  // Filter users based on the active tab
  const filteredUsers = users.filter((user) =>
    activeTab === "approved" ? user.isAuth : !user.isAuth
  );

  // Approve user function
  const handleApproveUser = async (userId: string) => {
    try {
      await updateUserStatus(userId, true); // Approve user
      fetchUsers(); // Refresh the list
    } catch (error) {
      console.error("Error approving user:", error);
    }
  };

  // Reject user function
  const handleRejectUser = async (userId: string) => {
    try {
      await updateUserStatus(userId, false); // Reject user
      fetchUsers(); // Refresh the list
    } catch (error) {
      console.error("Error rejecting user:", error);
    }
  };

  // Render user cards
  const renderUserItem = ({ item }: { item: User }) => (
    <View className="p-4 bg-[#fefeff] mb-2 rounded-lg shadow-md">
      <Text className="font-psemibold  text-lg">{item.username}</Text>
      <Text className="text-secondary">
        {item.email ? item.email : item.phoneNumber}
      </Text>

      {activeTab === "unapproved" && (
        <View className="flex-row justify-end space-x-4 mt-4">
          <TouchableOpacity
            onPress={() => handleApproveUser(item.id)}
            className="px-4 py-2 bg-green-500 rounded"
          >
            <Text className="text-white font-bold">Approve</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView className="bg-primary px-4 h-full">
      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.id}
        renderItem={renderUserItem}
        ListHeaderComponent={() => (
          <View className="flex my-6 space-y-6">
            <View className="flex justify-between items-start flex-row mb-6">
              <View>
                <Text className="font-pmedium text-sm text-gray-100">
                  Welcome Back
                </Text>
                <Text className="text-2xl font-psemibold text-white">
                  {user?.username}
                </Text>
              </View>
            </View>
            <View className="flex flex-row justify-around py-4 bg-secondary rounded-md px-4 ">
              <TouchableOpacity
                onPress={() => setActiveTab("unapproved")}
                className={`flex-1 rounded-full  items-center py-2 ${
                  activeTab === "unapproved" ? "bg-white" : "bg-transparent"
                }`}
              >
                <Text
                  className={`text-sm ${
                    activeTab === "unapproved" ? "text-black" : "text-white"
                  }`}
                >
                  Unapproved Users
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setActiveTab("approved")}
                className={`flex-1 rounded-full items-center py-2 ${
                  activeTab === "approved" ? "bg-white" : "bg-transparent"
                }`}
              >
                <Text
                  className={`text-sm ${
                    activeTab === "approved" ? "text-black" : "text-white"
                  }`}
                >
                  Approved Users
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          //   <EmptyState
          //     title="No Users Found"
          //     subtitle="No users in this category"
          //   />
          <View className="flex justify-center items-center px-4">
            <Image
              source={images.empty}
              resizeMode="contain"
              className="w-[270px] h-[216px]"
            />

            <Text className="text-sm font-pmedium text-gray-100">
              No Users Found
            </Text>
            <Text className="text-xl text-center font-psemibold text-white mt-2">
              No users in this category
            </Text>
          </View>
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
};

export default users;
