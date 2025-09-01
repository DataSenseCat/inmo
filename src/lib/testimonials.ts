
'use client';

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
import { firebaseTimestampToString } from './utils';

const prepareTestimonialData = (data: any) => {
    return {
        name: data.name || '',
        comment: data.comment || '',
        rating: Number(data.rating) || 0,
        active: data.active === undefined ? true : data.active,
    };
};

// This function now runs on the CLIENT
export async function createTestimonial(data: Omit<Testimonial, 'id' | 'createdAt' | 'updatedAt'>): Promise<{ id: string }> {
    try {
        const testimonialPayload = {
            ...prepareTestimonialData(data),
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
        };
        const docRef = await addDoc(collection(db, 'testimonials'), testimonialPayload);
        return { id: docRef.id };
    } catch (error) {
        console.error("Error creating testimonial: ", error);
        throw new Error("Failed to create testimonial.");
    }
}

// This function now runs on the CLIENT
export async function updateTestimonial(id: string, data: Partial<Testimonial>): Promise<void> {
    try {
        const docRef = doc(db, 'testimonials', id);
        const testimonialPayload = {
            ...prepareTestimonialData(data),
            updatedAt: Timestamp.now(),
        };
        await updateDoc(docRef, testimonialPayload);
    } catch (error) {
        console.error("Error updating testimonial: ", error);
        throw new Error("Failed to update testimonial.");
    }
}

// This function runs on client
export async function getTestimonials(onlyActive: boolean = false): Promise<Testimonial[]> {
    try {
        const testimonialsCol = collection(db, 'testimonials');
        const constraints = [orderBy('createdAt', 'desc')];
        if (onlyActive) {
            constraints.unshift(where('active', '==', true));
        }
        const q = query(testimonialsCol, ...constraints);
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                createdAt: firebaseTimestampToString(data.createdAt),
                updatedAt: firebaseTimestampToString(data.updatedAt),
            } as Testimonial
        });
    } catch (error) {
        console.error("Error getting testimonials: ", error);
        return [];
    }
}

// This can be called from client
export async function getTestimonialById(id: string): Promise<Testimonial | null> {
    try {
        const docRef = doc(db, 'testimonials', id);
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

// This function now runs on the CLIENT
export async function deleteTestimonial(id: string): Promise<void> {
    try {
        const docRef = doc(db, 'testimonials', id);
        await deleteDoc(docRef);
    } catch (error) {
        console.error("Error deleting testimonial: ", error);
        throw new Error("Failed to delete testimonial.");
    }
}
