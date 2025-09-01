
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";
import admin from 'firebase-admin';

const clientCredentials = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

function initializeAdminApp() {
    if (admin.apps.length > 0) {
        return admin.app();
    }
    
    const serviceAccount = JSON.parse(
        process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string
    );

    return admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: clientCredentials.storageBucket,
    });
}

let app: FirebaseApp;
let db: Firestore;
let storage: FirebaseStorage;
let adminDb: admin.firestore.Firestore;
let adminStorage: admin.storage.Storage;

if (typeof window === "undefined") {
    // Server-side initialization
    initializeAdminApp();
    app = getApps().length > 0 ? getApp() : initializeApp(clientCredentials);
    db = getFirestore(app);
    storage = getStorage(app);
    adminDb = admin.firestore();
    adminStorage = admin.storage();
} else {
    // Client-side initialization
    app = getApps().length > 0 ? getApp() : initializeApp(clientCredentials);
    db = getFirestore(app);
    storage = getStorage(app);
}

export { app, db, storage, adminDb, adminStorage };
