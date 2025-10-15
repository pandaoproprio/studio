// src/lib/firebase.ts
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBnNpg3SGf-lasm1dzX0NH8nSG1ylehmUc",
  authDomain: "studio-2770845557-a7da9.firebaseapp.com",
  projectId: "studio-2770845557-a7da9",
  storageBucket: "studio-2770845557-a7da9.firebasestorage.app",
  messagingSenderId: "532352991807",
  appId: "1:532352991807:web:93e75bf1ebe176ec70ae8a"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
