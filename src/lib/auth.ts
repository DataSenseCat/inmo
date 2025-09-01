
'use server';

import { collection, getDocs, query, where, limit, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Admin } from '@/models/admin';

// Nota: En una aplicación de producción, las contraseñas DEBEN ser hasheadas
// usando una librería como bcrypt. Por simplicidad aquí se guardan en texto plano.

/**
 * Verifica si existe un administrador con el email y contraseña proporcionados.
 */
export async function authenticateAdmin({ email, password }: Omit<Admin, 'id'>): Promise<boolean> {
  try {
    const q = query(
      collection(db, 'admins'),
      where('email', '==', email),
      where('password', '==', password), // ¡NO SEGURO PARA PRODUCCIÓN!
      limit(1)
    );
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch (error) {
    console.error("Error authenticating admin:", error);
    return false;
  }
}

/**
 * Verifica si la colección de 'admins' está vacía.
 */
export async function isFirstAdmin(): Promise<boolean> {
  try {
    const q = query(collection(db, 'admins'), limit(1));
    const querySnapshot = await getDocs(q);
    return querySnapshot.empty;
  } catch (error) {
    console.error("Error checking for first admin:", error);
    // En caso de error, asumir que no es el primer admin para evitar bloqueos.
    return false; 
  }
}

/**
 * Crea el primer documento de administrador.
 */
export async function createFirstAdmin({ email, password }: Omit<Admin, 'id'>): Promise<void> {
  try {
    const isAdminFirst = await isFirstAdmin();
    if (!isAdminFirst) {
      throw new Error("Ya existe un administrador. No se puede crear uno nuevo por este método.");
    }
    
    await addDoc(collection(db, 'admins'), {
      email,
      password, // ¡NO SEGURO PARA PRODUCCIÓN!
      createdAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error creating first admin:", error);
    throw error; // Propagar el error para que la UI lo maneje
  }
}
