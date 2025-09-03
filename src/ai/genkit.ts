
'use server';

/**
 * @fileoverview
 * This file contains the Genkit initialization for both server and client environments.
 * It conditionally exports a server-side instance with full capabilities (including plugins
 * that use Node.js dependencies like 'firebase-admin') or a client-side safe instance
 * that prevents server code from leaking into the browser bundle.
 */

import { genkit, GenkitError } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

// This function will only be executed on the server, ensuring server-only
// dependencies are not bundled for the client.
const initializeServerGenkit = () => {
  // We dynamically import firebase-admin only when on the server
  const { adminDb } = require('@/lib/firebase-admin');
  return genkit({
    plugins: [googleAI({ firestore: adminDb })],
  });
};

// This function is for the client. It provides a "safe" version of Genkit
// that does not include any server-side plugins or dependencies.
const initializeClientGenkit = () => {
  return genkit({
    plugins: [googleAI()],
    // Prevent flows from being run on the client by throwing an error.
    flowRunner: (flow, input) => {
       throw new GenkitError(`Flows cannot be run on the client side. Attempted to run '${flow.name}'.`);
    }
  });
};

// We check if we are in a server environment (Node.js, Next.js server-side)
// or a client environment (the browser).
const isServer = typeof window === 'undefined';

// Conditionally export the appropriate Genkit instance.
export const ai = isServer ? initializeServerGenkit() : initializeClientGenkit();
