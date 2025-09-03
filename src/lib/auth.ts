
'use server';

import type { Admin } from '@/models/admin';
import { adminDb } from './firebase-admin';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';


/**
 * Autentica al administrador consultando la colección 'admins' en Firestore.
 * Busca un documento que coincida con el email y la contraseña proporcionados.
 */
export async function authenticateAdmin({ email, password }: Omit<Admin, 'id'>): Promise<boolean> {
  try {
    const adminsCol = collection(adminDb, 'admins');
    
    // Crear una consulta para encontrar un admin con el email y contraseña coincidentes
    const q = query(
        adminsCol, 
        where("email", "==", email), 
        where("password", "==", password), 
        limit(1)
    );

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
        // Si se encuentra al menos un documento, la autenticación es exitosa
        console.log(`Autenticación exitosa para el usuario: ${email}`);
        return true;
    } else {
        // Si no se encuentra ningún documento, las credenciales son incorrectas
        console.log(`Fallo de autenticación para el usuario: ${email}. No se encontraron coincidencias.`);
        return false;
    }

  } catch (error) {
    console.error("Error durante el proceso de autenticación en Firestore:", error);
    // En caso de un error en la base de datos, denegar el acceso por seguridad
    return false;
  }
}
