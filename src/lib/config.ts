
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
        console.error("Error getting site config, returning null: ", error);
        return null;
    }
}

export async function updateSiteConfig(data: Partial<Omit<SiteConfig, 'updatedAt'>>, logoFile?: File, logoPreview?: string | null): Promise<void> {
    try {
        const docRef = doc(db, 'siteConfig', CONFIG_DOC_ID);
        const currentConfig = await getSiteConfig();
        
        const configData: any = {
            ...data,
            updatedAt: Timestamp.now()
        };

        if (logoFile) {
            // Upload new logo, delete old one if it exists
            if (currentConfig?.logoUrl) {
                try {
                    const oldImageRef = ref(storage, currentConfig.logoUrl);
                    await deleteObject(oldImageRef);
                } catch(e) {
                    console.error("Failed to delete old logo, continuing with update...", e);
                }
            }
            const logoRef = ref(storage, `site/logo_${Date.now()}_${logoFile.name}`);
            await uploadBytes(logoRef, logoFile);
            configData.logoUrl = await getDownloadURL(logoRef);

        } else if (!logoPreview && currentConfig?.logoUrl) {
            // If preview is null/empty and there was a logo, it means we need to delete it.
            try {
                const oldImageRef = ref(storage, currentConfig.logoUrl);
                await deleteObject(oldImageRef);
            } catch(e) {
                console.error("Failed to delete logo, continuing with update...", e);
            }
            configData.logoUrl = ''; // Set to empty string to remove from db
        }
        // If logoFile is null but logoPreview exists, it means we keep the existing logo.
        // In this case, we don't add logoUrl to configData, so it's not overwritten.

        await setDoc(docRef, configData, { merge: true });
    } catch (error) {
        console.error("Error updating site config: ", error);
        throw new Error("Failed to update site config.");
    }
}
