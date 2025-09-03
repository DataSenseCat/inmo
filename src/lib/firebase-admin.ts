
/**
 * @fileoverview
 * This file contains the server-side only Firebase Admin SDK initialization.
 * It should only be imported in server-side code (Server Actions, API routes).
 */
import { initializeApp, getApps, getApp, type App } from 'firebase-admin/app';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';
import { getStorage, type Storage } from 'firebase-admin/storage';

let adminApp: App;
let adminDb: Firestore;
let adminStorage: Storage;

if (!getApps().length) {
    adminApp = initializeApp({
        projectId: "catamarca-estates",
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    });
} else {
    adminApp = getApp();
}

adminDb = getFirestore(adminApp);
adminStorage = getStorage(adminApp);

export { adminApp, adminDb, adminStorage };
