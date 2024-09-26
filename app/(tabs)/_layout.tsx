import { View, Text, Image } from "react-native";
import React from "react";
import { Redirect, Tabs } from "expo-router";
import { icons } from "../../constants";
import { useGlobalContext } from "@/context/GlobalProvider";

// Custom Tab Icon Component
const TabIcon = ({ icon, color, name, focused }: any) => {
  return (
    <View className="flex items-center justify-center gap-2">
      <Image
        source={icon}
        resizeMode="contain"
        className="w-6 h-6"
        style={{ tintColor: color }}
      />
      <Text
        className={`${focused ? "font-psemibold" : "font-pregular"} text-xs`}
        style={{ color: color }}
      >
        {name}
      </Text>
    </View>
  );
};

type Role = "user" | "admin";

// Main Tab Layout Component
const Tablayout = () => {
  const { isLogged, loading, user } = useGlobalContext();
  if (!loading && !isLogged) return <Redirect href="/signin" />;
  // console.log("user", user);
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#b36dd9",
        // tabBarActiveTintColor: "#FFA001",
        tabBarInactiveTintColor: "#CDCDE0",
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "#161622",
          borderTopWidth: 1,
          borderTopColor: "#232533",
          height: 84,
        },
      }}
    >
      {/* Common Tabs for All Users */}
      <Tabs.Screen
        name="adminprofile"
        options={{
          title: "Admin",
          headerShown: false,
          href: user?.role === "admin" ? undefined : null, // Show only for user
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={icons.profile}
              color={color}
              name="Admin"
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="users"
        options={{
          title: "Users",
          headerShown: false,
          href: user?.role === "admin" ? undefined : null, // Show only for user
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={icons.profile}
              color={color}
              name="Users"
              focused={focused}
            />
          ),
        }}
      />


      {/* User-Only Tab */}
      <Tabs.Screen
        name="myimg"
        options={{
          title: "Images",
          headerShown: false,
          href: user?.role === "admin" ? undefined : null,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={icons.bookmark}
              color={color}
              name="Images"
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="upload"
        options={{
          title: "Upload",
          headerShown: false,
          href: user?.role === "admin" ? undefined : null, // Show only for user
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={icons.upload}
              color={color}
              name="Upload"
              focused={focused}
            />
          ),
        }}
      />
    </Tabs>
  );
};

export default Tablayout;
