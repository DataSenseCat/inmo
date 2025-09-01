
'use server';

import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, orderBy, query, Timestamp, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes, deleteObject } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import type { Agent } from '@/models/agent';
import { firebaseTimestampToString } from './utils';

// This function now runs on the SERVER
export async function createAgent(
  data: Omit<Agent, 'id' | 'photoUrl' | 'createdAt' | 'updatedAt'>,
  photoDataUri?: string
): Promise<{ id: string }> {
  try {
    const agentPayload = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      active: data.active,
      bio: data.bio || '',
      photoUrl: '', // Initialize with empty string
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    const docRef = await addDoc(collection(db, 'agents'), agentPayload);
    const agentId = docRef.id;

    if (photoDataUri) {
        // Convert Data URI to buffer
        const buffer = Buffer.from(photoDataUri.split(',')[1], 'base64');
        const mimeType = photoDataUri.split(';')[0].split(':')[1];
        const fileExtension = mimeType.split('/')[1];
        const fileName = `profile.${fileExtension}`;

        const imageRef = ref(storage, `agents/${agentId}/${fileName}`);

        // Upload buffer to Firebase Storage
        await uploadBytes(imageRef, buffer, { contentType: mimeType });
        const photoUrl = await getDownloadURL(imageRef);

        // Update the agent document with the new photo URL
        await updateDoc(doc(db, 'agents', agentId), { photoUrl: photoUrl });
    }

    return { id: agentId };
  } catch (error) {
    console.error("Error creating agent: ", error);
    throw new Error("Failed to create agent.");
  }
}

// This function now runs on the SERVER
export async function updateAgent(
  id: string,
  data: Partial<Omit<Agent, 'id'>>,
  photoDataUri?: string
): Promise<void> {
  try {
    const docRef = doc(db, 'agents', id);
    const updatePayload: any = {
      ...data,
      bio: data.bio || '',
      updatedAt: Timestamp.now(),
    };

    if (photoDataUri) {
      const currentDoc = await getDoc(docRef);
      if (!currentDoc.exists()) throw new Error("Agent not found.");
      const currentData = currentDoc.data();

      // Delete the old image if it exists
      if (currentData.photoUrl && currentData.photoUrl.startsWith('https://firebasestorage.googleapis.com')) {
        try {
          await deleteObject(ref(storage, currentData.photoUrl));
        } catch (e) {
          console.warn("Failed to delete old image, continuing update.", e);
        }
      }

      // Convert Data URI to buffer and upload
      const buffer = Buffer.from(photoDataUri.split(',')[1], 'base64');
      const mimeType = photoDataUri.split(';')[0].split(':')[1];
      const fileExtension = mimeType.split('/')[1];
      const fileName = `profile.${fileExtension}`;
      const imageRef = ref(storage, `agents/${id}/${fileName}`);
      
      await uploadBytes(imageRef, buffer, { contentType: mimeType });
      updatePayload.photoUrl = await getDownloadURL(imageRef);
    }
    
    delete updatePayload.id;
    await updateDoc(docRef, updatePayload);
  } catch (error) {
    console.error("Error updating agent: ", error);
    throw new Error("Failed to update agent.");
  }
}

// This function runs on the server
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

// This function runs on the server (or client if called from a client component)
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

// This function now runs on the SERVER
export async function deleteAgent(id: string): Promise<void> {
  try {
    const docRef = doc(db, 'agents', id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const agent = docSnap.data();
      if (agent.photoUrl && agent.photoUrl.startsWith('https://firebasestorage.googleapis.com')) {
        try {
          const imageRef = ref(storage, agent.photoUrl);
          await deleteObject(imageRef);
        } catch (storageError) {
          console.warn(`Failed to delete image for agent ${id}:`, storageError);
        }
      }
    }
    await deleteDoc(docRef);
  } catch (error)
 {
    console.error("Error deleting agent: ", error);
    throw new Error("Failed to delete agent.");
  }
}
