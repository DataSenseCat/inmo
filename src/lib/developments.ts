
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
import { firebaseTimestampToString, dataUriToBuffer } from './utils';

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

// This function now runs on the CLIENT
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

        const { buffer, mimeType } = dataUriToBuffer(imageDataUri);
        const fileExtension = mimeType.split('/')[1] || 'jpg';
        const imageRef = ref(storage, `developments/${devId}/main.${fileExtension}`);
        await uploadBytes(imageRef, buffer, { contentType: mimeType });
        const imageUrl = await getDownloadURL(imageRef);
        
        await updateDoc(doc(db, 'developments', devId), { image: imageUrl });

        return { id: devId };

    } catch (error) {
        console.error("Error creating development: ", error);
        throw new Error("Failed to create development.");
    }
}

// This function now runs on the CLIENT
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
            
            const { buffer, mimeType } = dataUriToBuffer(newImageDataUri);
            const fileExtension = mimeType.split('/')[1] || 'jpg';
            const imageRef = ref(storage, `developments/${id}/main.${fileExtension}`);
            await uploadBytes(imageRef, buffer, { contentType: mimeType });
            updatePayload.image = await getDownloadURL(imageRef);
        }

        delete updatePayload.id;

        await updateDoc(docRef, updatePayload);
    } catch (error) {
        console.error("Error updating development: ", error);
        throw new Error("Failed to update development.");
    }
}

// This function runs on the CLIENT
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

// This function can be called from client or server
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

// This function now runs on the CLIENT
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
