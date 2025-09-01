
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";
import admin from 'firebase-admin';

// --- Client-side config ---
const clientCredentials = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// --- Admin SDK Initialization (Server-side) ---
function initializeAdminApp() {
    // Check if the admin app is already initialized
    if (admin.apps.length > 0) {
        return admin.app();
    }
    
    // Check if the service account key is available in environment variables
    const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    if (!serviceAccountKey) {
        console.warn(
            `
            ********************************************************************************
            * WARNING: Firebase Admin SDK service account key is not set.                  *
            * Server-side Firebase operations (Firestore writes, Storage uploads) will fail. *
            * Please set the FIREBASE_SERVICE_ACCOUNT_KEY environment variable.            *
            ********************************************************************************
            `
        );
        return null; // Return null if key is not found
    }

    try {
        const serviceAccount = JSON.parse(serviceAccountKey);

        return admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            storageBucket: clientCredentials.storageBucket,
        });
    } catch (error: any) {
        console.error("Error parsing Firebase service account key:", error.message);
        console.error(
            `
            ********************************************************************************
            * ERROR: Failed to initialize Firebase Admin SDK.                              *
            * Make sure the FIREBASE_SERVICE_ACCOUNT_KEY is a valid JSON string.           *
            ********************************************************************************
            `
        );
        return null;
    }
}

// --- Exports ---
// Initialize client app (safe for both client and server)
const app: FirebaseApp = getApps().length ? getApp() : initializeApp(clientCredentials);
const db: Firestore = getFirestore(app);
const storage: FirebaseStorage = getStorage(app);

// Initialize admin app (will be null if key is not set)
const adminApp = initializeAdminApp();

// Conditionally export admin services
const adminDb: admin.firestore.Firestore | null = adminApp ? admin.firestore() : null;
const adminStorage: admin.storage.Storage | null = adminApp ? admin.storage() : null;

export { app, db, storage, adminDb, adminStorage };
