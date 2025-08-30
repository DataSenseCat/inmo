
'use server';

import {
  addDoc,
  collection,
  getDocs,
  getDoc,
  doc,
  query,
  orderBy,
  limit,
  where,
  deleteDoc,
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import type { Property } from '@/models/property';

// Function to create a new property
export async function createProperty(data: Omit<Property, 'id' | 'images' | 'createdAt' | 'updatedAt'>, images: File[]) {
    try {
        const imageUrls = [];
        for (const image of images) {
            const imageRef = ref(storage, `properties/${Date.now()}_${image.name}`);
            await uploadBytes(imageRef, image);
            const url = await getDownloadURL(imageRef);
            imageUrls.push({ url });
        }

        const docRef = await addDoc(collection(db, 'properties'), {
            ...data,
            images: imageUrls,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        return { id: docRef.id };
    } catch (error) {
        console.error("Error creating property: ", error);
        throw new Error("Failed to create property.");
    }
}

// Function to get all properties
export async function getProperties() {
  const propertiesCol = collection(db, 'properties');
  const q = query(propertiesCol, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Property));
}

// Function to get featured properties
export async function getFeaturedProperties() {
    const propertiesCol = collection(db, 'properties');
    const q = query(propertiesCol, where('featured', '==', true), orderBy('createdAt', 'desc'), limit(4));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Property));
}

// Function to get a single property by its ID
export async function getPropertyById(id: string) {
    const docRef = doc(db, 'properties', id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Property;
    } else {
        return null;
    }
}

// Function to delete a property by its ID
export async function deleteProperty(id: string): Promise<void> {
    try {
        const docRef = doc(db, 'properties', id);
        await deleteDoc(docRef);
        // Note: Deleting images from storage should be handled by a Cloud Function trigger
    } catch (error) {
        console.error("Error deleting property: ", error);
        throw new Error("Failed to delete property.");
    }
}
