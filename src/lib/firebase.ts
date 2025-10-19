// src/lib/firebase.ts
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import {
  getFirestore,
  initializeFirestore,
  enableIndexedDbPersistence,
  CACHE_SIZE_UNLIMITED,
  type Firestore,
} from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const isFirebaseConfigured = Object.values(firebaseConfig).every(Boolean);

let app: FirebaseApp | null = null;
if (isFirebaseConfigured) {
  app = getApps().length ? getApp() : initializeApp(firebaseConfig);
}

const auth: Auth | null = app ? getAuth(app) : null;

let db: Firestore | null = null;
let persistencePromise: Promise<void | string> | null = null;

const getDb = (): Firestore => {
  if (!app || !isFirebaseConfigured) {
    throw new Error("Firebase não está configurado.");
  }

  if (!db) {
    db = initializeFirestore(app, {
      cacheSizeBytes: CACHE_SIZE_UNLIMITED,
    });
  }
  return db;
};

const ensurePersistence = async () => {
  if (!isFirebaseConfigured) {
    return;
  }

  if (!persistencePromise) {
    const firestoreDb = getDb();
    persistencePromise = enableIndexedDbPersistence(firestoreDb).catch((err) => {
      if (err.code === "failed-precondition") {
        console.warn("Multiple tabs open, persistence can only be enabled in one tab at a time.");
      } else if (err.code === "unimplemented") {
        console.warn("The current browser does not support all of the features required to enable persistence.");
      }
      return err;
    });
  }
  await persistencePromise;
};

export { app, auth, getDb, ensurePersistence, isFirebaseConfigured };
