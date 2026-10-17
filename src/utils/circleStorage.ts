/**
 * Circle Customization & Project Gallery Storage Utility
 * Manages custom thumbnails, names/titles, image galleries, and custom/removed circles for Recent Works.
 * Synchronously caches in localStorage and broadcasts updates across the app.
 */

export interface CircleData {
  title?: string;
  imageUrl?: string;
  videoUrl?: string;
  mediaType?: 'image' | 'video';
  gallery?: string[];
  updatedAt?: number;
}

export interface CustomCircleItem {
  id: string;
  index: string;
  title: string;
  subtitle: string;
  category: 'Campaigns & Festivals' | 'Logofolio & Branding' | 'Editorial & Lookbooks' | 'Packaging' | 'Motion & Video';
  year: string;
  tool: string;
  client: string;
  imageUrl: string;
  videoUrl?: string;
  mediaType?: 'image' | 'video';
  aspect: 'landscape' | 'portrait' | 'square';
  description: string;
  processNotes: string;
  tags: string[];
}

const STORAGE_KEY = 'kaushik_circle_customizations_v2';
const CUSTOM_PROJECTS_KEY = 'kaushik_custom_added_projects_v1';
const REMOVED_PROJECTS_KEY = 'kaushik_removed_projects_v1';

// In-memory caches
let memoryCustomizations: Record<string, CircleData> = {};
let memoryCustomProjects: CustomCircleItem[] = [];
let memoryRemovedProjectIds: string[] = [];

// Initialize from localStorage
if (typeof window !== 'undefined') {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      memoryCustomizations = JSON.parse(raw);
    }
  } catch (e) {
    console.warn('Failed to load circle customizations from localStorage:', e);
  }

  try {
    const rawProjects = localStorage.getItem(CUSTOM_PROJECTS_KEY);
    if (rawProjects) {
      memoryCustomProjects = JSON.parse(rawProjects);
    }
  } catch (e) {
    console.warn('Failed to load custom projects from localStorage:', e);
  }

  try {
    const rawRemoved = localStorage.getItem(REMOVED_PROJECTS_KEY);
    if (rawRemoved) {
      memoryRemovedProjectIds = JSON.parse(rawRemoved);
    }
  } catch (e) {
    console.warn('Failed to load removed project IDs from localStorage:', e);
  }
}

/**
 * Default gallery sets for portfolio items
 */
const DEFAULT_GALLERIES: Record<string, string[]> = {
  'pg-better-candle': [
    '/projects/better-candle.png',
    'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=1200&q=85',
  ],
  'pg-harmony': [
    '/projects/harmony-brand-design.png',
    'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=85',
  ],
  'pg-biocule': [
    '/projects/rebranding-for-biocule.png',
    'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1200&q=85',
  ],
  'pg-the-trost': [
    '/projects/the-trost.webp',
    '/projects/the-trost.png',
    'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=85',
  ],
  'pg-horology': [
    '/projects/all-about-horology.webp',
    'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=1200&q=85',
  ],
  'pg-superdry': [
    '/projects/superdry-campaign.webp',
    '/projects/superdry-outlet.webp',
    'https://images.unsplash.com/photo-1523381294911-8d3cead13475?auto=format&fit=crop&w=1200&q=85',
  ],
  'pg-combine': [
    '/projects/combine-sports.webp',
    'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=85',
  ],
  'pg-cha-brochure': [
    '/projects/cha-brochure.webp',
    '/projects/cha-tea-drops.webp',
    '/projects/cha-tea-drops.png',
  ],
  'pg-themonk-tokyo': [
    '/projects/the-world-collection-tokyo.webp',
    '/projects/the-monk-eyewear.webp',
    'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1200&q=85',
  ],
  'pg-soledition': [
    '/projects/soledition-2024.webp',
    'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=1200&q=85',
  ],
  'pg-superdry-outlet': [
    '/projects/superdry-outlet.webp',
    '/projects/superdry-campaign.webp',
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=85',
  ],
  'pg-themonk-frames': [
    '/projects/the-monk-eyewear.webp',
    '/projects/lookbook-themonk.webp',
    'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=1200&q=85',
  ],
  'pg-masala-store': [
    '/projects/masala-synergy-store.webp',
    '/projects/masala-synergy.webp',
    'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1200&q=85',
  ],
  'pg-masala': [
    '/projects/masala-synergy.webp',
    '/projects/masala-synergy-store.webp',
    'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=1200&q=85',
  ],
  'pg-shuchi': [
    '/projects/shuchi-beltings.webp',
    'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=85',
  ],
};

