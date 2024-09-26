import { View, Text, Image, ScrollView, Alert, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { ResizeMode, Video } from "expo-av";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { getMediaById, deleteMedia } from "@/lib/FIrebaseAPIS"; // Assume deleteMedia is available in FirebaseAPIS
import EmptyState from "@/components/EmptyState";
import { SafeAreaView } from "react-native-safe-area-context";
import { icons } from "@/constants";

interface Media {
  id: string;
  imageUrl: string;
  videoUrl: string;
  title: string;
}

const Mediapost = () => {
  const { id } = useLocalSearchParams();
  const [media, setMedia] = useState<Media | null>(null);
  const router = useRouter(); // Hook to navigate programmatically

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

  // Function to handle media deletion
  const handleDelete = async () => {
    if (!media || !media.id) return;

    // Confirm deletion with the user
    Alert.alert(
      "Delete Media",
      "Are you sure you want to delete this media?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteMedia(media.id); // Call the deleteMedia function
              Alert.alert("Media Deleted", "The media has been deleted successfully.");
              router.push("/home"); // Navigate back to the home screen after deletion
            } catch (error) {
              console.error("Error deleting media:", error);
              Alert.alert("Error", "An error occurred while trying to delete the media.");
            }
          },
        },
      ]
    );
  };

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
          <View className="flex-1 gap-3 mb-2">
            <Text className="text-white capitalize text-center text-3xl font-bold">
              {media.title}
            </Text>
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
            className="font-pmedium text-sm bg-secondary px-3 py-2 rounded-full text-white"
          >
            <Text className="text-white">Go Home</Text>
          </Link>

          {/* Delete Button */}
          <TouchableOpacity
            onPress={handleDelete}
            className="mt-4 bg-red-600 px-4 py-2 rounded-full"
          >
            <Text className="text-white text-sm">Delete Media</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Mediapost;
