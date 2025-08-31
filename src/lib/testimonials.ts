
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
import { db } from '@/lib/firebase';
import type { Testimonial } from '@/models/testimonial';

const cleanData = (data: any) => {
    const cleanedData: { [key: string]: any } = {};
    for (const key in data) {
        if (data[key] !== '' && data[key] !== undefined && data[key] !== null) {
            cleanedData[key] = data[key];
        }
    }
    return cleanedData;
};

export async function createTestimonial(data: Omit<Testimonial, 'id' | 'createdAt' | 'updatedAt'>): Promise<{ id: string }> {
    try {
        const testimonialData = {
            ...cleanData(data),
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
        };
        const docRef = await addDoc(collection(db, 'testimonials'), testimonialData);
        return { id: docRef.id };
    } catch (error) {
        console.error("Error creating testimonial: ", error);
        throw new Error("Failed to create testimonial.");
    }
}

export async function updateTestimonial(id: string, data: Partial<Testimonial>): Promise<void> {
    try {
        const docRef = doc(db, 'testimonials', id);
        const testimonialData = {
            ...cleanData(data),
            updatedAt: Timestamp.now(),
        };
        await updateDoc(docRef, testimonialData);
    } catch (error) {
        console.error("Error updating testimonial: ", error);
        throw new Error("Failed to update testimonial.");
    }
}

export async function getTestimonials(onlyActive: boolean = false): Promise<Testimonial[]> {
    try {
        const testimonialsCol = collection(db, 'testimonials');
        const constraints = [orderBy('createdAt', 'desc')];
        if (onlyActive) {
            constraints.unshift(where('active', '==', true));
        }
        const q = query(testimonialsCol, ...constraints);
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Testimonial));
    } catch (error) {
        console.error("Error getting testimonials: ", error);
        return [];
    }
}

export async function getTestimonialById(id: string): Promise<Testimonial | null> {
    try {
        const docRef = doc(db, 'testimonials', id);
        const docSnap = await getDoc(docRef);
        return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as Testimonial : null;
    } catch (error) {
        console.error(`Error getting testimonial by ID ${id}: `, error);
        return null;
    }
}

export async function deleteTestimonial(id: string): Promise<void> {
    try {
        const docRef = doc(db, 'testimonials', id);
        await deleteDoc(docRef);
    } catch (error) {
        console.error("Error deleting testimonial: ", error);
        throw new Error("Failed to delete testimonial.");
    }
}
