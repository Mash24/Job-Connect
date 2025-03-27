import React, { useEffect } from 'react';
import { auth, db } from "../firebase/config"
import { onAuthStateChanged } from "firebase/auth";



const FirebaseTest = () => {
    useEffect(() => {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          console.log("Logged in user:", user.email);
        } else {
          console.log("No user logged in");
      }
    });

    try {
      console.log("Firebase DB connected:", db);
    } catch (error) {
      console.error("Error connecting to Firebase DB:", error);
    }
  }, []);


    return (
      <div className="p-4 bg-green-100 rounded text-green-900">
        <h2 className="text-xl font-bold">Firebase Test</h2>
        <p>Check the console for firebase connection status.</p>
      </div>
    );
};

export default FirebaseTest