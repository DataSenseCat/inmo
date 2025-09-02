
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
import { ref, deleteObject } from 'firebase/storage';
import { db, storage, uploadFile } from '@/lib/firebase';
import type { Property } from '@/models/property';
import { firebaseTimestampToString } from './utils';

type PropertyCreationPayload = Omit<Property, 'id' | 'images' | 'createdAt' | 'updatedAt'>;

type ActionResponse<T = {}> = {
    success: boolean;
    message?: string;
} & T;


async function uploadPropertyImages(propId: string, imageDataUris: string[]): Promise<{ url: string }[]> {
    const imageUrls = await Promise.all(imageDataUris.map(async (dataUri, index) => {
        const fileExtension = dataUri.substring(dataUri.indexOf('/') + 1, dataUri.indexOf(';'));
        const imagePath = `properties/${propId}/${Date.now()}_${index}.${fileExtension}`;
        const url = await uploadFile(dataUri, imagePath);
        return { url };
    }));
    return imageUrls;
}

export async function createProperty(data: PropertyCreationPayload, imageDataUris: string[]): Promise<ActionResponse<{ id?: string }>> {
    if (!imageDataUris || imageDataUris.length === 0) {
        return { success: false, message: "Debés subir al menos una imagen." };
    }
    
    try {
        const propertyPayload = {
            title: data.title || '',
            description: data.description || '',
            priceUSD: Number(data.priceUSD) || 0,
            priceARS: Number(data.priceARS) || 0,
            type: data.type || 'Casa',
            operation: data.operation || 'Venta',
            location: data.location || '',
            address: data.address || '',
            bedrooms: Number(data.bedrooms) || 0,
            bathrooms: Number(data.bathrooms) || 0,
            area: Number(data.area) || 0,
            totalM2: Number(data.totalM2) || 0,
            featured: data.featured || false,
            active: data.active === undefined ? true : data.active,
            agentId: data.agentId || '',
            contact: {
                name: data.contact?.name || '',
                phone: data.contact?.phone || '',
                email: data.contact?.email || '',
            },
            features: {
                cochera: data.features?.cochera || false,
                piscina: data.features?.piscina || false,
                dptoServicio: data.features?.dptoServicio || false,
                quincho: data.features?.quincho || false,
                parrillero: data.features?.parrillero || false,
            },
            images: [],
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
        };
        
        const docRef = await addDoc(collection(db, 'properties'), propertyPayload);
        const propId = docRef.id;

        const imageUrls = await uploadPropertyImages(propId, imageDataUris);
        
        await updateDoc(doc(db, 'properties', propId), { images: imageUrls, updatedAt: Timestamp.now() });

        return { success: true, id: propId };
    } catch (error) {
        console.error("Error creating property: ", error);
        return { success: false, message: "No se pudo crear la propiedad. Por favor, intente de nuevo." };
    }
}

export async function updateProperty(id: string, data: Partial<PropertyCreationPayload>, newImageDataUris?: string[]): Promise<ActionResponse> {
    try {
        const docRef = doc(db, 'properties', id);
        
        const updatePayload: any = {
            ...data,
            updatedAt: Timestamp.now(),
        };
        
        if (newImageDataUris && newImageDataUris.length > 0) {
            const docSnap = await getDoc(docRef);
            const currentProperty = docSnap.data() as Property | undefined;

            if (currentProperty?.images) {
                await Promise.all(currentProperty.images.map(async (image) => {
                    if (image.url && image.url.startsWith('https://firebasestorage.googleapis.com')) {
                        try {
                            await deleteObject(ref(storage, image.url));
                        } catch (storageError: any) {
                            if (storageError.code !== 'storage/object-not-found') {
                                console.warn(`Could not delete old image ${image.url}:`, storageError);
                            }
                        }
                    }
                }));
            }
            
            const newImageUrls = await uploadPropertyImages(id, newImageDataUris);
            updatePayload.images = newImageUrls;
        }

        await updateDoc(docRef, updatePayload);
        return { success: true };
    } catch (error) {
        console.error("Error updating property: ", error);
        return { success: false, message: "No se pudo actualizar la propiedad. Por favor, intente de nuevo." };
    }
}

export async function getProperties(): Promise<Property[]> {
  try {
    const propertiesCol = collection(db, 'properties');
    const q = query(propertiesCol, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    const allProperties = snapshot.docs.map(doc => {
      const data = doc.data();
      return { 
        id: doc.id,
        ...data,
        createdAt: firebaseTimestampToString(data.createdAt),
        updatedAt: firebaseTimestampToString(data.updatedAt),
      } as Property;
    });
    return allProperties;
  } catch (error) {
    console.error("Error getting properties (the app will proceed with an empty list): ", error);
    return [];
  }
}

export async function getFeaturedProperties(): Promise<Property[]> {
    try {
        const propertiesCol = collection(db, 'properties');
        const q = query(propertiesCol, where('featured', '==', true), where('active', '==', true), limit(4));
        const snapshot = await getDocs(q);
        
        const featured = snapshot.docs.map(doc => {
          const data = doc.data();
          return { 
            id: doc.id,
            ...data,
            createdAt: firebaseTimestampToString(data.createdAt),
            updatedAt: firebaseTimestampToString(data.updatedAt),
          } as Property;
        });

        return featured;

    } catch (error) {
        console.error("Error getting featured properties (the app will proceed with an empty list): ", error);
        return [];
    }
}

export async function getPropertyById(id: string): Promise<Property | null> {
    try {
        const docRef = doc(db, 'properties', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            return {
              id: docSnap.id,
              ...data,
              createdAt: firebaseTimestampToString(data.createdAt),
              updatedAt: firebaseTimestampToString(data.updatedAt),
            } as Property;
        } else {
            return null;
        }
    } catch (error) {
        console.error(`Error getting property by ID ${id}: `, error);
        return null;
    }
}

export async function deleteProperty(id: string): Promise<void> {
    try {
        const docRef = doc(db, 'properties', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const property = docSnap.data() as Property;
            if (property.images && property.images.length > 0) {
                 await Promise.all(property.images.map(async (image) => {
                    if (image.url && image.url.startsWith('https://firebasestorage.googleapis.com')) {
                        try {
                            const imageRef = ref(storage, image.url);
                            await deleteObject(imageRef);
                        } catch (storageError: any) {
                             if (storageError.code !== 'storage/object-not-found') {
                                console.error(`Failed to delete image ${image.url} from storage:`, storageError);
                             }
                        }
                    }
                }));
            }
        }
        await deleteDoc(docRef);
    } catch (error) {
        console.error("Error deleting property: ", error);
        throw new Error("Failed to delete property.");
    }
}
