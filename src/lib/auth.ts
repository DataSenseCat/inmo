
'use server';

import type { Admin } from '@/models/admin';

// ¡IMPORTANTE! Esta es una autenticación muy básica solo para fines de demostración.
// En una aplicación de producción, NUNCA almacenes contraseñas en texto plano
// ni en variables de entorno del lado del cliente. Utiliza un proveedor de autenticación
// como Firebase Authentication, Auth0, etc.

/**
 * Verifica si las credenciales coinciden con las variables de entorno.
 */
export async function authenticateAdmin({ email, password }: Omit<Admin, 'id'>): Promise<boolean> {
  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
  const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    console.error("Las variables de entorno de administrador no están configuradas.");
    return false;
  }

  return email === adminEmail && password === adminPassword;
}
