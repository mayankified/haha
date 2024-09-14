import React, { useState } from "react";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  Alert,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import storage from "@react-native-firebase/storage";
import { Video } from "expo-av"; // Import Video for video preview
import { ResizeMode } from "expo-av"; // For video resizing modes
import { icons } from "../../constants";
import FormField from "@/components/Formfield";
import CustomButton from "@/components/CustomButton";
import { useGlobalContext } from "@/context/GlobalProvider";
import { getBlobFroUri } from "@/utils";
import axios from "axios";
import { uploadMedia } from "@/lib/FIrebaseAPIS";

// Define types for form state
type FormState = {
  title: string;
  image: { uri: string } | null; // Store image URI
  video: { uri: string } | null; // Video state
};

const Upload = () => {
  const { user } = useGlobalContext();
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState<FormState>({
    title: "",
    image: null,
    video: null, // Added video state
  });

  // Image picker function
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      // Store the image URI instead of embeddings
      setForm({
        ...form,
        image: { uri: result.assets[0].uri }, // Store the image URI
      });
    }
  };

  // Video picker function
  const openPicker = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos, // Choose videos
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) {
      setForm({
        ...form,
        video: { uri: result.assets[0].uri }, // Set video URI in form
      });
    }
  };

  const uploadImage = async () => {
    try {
      const imageUri = form.image?.uri; // Get the image URI from the form
      if (!imageUri) throw new Error("No image URI found");

      // Set the current step

      // Convert the image file URI to a Blob
      const blob = await getBlobFroUri(imageUri);

      // Extract the filename from the URI
      const filename = imageUri.substring(imageUri.lastIndexOf("/") + 1);
      const ref = storage().ref().child(filename);

      // Upload the Blob to Firebase Storage
      await ref.put(blob);

      // Get the download URL for the uploaded image
      const imgUrl = await ref.getDownloadURL();
      return imgUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error; // Re-throw the error for handling elsewhere
    }
  };

  const uploadVideo = async () => {
    try {
      const imageUri = form.video?.uri; // Get the video URI from the form
      if (!imageUri) throw new Error("No Video URI found");

      // Set the current step

      const blob = await getBlobFroUri(imageUri);
      const filename = imageUri.substring(imageUri.lastIndexOf("/") + 1);
      const ref = storage().ref().child(filename);

      await ref.put(blob);
      const imgUrl = await ref.getDownloadURL();
      return imgUrl;
    } catch (error) {
      console.error("Error uploading video:", error);
      throw error;
    }
  };

  const uploadtoVectorDB = async (img: string, video: string) => {
    try {
      // Set the current step

      const result = await axios.post(
        "http://192.168.183.56:3000/upload", // Replace with your actual server URL
        {
          imageUrl: img,
          text: video,
        }
      );
      console.log("Upload successful:", result.data);
    } catch (error: any) {
      console.error("Error uploading to vector DB:", error.message);
    }
  };

  const submit = async () => {
    if (!form.title || !form.image || !form.video) {
      return Alert.alert("Please provide all fields");
    }
    setUploading(true);

    try {
      const imageURL = await uploadImage();
      const videoURL = await uploadVideo();

      await uploadtoVectorDB(imageURL, videoURL);
      await uploadMedia(imageURL, videoURL, form.title);
      Alert.alert("Success", "Post uploaded successfully");
      router.push("/home");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setForm({
        title: "",
        image: null,
        video: null,
      });
      setUploading(false);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView className="px-4 my-6">
        <Text className="text-2xl text-white font-psemibold">Upload Media</Text>

        {/* Form field for media title */}
        <FormField
          title="Media Title"
          value={form.title}
          placeholder="Give your media a catchy title..."
          handleChangeText={(e) => setForm({ ...form, title: e })}
          otherStyles="mt-10"
        />

        {/* Image Upload */}
        <View className="mt-7 space-y-2">
          <Text className="text-base text-gray-100 font-pmedium">
            Upload Image
          </Text>

          <TouchableOpacity onPress={pickImage}>
            {form.image ? (
              <Image
                source={{ uri: form.image.uri }}
                resizeMode="cover"
                className="w-full h-64 rounded-2xl"
              />
            ) : (
              <View className="w-full h-40 px-4 bg-black-100 rounded-2xl border border-black-200 flex justify-center items-center">
                <View className="w-14 h-14 border border-dashed border-[#b36dd9] flex justify-center items-center">
                  <Image
                    source={icons.upload}
                    resizeMode="contain"
                    alt="upload"
                    className="w-1/2 h-1/2"
                  />
                </View>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Video Upload Section */}
        <Text className="text-2xl text-white font-psemibold mt-8">
          Upload Video
        </Text>
        <View className="mt-7 space-y-2">
          <TouchableOpacity onPress={openPicker}>
            {form.video ? (
              <Video
                source={{ uri: form.video.uri }}
                className="w-full h-64 rounded-2xl"
                useNativeControls
                resizeMode={ResizeMode.COVER}
                isLooping
              />
            ) : (
              <View className="w-full h-40 px-4 bg-black-100 rounded-2xl border border-black-200 flex justify-center items-center">
                <View className="w-14 h-14 border border-dashed border-[#b36dd9] flex justify-center items-center">
                  <Image
                    source={icons.upload}
                    resizeMode="contain"
                    alt="upload"
                    className="w-1/2 h-1/2"
                  />
                </View>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Submit Button */}
        <CustomButton
          title={!uploading ? "Submit & Publish" : "Uploading"}
          handlePress={submit}
          containerStyles="mt-7"
          isLoading={uploading}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Upload;
