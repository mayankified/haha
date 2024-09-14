import React, { useState, useRef } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import { CameraView, CameraType } from "expo-camera";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { icons } from "@/constants";
import { ResizeMode, Video } from "expo-av"; // Import the Video component for video playback
import axios from "axios";
const Scanner = () => {
  const [facing, setFacing] = useState<CameraType>("back"); // Use CameraType for toggling
  const [isProcessing, setIsProcessing] = useState(false); // Loading state for image processing
  const [videoUrl, setVideoUrl] = useState(""); // State to store the video URL
  const cameraRef = useRef(null);
  const videoRef = useRef(null); // Ref for Video component

  const handleCapture = async () => {
    if (cameraRef.current) {
      try {
        const options = { quality: 0.5 };
        // @ts-ignore
        const data = await cameraRef.current.takePictureAsync(options);
        setIsProcessing(true);

        // Create a new FormData object
        const formData = new FormData();

        // Append the image to FormData with the required properties
        formData.append("image", {
          uri: data.uri, // The local URI of the image
          name: "photo.jpg", // The name of the file
          type: "image/jpeg", // The MIME type of the file
        } as any);
        // Send the formData object using axios
        const response = await axios.post(
          "http://192.168.183.56:3000/query",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        const url = response.data.result.text;
        if (!url)
          Alert.alert("Corresponding Image not found!, Please Try again");

        setIsProcessing(false);
        setVideoUrl(response.data.result.text);
      } catch (error) {
        console.log("Error:", error);
      }
    }
  };

  const toggleCameraFacing = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  return (
    <SafeAreaView className="flex-1 bg-primary">
      {/* If video URL is present, show the video instead of the camera */}
      {videoUrl ? (
        <Video
          ref={videoRef}
          source={{ uri: videoUrl }} // Video source URL
          style={{ flex: 1 }}
          // @ts-ignore
          resizeMode={ResizeMode.CONTAIN}
          shouldPlay
          isLooping
        />
      ) : (
        <CameraView style={{ flex: 1 }} facing={facing} ref={cameraRef} />
      )}

      {/* Bottom Button Bar */}
      <View className="flex-row justify-between items-center px-4 py-2 bg-black">
        {/* Toggle Camera Button (Only visible when camera is active) */}
        {!videoUrl && (
          <TouchableOpacity
            onPress={toggleCameraFacing}
            className="bg-secondary p-2 rounded-full"
          >
            <Text className="text-white px-4 text-lg">Flip</Text>
          </TouchableOpacity>
        )}

        {/* Capture Photo Button (Only visible when camera is active) */}
        {!videoUrl && (
          <TouchableOpacity
            onPress={handleCapture}
            activeOpacity={0.8}
            className="bg-secondary w-16 h-16 rounded-full justify-center items-center shadow-lg"
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
              className="w-8 h-8 m-4"
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}

        {/* Close Button */}
        <TouchableOpacity
          onPress={() =>
            // router.push("/home")
            videoUrl ? setVideoUrl("") : router.push("/home")
          }
          className="bg-gray-700 p-2 rounded-full"
        >
          <Text className="text-white px-4 text-lg">Close</Text>
        </TouchableOpacity>
      </View>

      {/* Show loader if image is being processed */}
      {isProcessing && (
        <View className="absolute left-[40%] top-[50%] justify-center items-center">
          <ActivityIndicator size="large" color="#00ff00" />
          <Text className="text-white mt-2">Processing...</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default Scanner;
