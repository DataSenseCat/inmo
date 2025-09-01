
'use server';

import type { Admin } from '@/models/admin';

/**
 * Autentica al administrador comparando las credenciales proporcionadas
 * con las variables de entorno seguras.
 * Este método es simple, directo y evita la complejidad de la base de datos para el login.
 */
export async function authenticateAdmin({ email, password }: Omit<Admin, 'id'>): Promise<boolean> {
  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
  const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    console.error("Las variables de entorno del administrador (EMAIL/PASSWORD) no están configuradas.");
    return false;
  }

  if (email === adminEmail && password === adminPassword) {
    console.log("Autenticación exitosa.");
    return true;
  } else {
    console.log("Fallo de autenticación: las credenciales no coinciden.");
    return false;
  }
}
