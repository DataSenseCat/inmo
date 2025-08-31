
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
  updateDoc,
  Timestamp,
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes, deleteObject } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import type { Property } from '@/models/property';

// Helper function to clean data for Firestore
const cleanData = (data: any) => {
    const cleanedData: { [key: string]: any } = {};
    const dataToClean = { ...data };
    delete dataToClean.agentId; // Don't store agentId directly
    
    for (const key in dataToClean) {
        if (dataToClean[key] !== '' && dataToClean[key] !== undefined && dataToClean[key] !== null) {
            if(typeof dataToClean[key] === 'object' && !Array.isArray(dataToClean[key]) && dataToClean[key] !== null) {
                cleanedData[key] = cleanData(dataToClean[key]);
            } else {
                cleanedData[key] = dataToClean[key];
            }
        }
    }
    return cleanedData;
};


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
        
        const propertyData = {
            ...cleanData(data),
            images: imageUrls,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
        }

        const docRef = await addDoc(collection(db, 'properties'), propertyData);
        return { id: docRef.id };
    } catch (error) {
        console.error("Error creating property: ", error);
        throw new Error("Failed to create property.");
    }
}

// Function to update an existing property
export async function updateProperty(id: string, data: Partial<Property>, newImages?: File[]) {
    try {
        const docRef = doc(db, 'properties', id);
        const propertyData: any = {
            ...cleanData(data),
            updatedAt: Timestamp.now(),
        };

        if (newImages && newImages.length > 0) {
            const docSnap = await getDoc(docRef);
            const currentProperty = docSnap.data() as Property | undefined;

            // Delete old images from storage
            if (currentProperty?.images && currentProperty.images.length > 0) {
                for (const image of currentProperty.images) {
                    try {
                        const oldImageRef = ref(storage, image.url);
                        await deleteObject(oldImageRef);
                    } catch (storageError) {
                        console.warn(`Could not delete old image ${image.url}:`, storageError);
                    }
                }
            }
            
            // Upload new images
            const newImageUrls = [];
            for (const image of newImages) {
                const imageRef = ref(storage, `properties/${Date.now()}_${image.name}`);
                await uploadBytes(imageRef, image);
                const url = await getDownloadURL(imageRef);
                newImageUrls.push({ url });
            }
            propertyData.images = newImageUrls;
        }

        await updateDoc(docRef, propertyData);
    } catch (error) {
        console.error("Error updating property: ", error);
        throw new Error("Failed to update property.");
    }
}


// Function to get all properties
export async function getProperties(): Promise<Property[]> {
  try {
    const propertiesCol = collection(db, 'properties');
    const q = query(propertiesCol, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Property));
  } catch (error) {
    console.error("Error getting properties (the app will proceed with an empty list): ", error);
    return [];
  }
}

// Function to get featured properties
export async function getFeaturedProperties(): Promise<Property[]> {
    try {
        const propertiesCol = collection(db, 'properties');
        const q = query(propertiesCol, where('featured', '==', true), orderBy('createdAt', 'desc'), limit(4));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Property));
    } catch (error) {
        console.error("Error getting featured properties (the app will proceed with an empty list): ", error);
        return [];
    }
}

// Function to get a single property by its ID
export async function getPropertyById(id: string): Promise<Property | null> {
    try {
        const docRef = doc(db, 'properties', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() } as Property;
        } else {
            return null;
        }
    } catch (error) {
        console.error(`Error getting property by ID ${id}: `, error);
        return null;
    }
}

// Function to delete a property by its ID
export async function deleteProperty(id: string): Promise<void> {
    try {
        const docRef = doc(db, 'properties', id);
        // Optionally, get the document first to delete images from storage
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const property = docSnap.data() as Property;
            if (property.images && property.images.length > 0) {
                for (const image of property.images) {
                    try {
                        const imageRef = ref(storage, image.url);
                        await deleteObject(imageRef);
                    } catch (storageError) {
                        // Log error but don't block deletion if an image fails to delete
                        console.error(`Failed to delete image ${image.url} from storage:`, storageError);
                    }
                }
            }
        }
        await deleteDoc(docRef);
    } catch (error) {
        console.error("Error deleting property: ", error);
        throw new Error("Failed to delete property.");
    }
}
