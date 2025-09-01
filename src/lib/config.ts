
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
            const configData = {
                ...data,
                // Ensure nested objects exist to prevent runtime errors
                socials: data.socials || { facebook: '', instagram: '', twitter: '' },
                services: data.services || [],
                certifications: data.certifications || [],
                updatedAt: firebaseTimestampToString(data.updatedAt)
            };
            return configData as SiteConfig;
        } else {
            console.warn(`Config document 'siteConfig/${CONFIG_DOC_ID}' not found. This is normal on first run. A default will be created if needed.`);
            // Return a default structure but indicate it's not from DB
             const defaultConfig: SiteConfig = {
                contactPhone: '',
                contactEmail: '',
                leadNotificationEmail: '',
                address: '',
                officeHours: '',
                socials: { facebook: '', instagram: '', twitter: '' },
                services: [],
                certifications: [],
                logoUrl: '/logo.png'
            };
            // Do not write to DB here, let the config form handle creation.
            return defaultConfig;
        }
    } catch (error) {
        console.error("CRITICAL: Error getting site config. This might be due to Firestore permissions or the database not being created.", error);
        // Return null to indicate a critical failure in fetching config.
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
