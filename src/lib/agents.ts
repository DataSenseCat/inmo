
'use server';

import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, orderBy, query, Timestamp, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes, deleteObject } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import type { Agent } from '@/models/agent';
import { firebaseTimestampToString } from './utils';

export async function createAgent(data: Omit<Agent, 'id' | 'photoUrl' | 'createdAt' | 'updatedAt'>, photoFile?: File): Promise<{ id: string }> {
  try {
    let photoUrl = '';
    if (photoFile) {
        const imageRef = ref(storage, `agents/${Date.now()}_${photoFile.name}`);
        await uploadBytes(imageRef, photoFile);
        photoUrl = await getDownloadURL(imageRef);
    }
    
    const agentPayload = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      active: data.active,
      bio: data.bio || '',
      photoUrl: photoUrl,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    const docRef = await addDoc(collection(db, 'agents'), agentPayload);
    return { id: docRef.id };

  } catch (error) {
    console.error("Error creating agent: ", error);
    throw new Error("Failed to create agent.");
  }
}

export async function updateAgent(id: string, data: Partial<Omit<Agent, 'id'>>, photoFile?: File): Promise<void> {
  try {
    const docRef = doc(db, 'agents', id);
    const currentDoc = await getDoc(docRef);

    if (!currentDoc.exists()) {
      throw new Error("Agent not found.");
    }
    
    const currentData = currentDoc.data() as Agent;
    let photoUrl = currentData.photoUrl;

    if (photoFile) {
        if (photoUrl && photoUrl.startsWith('https://firebasestorage.googleapis.com')) {
            try {
                const oldImageRef = ref(storage, photoUrl);
                await deleteObject(oldImageRef);
            } catch(e) {
                console.warn("Failed to delete old image, continuing with update...", e);
            }
        }
        const imageRef = ref(storage, `agents/${Date.now()}_${photoFile.name}`);
        await uploadBytes(imageRef, photoFile);
        photoUrl = await getDownloadURL(imageRef);
    }

    const updatePayload: any = {
      ...data,
      bio: data.bio || '', 
      photoUrl: photoUrl,
      updatedAt: Timestamp.now(),
    };

    await updateDoc(docRef, updatePayload);
  } catch (error) {
    console.error("Error updating agent: ", error);
    throw new Error("Failed to update agent.");
  }
}

export async function getAgents(): Promise<Agent[]> {
  try {
    const snapshot = await getDocs(query(collection(db, 'agents'), orderBy('name', 'asc')));
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return { 
        id: doc.id,
        ...data,
        createdAt: firebaseTimestampToString(data.createdAt),
        updatedAt: firebaseTimestampToString(data.updatedAt),
      } as Agent
    });
  } catch (error) {
    console.error("Error getting agents (the app will proceed with an empty list): ", error);
    return [];
  }
}

export async function getAgentById(id: string): Promise<Agent | null> {
  try {
    const docSnap = await getDoc(doc(db, 'agents', id));
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        createdAt: firebaseTimestampToString(data.createdAt),
        updatedAt: firebaseTimestampToString(data.updatedAt),
      } as Agent;
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
      if (agent.photoUrl && agent.photoUrl.startsWith('https://firebasestorage.googleapis.com')) {
        try {
          const imageRef = ref(storage, agent.photoUrl);
          await deleteObject(imageRef);
        } catch (storageError) {
          console.error(`Failed to delete image for agent ${id}:`, storageError);
        }
      }
    }
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting agent: ", error);
    throw new Error("Failed to delete agent.");
  }
}
