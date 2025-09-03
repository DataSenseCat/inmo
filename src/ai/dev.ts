import { config } from 'dotenv';
config();

// Este archivo se utiliza para el desarrollo local con 'genkit dev'.
// No se debe importar directamente en el código de la aplicación Next.js
// para evitar que las dependencias del servidor se incluyan en el cliente.
