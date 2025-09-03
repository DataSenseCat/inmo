import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// This is the CLIENT-side instance of Genkit. It should not contain plugins
// that have server-side dependencies like firebase-admin.
export const ai = genkit({
  plugins: [googleAI()],
});
