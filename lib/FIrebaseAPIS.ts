// import { v4 as sexy } from "uuid";
import { base64ToBlob, getBlobFroUri } from "../utils";
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
export const uploadImageWithTitle = async (
  imageUrl: string,
  title: string,
  userId: string // userId instead of user
) => {
  try {
    // Generate a new document reference and its ID
    const mediaRef = firestore().collection("media").doc();
    const documentId = mediaRef.id; // Get the generated document ID

    // Create a reference to the user document
    const userRef = firestore().collection("users").doc(userId);

    // Set the document data in Firestore with image URL, title, and ID
    await mediaRef.set({
      id: documentId, // Add the generated ID to the document data
      title: title,
      imageUrl: imageUrl,
      videoUrl: null, // Initial value
      updatedByAdmin: false, // Initial value
      createdAt: firestore.FieldValue.serverTimestamp(),
      user: userRef, // Save the reference to the user document
    });

    console.log("Image uploaded successfully with title:", title);
    return documentId; // Return the document ID
  } catch (error) {
    console.error("Error saving image and title to Firestore:", error);
    throw error; // Re-throw the error for handling elsewhere if needed
  }
};

export const updateMediaWithVideoUrl = async (
  mediaId: string, // The ID of the media document to update
  videoUrl: string // New video URL to be set
) => {
  try {
    // Reference to the specific media document by its ID
    const mediaRef = firestore().collection("media").doc(mediaId);

    // Update the document data in Firestore with the new video URL, updated title, and set updatedByAdmin to true
    await mediaRef.update({
      videoUrl: videoUrl, // Set the new video URL
      updatedByAdmin: true, // Mark as updated by admin
    });

    console.log("Media updated successfully with video URL:", videoUrl);
  } catch (error) {
    console.error("Error updating media with video URL:", error);
    throw error; // Re-throw the error for handling elsewhere if needed
  }
};
export const getUnupdatedMedia = async () => {
  try {
    const mediaRef = firestore().collection("media");
    const querySnap = await mediaRef.where("updatedByAdmin", "==", false).get();

    // Fetch user data for each media document
    const postsWithUserData = await Promise.all(
      querySnap.docs.map(async (doc) => {
        const mediaData = doc.data();
        const userRef = mediaData.user;

        // Fetch user data using the reference
        let userData = null;
        if (userRef) {
          const userDoc = await userRef.get();
          userData = userDoc.data();
        }

        return {
          id: doc.id,
          ...mediaData,
          user: userData, // Combine media data with user data
        };
      })
    );

    return postsWithUserData;
  } catch (error) {
    console.error("Error getting unupdated media:", error);
    return [];
  }
};
export const getUpdatedMedia = async () => {
  try {
    const mediaRef = firestore().collection("media");
    const querySnap = await mediaRef.where("updatedByAdmin", "==", true).get();

    // Fetch user data for each media document
    const postsWithUserData = await Promise.all(
      querySnap.docs.map(async (doc) => {
        const mediaData = doc.data();
        const userRef = mediaData.user;

        // Fetch user data using the reference
        let userData = null;
        if (userRef) {
          const userDoc = await userRef.get();
          userData = userDoc.data();
        }

        return {
          id: doc.id,
          ...mediaData,
          user: userData, // Combine media data with user data
        };
      })
    );

    return postsWithUserData;
  } catch (error) {
    console.error("Error getting unupdated media:", error);
    return [];
  }
};
export const getPostsByUser = async (uid: string) => {
  try {
    // Reference to the user document using the uid
    const userRef = firestore().collection("users").doc(uid);

    // Query the media collection where the user field matches the userRef
    const mediaRef = firestore().collection("media");
    const querySnap = await mediaRef.where("user", "==", userRef).get();

    // Fetch media data
    const postsWithUserData = await Promise.all(
      querySnap.docs.map(async (doc) => {
        const mediaData = doc.data();
        // Fetch user data (optional, if needed for some reason)
        const userDoc = await userRef.get();
        const userData = userDoc.data();

        return {
          id: doc.id,
          ...mediaData,
          user: userData, // Combine media data with user data
        };
      })
    );

    return postsWithUserData;
  } catch (error) {
    console.error("Error getting posts by user:", error);
    return [];
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
    let userData = null;
    if (mediaData && mediaData.user) {
      const userRef = mediaData.user;
      const userDoc = await userRef.get();
      userData = userDoc.data();
    }

    // Return the media data combined with the user data
    return {
      id: mediaDoc.id,
      ...mediaData,
      user: userData,
    };
  } catch (error) {
    console.error("Error getting media by ID:", error);
    return null;
  }
};

