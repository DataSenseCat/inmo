
'use server';
    
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  Timestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { adminDb } from '@/lib/firebase-admin';
import type { Testimonial } from '@/models/testimonial';
import { firebaseTimestampToString } from './utils';

const prepareTestimonialData = (data: any) => {
    return {
        name: data.name || '',
        comment: data.comment || '',
        rating: Number(data.rating) || 0,
        active: data.active === undefined ? true : data.active,
    };
};

export async function createTestimonial(data: Omit<Testimonial, 'id' | 'createdAt' | 'updatedAt'>): Promise<{ id: string }> {
    try {
        const testimonialPayload = {
            ...prepareTestimonialData(data),
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
        };
        const docRef = await addDoc(collection(adminDb, 'testimonials'), testimonialPayload);
        return { id: docRef.id };
    } catch (error) {
        console.error("Error creating testimonial: ", error);
        throw new Error("Failed to create testimonial.");
    }
}

export async function updateTestimonial(id: string, data: Partial<Testimonial>): Promise<void> {
    try {
        const docRef = doc(adminDb, 'testimonials', id);
        const testimonialPayload: any = {
            ...prepareTestimonialData(data),
            updatedAt: Timestamp.now(),
        };
        delete testimonialPayload.id;
        await updateDoc(docRef, testimonialPayload);
    } catch (error) {
        console.error("Error updating testimonial: ", error);
        throw new Error("Failed to update testimonial.");
    }
}

export async function getTestimonials(onlyActive: boolean = false): Promise<Testimonial[]> {
    try {
        const testimonialsCol = collection(adminDb, 'testimonials');
        
        let q;
        if (onlyActive) {
            q = query(testimonialsCol, where('active', '==', true), orderBy('createdAt', 'desc'));
        } else {
            q = query(testimonialsCol, orderBy('createdAt', 'desc'));
        }

        const snapshot = await getDocs(q);
        let testimonials = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                createdAt: firebaseTimestampToString(data.createdAt),
                updatedAt: firebaseTimestampToString(data.updatedAt),
            } as Testimonial
        });
        
        return testimonials;

    } catch (error) {
        console.error("Error getting testimonials: ", error);
        return [];
    }
}

export async function getTestimonialById(id: string): Promise<Testimonial | null> {
    try {
        const docRef = doc(adminDb, 'testimonials', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
            return {
                id: docSnap.id,
                ...data,
                createdAt: firebaseTimestampToString(data.createdAt),
                updatedAt: firebaseTimestampToString(data.updatedAt),
            } as Testimonial;
        }
        return null;
    } catch (error) {
        console.error(`Error getting testimonial by ID ${id}: `, error);
        return null;
    }
}

export async function deleteTestimonial(id: string): Promise<void> {
    try {
        const docRef = doc(adminDb, 'testimonials', id);
        await deleteDoc(docRef);
    } catch (error) {
        console.error("Error deleting testimonial: ", error);
        throw new Error("Failed to delete testimonial.");
    }
}
