
'use server';

import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { SiteConfig } from '@/models/site-config';
import { firebaseTimestampToString } from './utils';

const CONFIG_DOC_ID = 'main'; 

export async function getSiteConfig(): Promise<SiteConfig | null> {
    try {
        const docRef = doc(db, 'siteConfig', CONFIG_DOC_ID);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            return {
                ...data,
                updatedAt: firebaseTimestampToString(data.updatedAt)
            } as SiteConfig;
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

export async function updateSiteConfig(data: Partial<Omit<SiteConfig, 'logoUrl' | 'id'>>): Promise<void> {
    try {
        const docRef = doc(db, 'siteConfig', CONFIG_DOC_ID);
        
        const configToSave = {
            contactPhone: data.contactPhone || '',
            contactEmail: data.contactEmail || '',
            leadNotificationEmail: data.leadNotificationEmail || '',
            address: data.address || '',
            officeHours: data.officeHours || '',
            socials: {
                facebook: data.socials?.facebook || '',
                instagram: data.socials?.instagram || '',
                twitter: data.socials?.twitter || '',
            },
            services: data.services || [],
            certifications: data.certifications || [],
            updatedAt: Timestamp.now()
        };

        await setDoc(docRef, configToSave, { merge: true });

    } catch (error) {
        console.error("Error updating site config: ", error);
        throw new Error("Failed to update site config.");
    }
}
