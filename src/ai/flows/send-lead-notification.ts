
'use server';

/**
 * @fileOverview A flow to send an email notification for a new lead.
 *
 * - sendLeadNotification - A function that handles sending the notification.
 * - SendLeadNotificationInput - The input type for the function.
 */

import { ai } from '@/ai/init'; // Use the server-side instance
import { z } from 'genkit';
import type { Lead } from '@/models/lead';

const SendLeadNotificationInputSchema = z.object({
    to: z.string().email().describe('The email address to send the notification to.'),
    lead: z.object({
        name: z.string(),
        email: z.string(),
        phone: z.string().optional(),
        subject: z.string(),
        message: z.string(),
        contactPreference: z.string(),
    }).describe('The lead data.')
});

export type SendLeadNotificationInput = z.infer<typeof SendLeadNotificationInputSchema>;

export async function sendLeadNotification(input: SendLeadNotificationInput): Promise<void> {
    return sendLeadNotificationFlow(input);
}

const sendLeadNotificationFlow = ai.defineFlow(
    {
        name: 'sendLeadNotificationFlow',
        inputSchema: SendLeadNotificationInputSchema,
        outputSchema: z.void(),
    },
    async (input) => {
        const subject = `Nuevo Lead Recibido: ${input.lead.subject}`;
        const body = `
            Has recibido un nuevo lead a través del sitio web.

            Detalles del Lead:
            - Nombre: ${input.lead.name}
            - Email: ${input.lead.email}
            - Teléfono: ${input.lead.phone || 'No proporcionado'}
            - Preferencia de Contacto: ${input.lead.contactPreference}
            - Asunto: ${input.lead.subject}
            
            Mensaje:
            ${input.lead.message}
        `;

        // TODO: Replace this with a real email sending service (e.g., SendGrid, Resend, etc.)
        // This requires setting up the service and its API key in the environment.
        console.log('//////////////////////////////////////////////////');
        console.log('// SIMULATING LEAD NOTIFICATION EMAIL');
        console.log('// TO:', input.to);
        console.log('// SUBJECT:', subject);
        console.log('// BODY:');
        console.log(body);
        console.log('//////////////////////////////////////////////////');

        // This is where you would call the email service API.
        // For example:
        // await resend.emails.send({
        //   from: 'onboarding@resend.dev',
        //   to: input.to,
        //   subject: subject,
        //   text: body,
        // });
        
        return;
    }
);
