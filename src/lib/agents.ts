
'use server';

import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, orderBy, query, Timestamp, updateDoc, where } from 'firebase/firestore';
import { adminDb, adminStorage } from '@/lib/firebase-admin';
import type { Agent } from '@/models/agent';
import { firebaseTimestampToString, dataUriToBuffer } from './utils';

export type AgentActionResponse = {
    success: boolean;
    message: string;
    id?: string;
};

// This is a server-only function
async function uploadAgentPhoto(agentId: string, photoDataUri: string): Promise<string> {
    const bucket = adminStorage.bucket();
    const { buffer, mimeType } = dataUriToBuffer(photoDataUri);
    const fileExtension = mimeType.split('/')[1] || 'jpg';
    const imagePath = `agents/${agentId}/profile.${Date.now()}.${fileExtension}`;
    const file = bucket.file(imagePath);

    await file.save(buffer, {
        metadata: {
            contentType: mimeType,
        },
    });
    
    // Make the file publicly readable.
    // REQUIRES the service account to have the "Storage Object Admin" role in IAM.
    await file.makePublic();

    // Return the public URL
    const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(imagePath)}?alt=media`;
    
    return publicUrl;
}

const parseAgentFormData = (formData: FormData) => {
    return {
        id: formData.get('id') as string | undefined,
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        phone: formData.get('phone') as string,
        bio: formData.get('bio') as string || '',
        active: formData.get('active') === 'on',
        photoDataUri: formData.get('photoDataUri') as string | undefined,
    };
};

export async function saveAgent(
    prevState: AgentActionResponse, 
    formData: FormData
): Promise<AgentActionResponse> {
    const agentId = formData.get('id') as string | null;
    const isEditing = !!agentId;
    const { photoDataUri, ...data } = parseAgentFormData(formData);

    try {
        if (isEditing) {
            // UPDATE
            const docRef = doc(adminDb, 'agents', agentId);
            const updatePayload: any = { 
                ...data, 
                updatedAt: Timestamp.now() 
            };
            delete updatePayload.id;

            if (photoDataUri) {
                const currentDoc = await getDoc(docRef);
                if (currentDoc.exists()) {
                    const currentData = currentDoc.data();
                    if (currentData && currentData.photoUrl && currentData.photoUrl.startsWith('https://firebasestorage.googleapis.com')) {
                        try {
                            const fileUrl = decodeURIComponent(currentData.photoUrl);
                            const filePath = fileUrl.split('/o/')[1].split('?')[0];
                            await adminStorage.bucket().file(filePath).delete();
                        } catch (e: any) {
                           if (e.code !== 404) console.warn("Could not delete old agent photo, but continuing with update.", e);
                        }
                    }
                }
                updatePayload.photoUrl = await uploadAgentPhoto(agentId, photoDataUri);
            }

            await updateDoc(docRef, updatePayload);
            return { success: true, message: 'Agente actualizado con éxito.' };

        } else {
            // CREATE
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

            const docRef = await addDoc(collection(adminDb, 'agents'), agentPayload);
            const newAgentId = docRef.id;

            if (photoDataUri) {
                const photoUrl = await uploadAgentPhoto(newAgentId, photoDataUri);
                await updateDoc(doc(adminDb, 'agents', newAgentId), { photoUrl: photoUrl });
            }
            
            return { success: true, id: newAgentId, message: 'Agente creado con éxito.' };
        }
    } catch (error: any) {
        console.error("Error saving agent: ", error);
        return { success: false, message: `No se pudo guardar el agente. Error: ${error.message}` };
    }
}


export async function getAgents(): Promise<Agent[]> {
  try {
    const activeAgentsQuery = query(collection(adminDb, 'agents'), where('active', '==', true), orderBy('name', 'asc'));
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
        const allAgentsQuery = query(collection(adminDb, 'agents'), orderBy('name', 'asc'));
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
    const docSnap = await getDoc(doc(adminDb, 'agents', id));
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
    const docRef = doc(adminDb, 'agents', id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const agent = docSnap.data();
      if (agent.photoUrl && agent.photoUrl.startsWith('https://firebasestorage.googleapis.com')) {
        try {
            const filePath = decodeURIComponent(agent.photoUrl.split('/o/')[1].split('?')[0]);
            await adminStorage.bucket().file(filePath).delete();
        } catch (storageError: any) {
            if (storageError.code !== 404) { // 404 means not found, which is fine
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

