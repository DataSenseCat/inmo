
// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyClnikNK5zuHaS5c1hWnZEepRppHwB6Y4M",
    authDomain: "catamarca-estates.firebaseapp.com",
    projectId: "catamarca-estates",
    storageBucket: "catamarca-estates.appspot.com",
    messagingSenderId: "826854436736",
    appId: "1:826854436736:web:21b0f4995ce88ba33a9b65"
};

// Initialize Firebase
let app;
if (!getApps().length) {
    app = initializeApp(firebaseConfig);
} else {
    app = getApps()[0];
}

const db = getFirestore(app);
const storage = getStorage(app);

export { app, db, storage };
