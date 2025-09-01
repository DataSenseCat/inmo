
'use server';

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  Timestamp,
  updateDoc,
} from 'firebase/firestore';
import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import type { Agent } from '@/models/agent';

export async function createAgent(data: Omit<Agent, 'id' | 'photoUrl' | 'createdAt' | 'updatedAt'>, photoFile?: File) {
  try {
    const agentPayload: Omit<Agent, 'id'> = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      active: data.active,
      bio: data.bio || '',
      photoUrl: '', // Start with no photo URL
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    if (photoFile) {
      const imageRef = ref(storage, `agents/${Date.now()}_${photoFile.name}`);
      await uploadBytes(imageRef, photoFile);
      agentPayload.photoUrl = await getDownloadURL(imageRef);
    }

    const docRef = await addDoc(collection(db, 'agents'), agentPayload);
    return { id: docRef.id };
  } catch (error) {
    console.error("Error creating agent: ", error);
    throw new Error("Failed to create agent.");
  }
}


export async function updateAgent(id: string, data: Partial<Omit<Agent, 'id'>>, photoFile?: File) {
  try {
    const docRef = doc(db, 'agents', id);
    const currentDoc = await getDoc(docRef);

    if (!currentDoc.exists()) {
      throw new Error("Agent not found.");
    }

    const currentData = currentDoc.data() as Agent;
    let photoUrl = currentData.photoUrl; // Keep the existing photo URL by default

    if (photoFile) {
      // If there's an old photo, delete it
      if (photoUrl && photoUrl.startsWith('https://firebasestorage.googleapis.com')) {
        try {
          const oldImageRef = ref(storage, photoUrl);
          await deleteObject(oldImageRef);
        } catch (e) {
          console.error("Failed to delete old photo, continuing with update...", e);
        }
      }
      // Upload the new photo
      const newImageRef = ref(storage, `agents/${Date.now()}_${photoFile.name}`);
      await uploadBytes(newImageRef, photoFile);
      photoUrl = await getDownloadURL(newImageRef);
    }

    const updatePayload: Partial<Agent> = {
      ...data,
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
      if (agent.photoUrl && agent.photoUrl.startsWith('https://firebasestorage.googleapis.com')) {
        try {
          const imageRef = ref(storage, agent.photoUrl);
          await deleteObject(imageRef);
        } catch (storageError) {
          console.error(`Failed to delete image ${agent.photoUrl} from storage:`, storageError);
          // Do not rethrow, allow firestore document to be deleted anyway
        }
      }
    }
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting agent: ", error);
    throw new Error("Failed to delete agent.");
  }
}
