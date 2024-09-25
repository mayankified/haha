import {
  View,
  Text,
  Image,
  ScrollView,
  Dimensions,
  Alert,
  Button,
  Touchable,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import CustomButton from "../../components/CustomButton";
import FormField from "../../components/Formfield";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, router } from "expo-router";
import { images } from "../../constants";
import auth from "@react-native-firebase/auth";
import { addUserToFirestore } from "@/lib/FIrebaseAPIS";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

const signup = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [isSubmitting, setisSubmitting] = useState(false);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        "176416913590-qnnd34r8ao8vpsj5g5141f68c1d02pj6.apps.googleusercontent.com",
    });
    console.log("Google Signin Configured");
  }, []);

  async function onGoogleButtonPress() {
    // Check if your device supports Google Play
    await GoogleSignin.hasPlayServices();
    // Get the users ID token
    const response = await GoogleSignin.signIn();
    const idToken=response.data?.idToken;
    console.log("ID Token:", idToken);
    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken as string);
    // Sign-in the user with the credential
    // co auth().signInWithCredential(googleCredential);
    const userCredential = await auth().signInWithCredential(googleCredential);
    const user = userCredential.user;
    const { uid, email, displayName } = user;
    console.log("User signed in with Google:", user);
    if (uid && email && displayName) {
      await addUserToFirestore(uid, email, displayName, "user");
    } else {
      // Handle case where displayName might be null
      await addUserToFirestore(uid, email as string, "User", "user");
    }
  }

  const submit = async () => {
    if (form.username === "" || form.email === "" || form.password === "") {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    setisSubmitting(true);
    try {
      console.log(form);
      const result = await auth().createUserWithEmailAndPassword(
        form.email,
        form.password
      );
      if (auth().currentUser) {
        await auth().currentUser?.updateProfile({
          displayName: form.username,
        });
        await addUserToFirestore(
          auth().currentUser?.uid as any,
          form.email,
          form.username,
          "user"
        );
      }

      //set it to global state
      console.log("Sign up Success!!");
      console.log(result);

      router.push("/home");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setisSubmitting(false);
    }
  };
  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View
          className="w-full flex justify-center h-full px-4 my-6"
          style={{
            minHeight: Dimensions.get("window").height - 100,
          }}
        >
          {/* <Image
            source={images.logo}
            resizeMode="contain"
            className="w-[115px] h-[34px]"
          /> */}

          <Text className="text-secondary-100 font-psemibold text-center text-4xl">
            Maya
          </Text>

          <Text className="text-2xl font-semibold text-white mt-10 font-psemibold">
            Sign Up to Maya
          </Text>

          <View className="flex justify-end pt-5 flex-row gap-2">
           
            <TouchableOpacity
              className=" font-pmedium text-sm bg-secondary px-6 py-2 rounded-full text-white"
              onPress={() =>
                onGoogleButtonPress().then(() =>
                  console.log("Signed in with Google!")
                )
              }
            >
              <Text className="text-white font-psemibold">Use Google</Text>
            </TouchableOpacity>
          </View>

          <FormField
            placeholder="Enter your username"
            title="Username"
            value={form.username}
            handleChangeText={(e) => setForm({ ...form, username: e })}
            otherStyles="mt-10"
          />

          <FormField
            placeholder="Enter your email"
            title="Email"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles="mt-7"
            keyboardType="email-address"
          />

          <FormField
            placeholder="Enter your password"
            title="Password"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles="mt-7"
          />

          <CustomButton
            title="Sign Up"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />

          <View className="flex justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-pregular">
              Have an account already?
            </Text>
            <Link
              href="/signin"
              className="text-lg font-psemibold text-secondary"
            >
              Login
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default signup;
