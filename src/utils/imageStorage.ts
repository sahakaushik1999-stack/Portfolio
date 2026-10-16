/**
 * Robust Client & Local Storage utility for custom project images.
 * Uses IndexedDB for unlimited, high-resolution image data persistence,
 * paired with localStorage caching for instantaneous synchronous hydration.
 */

const DB_NAME = 'kaushik_portfolio_images_v2';
const DB_VERSION = 1;
const STORE_NAME = 'project_images';
const CACHE_KEY = 'kaushik_project_image_cache';

// Helper to open IndexedDB
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
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

  // Also broadcast across browser tabs via storage event or BroadcastChannel
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(memoryOverrides));
      window.dispatchEvent(new CustomEvent('kaushik_images_updated', { detail: snapshot }));
    } catch (err) {
      // If localStorage is full, ignore and rely on IndexedDB
    }
  }
}

/**
 * Get all current image overrides.
 */
export async function getAllImageOverrides(): Promise<Record<string, string>> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();
      req.onsuccess = () => {
        const results = req.result || [];
        const map: Record<string, string> = {};
        for (const item of results) {
          if (item && item.id && item.url) {
            map[item.id] = item.url;
          }
        }
        memoryOverrides = { ...memoryOverrides, ...map };
        // Sync cache
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify(memoryOverrides));
        } catch (_) {}
        resolve(memoryOverrides);
      };
      req.onerror = () => {
        resolve(memoryOverrides);
      };
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
 * Save an image override for a given project ID (persists in IndexedDB and localStorage).
 */
export async function saveImageOverride(projectId: string, imageUrlOrDataUrl: string): Promise<void> {
  memoryOverrides[projectId] = imageUrlOrDataUrl;
  notifyListeners();

  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
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
    console.warn('Failed to save image to IndexedDB, fallback to memory & localStorage:', err);
  }
}

/**
 * Remove an image override (restoring the project's original default image).
 */
export async function removeImageOverride(projectId: string): Promise<void> {
  delete memoryOverrides[projectId];
  notifyListeners();

  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(projectId);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('Failed to remove image from IndexedDB:', err);
  }
}

/**
 * Reset all image overrides back to original portfolio defaults.
 */
export async function resetAllImageOverrides(): Promise<void> {
  memoryOverrides = {};
  notifyListeners();

  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.clear();
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
    localStorage.removeItem(CACHE_KEY);
  } catch (err) {
    console.warn('Failed to clear IndexedDB:', err);
  }
}

/**
 * Subscribe to override changes.
 */
export function subscribeToImageOverrides(callback: (overrides: Record<string, string>) => void): () => void {
  listeners.add(callback);
  callback({ ...memoryOverrides });

  // Listen to cross-window events
  const handleCustomEvent = (e: Event) => {
    const detail = (e as CustomEvent).detail;
    if (detail) {
      callback({ ...detail });
    }
  };
  window.addEventListener('kaushik_images_updated', handleCustomEvent);

  return () => {
    listeners.delete(callback);
    window.removeEventListener('kaushik_images_updated', handleCustomEvent);
  };
}

/**
 * Compress and process a user-uploaded image file into an optimized high-res data URL.
 * Resizes large dimensions to max 1920px while maintaining crystal clarity,
 * preventing memory bloat in 3D perspective layers.
 */
export function processImageFile(file: File, maxDimension: number = 1920): Promise<string> {
  return new Promise((resolve, reject) => {
    // If SVG, read as raw text data URL
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

        // Prefer webp or jpeg
        const outputMime = file.type === 'image/png' ? 'image/png' : 'image/webp';
        const dataUrl = canvas.toDataURL(outputMime, 0.92);
        resolve(dataUrl);
      };
      img.onerror = () => {
        // Fallback to raw dataUrl
        resolve(reader.result as string);
      };
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
