// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBSvJxibqBYjvV_Srvv08xjERwcz7m3cXM",
  authDomain: "project3-2b5f4.firebaseapp.com",
  databaseURL: "https://project3-2b5f4-default-rtdb.firebaseio.com",
  projectId: "project3-2b5f4",
  storageBucket: "project3-2b5f4.firebasestorage.app",
  messagingSenderId: "801776107650",
  appId: "1:801776107650:web:98f47305624b2c2e59b49b",
  measurementId: "G-RRHLSTKLE8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
