
'use server';

import type { Admin } from '@/models/admin';

/**
 * Autentica al administrador comparando las credenciales proporcionadas
 * con los valores incrustados directamente en el código.
 * 
 * ADVERTENCIA: Esta es una solución temporal para asegurar el acceso.
 * Las credenciales están hardcodeadas aquí.
 */
export async function authenticateAdmin({ email, password }: Omit<Admin, 'id'>): Promise<boolean> {
  
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
