import { Image, ScrollView, Text, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../constants";
import CustomButton from "../components/CustomButton";
import { StatusBar } from "expo-status-bar";
import { Redirect, router } from "expo-router";
// import { useGlobalContext } from "@/context/GlobalProvider";

const index = () => {
  // const { isLogged, loading } = useGlobalContext();
  // if (!loading && isLogged) return <Redirect href="/home" />;
  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView
        contentContainerStyle={{
          height: "100%",
        }}
      >
        <View className="w-full flex justify-center items-center h-full px-4">
          {/* <Image
            source={images.logo}
            className="w-[130px] h-[84px]"
            resizeMode="contain"
          /> */}
          <Text className="text-white font-psemibold text-3xl">
            Maya app
          </Text>

          <Image
            source={images.cards}
            className="max-w-[380px] w-full h-[298px]"
            resizeMode="contain"
          />
          <View className="mt-5 relative">
            <Text className="text-3xl text-white font-bold text-center">
              Discover Endless{"\n"}
              Possibilities with{" "}
              {/* textsecondary200 */}
              <Text className=" text-[#c877f4]">maya</Text>
            </Text>
            <Image
              source={images.path}
              className="w-[136px] opacity-70 h-[15px] absolute -bottom-2 -right-8"
              resizeMode="contain"
            />
          </View>
          <Text className="text-sm font-pregular text-gray-100 mt-7 text-center">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Est facilis qui maiores, tempora maxime ipsa sequi dolorem aut ratione vero?
          </Text>
          <CustomButton
            title="Continue"
            handlePress={() => router.push("/signin")}
            containerStyles="w-full mt-7"
          />
        </View>
      </ScrollView>
      <StatusBar backgroundColor="#161622" style="light" />
    </SafeAreaView>
  );
};

export default index;
