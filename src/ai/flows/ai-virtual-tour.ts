'use server';

/**
 * @fileOverview Generates an AI-powered virtual tour experience with descriptive narratives for uploaded property images.
 *
 * - generateVirtualTour - A function that handles the generation of the virtual tour.
 * - AIVirtualTourInput - The input type for the generateVirtualTour function.
 * - AIVirtualTourOutput - The return type for the generateVirtualTour function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AIVirtualTourInputSchema = z.object({
  imageDataUris: z
    .array(z.string())
    .describe(
      'An array of property photos, as data URIs that must include a MIME type and use Base64 encoding. Expected format: data:<mimetype>;base64,<encoded_data>.'
    ),
  propertyDescription: z.string().describe('A general description of the property.'),
});
export type AIVirtualTourInput = z.infer<typeof AIVirtualTourInputSchema>;

const AIVirtualTourOutputSchema = z.object({
  tourNarratives: z
    .array(z.string())
    .describe('An array of descriptive narratives, one for each image.'),
});
export type AIVirtualTourOutput = z.infer<typeof AIVirtualTourOutputSchema>;

export async function generateVirtualTour(input: AIVirtualTourInput): Promise<AIVirtualTourOutput> {
  return aiVirtualTourFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiVirtualTourPrompt',
  input: {schema: AIVirtualTourInputSchema},
  output: {schema: AIVirtualTourOutputSchema},
  prompt: `You are a real estate agent creating virtual tour narratives for potential buyers or renters.

  Given a set of images and a general property description, your task is to generate a descriptive narrative for each image.
  Each narrative should highlight the key features and benefits of the space shown in the image, and give a user a sense of the space and layout.
  The narratives should be engaging, informative, and tailored to the specific image.

  Property Description: {{{propertyDescription}}}

  Images:
  {{#each imageDataUris}}
  Image {{@index + 1}}:
  {{media url=this}}
  {{/each}}

  Generate an array of descriptive narratives, one for each image provided.`, // Changed from tourNarrative to an array of narratives
});

const aiVirtualTourFlow = ai.defineFlow(
  {
    name: 'aiVirtualTourFlow',
    inputSchema: AIVirtualTourInputSchema,
    outputSchema: AIVirtualTourOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
