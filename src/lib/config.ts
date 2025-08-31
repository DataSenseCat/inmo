
'use server';

import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes, deleteObject } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import type { SiteConfig } from '@/models/site-config';

const CONFIG_DOC_ID = 'main'; 

// Helper to remove undefined, null, or empty string values from an object
const cleanData = (obj: any): any => {
    if (Array.isArray(obj)) {
        return obj.map(v => (v && typeof v === 'object') ? cleanData(v) : v)
                   .filter(v => v !== null && v !== undefined && v !== '');
    } else if (obj && typeof obj === 'object' && !(obj instanceof Timestamp) && !(obj instanceof File)) {
        return Object.entries(obj)
            .map(([k, v]) => [k, v && typeof v === 'object' ? cleanData(v) : v])
            .reduce((a, [k, v]) => (v === null || v === undefined || v === '' ? a : (a[k as keyof any] = v, a)), {} as any);
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
            const defaultConfig: Partial<SiteConfig> = {
                contactPhone: '',
                contactEmail: '',
                address: '',
                officeHours: '',
                socials: { facebook: '', instagram: '', twitter: '' },
            };
            await setDoc(docRef, defaultConfig);
            return defaultConfig as SiteConfig;
        }
    } catch (error) {
        console.error("Error getting site config, returning null: ", error);
        return null;
    }
}


export async function updateSiteConfig(
    data: Omit<SiteConfig, 'logoUrl' | 'updatedAt'>,
    currentConfig: SiteConfig | null,
    logoFile?: File, 
    logoRemoved?: boolean
): Promise<void> {
    try {
        const docRef = doc(db, 'siteConfig', CONFIG_DOC_ID);
        
        let configData: any = {
            ...data,
            updatedAt: Timestamp.now()
        };

        if (logoFile) {
            if (currentConfig?.logoUrl) {
                try {
                    const oldImageRef = ref(storage, currentConfig.logoUrl);
                    await deleteObject(oldImageRef);
                } catch(e) {
                    console.warn("Old logo not found or failed to delete, continuing with update...", e);
                }
            }
            const logoRef = ref(storage, `site/logo_${Date.now()}_${logoFile.name}`);
            await uploadBytes(logoRef, logoFile);
            configData.logoUrl = await getDownloadURL(logoRef);

        } else if (logoRemoved && currentConfig?.logoUrl) {
            try {
                const oldImageRef = ref(storage, currentConfig.logoUrl);
                await deleteObject(oldImageRef);
            } catch(e) {
                console.warn("Failed to delete logo, continuing with update...", e);
            }
            configData.logoUrl = '';
        }

        const cleanedConfigData = cleanData(configData);

        await setDoc(docRef, cleanedConfigData, { merge: true });
    } catch (error) {
        console.error("Error updating site config: ", error);
        throw new Error("Failed to update site config.");
    }
}
