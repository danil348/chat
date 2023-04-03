// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage, ref } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCjYV3nS1aRHxUWAxeyaWawYjoXvhHes1c",
  authDomain: "chat-e74a5.firebaseapp.com",
  projectId: "chat-e74a5",
  storageBucket: "chat-e74a5.appspot.com",
  messagingSenderId: "396712617764",
  appId: "1:396712617764:web:421864a9e5353a334df5b1"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth()
export const storage = getStorage()
export const db = getFirestore()