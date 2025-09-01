
'use server';

import { Timestamp } from 'firebase-admin/firestore';
import { adminDb, adminStorage } from '@/lib/firebase';
import type { Agent } from '@/models/agent';

const BUCKET_NAME = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;

export async function createAgent(data: Omit<Agent, 'id' | 'photoUrl' | 'createdAt' | 'updatedAt'>, photoFile?: File): Promise<{ id: string }> {
  try {
    const agentPayload: any = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      active: data.active,
      bio: data.bio || '',
      photoUrl: '', // Default empty
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    if (photoFile && BUCKET_NAME) {
      const bucket = adminStorage.bucket(BUCKET_NAME);
      const filePath = `agents/${Date.now()}_${photoFile.name}`;
      const buffer = Buffer.from(await photoFile.arrayBuffer());
      
      const file = bucket.file(filePath);
      await file.save(buffer, {
        metadata: {
          contentType: photoFile.type,
        },
      });

      agentPayload.photoUrl = file.publicUrl();
    }

    const docRef = await adminDb.collection('agents').add(agentPayload);
    return { id: docRef.id };

  } catch (error) {
    console.error("Error creating agent: ", error);
    throw new Error("Failed to create agent.");
  }
}

export async function updateAgent(id: string, data: Partial<Omit<Agent, 'id'>>, photoFile?: File): Promise<void> {
  try {
    const docRef = adminDb.collection('agents').doc(id);
    const currentDoc = await docRef.get();

    if (!currentDoc.exists) {
      throw new Error("Agent not found.");
    }

    const updatePayload: any = {
      ...data,
      updatedAt: Timestamp.now(),
    };

    if (photoFile && BUCKET_NAME) {
      const bucket = adminStorage.bucket(BUCKET_NAME);

      // Delete old photo if it exists
      const oldData = currentDoc.data() as Agent;
      if (oldData.photoUrl && oldData.photoUrl.includes(BUCKET_NAME)) {
          try {
            const oldFileName = oldData.photoUrl.split(`/o/`)[1].split('?')[0].replace(/%2F/g, "/");
            await bucket.file(decodeURIComponent(oldFileName)).delete();
          } catch (e) {
             console.warn("Failed to delete old photo, continuing with update...", e);
          }
      }
      
      // Upload new photo
      const filePath = `agents/${Date.now()}_${photoFile.name}`;
      const buffer = Buffer.from(await photoFile.arrayBuffer());
      const file = bucket.file(filePath);
      await file.save(buffer, {
        metadata: {
          contentType: photoFile.type,
        },
      });
      updatePayload.photoUrl = file.publicUrl();
    }

    await docRef.update(updatePayload);
  } catch (error) {
    console.error("Error updating agent: ", error);
    throw new Error("Failed to update agent.");
  }
}

export async function getAgents(): Promise<Agent[]> {
  try {
    const snapshot = await adminDb.collection('agents').orderBy('name', 'asc').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Agent));
  } catch (error) {
    console.error("Error getting agents (the app will proceed with an empty list): ", error);
    return [];
  }
}

export async function getAgentById(id: string): Promise<Agent | null> {
  try {
    const docSnap = await adminDb.collection('agents').doc(id).get();
    if (docSnap.exists) {
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
    const docRef = adminDb.collection('agents').doc(id);
    const docSnap = await docRef.get();

    if (docSnap.exists && BUCKET_NAME) {
      const agent = docSnap.data() as Agent;
      if (agent.photoUrl && agent.photoUrl.includes(BUCKET_NAME)) {
        try {
          const bucket = adminStorage.bucket(BUCKET_NAME);
          const oldFileName = agent.photoUrl.split(`/o/`)[1].split('?')[0].replace(/%2F/g, "/");
          await bucket.file(decodeURIComponent(oldFileName)).delete();
        } catch (storageError) {
          console.error(`Failed to delete image for agent ${id}:`, storageError);
        }
      }
    }
    await docRef.delete();
  } catch (error) {
    console.error("Error deleting agent: ", error);
    throw new Error("Failed to delete agent.");
  }
}
