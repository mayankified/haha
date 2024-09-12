import { useState } from "react";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  Alert,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { icons } from "../../constants";
import FormField from "@/components/Formfield";
import CustomButton from "@/components/CustomButton";
import { uploadImageWithTitle } from "@/lib/FIrebaseAPIS";
import * as FileSystem from "expo-file-system";
import { getBlobFroUri } from "@/utils";
import storage from "@react-native-firebase/storage";
import { useGlobalContext } from "@/context/GlobalProvider";
// Define types for form state and document picker result
type FormState = {
  title: string;
  image: { uri: string } | null; // Simplified type for image with a URI
};

const Upload = () => {
  const {user}=useGlobalContext();
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState<FormState>({
    title: "",
    image: null,
  });

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setForm({
        ...form,
        image: { uri: result.assets[0].uri },
      });
    }
  };

  const uploadImage = async () => {
    try {
  
      const imageUri = form.image?.uri; // Get the image URI from the form
      if (!imageUri) throw new Error("No image URI found");
  
      // Convert the image file URI to a Blob
      const blob = await getBlobFroUri(imageUri);
  
      // Extract the filename from the URI
      const filename = imageUri.substring(imageUri.lastIndexOf("/") + 1);
      const ref = storage().ref().child(filename);
  
      // Upload the Blob to Firebase Storage
      await ref.put(blob);
  
      // Get the download URL for the uploaded image
      const imgUrl = await ref.getDownloadURL();
      console.log("Image URL:", imgUrl);
      return imgUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error; // Re-throw the error for handling elsewhere
    }
  };
  const submit = async () => {
    if (!form.title || !form.image) {
      return Alert.alert("Please provide all fields");
    }
    console.log(form);
    setUploading(true);
    try {
    const url=  await uploadImage();
      await uploadImageWithTitle(url as string, form.title,user.uid)
      Alert.alert("Success", "Post uploaded successfully");
      router.push("/home");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setForm({
        title: "",
        image: null,
      });
      setUploading(false);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView className="px-4 my-6">
        <Text className="text-2xl text-white font-psemibold">Upload Image</Text>

        <FormField
          title="Image Title"
          value={form.title}
          placeholder="Give your image a catchy title..."
          handleChangeText={(e) => setForm({ ...form, title: e })}
          otherStyles="mt-10"
        />

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

        <CustomButton
          title="Submit & Publish"
          handlePress={submit}
          containerStyles="mt-7"
          isLoading={uploading}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Upload;
