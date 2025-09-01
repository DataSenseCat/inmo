import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, orderBy, query, Timestamp, updateDoc, where } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import { db, storage, uploadFile } from '@/lib/firebase';
import type { Agent } from '@/models/agent';
import { firebaseTimestampToString, dataUriToBuffer } from './utils';

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
      photoUrl: '',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    const docRef = await addDoc(collection(db, 'agents'), agentPayload);
    const agentId = docRef.id;

    if (photoDataUri) {
        const { mimeType } = dataUriToBuffer(photoDataUri);
        const fileExtension = mimeType.split('/')[1] || 'jpg';
        const imagePath = `agents/${agentId}/profile.${fileExtension}`;
        
        const photoUrl = await uploadFile(photoDataUri, imagePath);
        
        await updateDoc(doc(db, 'agents', agentId), { photoUrl: photoUrl, updatedAt: Timestamp.now() });
    }

    return { id: agentId };
  } catch (error) {
    console.error("Error creating agent: ", error);
    throw new Error("Failed to create agent.");
  }
}

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
    
    delete updatePayload.id;

    if (photoDataUri) {
      const currentDoc = await getDoc(docRef);
      if (!currentDoc.exists()) throw new Error("Agent not found.");
      
      const currentData = currentDoc.data();
      if (currentData.photoUrl && currentData.photoUrl.startsWith('https://firebasestorage.googleapis.com')) {
        try {
          await deleteObject(ref(storage, currentData.photoUrl));
        } catch (e: any) {
           if (e.code !== 'storage/object-not-found') {
             console.warn("Failed to delete old image, continuing update.", e);
           }
        }
      }

      const { mimeType } = dataUriToBuffer(photoDataUri);
      const fileExtension = mimeType.split('/')[1] || 'jpg';
      const imagePath = `agents/${id}/profile.${fileExtension}`;
      updatePayload.photoUrl = await uploadFile(photoDataUri, imagePath);
    }
    
    await updateDoc(docRef, updatePayload);
  } catch (error) {
    console.error("Error updating agent: ", error);
    throw new Error("Failed to update agent.");
  }
}

export async function getAgents(): Promise<Agent[]> {
  try {
    const activeAgentsQuery = query(collection(db, 'agents'), where('active', '==', true), orderBy('name', 'asc'));
    const snapshot = await getDocs(activeAgentsQuery);
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

export async function getAllAgents(): Promise<Agent[]> {
    try {
        const allAgentsQuery = query(collection(db, 'agents'), orderBy('name', 'asc'));
        const snapshot = await getDocs(allAgentsQuery);
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
        console.error("Error getting all agents (the app will proceed with an empty list): ", error);
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
      const agent = docSnap.data();
      if (agent.photoUrl && agent.photoUrl.startsWith('https://firebasestorage.googleapis.com')) {
        try {
          const imageRef = ref(storage, agent.photoUrl);
          await deleteObject(imageRef);
        } catch (storageError: any) {
            if (storageError.code !== 'storage/object-not-found') {
              console.warn(`Failed to delete image for agent ${id}:`, storageError);
            }
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
