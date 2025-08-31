
'use server';

import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes, deleteObject } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
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
            .filter(v => v !== null && v !== undefined && v !== '');
    }
    if (obj instanceof Timestamp || obj instanceof File) {
        return obj;
    }
    if (typeof obj === 'object') {
        const newObj: { [key: string]: any } = {};
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                const value = obj[key];
                if (value !== null && value !== undefined && value !== '') {
                    const cleanedValue = (value && typeof value === 'object') ? cleanData(value) : value;
                    if (cleanedValue !== null && cleanedValue !== undefined && cleanedValue !== '') {
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
            };
            await setDoc(docRef, defaultConfig);
            return defaultConfig;
        }
    } catch (error) {
        console.error("Error getting site config, returning null: ", error);
        return null;
    }
}


export async function updateSiteConfig(
    data: Omit<SiteConfig, 'logoUrl' | 'updatedAt' | 'socials'> & { facebookUrl?: string, instagramUrl?: string, twitterUrl?: string },
    currentConfig: SiteConfig | null,
    logoFile?: File, 
    logoRemoved?: boolean
): Promise<void> {
    try {
        const docRef = doc(db, 'siteConfig', CONFIG_DOC_ID);
        
        let logoUrl = currentConfig?.logoUrl;

        if (logoFile) {
            if (logoUrl) {
                try {
                    const oldImageRef = ref(storage, logoUrl);
                    await deleteObject(oldImageRef);
                } catch(e) {
                    console.warn("Old logo not found or failed to delete, continuing with update...", e);
                }
            }
            const logoRef = ref(storage, `site/logo_${Date.now()}_${logoFile.name}`);
            await uploadBytes(logoRef, logoFile);
            logoUrl = await getDownloadURL(logoRef);

        } else if (logoRemoved && logoUrl) {
            try {
                const oldImageRef = ref(storage, logoUrl);
                await deleteObject(oldImageRef);
            } catch(e) {
                console.warn("Failed to delete logo, continuing with update...", e);
            }
            logoUrl = ''; 
        }

        const configToSave: Partial<SiteConfig> = {
            contactPhone: data.contactPhone,
            contactEmail: data.contactEmail,
            leadNotificationEmail: data.leadNotificationEmail,
            address: data.address,
            officeHours: data.officeHours,
            socials: {
                facebook: data.facebookUrl || '',
                instagram: data.instagramUrl || '',
                twitter: data.twitterUrl || '',
            },
            logoUrl: logoUrl,
            updatedAt: Timestamp.now()
        };
        
        const cleanedConfigData = cleanData(configToSave);

        await setDoc(docRef, cleanedConfigData, { merge: true });

    } catch (error) {
        console.error("Error updating site config: ", error);
        throw new Error("Failed to update site config.");
    }
}
