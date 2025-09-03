import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import { adminDb } from '@/lib/firebase-admin';

export const ai = genkit({
  plugins: [googleAI({ firestore: adminDb })],
});
