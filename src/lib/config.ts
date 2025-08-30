
'use server';

import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { SiteConfig } from '@/models/site-config';

const CONFIG_DOC_ID = 'main'; 

export async function getSiteConfig(): Promise<SiteConfig | null> {
    try {
        const docRef = doc(db, 'siteConfig', CONFIG_DOC_ID);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return docSnap.data() as SiteConfig;
        } else {
            console.log("No config document found!");
            // Optionally, create a default config if it doesn't exist
            return null;
        }
    } catch (error) {
        console.error("Error getting site config: ", error);
        throw new Error("Failed to get site config.");
    }
}

export async function updateSiteConfig(data: SiteConfig): Promise<void> {
    try {
        const docRef = doc(db, 'siteConfig', CONFIG_DOC_ID);
        await setDoc(docRef, {
            ...data,
            updatedAt: Timestamp.now()
        }, { merge: true });
    } catch (error) {
        console.error("Error updating site config: ", error);
        throw new Error("Failed to update site config.");
    }
}
