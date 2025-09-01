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
import { firebaseTimestampToString, dataUriToBuffer } from './utils';

const preparePropertyDataForSave = (data: any) => {
    return {
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
        featured: data.featured || false,
        active: data.active === undefined ? true : data.active,
        agentId: data.agentId || '',
        contact: data.contact || { name: '', phone: '', email: '' },
        features: data.features || {
            cochera: false,
            piscina: false,
            dptoServicio: false,
            quincho: false,
            parrillero: false,
        },
    };
};

export async function createProperty(data: Omit<Property, 'id' | 'images' | 'createdAt' | 'updatedAt'>, imageDataUris: string[]): Promise<{ id: string }> {
    try {
        if (!imageDataUris || imageDataUris.length === 0) {
            throw new Error("At least one image is required to create a property.");
        }

        const propertyPayload = {
            ...preparePropertyDataForSave(data),
            images: [],
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
        }
        const docRef = await addDoc(collection(db, 'properties'), propertyPayload);
        const propId = docRef.id;

        const imageUrls = [];
        for (const [index, dataUri] of imageDataUris.entries()) {
            const { buffer, mimeType } = dataUriToBuffer(dataUri);
            const fileExtension = mimeType.split('/')[1] || 'jpg';
            const imageRef = ref(storage, `properties/${propId}/${Date.now()}_${index}.${fileExtension}`);
            await uploadBytes(imageRef, buffer, { contentType: mimeType });
            const url = await getDownloadURL(imageRef);
            imageUrls.push({ url });
        }
        
        await updateDoc(doc(db, 'properties', propId), { images: imageUrls, updatedAt: Timestamp.now() });

        return { id: propId };
    } catch (error) {
        console.error("Error creating property: ", error);
        throw new Error("Failed to create property.");
    }
}

export async function updateProperty(id: string, data: Partial<Property>, newImageDataUris?: string[]): Promise<void> {
    try {
        const docRef = doc(db, 'properties', id);
        
        const updatePayload: any = {
            ...preparePropertyDataForSave(data),
            updatedAt: Timestamp.now(),
        };
        
        delete updatePayload.id;

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
            
            const newImageUrls = [];
            for (const [index, dataUri] of newImageDataUris.entries()) {
                const { buffer, mimeType } = dataUriToBuffer(dataUri);
                const fileExtension = mimeType.split('/')[1] || 'jpg';
                const imageRef = ref(storage, `properties/${id}/${Date.now()}_${index}.${fileExtension}`);
                await uploadBytes(imageRef, buffer, { contentType: mimeType });
                const url = await getDownloadURL(imageRef);
                newImageUrls.push({ url });
            }
            updatePayload.images = newImageUrls;
        }

        await updateDoc(docRef, updatePayload);
    } catch (error) {
        console.error("Error updating property: ", error);
        throw new Error("Failed to update property.");
    }
}

export async function getProperties(): Promise<Property[]> {
  try {
    const propertiesCol = collection(db, 'properties');
    const q = query(propertiesCol, where('active', '==', true), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return { 
        id: doc.id,
        ...data,
        createdAt: firebaseTimestampToString(data.createdAt),
        updatedAt: firebaseTimestampToString(data.updatedAt),
      } as Property;
    });
  } catch (error) {
    console.error("Error getting properties (the app will proceed with an empty list): ", error);
    return [];
  }
}

export async function getFeaturedProperties(): Promise<Property[]> {
    try {
        const propertiesCol = collection(db, 'properties');
        const q = query(propertiesCol, where('featured', '==', true), orderBy('createdAt', 'desc'), limit(10));
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

        // Filtrar por 'activas' en el lado del cliente y tomar las primeras 4
        return featured.filter(p => p.active).slice(0, 4);

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