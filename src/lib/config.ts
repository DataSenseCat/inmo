
import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { SiteConfig } from '@/models/site-config';
import { firebaseTimestampToString } from './utils';

const CONFIG_DOC_ID = 'main'; 

export async function getSiteConfig(): Promise<SiteConfig | null> {
    try {
        const docRef = doc(db, 'siteConfig', CONFIG_DOC_ID);
        const docSnap = await getDoc(docRef);

        const defaultConfig: SiteConfig = {
            contactPhone: 'Configurar teléfono',
            contactEmail: 'Configurar email',
            leadNotificationEmail: '',
            address: 'Configurar dirección',
            officeHours: 'Configurar horarios',
            socials: { facebook: '', instagram: '', twitter: '' },
            services: [],
            certifications: [],
            logoUrl: '/logo.png'
        };

        if (docSnap.exists()) {
            const data = docSnap.data();
            const configData = {
                ...data,
                socials: data.socials || { facebook: '', instagram: '', twitter: '' },
                services: data.services || [],
                certifications: data.certifications || [],
                updatedAt: firebaseTimestampToString(data.updatedAt)
            };
            return configData as SiteConfig;
        } else {
            console.log(`Config document 'siteConfig/${CONFIG_DOC_ID}' not found. Creating a default one.`);
            const configToSave = {
                ...defaultConfig,
                updatedAt: Timestamp.now()
            };
            await setDoc(docRef, configToSave);
            console.log("Default config created.");
            return {
                ...configToSave,
                updatedAt: firebaseTimestampToString(configToSave.updatedAt)
            } as SiteConfig;
        }
    } catch (error: any) {
        console.error("CRITICAL: Error getting site config. This might be due to Firestore permissions or the database not being created.", error);
        // Return a safe default object to prevent app crashes
        const safeDefault: SiteConfig = {
            contactPhone: 'Error',
            contactEmail: 'Error',
            leadNotificationEmail: '',
            address: 'Error',
            officeHours: 'Error',
            socials: { facebook: '', instagram: '', twitter: '' },
            services: [],
            certifications: [],
            logoUrl: '/logo.png'
        };
        return safeDefault;
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
