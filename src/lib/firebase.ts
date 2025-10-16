
// src/lib/firebase.ts
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, initializeFirestore, enableIndexedDbPersistence, CACHE_SIZE_UNLIMITED, type Firestore } from 'firebase/firestore';

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
const app: FirebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth: Auth = getAuth(app);

// Initialize Firestore with persistence
const db: Firestore = initializeFirestore(app, {
  cacheSizeBytes: CACHE_SIZE_UNLIMITED,
});

const persistencePromise = enableIndexedDbPersistence(db)
  .catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn("Multiple tabs open, persistence can only be enabled in one tab at a time.");
    } else if (err.code === 'unimplemented') {
      console.warn("The current browser does not support all of the features required to enable persistence.");
    }
    return err; // Return error to be handled by services
  });

export { app, auth, db, persistencePromise };
