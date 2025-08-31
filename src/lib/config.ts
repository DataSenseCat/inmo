
'use server';

import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { SiteConfig } from '@/models/site-config';

const CONFIG_DOC_ID = 'main'; 

// Helper to remove undefined, null, or empty string values from an object
const cleanData = (obj: any): any => {
    if (obj === null || obj === undefined) {
        return undefined;
    }
    if (Array.isArray(obj)) {
        return obj
            .map(v => (v && typeof v === 'object') ? cleanData(v) : v)
            .filter(v => v !== null && v !== undefined);
    }
    if (obj instanceof Timestamp || obj instanceof File) {
        return obj;
    }
    if (typeof obj === 'object') {
        const newObj: { [key: string]: any } = {};
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                const value = obj[key];
                if (value !== null && value !== undefined) {
                     const cleanedValue = (value && typeof value === 'object') ? cleanData(value) : value;
                     if(cleanedValue !== undefined) {
                         newObj[key] = cleanedValue;
                     }
                }
            }
        }
        return newObj;
    }
    return obj;
};

export async function getSiteConfig(): Promise<SiteConfig | null> {
    try {
        const docRef = doc(db, 'siteConfig', CONFIG_DOC_ID);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return docSnap.data() as SiteConfig;
        } else {
            console.warn("No config document found! Creating a default one.");
            const defaultConfig: SiteConfig = {
                contactPhone: '',
                contactEmail: '',
                address: '',
                officeHours: '',
                socials: { facebook: '', instagram: '', twitter: '' },
                logoUrl: '/logo.png' // Default logo
            };
            await setDoc(docRef, defaultConfig);
            return defaultConfig;
        }
    } catch (error) {
        console.error("Error getting site config, returning null: ", error);
        return null;
    }
}

export async function updateSiteConfig(data: Partial<Omit<SiteConfig, 'logoUrl'>>): Promise<void> {
    try {
        const docRef = doc(db, 'siteConfig', CONFIG_DOC_ID);
        
        const configToSave: Partial<SiteConfig> = {
            ...data,
            updatedAt: Timestamp.now()
        };
        
        const cleanedConfigData = cleanData(configToSave);

        await setDoc(docRef, cleanedConfigData, { merge: true });

    } catch (error) {
        console.error("Error updating site config: ", error);
        throw new Error("Failed to update site config.");
    }
}
