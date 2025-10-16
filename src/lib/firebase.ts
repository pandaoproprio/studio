// src/lib/firebase.ts
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, initializeFirestore, enableIndexedDbPersistence, CACHE_SIZE_UNLIMITED, type Firestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY", // This will be replaced by the build system
  authDomain: "anniconecta.firebaseapp.com",
  projectId: "anniconecta",
  storageBucket: "anniconecta.appspot.com",
  messagingSenderId: "532352991807",
  appId: "1:532352991807:web:f5a1a1005a769837947116"
};

// Initialize Firebase
const app: FirebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth: Auth = getAuth(app);

let db: Firestore;
let persistencePromise: Promise<void | string>;

// Singleton pattern for Firestore and its persistence
const getDb = (): Firestore => {
  if (!db) {
    db = initializeFirestore(app, {
      cacheSizeBytes: CACHE_SIZE_UNLIMITED,
    });
    persistencePromise = enableIndexedDbPersistence(db)
      .catch((err) => {
        if (err.code === 'failed-precondition') {
          console.warn("Multiple tabs open, persistence can only be enabled in one tab at a time.");
        } else if (err.code === 'unimplemented') {
          console.warn("The current browser does not support all of the features required to enable persistence.");
        }
        return err; // Return error to be handled by services
      });
  }
  return db;
};

// Function to ensure persistence is awaited before operations
const ensurePersistence = async () => {
  getDb(); // Ensure db is initialized
  return persistencePromise;
};


export { app, auth, getDb, ensurePersistence };
