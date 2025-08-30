
'use server';

import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';
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
            console.warn("No config document found!");
            return null;
        }
    } catch (error) {
        console.error("Error getting site config (the app will proceed with default values): ", error);
        // Return null instead of throwing an error to allow the app to run
        // even if Firestore is not available.
        return null;
    }
}

export async function updateSiteConfig(data: Omit<SiteConfig, 'updatedAt' | 'logoUrl'>, logoFile?: File): Promise<void> {
    try {
        const docRef = doc(db, 'siteConfig', CONFIG_DOC_ID);
        const currentConfig = await getSiteConfig();
        
        const configData: any = {
            ...data,
            updatedAt: Timestamp.now()
        };

        if (logoFile) {
            // Delete old logo if it exists
            if (currentConfig?.logoUrl) {
                try {
                    const oldImageRef = ref(storage, currentConfig.logoUrl);
                    await deleteObject(oldImageRef);
                } catch(e) {
                    console.error("Failed to delete old logo, continuing with update...", e);
                }
            }
            // Upload new logo
            const logoRef = ref(storage, `site/logo_${Date.now()}_${logoFile.name}`);
            await uploadBytes(logoRef, logoFile);
            configData.logoUrl = await getDownloadURL(logoRef);
        } else if ((data as any).logoUrl === null) {
            // Logic to remove the logo if requested
             if (currentConfig?.logoUrl) {
                try {
                    const oldImageRef = ref(storage, currentConfig.logoUrl);
                    await deleteObject(oldImageRef);
                } catch(e) {
                    console.error("Failed to delete logo, continuing with update...", e);
                }
            }
            configData.logoUrl = '';
        }

        await setDoc(docRef, configData, { merge: true });
    } catch (error) {
        console.error("Error updating site config: ", error);
        throw new Error("Failed to update site config.");
    }
}
