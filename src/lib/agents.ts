
'use server';

import {
  addDoc,
  collection,
  getDocs,
  getDoc,
  doc,
  query,
  orderBy,
  deleteDoc,
  updateDoc,
  Timestamp,
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes, deleteObject } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import type { Agent } from '@/models/agent';

// Helper to remove undefined or null values from an object
const cleanData = (obj: any): any => {
    if (obj === null || obj === undefined) return undefined;
    if (Array.isArray(obj)) return obj.map(v => cleanData(v));
    if (obj instanceof Timestamp || obj instanceof File) return obj;

    if (typeof obj === 'object' && Object.keys(obj).length > 0) {
        return Object.entries(obj).reduce((acc, [key, value]) => {
            const cleanedValue = cleanData(value);
            if (cleanedValue !== undefined && cleanedValue !== null) {
                acc[key as keyof typeof acc] = cleanedValue;
            }
            return acc;
        }, {} as { [key: string]: any });
    }
    return obj;
};

export async function createAgent(data: Omit<Agent, 'id' | 'photoUrl' | 'createdAt' | 'updatedAt'>, photoFile?: File) {
    try {
        const agentData: any = {
            ...cleanData(data),
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
        };

        if (photoFile) {
            const imageRef = ref(storage, `agents/${Date.now()}_${photoFile.name}`);
            await uploadBytes(imageRef, photoFile);
            agentData.photoUrl = await getDownloadURL(imageRef);
        } else {
            agentData.photoUrl = '';
        }

        const docRef = await addDoc(collection(db, 'agents'), agentData);

        return { id: docRef.id };
    } catch (error) {
        console.error("Error creating agent: ", error);
        throw new Error("Failed to create agent.");
    }
}

export async function updateAgent(id: string, data: Partial<Agent>, photoFile?: File) {
    try {
        const docRef = doc(db, 'agents', id);
        const currentDoc = await getDoc(docRef);
        const currentData = currentDoc.data() as Agent | undefined;
        let photoUrl = currentData?.photoUrl;

        if (photoFile) {
            if (photoUrl) {
                try {
                    const oldImageRef = ref(storage, photoUrl);
                    await deleteObject(oldImageRef);
                } catch(e) {
                    console.error("Failed to delete old photo, continuing with update...", e);
                }
            }
            const imageRef = ref(storage, `agents/${Date.now()}_${photoFile.name}`);
            await uploadBytes(imageRef, photoFile);
            photoUrl = await getDownloadURL(imageRef);
        }

        const agentData: any = {
            ...cleanData(data),
            updatedAt: Timestamp.now(),
        };

        if (photoUrl) {
            agentData.photoUrl = photoUrl;
        }
        
        if (data.bio === null || data.bio === undefined) {
             agentData.bio = '';
        }


        await updateDoc(docRef, agentData);
    } catch (error) {
        console.error("Error updating agent: ", error);
        throw new Error("Failed to update agent.");
    }
}

export async function getAgents(): Promise<Agent[]> {
  try {
    const agentsCol = collection(db, 'agents');
    const q = query(agentsCol, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Agent));
  } catch (error) {
      console.error("Error getting agents (the app will proceed with an empty list): ", error);
      return [];
  }
}

export async function getAgentById(id: string): Promise<Agent | null> {
    try {
        const docRef = doc(db, 'agents', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() } as Agent;
        } else {
            return null;
        }
    } catch (error) {
        console.error(`Error getting agent by ID ${id}: `, error);
        return null;
    }
}

export async function deleteAgent(id: string): Promise<void> {
    try {
        const docRef = doc(db, 'agents', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const agent = docSnap.data() as Agent;
            if (agent.photoUrl) {
                try {
                    const imageRef = ref(storage, agent.photoUrl);
                    await deleteObject(imageRef);
                } catch (storageError) {
                    console.error(`Failed to delete image ${agent.photoUrl} from storage:`, storageError);
                }
            }
        }
        await deleteDoc(docRef);
    } catch (error) {
        console.error("Error deleting agent: ", error);
        throw new Error("Failed to delete agent.");
    }
}
