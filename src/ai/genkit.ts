import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import {getFirestore} from 'firebase-admin/firestore';
import {initializeApp, getApps, getApp} from 'firebase-admin/app';

if (!getApps().length) {
  initializeApp({
    projectId: process.env.FIREBASE_PROJECT_ID,
  });
}
const firestore = getFirestore(getApp(), process.env.FIRESTORE_DATABASE_ID);

export const ai = genkit({
  plugins: [googleAI({firestore})],
  model: 'googleai/gemini-2.5-flash',
});
