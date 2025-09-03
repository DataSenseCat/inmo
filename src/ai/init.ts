// @ts-nocheck - This is a server-side only file and will not be type-checked in the client.
/**
 * @fileoverview
 * This file contains the SERVER-SIDE ONLY Genkit initialization.
 * It should only be imported in server-side code ('use server' files).
 */
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import { adminDb } from '@/lib/firebase-admin';

// This is the SERVER-side instance of Genkit, initialized with server-only plugins.
export const ai = genkit({
  plugins: [googleAI({ firestore: adminDb })],
});
