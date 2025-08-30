
'use server';

import {
  addDoc,
  collection,
  getDocs,
  getDoc,
  doc,
  query,
  orderBy,
  deleteDoc,
  updateDoc,
  Timestamp,
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes, deleteObject } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import type { Development } from '@/models/development';

// Helper function to clean data for Firestore
const cleanData = (data: any) => {
    const cleanedData: { [key: string]: any } = {};
    for (const key in data) {
        const value = data[key];
        if (value !== '' && value !== undefined && value !== null) {
             if(typeof value === 'object' && !Array.isArray(value) && value !== null && !(value instanceof File)) {
                cleanedData[key] = cleanData(value);
            } else {
                cleanedData[key] = value;
            }
        }
    }
    return cleanedData;
};

// Function to create a new development
export async function createDevelopment(data: Omit<Development, 'id' | 'image' | 'createdAt' | 'updatedAt'>, image: File) {
    try {
        const imageRef = ref(storage, `developments/${Date.now()}_${image.name}`);
        await uploadBytes(imageRef, image);
        const imageUrl = await getDownloadURL(imageRef);
        
        const developmentData = {
            ...cleanData(data),
            image: imageUrl,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
        }

        const docRef = await addDoc(collection(db, 'developments'), developmentData);
        return { id: docRef.id };
    } catch (error) {
        console.error("Error creating development: ", error);
        throw new Error("Failed to create development.");
    }
}

// Function to update an existing development
export async function updateDevelopment(id: string, data: Partial<Development>, newImage?: File) {
    try {
        const docRef = doc(db, 'developments', id);
        const currentDoc = await getDoc(docRef);
        const currentData = currentDoc.data() as Development | undefined;
        let imageUrl = currentData?.image;

        if (newImage) {
            // Delete old image if it exists
            if (imageUrl) {
                try {
                    const oldImageRef = ref(storage, imageUrl);
                    await deleteObject(oldImageRef);
                } catch(e) {
                    console.error("Failed to delete old image, continuing with update...", e);
                }
            }
            // Upload new image
            const imageRef = ref(storage, `developments/${Date.now()}_${newImage.name}`);
            await uploadBytes(imageRef, newImage);
            imageUrl = await getDownloadURL(imageRef);
        }

        const developmentData: any = {
            ...cleanData(data),
            updatedAt: Timestamp.now(),
        };

        if (imageUrl) {
            developmentData.image = imageUrl;
        }

        await updateDoc(docRef, developmentData);
    } catch (error) {
        console.error("Error updating development: ", error);
        throw new Error("Failed to update development.");
    }
}

// Function to get all developments
export async function getDevelopments(): Promise<Development[]> {
  const developmentsCol = collection(db, 'developments');
  const q = query(developmentsCol, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Development));
}

// Function to get a single development by its ID
export async function getDevelopmentById(id: string): Promise<Development | null> {
    const docRef = doc(db, 'developments', id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Development;
    } else {
        return null;
    }
}

// Function to delete a development by its ID
export async function deleteDevelopment(id: string): Promise<void> {
    try {
        const docRef = doc(db, 'developments', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const development = docSnap.data() as Development;
            if (development.image) {
                try {
                    const imageRef = ref(storage, development.image);
                    await deleteObject(imageRef);
                } catch (storageError) {
                    console.error(`Failed to delete image ${development.image} from storage:`, storageError);
                }
            }
        }
        await deleteDoc(docRef);
    } catch (error) {
        console.error("Error deleting development: ", error);
        throw new Error("Failed to delete development.");
    }
}

    