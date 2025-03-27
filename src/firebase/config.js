import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "@firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBRcFezpZSQ6WmJp8iOxa88kv_InY-96xQ",
  authDomain: "job-connect-d56e9.firebaseapp.com",
  projectId: "job-connect-d56e9",
  storageBucket: "job-connect-d56e9.firebasestorage.app",
  messagingSenderId: "127293465155",
  appId: "1:127293465155:web:435ed4b474869e42acaaf6",
  measurementId: "G-8KTWMVTRHP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore();
const storage = getStorage();
const analytics = getAnalytics(app);
const googleProvider = new GoogleAuthProvider();

export {auth,db,storage, googleProvider, analytics};