// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getStorage} from "firebase/storage"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBO65lAGIfM9BGPdeAYu5sfZ3qBr-8Vybw",
  authDomain: "upload-file-b92d3.firebaseapp.com",
  projectId: "upload-file-b92d3",
  storageBucket: "upload-file-b92d3.appspot.com",
  messagingSenderId: "396758804070",
  appId: "1:396758804070:web:5a48f2d03f4b65711e2fa7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);