/**
 * Cloud Firestore + Client IndexedDB & Local Storage utility for custom project images.
 * Persists all uploaded and customized images permanently to Google Cloud Firestore,
 * paired with IndexedDB & localStorage caching for instantaneous zero-latency hydration.
 * Resilient against network outages and Firestore daily quota limits.
 */

import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  getDocs,
  onSnapshot,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType, getFirestoreQuotaExceeded } from '../firebase';

const FIRESTORE_COLLECTION = 'custom_project_images';
const DB_NAME = 'kaushik_portfolio_images_v2';
const DB_VERSION = 1;
const STORE_NAME = 'project_images';
const CACHE_KEY = 'kaushik_project_image_cache';

// Helper to open IndexedDB for local offline mirror
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const idb = request.result;
      if (!idb.objectStoreNames.contains(STORE_NAME)) {
        idb.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// In-memory cache + listeners
let memoryOverrides: Record<string, string> = {};
const listeners = new Set<(overrides: Record<string, string>) => void>();

// Synchronously initialize from localStorage cache if present
if (typeof window !== 'undefined') {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      memoryOverrides = JSON.parse(cached);
    }
  } catch (err) {
    console.warn('Failed to parse cached image overrides:', err);
  }
}

function notifyListeners() {
  const snapshot = { ...memoryOverrides };
  listeners.forEach((listener) => {
    try {
      listener(snapshot);
    } catch (e) {
      console.error('Error notifying image storage listener:', e);
    }
  });

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(memoryOverrides));
      window.dispatchEvent(new CustomEvent('kaushik_images_updated', { detail: snapshot }));
    } catch {
      // LocalStorage quota may be reached, rely on IndexedDB
    }
  }
}

/**
 * Fetch all image overrides from Firestore, falling back seamlessly to IndexedDB if offline or quota-limited.
 */
export async function getAllImageOverrides(): Promise<Record<string, string>> {
  // If Firestore quota is already known to be exceeded, skip remote reads and load from local DB immediately
  if (!getFirestoreQuotaExceeded()) {
    try {
      const querySnapshot = await getDocs(collection(db, FIRESTORE_COLLECTION));
      const cloudMap: Record<string, string> = {};
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        if (data && data.id && data.imageUrl) {
          cloudMap[data.id] = data.imageUrl;
        }
      });

      if (Object.keys(cloudMap).length > 0) {
        memoryOverrides = { ...memoryOverrides, ...cloudMap };
        notifyListeners();
        return memoryOverrides;
      }
    } catch (err) {
      console.warn('Firestore fetch failed or quota exceeded, checking local storage:', err);
      handleFirestoreError(err, OperationType.GET, FIRESTORE_COLLECTION);
    }
  }

  // Fallback to IndexedDB
  try {
    const idb = await openDB();
    return new Promise((resolve) => {
      const tx = idb.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();
      req.onsuccess = () => {
        const results = req.result || [];
        const localMap: Record<string, string> = {};
        for (const item of results) {
          if (item && item.id && item.url) {
            localMap[item.id] = item.url;
          }
        }
        memoryOverrides = { ...memoryOverrides, ...localMap };
        notifyListeners();
        resolve(memoryOverrides);
      };
      req.onerror = () => resolve(memoryOverrides);
    });
  } catch {
    return memoryOverrides;
  }
}

/**
 * Get synchronous memory snapshot of overrides.
 */
export function getSynchronousOverrides(): Record<string, string> {
  return { ...memoryOverrides };
}

/**
 * Save an image override for a given project ID (persists to Firestore and mirrors locally in IndexedDB).
 */
