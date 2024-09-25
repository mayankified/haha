// import { v4 as sexy } from "uuid";
// import { base64ToBlob, getBlobFroUri } from "../utils";
import firestore from "@react-native-firebase/firestore";
import storage from "@react-native-firebase/storage";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { Alert } from "react-native";

export const addUserToFirestore = async (
  uid: string,
  email: string,
  username: string,
  role: string
) => {
  try {
    console.log({ uid, email, username, role });
    const userRef = firestore().collection("users").doc(uid); // Reference to the user document
    // await setDoc(userRef, { email, username, role });
    await userRef.set({ uid, email, username, role }); // Add user data to Firestore
    console.log("User added to Firestore with role:", role);
  } catch (error) {
    console.error("Error adding user to Firestore:", error);
  }
};
export const addUserWithPhoneToFirestore = async (
  uid: string,
  phoneNumber: string,
  username: string,
  role: string
) => {
  try {
    const userRef = firestore().collection("users").doc(uid); // Reference to the user document

    await userRef.set({
      phoneNumber,
      username,
      role,
    }); // Add user data to Firestore

    console.log(
      "User added to Firestore with username and role:",
      username,
      role
    );
  } catch (error) {
    console.error("Error adding user to Firestore:", error);
  }
};
export const uploadMedia = async (
  imageUrl: string,
  videoUrl:string,
  title: string,
) => {
  try {
    // Generate a new document reference and its ID
    const mediaRef = firestore().collection("media").doc();
    const documentId = mediaRef.id; // Get the generated document ID

    // Create a reference to the user document

    // Set the document data in Firestore with image URL, title, and ID
    await mediaRef.set({
      id: documentId, // Add the generated ID to the document data
      title: title,
      imageUrl: imageUrl,
      videoUrl: videoUrl, 
      createdAt: firestore.FieldValue.serverTimestamp(),
    });

    console.log("Media uploaded successfully with title:", title);
    return documentId; // Return the document ID
  } catch (error) {
    console.error("Error saving image and title to Firestore:", error);
    throw error; // Re-throw the error for handling elsewhere if needed
  }
};


export const getUpdatedMedia = async () => {
  try {
    const mediaRef = firestore().collection("media");
    const querySnap = await mediaRef.get();

    // Map over documents and extract data
    const mediaList = querySnap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return mediaList;
  } catch (error) {
    console.error("Error getting media:", error);
    return [];
  }
};


export const getCountOfAllMedia = async () => {
  try {
    const mediaRef = firestore().collection("media");
    const querySnap = await mediaRef.get();

    // Return the count of documents
    return querySnap.size;
  } catch (error) {
    console.error("Error getting count of all media:", error);
    return 0;
  }
};
export const getCountOfUpdatedMedia = async () => {
  try {
    const mediaRef = firestore().collection("media");
    const querySnap = await mediaRef.where("updatedByAdmin", "==", true).get();

    // Return the count of documents
    return querySnap.size;
  } catch (error) {
    console.error("Error getting count of updated media:", error);
    return 0;
  }
};

export const getCountOfAllUsers = async () => {
  try {
    const usersRef = firestore().collection("users");
    const querySnap = await usersRef.get();

    // Return the count of documents
    return querySnap.size;
  } catch (error) {
    console.error("Error getting count of all users:", error);
    return 0;
  }
};

export const getCountOfUpdatedPostsByUser = async (uid: string) => {
  try {
    // Reference to the user document using the uid
    const userRef = firestore().collection("users").doc(uid);

    // Query the media collection where the user field matches the userRef and updatedByAdmin is true
    const mediaRef = firestore().collection("media");
    const querySnap = await mediaRef
      .where("user", "==", userRef)
      .where("updatedByAdmin", "==", true)
      .get();

    // Return the count of documents
    return querySnap.size;
  } catch (error) {
    console.error("Error getting count of updated posts by user:", error);
    return 0;
  }
};
export const getMediaById = async (mediaId: string) => {
  try {
    // Reference to the media document using the mediaId
    const mediaRef = firestore().collection("media").doc(mediaId);

    // Fetch the media document
    const mediaDoc = await mediaRef.get();

    if (!mediaDoc.exists) {
      Alert.alert(`No media found with id: ${mediaId}`);
      return null;
    }

    // Get media data
    const mediaData = mediaDoc.data();

    // If the media document includes a user reference, fetch the user data
    

    // Return the media data combined with the user data
    return {
      id: mediaDoc.id,
      ...mediaData
    };
  } catch (error) {
    console.error("Error getting media by ID:", error);
    return null;
  }
};