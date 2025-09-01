
'use server';

import type { Admin } from '@/models/admin';

/**
 * Autentica al administrador comparando las credenciales proporcionadas
 * con los valores incrustados directamente en el código.
 * 
 * IMPORTANTE: Esta es una solución de emergencia para garantizar el acceso.
 * Las credenciales están hardcodeadas aquí.
 */
export async function authenticateAdmin({ email, password }: Omit<Admin, 'id'>): Promise<boolean> {
  
  // Credenciales incrustadas directamente
  const adminEmail = "rlolin1972@gmail.com";
  const adminPassword = "RoccoLolo2021?";

  if (email === adminEmail && password === adminPassword) {
    console.log("Autenticación exitosa (credenciales hardcodeadas).");
    return true;
  } else {
    console.log("Fallo de autenticación: las credenciales no coinciden.");
    return false;
  }
}