/**
 * Get the initial or saved gallery images for a project/circle
 */
export function getProjectGallery(circleId: string, projectId: string, fallbackImageUrl: string): string[] {
  // 1. Check custom circle override
  const custom = memoryCustomizations[circleId]?.gallery;
  if (custom && custom.length > 0) {
    return custom;
  }

  // 2. Check custom project override
  const projectCustom = memoryCustomizations[projectId]?.gallery;
  if (projectCustom && projectCustom.length > 0) {
    return projectCustom;
  }

  // 3. Check default gallery sets
  const defaults = DEFAULT_GALLERIES[projectId];
  if (defaults && defaults.length > 0) {
    return defaults;
  }

  // 4. Fallback to image + sample design images
  return [
    fallbackImageUrl,
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1200&q=85',
  ];
}

/**
 * Get all circle customizations
 */
export function getAllCircleCustomizations(): Record<string, CircleData> {
  return { ...memoryCustomizations };
}

/**
 * Get customization for a specific circle
 */
export function getCircleCustomization(circleId: string): CircleData | undefined {
  return memoryCustomizations[circleId];
}

/**
 * Save custom title, thumbnail, or gallery for a circle
 */
export function saveCircleCustomization(circleId: string, updates: Partial<CircleData>): void {
  const current = memoryCustomizations[circleId] || {};
  memoryCustomizations[circleId] = {
    ...current,
    ...updates,
    updatedAt: Date.now(),
  };

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(memoryCustomizations));
      window.dispatchEvent(
        new CustomEvent('kaushik_circles_updated', {
          detail: { circleId, customizations: memoryCustomizations },
        })
      );
    } catch (e) {
      console.warn('LocalStorage save failed (quota may be full):', e);
    }
  }
}

/**
 * Set circle thumbnail image
 */
export function setCircleThumbnail(circleId: string, imageUrl: string): void {
  saveCircleCustomization(circleId, { imageUrl, mediaType: 'image' });
}

/**
 * Set circle video (persists uploaded/selected video for this circle)
 */
export function setCircleVideo(circleId: string, videoUrl: string): void {
  saveCircleCustomization(circleId, { videoUrl, imageUrl: videoUrl, mediaType: 'video' });
}

/**
 * Set circle media (image or video)
 */
export function setCircleMedia(circleId: string, mediaUrl: string, mediaType: 'image' | 'video'): void {
  if (mediaType === 'video') {
    saveCircleCustomization(circleId, { videoUrl: mediaUrl, imageUrl: mediaUrl, mediaType: 'video' });
  } else {
    saveCircleCustomization(circleId, { imageUrl: mediaUrl, mediaType: 'image' });
  }
}

/**
 * Set circle title/name
 */
export function setCircleTitle(circleId: string, title: string): void {
  saveCircleCustomization(circleId, { title });
}

/**
 * Add image to a circle's gallery
 */
export function addImageToCircleGallery(
  circleId: string,
  newImageUrl: string,
  currentGallery: string[]
): string[] {
  const current = memoryCustomizations[circleId]?.gallery || currentGallery;
  const updatedGallery = [newImageUrl, ...current];
  saveCircleCustomization(circleId, { gallery: updatedGallery });
  return updatedGallery;
}

/**
 * Delete image from a circle's gallery
 */
