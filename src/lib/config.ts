
'use server';

import { doc, getDoc, setDoc, Timestamp, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes, deleteObject } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import type { SiteConfig } from '@/models/site-config';

const CONFIG_DOC_ID = 'main'; 

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
        
        const configData: any = {
            ...data,
            updatedAt: Timestamp.now()
        };

        if (logoFile) {
            // 1. Upload new logo, delete old one if it exists
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
            // 2. If no new file but logo was removed, delete the old one
            try {
                const oldImageRef = ref(storage, currentConfig.logoUrl);
                await deleteObject(oldImageRef);
            } catch(e) {
                console.warn("Failed to delete logo, continuing with update...", e);
            }
            configData.logoUrl = ''; // Set to empty string to remove from db
        }
        // 3. If no new file and logo was not removed, logoUrl is not added to configData,
        // so it keeps its previous value in Firestore due to merge:true.

        await setDoc(docRef, configData, { merge: true });
    } catch (error) {
        console.error("Error updating site config: ", error);
        throw new Error("Failed to update site config.");
    }
}
