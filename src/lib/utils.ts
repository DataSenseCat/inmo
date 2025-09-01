import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Timestamp } from "firebase/firestore";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function urlToDataUri(url: string): Promise<string> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${response.statusText}`);
  }
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Converts a Firebase Timestamp to a localized string, or returns a default value.
 * @param timestamp The Firebase Timestamp object.
 * @returns A localized date-time string or an empty string if timestamp is invalid.
 */
export function firebaseTimestampToString(timestamp: any): string {
    if (!timestamp || typeof timestamp.toDate !== 'function') {
        return '';
    }
    try {
        return (timestamp as Timestamp).toDate().toLocaleString();
    } catch (e) {
        return '';
    }
}

/**
 * Converts a File object to a Data URI string.
 * @param file The File object to convert.
 * @returns A promise that resolves with the Data URI string.
 */
export function fileToDataUri(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result as string);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
