// Import the functions you need from the SDKs
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";          
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBoSOhzQ11iOS4iDL9v5-Ha2kevqRvD_qw",
  authDomain: "cv-generator-auth-5bbcf.firebaseapp.com",
  projectId: "cv-generator-auth-5bbcf",
  storageBucket: "cv-generator-auth-5bbcf.firebasestorage.app",
  messagingSenderId: "912501814942",
  appId: "1:912501814942:web:fb216d027c8d99a6e7ad8f",
  measurementId: "G-C47WM045TH",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);