export const getCountOfPostsByUser = async (uid: string) => {
  try {
    // Reference to the user document using the uid
    const userRef = firestore().collection("users").doc(uid);

    // Query the media collection where the user field matches the userRef
    const mediaRef = firestore().collection("media");
    const querySnap = await mediaRef.where("user", "==", userRef).get();

    // Return the count of documents
    return querySnap.size;
  } catch (error) {
    console.error("Error getting count of posts by user:", error);
    return 0;
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


// export const uploadImageWithTitle = async (imageUrl: string, title: string) => {
//   try {
//     await firestore().collection("media").add({
//       title: title,
//       imageUrl: imageUrl,
//       createdAt: firestore.FieldValue.serverTimestamp(),
//     });
//     console.log('Image URL and title saved successfully:', imageUrl);

//   } catch (error) {
//     console.error("Error uploading image:", error);
//   }
// };

// export const uploadImageWithTitle = async (imageFile, title) => {
//   try {
//     // const name = sexy();
//     const imgBlob = await getBlobFroUri(imageFile);
//     console.log({ imageFile });
//     const storageRef = ref(FIREBASE_STORAGE, `images/shreya.jpg`);
//     const snapshot = await uploadBytes(storageRef, imgBlob);
//     const imageUrl = await getDownloadURL(storageRef);
//     console.log(imageUrl)
//     const mediaRef = doc(FIREBASE_STORE, "media", snapshot.metadata.name); // Using file name as document ID
//     await setDoc(mediaRef, {
//       title,
//       imageUrl,
//       videoUrl: null, // Initial value
//       updatedByAdmin: false, // Initial value
//     });

//     console.log("Image uploaded successfully with title:", title);
//   } catch (error) {
//     console.error("Error uploading image:", error);
//   }
// };

// export const uploadVideoForImage = async (imageId, videoFile) => {
//   try {
//     // const name = sexy();
//     const storageRef = ref(FIREBASE_STORAGE, `videos/${videoFile.name}`);
//     const snapshot = await uploadBytes(storageRef, videoFile);
//     const videoUrl = await getDownloadURL(storageRef);

//     const mediaRef = doc(FIREBASE_STORE, "media", imageId);
//     await updateDoc(mediaRef, {
//       videoUrl,
//       updatedByAdmin: true,
//     });

//     console.log("Video uploaded successfully for image ID:", imageId);
//   } catch (error) {
//     console.error("Error uploading video:", error);
//   }
// };

// export const getUpdatedMedia = async () => {
//   try {
//     const mediaRef = collection(FIREBASE_STORE, "media");
//     const q = query(mediaRef, where("updatedByAdmin", "==", true));
//     const querySnapshot = await getDocs(q);

//     const updatedMedia = querySnapshot.docs.map((doc) => ({
//       id: doc.id,
//       ...doc.data(),
//     }));

//     console.log("Updated media:", updatedMedia);
//     return updatedMedia;
//   } catch (error) {
//     console.error("Error getting updated media:", error);
//     return [];
//   }
// };

// export const getUnupdatedMedia = async () => {
//   try {
//     const mediaRef = collection(FIREBASE_STORE, "media");
//     const q = query(mediaRef, where("updatedByAdmin", "==", false));
//     const querySnapshot = await getDocs(q);

//     const unupdatedMedia = querySnapshot.docs.map((doc) => ({
//       id: doc.id,
//       ...doc.data(),
//     }));

//     console.log("Unupdated media:", unupdatedMedia);
//     return unupdatedMedia;
//   } catch (error) {
//     console.error("Error getting unupdated media:", error);
//     return [];
//   }
// };
