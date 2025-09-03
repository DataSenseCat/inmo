/**
 * @fileoverview
 * This file contains the server-side only Firebase Admin SDK initialization.
 * It should only be imported in server-side code (Server Actions, API routes).
 */
import { initializeApp, getApps, getApp, type App } from 'firebase-admin/app';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';
import { getStorage, type Storage } from 'firebase-admin/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: "catamarca-estates",
    storageBucket: "catamarca-estates.appspot.com",
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

function getAdminApp(): App {
    if (getApps().length > 0) {
        return getApp();
    }
    return initializeApp(firebaseConfig);
}

const adminApp: App = getAdminApp();
const adminDb: Firestore = getFirestore(adminApp, 'datainmob');
const adminStorage: Storage = getStorage(adminApp);

export { adminApp, adminDb, adminStorage };
