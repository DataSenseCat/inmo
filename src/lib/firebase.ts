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
const db: Firestore = getFirestore(app, process.env.FIRESTORE_DATABASE_ID);
const storage: FirebaseStorage = getStorage(app);

export async function uploadFile(dataUri: string, path: string): Promise<string> {
    const { buffer, mimeType } = dataUriToBuffer(dataUri);
    const storageRef = ref(storage, path);
    
    await uploadBytes(storageRef, buffer, { contentType: mimeType });
    
    const downloadUrl = await getDownloadURL(storageRef);
    return downloadUrl;
}


export { app, db, storage };
