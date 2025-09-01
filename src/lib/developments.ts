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
import { ref, deleteObject } from 'firebase/storage';
import { db, storage, uploadFile } from '@/lib/firebase';
import type { Development } from '@/models/development';
import { firebaseTimestampToString } from './utils';

async function uploadDevelopmentImage(devId: string, imageDataUri: string): Promise<string> {
    const fileExtension = imageDataUri.substring(imageDataUri.indexOf('/') + 1, imageDataUri.indexOf(';'));
    const imagePath = `developments/${devId}/main.${fileExtension}`;
    return await uploadFile(imageDataUri, imagePath);
}

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

export async function createDevelopment(data: Omit<Development, 'id' | 'image' | 'createdAt' | 'updatedAt'>, imageDataUri: string): Promise<{ id: string }> {
    try {
        if (!imageDataUri) {
            throw new Error("Main image is required to create a development.");
        }
        
        const developmentPayload = {
            ...prepareDevelopmentDataForSave(data),
            image: '',
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
        }
        const docRef = await addDoc(collection(db, 'developments'), developmentPayload);
        const devId = docRef.id;

        const imageUrl = await uploadDevelopmentImage(devId, imageDataUri);
        
        await updateDoc(doc(db, 'developments', devId), { image: imageUrl, updatedAt: Timestamp.now() });

        return { id: devId };

    } catch (error) {
        console.error("Error creating development: ", error);
        throw new Error("Failed to create development.");
    }
}

export async function updateDevelopment(id: string, data: Partial<Development>, newImageDataUri?: string): Promise<void> {
    try {
        const docRef = doc(db, 'developments', id);
        const updatePayload: any = {
            ...prepareDevelopmentDataForSave(data),
            updatedAt: Timestamp.now(),
        };

        if (newImageDataUri) {
            const currentDoc = await getDoc(docRef);
            if (!currentDoc.exists()) throw new Error("Development not found");
            const currentData = currentDoc.data();

            if (currentData.image && currentData.image.startsWith('https://firebasestorage.googleapis.com')) {
                try {
                    await deleteObject(ref(storage, currentData.image));
                } catch(e: any) {
                    if (e.code !== 'storage/object-not-found') {
                        console.warn("Failed to delete old image, continuing update.", e);
                    }
                }
            }
            
            updatePayload.image = await uploadDevelopmentImage(id, newImageDataUri);
        }

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
            const development = docSnap.data();
            if (development.image && development.image.startsWith('https://firebasestorage.googleapis.com')) {
                try {
                    const imageRef = ref(storage, development.image);
                    await deleteObject(imageRef);
                } catch (storageError: any) {
                    if (storageError.code !== 'storage/object-not-found') {
                        console.warn(`Failed to delete image ${development.image} from storage:`, storageError);
                    }
                }
            }
        }
        await deleteDoc(docRef);
    } catch (error) {
        console.error("Error deleting development: ", error);
        throw new Error("Failed to delete development.");
    }
}