
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
import { firebaseTimestampToString } from './utils';

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

export async function createDevelopment(data: Omit<Development, 'id' | 'image' | 'createdAt' | 'updatedAt'>, imageFile: File): Promise<{ id: string }> {
    try {
        let imageUrl = '';
        if (imageFile && imageFile.size > 0) {
            const imageRef = ref(storage, `developments/${Date.now()}_${imageFile.name}`);
            await uploadBytes(imageRef, imageFile);
            imageUrl = await getDownloadURL(imageRef);
        } else {
            throw new Error("Main image is required to create a development.");
        }
        
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

export async function updateDevelopment(id: string, data: Partial<Development>, newImageFile?: File): Promise<void> {
    try {
        const docRef = doc(db, 'developments', id);
        const currentDoc = await getDoc(docRef);

        if (!currentDoc.exists()) {
            throw new Error("Development not found");
        }
        
        const currentData = currentDoc.data() as Development;
        let imageUrl = currentData.image;

        if (newImageFile && newImageFile.size > 0) {
            if (imageUrl && imageUrl.startsWith('https://firebasestorage.googleapis.com')) {
                try {
                    const oldImageRef = ref(storage, imageUrl);
                    await deleteObject(oldImageRef);
                } catch(e) {
                    console.warn("Failed to delete old image, continuing with update...", e);
                }
            }
            const imageRef = ref(storage, `developments/${Date.now()}_${newImageFile.name}`);
            await uploadBytes(imageRef, newImageFile);
            imageUrl = await getDownloadURL(imageRef);
        }

        const updatePayload: any = {
            ...prepareDevelopmentDataForSave(data),
            image: imageUrl,
            updatedAt: Timestamp.now(),
        };

        delete updatePayload.id;

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
    return snapshot.docs.map(doc => {
        const data = doc.data();
        return { 
            id: doc.id,
            ...data,
            createdAt: firebaseTimestampToString(data.createdAt),
            updatedAt: firebaseTimestampToString(data.updatedAt),
        } as Development;
    });
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
            const data = docSnap.data();
            return {
                id: docSnap.id,
                ...data,
                createdAt: firebaseTimestampToString(data.createdAt),
                updatedAt: firebaseTimestampToString(data.updatedAt),
            } as Development;
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
                    console.warn(`Failed to delete image ${development.image} from storage:`, storageError);
                }
            }
        }
        await deleteDoc(docRef);
    } catch (error) {
        console.error("Error deleting development: ", error);
        throw new Error("Failed to delete development.");
    }
}
