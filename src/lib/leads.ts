
'use server';

import {
  addDoc,
  collection,
  getDocs,
  query,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { adminDb } from '@/lib/firebase-admin';
import type { Lead } from '@/models/lead';
import { getSiteConfig } from './config';
import { sendLeadNotification } from '@/ai/flows/send-lead-notification';
import { firebaseTimestampToString } from './utils';

export async function createLead(data: Omit<Lead, 'id' | 'createdAt'>) {
    try {
        const leadData = {
            ...data,
            createdAt: Timestamp.now(),
        }
        await addDoc(collection(adminDb, 'leads'), leadData);

        try {
            const config = await getSiteConfig();
            if (config?.leadNotificationEmail) {
                await sendLeadNotification({
                    to: config.leadNotificationEmail,
                    lead: data,
                });
            }
        } catch (notificationError) {
            console.error("Failed to send lead notification, but lead was saved:", notificationError);
        }

    } catch (error) {
        console.error("Error creating lead: ", error);
        throw new Error("Failed to create lead.");
    }
}

export async function getLeads(): Promise<Lead[]> {
  try {
    const leadsCol = collection(adminDb, 'leads');
    const q = query(leadsCol, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return { 
        id: doc.id,
        ...data,
        createdAt: firebaseTimestampToString(data.createdAt),
      } as Lead;
    });
  } catch (error) {
    console.error("Error getting leads (the app will proceed with an empty list): ", error);
    return [];
  }
}
