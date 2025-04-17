import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  setPersistence,
  browserLocalPersistence,
} from "@firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

// ✅ Your Firebase Project Configuration
const firebaseConfig = {
  apiKey: "AIzaSyBRcFezpZSQ6WmJp8iOxa88kv_InY-96xQ",
  authDomain: "job-connect-d56e9.firebaseapp.com",
  projectId: "job-connect-d56e9",
  storageBucket: "job-connect-d56e9.firebasestorage.app",
  messagingSenderId: "127293465155",
  appId: "1:127293465155:web:435ed4b474869e42acaaf6",
  measurementId: "G-8KTWMVTRHP",
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore();
const storage = getStorage();
const analytics = getAnalytics(app);
const googleProvider = new GoogleAuthProvider();

// ✅ Set local persistence to keep users logged in on refresh
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log("✅ Firebase Auth persistence set to LOCAL.");
  })
  .catch((error) => {
    console.error("❌ Failed to set auth persistence:", error);
  });

export { auth, db, storage, googleProvider, analytics };
