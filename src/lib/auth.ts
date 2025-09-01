
'use server';

import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Admin } from '@/models/admin';

/**
 * Verifica si las credenciales coinciden con un documento en la colección 'admins'.
 */
export async function authenticateAdmin({ email, password }: Omit<Admin, 'id'>): Promise<boolean> {
  try {
    const adminsCollection = collection(db, 'admins');
    const q = query(adminsCollection, where('email', '==', email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log('No admin found with that email.');
      return false;
    }

    const adminDoc = querySnapshot.docs[0];
    const adminData = adminDoc.data() as Admin;

    // ¡IMPORTANTE! Esta es una comparación de texto plano, no es segura para producción.
    // En un entorno real, la contraseña debería estar hasheada.
    if (adminData.password === password) {
      return true;
    } else {
      console.log('Admin password does not match.');
      return false;
    }
  } catch (error) {
    console.error("Error authenticating admin from Firestore: ", error);
    return false;
  }
}
