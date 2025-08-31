
'use server';

import {
  addDoc,
  collection,
  getDocs,
  query,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Lead } from '@/models/lead';
import { getSiteConfig } from './config';
import { sendLeadNotification } from '@/ai/flows/send-lead-notification';

// Function to create a new lead
export async function createLead(data: Omit<Lead, 'id' | 'createdAt'>) {
    try {
        const leadData = {
            ...data,
            createdAt: Timestamp.now(),
        }
        await addDoc(collection(db, 'leads'), leadData);

        // After saving, send the notification
        const config = await getSiteConfig();
        if (config?.leadNotificationEmail) {
            await sendLeadNotification({
                to: config.leadNotificationEmail,
                lead: data,
            });
        }

    } catch (error) {
        console.error("Error creating lead: ", error);
        throw new Error("Failed to create lead.");
    }
}

// Function to get all leads
export async function getLeads(): Promise<Lead[]> {
  try {
    const leadsCol = collection(db, 'leads');
    const q = query(leadsCol, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Lead));
  } catch (error) {
    console.error("Error getting leads (the app will proceed with an empty list): ", error);
    return [];
  }
}
