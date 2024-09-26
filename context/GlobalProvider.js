import auth, { onAuthStateChanged } from "@react-native-firebase/auth";
import React, { createContext, useContext, useEffect, useState } from "react";
import firestore from "@react-native-firebase/firestore";
// import { onAuthStateChanged } from "firebase/auth";
// import { FIREBASE_AUTH, FIREBASE_STORE } from "@/lib/FirebaseConfig";
// import { doc, getDoc } from "firebase/firestore";

// Define the structure of the user object
const defaultUser = {
  uid: null,
  email: null,
  username: null,
  role: null,
  isAuth: null,
};

// Create a context for global state
const GlobalContext = createContext();

export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
  const [user, setUser] = useState(defaultUser); // Use default user structure
  const [isLogged, setIsLogged] = useState(false);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(async (usr) => {
      if (usr) {
        try {
          // const userDocref = doc(FIREBASE_STORE, "users", usr.uid);
          const userDocref = firestore().collection("users").doc(usr.uid);
          const userDoc = await userDocref.get();
          if (userDoc.exists) {
            const userData = userDoc.data();
            console.log("userData", userData);
            console.log("usr", usr);
            // Map user details from Firebase user object
            const mappedUser = {
              uid: userData.uid, // Firebase User ID
              email: userData.email,
              isAuth: userData.isAuth,
              username: userData.displayName || "Anonymous", // Use Firebase displayName or a default value
              role: userData.role || "user", // Use role from Firestore or default to 'user'
            };
            setUser(mappedUser);
          } else {
            console.log("No user found");
            setUser(defaultUser);
          }
          setIsLogged(true);
        } catch (error) {
          console.error(error);
          setUser(defaultUser);
        } finally {
          setLoading(false); // Set loading to false after data fetching
        }
      } else {
        setUser(defaultUser);
        setIsLogged(false);
        setLoading(false); // Set loading to false when there is no user
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);
  console.log("user", user);
  return (
    <GlobalContext.Provider
      value={{ user, setUser, isLogged, setIsLogged, loading }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
