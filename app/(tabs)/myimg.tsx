import {
  View,
  Text,
  FlatList,
  RefreshControl,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import SearchInput from "@/components/SearchInput";
import EmptyState from "@/components/EmptyState";
import ImageCard from "@/components/Imagecard";
import { useGlobalContext } from "@/context/GlobalProvider";
import { getMediaById, getPostsByUser, getUnupdatedMedia, getUpdatedMedia } from "@/lib/FIrebaseAPIS";
import { icons } from "@/constants";

// Define the types for the post and its related properties
interface Post {
  id: string;  // Updated to match the structure of getUnupdatedMedia
  imageUrl: string;
  title: string;
  user: {
    username: string;
    avatar: string;
  };
}

const MyImg = () => {
  const { user } = useGlobalContext();
  const [posts, setPosts] = useState<Post[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  console.log("user", user);
  // Fetch unupdated media from Firestore
  const fetchPosts = async () => {
    try {
      const unupdatedMedia = await getPostsByUser(user.uid as string);
      setPosts(unupdatedMedia as any);  // Set the fetched media to state
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  // useEffect to fetch posts on component mount
  useEffect(() => {
    fetchPosts();
  }, []);

  // Refresh handler to refetch posts
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPosts();  // Fetch posts again when refreshing
    setRefreshing(false);
  };

  // Render the ImageCard for each post item
  const renderItem = ({ item }: { item: Post }) => (
    <ImageCard
    route={`/media/${item.id}`}
      image={item.imageUrl}
      title={item.title}
      creator={item.user?.username}
      avatar={item.user?item.user.avatar:icons.avatar}
    />
  );

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListHeaderComponent={() => (
          <View className="flex my-6 px-4 space-y-6">
            <View className="flex justify-between items-start flex-row mb-6">
              <View>
                <Text className="font-pmedium text-sm text-gray-100">
                  Welcome Back
                </Text>
                <Text className="text-2xl font-psemibold text-white">
                  {user?.username}
                </Text>
              </View>
              <View className="mt-1.5">
                {/* <Image
                  source={images.logoSmall}
                  className="w-9 h-10"
                  resizeMode="contain"
                /> */}
              </View>
            </View>
            <SearchInput />
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState title="No Media Found" subtitle="No Image uploaded yet" />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
};

export default MyImg;
