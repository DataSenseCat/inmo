import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import {getFirestore} from 'firebase-admin/firestore';
import {initializeApp, getApps, getApp} from 'firebase-admin/app';

if (!getApps().length) {
  initializeApp({
    projectId: 'catamarca-estates',
  });
}
const firestore = getFirestore(getApp());

export const ai = genkit({
  plugins: [googleAI({firestore})],
  model: 'googleai/gemini-2.5-flash',
});
