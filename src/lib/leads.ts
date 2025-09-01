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
import { firebaseTimestampToString } from './utils';

export async function createLead(data: Omit<Lead, 'id' | 'createdAt'>) {
    try {
        const leadData = {
            ...data,
            createdAt: Timestamp.now(),
        }
        await addDoc(collection(db, 'leads'), leadData);

        // After saving, attempt to send a notification.
        // This runs on the server, but the createLead function is called from the client.
        // This might require a separate server action if it causes issues.
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
    const leadsCol = collection(db, 'leads');
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