export function removeImageFromCircleGallery(
  circleId: string,
  imageToRemove: string,
  currentGallery: string[]
): { updatedGallery: string[]; newThumbnail?: string } {
  const current = memoryCustomizations[circleId]?.gallery || currentGallery;
  const updatedGallery = current.filter((img) => img !== imageToRemove);
  
  // If the deleted image was the current thumbnail, automatically pick another image
  const currentThumbnail = memoryCustomizations[circleId]?.imageUrl;
  let newThumbnail = currentThumbnail;
  if (currentThumbnail === imageToRemove && updatedGallery.length > 0) {
    newThumbnail = updatedGallery[0];
  }

  saveCircleCustomization(circleId, {
    gallery: updatedGallery,
    ...(newThumbnail ? { imageUrl: newThumbnail } : {}),
  });

  return { updatedGallery, newThumbnail };
}

/**
 * Reset a circle's customizations back to default
 */
export function resetCircleCustomization(circleId: string): void {
  delete memoryCustomizations[circleId];
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(memoryCustomizations));
      window.dispatchEvent(
        new CustomEvent('kaushik_circles_updated', {
          detail: { circleId, customizations: memoryCustomizations },
        })
      );
    } catch (e) {
      console.warn('LocalStorage reset failed:', e);
    }
  }
}

/**
 * Get all custom added projects
 */
export function getCustomProjects(): CustomCircleItem[] {
  return [...memoryCustomProjects];
}

/**
 * Add a custom project circle
 */
export function addCustomProject(item: CustomCircleItem, initialGallery?: string[]): void {
  memoryCustomProjects = [item, ...memoryCustomProjects];

  // If initial gallery was provided, save it under the circle's ID
  if (initialGallery && initialGallery.length > 0) {
    memoryCustomizations[item.id] = {
      title: item.title,
      imageUrl: item.imageUrl,
      gallery: initialGallery,
      updatedAt: Date.now(),
    };
  }

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(CUSTOM_PROJECTS_KEY, JSON.stringify(memoryCustomProjects));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(memoryCustomizations));
      window.dispatchEvent(
        new CustomEvent('kaushik_circles_updated', {
          detail: { addedItem: item },
        })
      );
    } catch (e) {
      console.warn('Failed to save custom projects to localStorage:', e);
    }
  }
}

/**
 * Get list of removed circle IDs
 */
export function getRemovedProjectIds(): string[] {
  return [...memoryRemovedProjectIds];
}

/**
 * Remove a circle by ID (persists across reloads)
 */
export function removeCircle(circleId: string): void {
  if (!memoryRemovedProjectIds.includes(circleId)) {
    memoryRemovedProjectIds = [...memoryRemovedProjectIds, circleId];
  }
  // Also remove from custom projects if it was user-added
  memoryCustomProjects = memoryCustomProjects.filter((p) => p.id !== circleId);

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(REMOVED_PROJECTS_KEY, JSON.stringify(memoryRemovedProjectIds));
      localStorage.setItem(CUSTOM_PROJECTS_KEY, JSON.stringify(memoryCustomProjects));
      window.dispatchEvent(
        new CustomEvent('kaushik_circles_updated', {
          detail: { removedCircleId: circleId },
        })
      );
    } catch (e) {
      console.warn('Failed to save removed project to localStorage:', e);
    }
  }
}

/**
 * Restore a previously removed circle
 */
export function restoreRemovedCircle(circleId: string): void {
  memoryRemovedProjectIds = memoryRemovedProjectIds.filter((id) => id !== circleId);
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(REMOVED_PROJECTS_KEY, JSON.stringify(memoryRemovedProjectIds));
      window.dispatchEvent(
        new CustomEvent('kaushik_circles_updated', {
          detail: { restoredCircleId: circleId },
        })
      );
    } catch (e) {
      console.warn('Failed to restore circle in localStorage:', e);
    }
  }
}

/**
 * Restore all circles (clears removals and resets default set)
 */
export function restoreAllCircles(): void {
  memoryRemovedProjectIds = [];
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(REMOVED_PROJECTS_KEY);
      window.dispatchEvent(
        new CustomEvent('kaushik_circles_updated', {
          detail: { reset: true },
        })
      );
    } catch (e) {
      console.warn('Failed to reset removed projects:', e);
    }
  }
}
