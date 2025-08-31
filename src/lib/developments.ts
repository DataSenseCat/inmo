
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
const cleanData = (obj: any): any => {
    if (obj === null || obj === undefined) return undefined;
    if (Array.isArray(obj)) return obj.map(v => cleanData(v));
    if (obj instanceof Timestamp || obj instanceof File) return obj;

    if (typeof obj === 'object' && Object.keys(obj).length > 0) {
         return Object.entries(obj).reduce((acc, [key, value]) => {
            const cleanedValue = cleanData(value);
            if (value === '' || value === 0) { // Keep empty strings and zero values
                 acc[key as keyof typeof acc] = value;
            } else if (cleanedValue !== undefined && cleanedValue !== null) {
                acc[key as keyof typeof acc] = cleanedValue;
            }
            return acc;
        }, {} as { [key: string]: any });
    }
    return obj;
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
  try {
    const developmentsCol = collection(db, 'developments');
    const q = query(developmentsCol, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Development));
  } catch (error) {
    console.error("Error getting developments (the app will proceed with an empty list): ", error);
    return [];
  }
}

// Function to get a single development by its ID
export async function getDevelopmentById(id: string): Promise<Development | null> {
    try {
        const docRef = doc(db, 'developments', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() } as Development;
        } else {
            return null;
        }
    } catch (error) {
        console.error(`Error getting development by ID ${id}: `, error);
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
