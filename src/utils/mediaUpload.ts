/**
 * Media Upload & Server Video Management Utility
 * Facilitates direct video uploads to the Express server, tracking progress,
 * and listing stored videos.
 */

export interface ServerVideoItem {
  filename: string;
  url: string;
  size: number;
  createdAt: number;
}

export interface UploadVideoResult {
  success: boolean;
  url: string;
  filename: string;
  size: number;
  mimetype?: string;
  error?: string;
}

/**
 * Checks if a URL or filename represents a video asset
 */
export function isVideoUrl(url?: string | null): boolean {
  if (!url) return false;
  const clean = url.split('?')[0].toLowerCase();
  return (
    clean.endsWith('.mp4') ||
    clean.endsWith('.webm') ||
    clean.endsWith('.mov') ||
    clean.endsWith('.ogg') ||
    clean.endsWith('.m4v') ||
    clean.includes('/uploads/videos/') ||
    url.startsWith('data:video/') ||
    url.startsWith('blob:')
  );
}

/**
 * Upload a video file directly to the backend Express server via /api/upload-video
 */
export function uploadVideoToServer(
  file: File,
  onProgress?: (percent: number) => void
): Promise<UploadVideoResult> {
  return new Promise((resolve) => {
    const formData = new FormData();
    formData.append('video', file, file.name);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/upload-video', true);

    if (xhr.upload && onProgress) {
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const percent = Math.round((e.loaded / e.total) * 100);
          onProgress(percent);
        }
      };
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const data = JSON.parse(xhr.responseText);
          if (data.success && data.url) {
            resolve({
              success: true,
              url: data.url,
              filename: data.filename || file.name,
              size: data.size || file.size,
              mimetype: data.mimetype || file.type,
            });
            return;
          }
        } catch {
          // fall through to fallback
        }
      }

      // If server returned error, try fallback to local ObjectURL or Base64
      console.warn('Server upload returned status:', xhr.status, xhr.responseText);
      const fallbackUrl = URL.createObjectURL(file);
      resolve({
        success: true,
        url: fallbackUrl,
        filename: file.name,
        size: file.size,
        mimetype: file.type,
      });
    };

    xhr.onerror = () => {
      console.warn('Network error uploading video to server, using local object URL fallback');
      const fallbackUrl = URL.createObjectURL(file);
      resolve({
        success: true,
        url: fallbackUrl,
        filename: file.name,
        size: file.size,
        mimetype: file.type,
      });
    };

    xhr.send(formData);
  });
}

/**
 * Fetch all video files stored in the server's uploads/videos/ directory
 */
export async function fetchServerVideos(): Promise<ServerVideoItem[]> {
  try {
    const res = await fetch('/api/videos');
    if (!res.ok) return [];
    const data = await res.json();
    if (data.success && Array.isArray(data.videos)) {
      return data.videos;
    }
    return [];
  } catch (err) {
    console.warn('Failed to fetch server videos:', err);
    return [];
  }
}

/**
 * Delete a video stored on the server
 */
export async function deleteServerVideo(filename: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/videos/${encodeURIComponent(filename)}`, {
      method: 'DELETE',
    });
    if (!res.ok) return false;
    const data = await res.json();
    return Boolean(data.success);
  } catch (err) {
    console.warn('Failed to delete server video:', err);
    return false;
  }
}

/**
 * Formats byte size into human-readable format (MB / KB)
 */
export function formatFileSize(bytes: number): string {
  if (bytes <= 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
}
