import { View, Text, Image, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { ResizeMode, Video } from "expo-av";
import { Link, useLocalSearchParams } from "expo-router";
import { getMediaById } from "@/lib/FIrebaseAPIS"; // Assume this function fetches media by ID
import EmptyState from "@/components/EmptyState";
import { SafeAreaView } from "react-native-safe-area-context";
import { icons } from "@/constants";

interface Media {
  id: string;
  imageUrl: string;
  videoUrl: string; // Assuming the video URL is also part of the media data
  title: string;

}

const Mediapost = () => {
  const { id } = useLocalSearchParams();
  const [media, setMedia] = useState<Media | null>(null);

  useEffect(() => {
    const fetchMedia = async () => {
      if (id) {
        try {
          const fetchedMedia = await getMediaById(id as string);
          setMedia(fetchedMedia as any);
          console.log("Media:", fetchedMedia);
        } catch (error) {
          console.error("Error fetching media:", error);
        }
      }
    };
    fetchMedia();
  }, [id]);

  if (!media) {
    return (
      <SafeAreaView className="bg-primary h-full flex justify-center items-center">
        <EmptyState
          title="Media Not Found"
          subtitle="No media found for this ID."
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex flex-col items-center p-4">
          {/* <View className="flex flex-row gap-3 items-start mb-6"> */}

          <View className="flex-1 gap-3 mb-2">
            <Text className="text-white  capitalize text-center text-3xl font-bold">
              {media.title}
            </Text>
            {/* </View> */}
          </View>

          <View className="w-full border-[2px] border-solid border-secondary-100 rounded-xl overflow-hidden mb-4">
            <Image
              source={{ uri: media.imageUrl }}
              className="w-full h-60"
              resizeMode="cover"
            />
          </View>

          <View className="w-full border-[2px] border-solid border-[#936ba6] rounded-xl overflow-hidden mb-4">
            <Video
              source={{ uri: media.videoUrl }} // Ensure videoUrl is provided
              className="w-full h-60"
              useNativeControls
              resizeMode={ResizeMode.COVER}
              shouldPlay
            />
          </View>
          <Link
            href={"/home"}
            className=" font-pmedium text-sm bg-secondary px-3 py-2 rounded-full text-white"
          >
            <Text className="text-white"> Go Home</Text>
          </Link>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Mediapost;