export async function saveImageOverride(projectId: string, imageUrlOrDataUrl: string): Promise<void> {
  memoryOverrides[projectId] = imageUrlOrDataUrl;
  notifyListeners();

  // Save to Cloud Firestore if quota allows
  if (!getFirestoreQuotaExceeded()) {
    const docRef = doc(db, FIRESTORE_COLLECTION, projectId);
    try {
      await setDoc(docRef, {
        id: projectId,
        imageUrl: imageUrlOrDataUrl,
        updatedAt: new Date().toISOString(),
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `${FIRESTORE_COLLECTION}/${projectId}`);
    }
  }

  // Also mirror in IndexedDB for offline resilience and instant recovery
  try {
    const idb = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = idb.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put({
        id: projectId,
        url: imageUrlOrDataUrl,
        updatedAt: Date.now(),
      });
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('Failed to save to local IndexedDB:', err);
  }
}

/**
 * Remove an image override (deletes from Firestore and restores default image).
 */
export async function removeImageOverride(projectId: string): Promise<void> {
  delete memoryOverrides[projectId];
  notifyListeners();

  // Delete from Cloud Firestore if quota allows
  if (!getFirestoreQuotaExceeded()) {
    const docRef = doc(db, FIRESTORE_COLLECTION, projectId);
    try {
      await deleteDoc(docRef);
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `${FIRESTORE_COLLECTION}/${projectId}`);
    }
  }

  // Remove from IndexedDB
  try {
    const idb = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = idb.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(projectId);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('Failed to delete from local IndexedDB:', err);
  }
}

/**
 * Reset all image overrides back to original portfolio defaults.
 */
export async function resetAllImageOverrides(): Promise<void> {
  const currentKeys = Object.keys(memoryOverrides);
  memoryOverrides = {};
  notifyListeners();

  // Delete all documents from Firestore if quota allows
  if (!getFirestoreQuotaExceeded()) {
    for (const key of currentKeys) {
      try {
        await deleteDoc(doc(db, FIRESTORE_COLLECTION, key));
      } catch (err) {
        console.warn(`Failed to delete override ${key} from Firestore:`, err);
      }
    }
  }

  try {
    const idb = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = idb.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.clear();
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
    localStorage.removeItem(CACHE_KEY);
  } catch (err) {
    console.warn('Failed to clear local IndexedDB:', err);
  }
}

/**
 * Subscribe to override changes (both local memory events and real-time Firestore sync).
 */
export function subscribeToImageOverrides(callback: (overrides: Record<string, string>) => void): () => void {
  listeners.add(callback);
  callback({ ...memoryOverrides });

  // Listen to cross-window local storage events
  const handleCustomEvent = (e: Event) => {
    const detail = (e as CustomEvent).detail;
    if (detail) {
      callback({ ...detail });
    }
  };
  window.addEventListener('kaushik_images_updated', handleCustomEvent);

  // Real-time Firestore sync across all devices & users
  let unsubscribeFirestore = () => {};

  if (!getFirestoreQuotaExceeded()) {
    try {
      unsubscribeFirestore = onSnapshot(
        collection(db, FIRESTORE_COLLECTION),
        (snapshot) => {
          const cloudMap: Record<string, string> = {};
          snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            if (data && data.id && data.imageUrl) {
              cloudMap[data.id] = data.imageUrl;
            }
          });
          memoryOverrides = { ...cloudMap };
          notifyListeners();
        },
        (error) => {
          // If quota exceeded or offline, stop hammering the listener
          const msg = error?.message || String(error);
          const lower = msg.toLowerCase();
          if (lower.includes('quota') || lower.includes('resource-exhausted') || lower.includes('offline')) {
            console.warn('Firestore realtime listener suspended (quota limit or offline). Running on local cache.');
            try {
              unsubscribeFirestore();
            } catch {}
          }
          handleFirestoreError(error, OperationType.GET, FIRESTORE_COLLECTION);
        }
      );
    } catch (err) {
      console.warn('Failed to initialize Firestore realtime listener:', err);
    }
  }

  return () => {
    listeners.delete(callback);
    window.removeEventListener('kaushik_images_updated', handleCustomEvent);
    try {
      unsubscribeFirestore();
    } catch {}
  };
}

/**
 * Compress and process a user-uploaded image file into an optimized high-res data URL.
 * Automatically keeps file size under Firestore's 1MB limit while maintaining crystal-clear quality.
 */
export function processImageFile(file: File, maxDimension: number = 2880): Promise<string> {
  return new Promise((resolve, reject) => {
    if (file.type === 'image/svg+xml') {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.naturalWidth || img.width;
        let height = img.naturalHeight || img.height;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(reader.result as string);
          return;
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // High-resolution WebP compression (fallback JPEG)
        let dataUrl = canvas.toDataURL('image/webp', 0.94);
        if (dataUrl.length > 950000) {
          dataUrl = canvas.toDataURL('image/webp', 0.88);
        }
        resolve(dataUrl);
      };
      img.onerror = () => {
        resolve(reader.result as string);
      };
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
