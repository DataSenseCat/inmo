
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyClnikNK5zuHaS5c1hWnZEepRppHwB6Y4M",
    authDomain: "catamarca-estates.firebaseapp.com",
    projectId: "catamarca-estates",
    storageBucket: "datainmob",
    messagingSenderId: "826854436736",
    appId: "1:826854436736:web:21b0f4995ce88ba33a9b65"
};

// Initialize Firebase for SSR
let app: FirebaseApp;
let db: Firestore;
let storage: FirebaseStorage;

if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
} else {
    app = getApp();
}

db = getFirestore(app);
storage = getStorage(app);

export { app, db, storage };
