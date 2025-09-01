
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

const prepareDevelopmentDataForSave = (data: any) => {
    return {
        title: data.title || '',
        location: data.location || '',
        description: data.description || '',
        status: data.status || 'planning',
        isFeatured: data.isFeatured || false,
        totalUnits: Number(data.totalUnits) || 0,
        availableUnits: Number(data.availableUnits) || 0,
        priceFrom: Number(data.priceFrom) || 0,
        priceRange: {
            min: Number(data.priceRange?.min) || 0,
            max: Number(data.priceRange?.max) || 0,
        },
        deliveryDate: data.deliveryDate || '',
    };
};

export async function createDevelopment(data: Omit<Development, 'id' | 'image' | 'createdAt' | 'updatedAt'>, image: File): Promise<{ id: string }> {
    try {
        const imageRef = ref(storage, `developments/${Date.now()}_${image.name}`);
        await uploadBytes(imageRef, image);
        const imageUrl = await getDownloadURL(imageRef);
        
        const developmentPayload = {
            ...prepareDevelopmentDataForSave(data),
            image: imageUrl,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
        }

        const docRef = await addDoc(collection(db, 'developments'), developmentPayload);
        return { id: docRef.id };
    } catch (error) {
        console.error("Error creating development: ", error);
        throw new Error("Failed to create development.");
    }
}

export async function updateDevelopment(id: string, data: Partial<Development>, newImage?: File): Promise<void> {
    try {
        const docRef = doc(db, 'developments', id);
        const currentDoc = await getDoc(docRef);

        if (!currentDoc.exists()) {
            throw new Error("Development not found");
        }
        
        const currentData = currentDoc.data() as Development;
        let imageUrl = currentData.image;

        if (newImage) {
            if (imageUrl && imageUrl.startsWith('https://firebasestorage.googleapis.com')) {
                try {
                    const oldImageRef = ref(storage, imageUrl);
                    await deleteObject(oldImageRef);
                } catch(e) {
                    console.warn("Failed to delete old image, continuing with update...", e);
                }
            }
            const imageRef = ref(storage, `developments/${Date.now()}_${newImage.name}`);
            await uploadBytes(imageRef, newImage);
            imageUrl = await getDownloadURL(imageRef);
        }

        const updatePayload: Partial<Development> = {
            ...prepareDevelopmentDataForSave(data),
            image: imageUrl,
            updatedAt: Timestamp.now(),
        };

        await updateDoc(docRef, updatePayload);
    } catch (error) {
        console.error("Error updating development: ", error);
        throw new Error("Failed to update development.");
    }
}

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

export async function deleteDevelopment(id: string): Promise<void> {
    try {
        const docRef = doc(db, 'developments', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const development = docSnap.data() as Development;
            if (development.image && development.image.startsWith('https://firebasestorage.googleapis.com')) {
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
