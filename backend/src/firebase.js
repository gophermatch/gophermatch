// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAZAnevR2XNZzx9d9-wfMiE9Vxaf7HD5ME",
  authDomain: "gophermatch-umn.firebaseapp.com",
  projectId: "gophermatch-umn",
  storageBucket: "gophermatch-umn.appspot.com",
  messagingSenderId: "1013893959576",
  appId: "1:1013893959576:web:074b9a335131c4843f25ed",
  measurementId: "G-6E0P1B0699"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
