
'use server';

import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { SiteConfig } from '@/models/site-config';

const CONFIG_DOC_ID = 'main'; 

// Helper to remove undefined or null values from an object
const cleanData = (obj: any): any => {
    if (obj === null || obj === undefined) return undefined;
    if (Array.isArray(obj)) return obj.map(v => cleanData(v)).filter(v => v !== null && v !== undefined);
    if (obj instanceof Timestamp || obj instanceof File) return obj;

    if (typeof obj === 'object' && Object.keys(obj).length > 0) {
        return Object.entries(obj).reduce((acc, [key, value]) => {
            if(key === 'id') return acc; // Don't include id field
            const cleanedValue = cleanData(value);
            // Allow empty strings, but not null/undefined
            if (cleanedValue !== undefined && cleanedValue !== null) {
                acc[key as keyof typeof acc] = cleanedValue;
            }
            return acc;
        }, {} as { [key: string]: any });
    }
    // Allow empty strings and other primitives
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
                services: [],
                certifications: [],
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
