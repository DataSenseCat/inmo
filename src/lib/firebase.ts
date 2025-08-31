
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyClnikNK5zuHaS5c1hWnZEepRppHwB6Y4M",
    authDomain: "catamarca-estates.firebaseapp.com",
    projectId: "catamarca-estates",
    storageBucket: "datainmob",
    messagingSenderId: "826854436736",
    appId: "1:826854436736:web:21b0f4995ce88ba33a9b65"
};

// Initialize Firebase
let app: FirebaseApp;
if (!getApps().length) {
    app = initializeApp(firebaseConfig);
} else {
    app = getApps()[0];
}

const db = getFirestore(app);
const storage = getStorage(app);

// Enable persistence
enableIndexedDbPersistence(db)
  .catch((err) => {
    if (err.code == 'failed-precondition') {
      // Multiple tabs open, persistence can only be enabled
      // in one tab at a time.
      // ...
      console.warn('Firestore persistence failed: failed-precondition. This can happen with multiple tabs open.');
    } else if (err.code == 'unimplemented') {
      // The current browser does not support all of the
      // features required to enable persistence
      // ...
       console.warn('Firestore persistence failed: unimplemented. Browser does not support this feature.');
    }
  });


export { app, db, storage };
