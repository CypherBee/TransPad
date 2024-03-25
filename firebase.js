// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD9pjkOlC-kiOaCOupzRKxCbh7sDnr8VDs",
  authDomain: "transpad-7f889.firebaseapp.com",
  projectId: "transpad-7f889",
  storageBucket: "transpad-7f889.appspot.com",
  messagingSenderId: "55452122264",
  appId: "1:55452122264:web:462af5d36912cf6e4ce4ed",
  measurementId: "G-8CR61W7FX7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app)
export  {app,db};

