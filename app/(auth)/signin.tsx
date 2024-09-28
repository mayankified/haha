import { useEffect, useState } from "react";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  Alert,
  TouchableOpacity,
} from "react-native";

import FormField from "@/components/Formfield";
import CustomButton from "@/components/CustomButton";
import auth from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

const SignIn = () => {
  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        "209138330850-m7ot0cl0ubos6ff0t0ker0rg5b98g258.apps.googleusercontent.com",
    });
  }, []);
  async function onGoogleButtonPress() {
    // Check if your device supports Google Play
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    // Get the users ID token
    const response = await GoogleSignin.signIn();
    const idToken = response.data?.idToken;
    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(
      idToken as string
    );
    // Sign-in the user with the credential
    // co auth().signInWithCredential(googleCredential);
    const userCredential = await auth().signInWithCredential(googleCredential);
  }

  const submit = async () => {
    if (form.email === "" || form.password === "") {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setSubmitting(true);

    try {
      // await signin(form.email, form.password);
      const result = await auth().signInWithEmailAndPassword(
        form.email,
        form.password
      );

      

      Alert.alert("Success", "User signed in successfully");
      router.replace("/home");
    } catch (error: any) {
      console.log("Error", error.message);
      Alert.alert("Error", error.message);
    } finally {
      setSubmitting(false);
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
            Augmenta
          </Text>

          <Text className="text-2xl font-semibold text-white mt-10 font-psemibold">
            Log in to Augmenta
          </Text>
          <View className="flex justify-end pt-5 flex-row gap-2">
            <TouchableOpacity
              className=" font-pmedium text-sm bg-secondary px-6 py-2 rounded-full text-white"
              onPress={() =>
                onGoogleButtonPress()
              }
            >
              <Text className="text-white font-psemibold">Use Google</Text>
            </TouchableOpacity>
          </View>

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
            title="Sign In"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />

          <View className="flex justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-pregular">
              Don't have an account?
            </Text>
            <Link
              href="/signup"
              className="text-lg font-psemibold text-secondary"
            >
              Signup
            </Link>
          </View>
          
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;
