
'use server';

import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL, type FirebaseStorage } from "firebase/storage";
import { dataUriToBuffer } from "./utils";

const clientCredentials = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: "catamarca-estates",
    storageBucket: "catamarca-estates.appspot.com",
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

function getFirebaseApp(): FirebaseApp {
    if (getApps().length > 0) {
        return getApp();
    }
    return initializeApp(clientCredentials);
}

const app: FirebaseApp = getFirebaseApp();
const db: Firestore = getFirestore(app, 'datainmob');
const storage: FirebaseStorage = getStorage(app);

/**
 * Uploads a file from a data URI to a specified path in Firebase Storage.
 * This function runs on the server to avoid CORS issues.
 * @param dataUri The data URI of the file to upload.
 * @param path The path in Firebase Storage where the file will be stored.
 * @returns A promise that resolves with the public download URL of the uploaded file.
 */
export async function uploadFile(dataUri: string, path: string): Promise<string> {
    try {
        const { buffer, mimeType } = dataUriToBuffer(dataUri);
        const storageRef = ref(storage, path);
        
        await uploadBytes(storageRef, buffer, { contentType: mimeType });
        
        const downloadUrl = await getDownloadURL(storageRef);
        return downloadUrl;
    } catch (error) {
        console.error(`Failed to upload file to ${path}:`, error);
        throw new Error("File upload failed.");
    }
}


export { app, db, storage };
