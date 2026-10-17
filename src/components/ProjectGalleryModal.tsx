import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ThemeMode } from '../types/portfolio';
import { soundManager } from '../utils/audio';
import { processImageFile } from '../utils/imageStorage';
import {
  uploadVideoToServer,
  isVideoUrl,
  fetchServerVideos,
} from '../utils/mediaUpload';
import {
  X,
  Plus,
  Trash2,
  Star,
  Upload,
  Link as LinkIcon,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Edit2,
  Sparkles,
  CheckCircle2,
  Check,
  Video,
  Play,
  Film,
} from 'lucide-react';

interface ProjectGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  circleId: string;
  projectId: string;
  title: string;
  category: string;
  client?: string;
  currentThumbnailUrl: string;
  galleryImages: string[];
  theme: ThemeMode;
  onUpdateGallery: (newImages: string[]) => void;
  onSetThumbnail: (imageUrl: string) => void;
  onUpdateTitle: (newTitle: string) => void;
  onOpenCircleCustomizer: () => void;
  onDeleteCircle?: (circleId: string) => void;
}

const SAMPLE_GALLERY_IMAGES = [
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=85',
];

export const ProjectGalleryModal: React.FC<ProjectGalleryModalProps> = ({
  isOpen,
  onClose,
  circleId,
  projectId,
  title,
  category,
  client,
  currentThumbnailUrl,
  galleryImages,
  theme,
  onUpdateGallery,
  onSetThumbnail,
  onUpdateTitle,
  onOpenCircleCustomizer,
  onDeleteCircle,
}) => {
  const [images, setImages] = useState<string[]>(galleryImages);
  const [isEditingTitle, setIsEditingTitle] = useState<boolean>(false);
  const [titleDraft, setTitleDraft] = useState<string>(title);
  const [cinemaIndex, setCinemaIndex] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [showAddMenu, setShowAddMenu] = useState<boolean>(false);
  const [urlInput, setUrlInput] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const videoInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setImages(galleryImages);
  }, [galleryImages]);

  useEffect(() => {
    setTitleDraft(title);
  }, [title]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Keyboard navigation for Cinema Lightbox
  useEffect(() => {
    if (cinemaIndex === null) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setCinemaIndex(null);
      if (e.key === 'ArrowRight' || e.key === 'j') {
        soundManager.playSlide?.();
        setCinemaIndex((curr) => (curr !== null ? (curr + 1) % images.length : 0));
      }
      if (e.key === 'ArrowLeft' || e.key === 'k') {
        soundManager.playSlide?.();
        setCinemaIndex((curr) => (curr !== null ? (curr - 1 + images.length) % images.length : 0));
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [cinemaIndex, images.length]);

  if (!isOpen) return null;

  // Add more images via File Picker
  const handleFilesSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    soundManager.playSlide?.();
    const newUrls: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const compressed = await processImageFile(file, 2560);
        newUrls.push(compressed);
      }

      const updated = [...newUrls, ...images];
      setImages(updated);
      onUpdateGallery(updated);
      showToast(`Added ${newUrls.length} new image${newUrls.length > 1 ? 's' : ''}!`);
    } catch (err) {
      console.error('Error processing gallery files:', err);
    } finally {
      setIsUploading(false);
      setShowAddMenu(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Upload video file to server and add to gallery
  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setUploadProgress(10);
      soundManager.playSlide?.();

      const result = await uploadVideoToServer(file, (percent) => {
        setUploadProgress(percent);
      });

      if (result.success && result.url) {
        const updated = [result.url, ...images];
        setImages(updated);
        onUpdateGallery(updated);
        showToast(`Video uploaded & stored on server: ${result.filename}!`);
      }
    } catch (err) {
      console.error('Error uploading video:', err);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      setShowAddMenu(false);
      if (videoInputRef.current) videoInputRef.current.value = '';
    }
  };

  // Add image or video via URL
  const handleAddUrl = () => {
    if (!urlInput.trim()) return;
    soundManager.playClick();
    const cleanUrl = urlInput.trim();
    const updated = [cleanUrl, ...images];
    setImages(updated);
    onUpdateGallery(updated);
    setUrlInput('');
    setShowAddMenu(false);
    showToast(isVideoUrl(cleanUrl) ? 'Video link added to gallery!' : 'Image added to gallery!');
  };

  // Add random preset sample
  const handleAddSample = () => {
    soundManager.playClick();
    const unusedSamples = SAMPLE_GALLERY_IMAGES.filter((s) => !images.includes(s));
    const sample =
      unusedSamples.length > 0
        ? unusedSamples[Math.floor(Math.random() * unusedSamples.length)]
        : SAMPLE_GALLERY_IMAGES[Math.floor(Math.random() * SAMPLE_GALLERY_IMAGES.length)];
    const updated = [sample, ...images];
    setImages(updated);
    onUpdateGallery(updated);
    setShowAddMenu(false);
    showToast('Design preset added to gallery!');
  };

  // Delete image or video from gallery
  const handleDeleteImage = (itemToRemove: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    soundManager.playClick();

    if (images.length <= 1) {
      alert('The gallery must have at least one media item.');
      return;
    }

    const updated = images.filter((img) => img !== itemToRemove);
    setImages(updated);
    onUpdateGallery(updated);

    // If deleting active cinema image, step back
    if (cinemaIndex !== null) {
      if (updated.length === 0) {
        setCinemaIndex(null);
      } else {
        setCinemaIndex(Math.min(cinemaIndex, updated.length - 1));
      }
    }

    // If deleting the active circle thumbnail, set to first remaining
    if (currentThumbnailUrl === itemToRemove && updated.length > 0) {
      onSetThumbnail(updated[0]);
    }

    showToast('Media item deleted');
  };

  // Set an image or video as the primary circle thumbnail
  const handleSetAsThumbnail = (targetMedia: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    soundManager.playClick();
    onSetThumbnail(targetMedia);
    showToast(isVideoUrl(targetMedia) ? 'Set as circle video thumbnail!' : 'Set as circle thumbnail image!');
  };

  // Save edited project title
  const handleSaveTitle = () => {
    if (!titleDraft.trim()) {
      setTitleDraft(title);
      setIsEditingTitle(false);
      return;
    }
    soundManager.playClick();
    onUpdateTitle(titleDraft.trim());
    setIsEditingTitle(false);
    showToast('Project title updated!');
  };

  return (
    <AnimatePresence>
      <div
        onClick={onClose}
        className="fixed inset-0 z-50 overflow-y-auto overscroll-contain bg-black/85 backdrop-blur-md px-3 sm:px-6 py-8 flex items-center justify-center min-h-screen cursor-pointer"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
          className={`relative max-w-4xl w-full rounded-2xl border shadow-2xl overflow-hidden cursor-default transition-colors ${
            theme === 'light'
              ? 'bg-[#fbfbfa] text-[#0c0c0e] border-neutral-300'
              : 'bg-[#101014] text-white border-neutral-800'
          }`}
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-4 border-b border-black/10 dark:border-white/10">
            <div className="flex items-start gap-3 min-w-0">
              <span className="w-2.5 h-2.5 rounded-full bg-[#e62b1e] mt-2 shrink-0" />
              <div className="min-w-0">
                {isEditingTitle ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={titleDraft}
                      onChange={(e) => setTitleDraft(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveTitle();
                        if (e.key === 'Escape') {
                          setTitleDraft(title);
                          setIsEditingTitle(false);
                        }
                      }}
                      autoFocus
                      className="px-2.5 py-1 text-sm font-unbounded font-black rounded border border-[#e62b1e] bg-transparent outline-none"
                    />
                    <button
                      onClick={handleSaveTitle}
                      className="px-2.5 py-1 text-xs font-mono font-bold bg-[#e62b1e] text-white rounded cursor-pointer"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setTitleDraft(title);
                        setIsEditingTitle(false);
                      }}
                      className="px-2 py-1 text-xs font-mono text-neutral-500 cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <h2 className="font-unbounded font-black text-base sm:text-lg tracking-tight uppercase truncate">
                      {title}
                    </h2>
                    <button
                      onClick={() => setIsEditingTitle(true)}
                      className="p-1 rounded text-neutral-400 hover:text-[#e62b1e] hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
                      title="Edit project title"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
                <div className="flex items-center gap-2 text-xs font-mono-tabular text-neutral-500 dark:text-neutral-400 mt-0.5">
                  <span className="uppercase font-semibold">{category}</span>
                  {client && <span>• {client}</span>}
                  <span>• {images.length} Media items</span>
                </div>
              </div>
            </div>

            {/* Header Right Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => {
                  soundManager.playClick();
                  onOpenCircleCustomizer();
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-mono text-xs font-bold transition-all cursor-pointer border ${
                  theme === 'light'
                    ? 'border-neutral-300 hover:border-[#e62b1e] text-neutral-800'
                    : 'border-neutral-700 hover:border-[#e62b1e] text-neutral-200'
                }`}
                title="Change circle thumbnail and name"
              >
                <Edit2 className="w-3 h-3 text-[#e62b1e]" />
                <span>Customize Circle</span>
              </button>

              {onDeleteCircle && (
                <button
                  onClick={() => {
                    if (window.confirm(`Remove circle "${title}" from the recent work canvas?`)) {
                      soundManager.playClick();
                      onDeleteCircle(circleId);
                    }
                  }}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-full font-mono text-xs font-bold text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer border border-red-500/30"
                  title="Remove this circle from canvas"
                >
                  <Trash2 className="w-3 h-3" />
                  <span className="hidden sm:inline">Remove</span>
                </button>
              )}

              <button
                onClick={() => {
                  soundManager.playClick();
                  onClose();
                }}
                className="w-8 h-8 flex items-center justify-center rounded-full text-neutral-500 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer ml-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Subheader: Upload Media Action Bar */}
          <div className="flex items-center justify-between px-6 py-3 border-b border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02]">
            <span className="font-mono-tabular text-xs uppercase tracking-wider text-neutral-500 font-bold">
              Gallery & Media Assets
            </span>

            <div className="flex items-center gap-2 relative">
              {/* Hidden File Inputs */}
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleFilesSelected}
                className="hidden"
              />
              <input
                ref={videoInputRef}
                type="file"
                accept="video/mp4,video/webm,video/quicktime,video/ogg,video/m4v"
                onChange={handleVideoUpload}
                className="hidden"
              />

              {/* Upload Video Button (Stored on Server) */}
              <button
                onClick={() => videoInputRef.current?.click()}
                disabled={isUploading}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-black text-white dark:bg-white dark:text-neutral-900 font-mono text-xs font-bold uppercase tracking-wider shadow-sm transition-colors cursor-pointer disabled:opacity-50"
                title="Upload a video to store on the server and show in gallery"
              >
                <Video className="w-3.5 h-3.5 text-[#e62b1e]" />
                <span>{isUploading ? `Uploading ${uploadProgress}%...` : 'Upload Video'}</span>
              </button>

              {/* Upload Photos Button */}
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#e62b1e] hover:bg-[#d02418] text-white font-mono text-xs font-bold uppercase tracking-wider shadow-sm transition-colors cursor-pointer disabled:opacity-50"
                title="Upload images from your computer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Photos</span>
              </button>

              <button
                onClick={() => setShowAddMenu(!showAddMenu)}
                className={`p-1.5 rounded-lg border text-xs transition-colors cursor-pointer ${
                  showAddMenu
                    ? 'bg-black text-white dark:bg-white dark:text-black border-transparent'
                    : 'border-black/15 dark:border-white/15 text-neutral-600 dark:text-neutral-300 hover:text-black dark:hover:text-white'
                }`}
                title="More ways to add media"
              >
                <Plus className="w-4 h-4" />
              </button>

              {/* Add Menu Popup */}
              {showAddMenu && (
                <div
                  className={`absolute right-0 top-full mt-2 w-72 p-3 rounded-xl border shadow-2xl z-40 transition-colors ${
                    theme === 'light'
                      ? 'bg-white border-neutral-300 text-neutral-900'
                      : 'bg-[#18181f] border-neutral-700 text-white'
                  }`}
                >
                  <span className="block font-mono-tabular text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-2">
                    Add Media by Link or Preset
                  </span>

                  {/* URL Input */}
                  <div className="flex gap-1.5 mb-2.5">
                    <input
                      type="url"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      placeholder="Paste image or video URL..."
                      className="flex-1 px-2.5 py-1 rounded text-xs font-mono outline-none border border-neutral-300 dark:border-neutral-700 bg-transparent"
                    />
                    <button
                      onClick={handleAddUrl}
                      className="px-2.5 py-1 bg-[#e62b1e] text-white text-xs font-bold rounded cursor-pointer"
                    >
                      Add
                    </button>
                  </div>

                  {/* Sample Preset Button */}
                  <button
                    onClick={handleAddSample}
                    className="w-full py-1.5 px-2.5 text-left text-xs font-mono font-bold rounded hover:bg-[#e62b1e]/10 hover:text-[#e62b1e] transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#e62b1e]" />
                    <span>Add Curated Design Preset</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Toast Notification */}
          <AnimatePresence>
            {toastMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-20 left-1/2 -translate-x-1/2 z-40 px-4 py-2 bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 rounded-full text-xs font-mono font-bold shadow-xl flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 text-[#e62b1e]" />
                <span>{toastMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Media Gallery Cards Grid */}
          <div className="p-6 max-h-[68vh] overflow-y-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {images.map((itemUrl, idx) => {
                const isThumbnail = currentThumbnailUrl === itemUrl;
                const isVid = isVideoUrl(itemUrl);

                return (
                  <div
                    key={`${itemUrl}-${idx}`}
                    onClick={() => setCinemaIndex(idx)}
                    className="group relative rounded-xl overflow-hidden border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 aspect-[16/11] cursor-pointer shadow-sm hover:shadow-xl transition-all"
                  >
                    {/* Media Render: Video or Image */}
                    {isVid ? (
                      <div className="relative w-full h-full bg-black flex items-center justify-center">
                        <video
                          src={itemUrl}
                          muted
                          playsInline
                          preload="metadata"
                          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500 ease-out"
                        />
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none group-hover:scale-110 transition-transform">
                          <div className="w-10 h-10 rounded-full bg-black/70 backdrop-blur-xs flex items-center justify-center text-white border border-white/20 shadow-lg">
                            <Play className="w-4 h-4 fill-white ml-0.5" />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <img
                        src={itemUrl}
                        alt={`Gallery item ${idx + 1}`}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover object-center group-hover:scale-[1.03] transition-transform duration-500 ease-out"
                      />
                    )}

                    {/* Gradient Overlay for controls */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                    {/* Top Badges & Actions */}
                    <div className="absolute top-3 inset-x-3 flex items-center justify-between gap-2 z-10">
                      {/* Thumbnail Indicator Badge */}
                      {isThumbnail ? (
                        <span className="px-2.5 py-1 rounded-full bg-[#e62b1e] text-white font-mono text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-md">
                          <Star className="w-3 h-3 fill-white" />
                          <span>Circle Thumbnail</span>
                        </span>
                      ) : (
                        <button
                          onClick={(e) => handleSetAsThumbnail(itemUrl, e)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity px-2.5 py-1 rounded-full bg-black/75 hover:bg-[#e62b1e] text-white font-mono text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-md cursor-pointer"
                          title="Set this media as the main circle thumbnail"
                        >
                          <Star className="w-3 h-3" />
                          <span>Set Thumbnail</span>
                        </button>
                      )}

                      {/* Video Tag */}
                      {isVid && !isThumbnail && (
                        <span className="px-2 py-0.5 rounded bg-black/60 text-white font-mono text-[9px] font-bold uppercase">
                          VIDEO
                        </span>
                      )}

                      {/* Delete Media Button */}
                      <button
                        onClick={(e) => handleDeleteImage(itemUrl, e)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity w-8 h-8 rounded-full bg-red-600/90 hover:bg-red-600 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-110 cursor-pointer ml-auto"
                        title="Delete this item from gallery"
                        aria-label="Delete media"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Bottom Preview Pill */}
                    <div className="absolute bottom-3 inset-x-3 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none">
                      <span className="font-mono-tabular text-[11px] text-white font-bold drop-shadow-md">
                        {idx + 1} / {images.length} {isVid ? '• Video' : ''}
                      </span>
                      <span className="px-2.5 py-1 rounded bg-black/80 backdrop-blur-sm text-white font-mono text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                        <Maximize2 className="w-3 h-3 text-[#e62b1e]" />
                        <span>{isVid ? 'Play' : 'Expand'}</span>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer Bar */}
          <div className="px-6 py-3 border-t border-black/10 dark:border-white/10 flex items-center justify-between text-xs font-mono-tabular bg-black/[0.02] dark:bg-white/[0.02]">
            <span className="text-neutral-500">
              Hover an item to set as circle thumbnail or delete. Click to inspect or play.
            </span>
            <button
              onClick={() => {
                soundManager.playClick();
                onClose();
              }}
              className="px-4 py-1.5 rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-bold uppercase hover:bg-[#e62b1e] dark:hover:bg-[#e62b1e] dark:hover:text-white transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        </motion.div>

        {/* Fullscreen Cinema Lightbox (Plays video or shows image) */}
        {cinemaIndex !== null && images[cinemaIndex] && (
          <div
            onClick={() => setCinemaIndex(null)}
            className="fixed inset-0 z-60 bg-black/95 flex flex-col items-center justify-between p-4 sm:p-6 cursor-pointer"
          >
            {/* Cinema Header */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-full flex items-center justify-between text-white select-none cursor-default"
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-sm font-bold text-[#e62b1e]">
                  {cinemaIndex + 1} / {images.length}
                </span>
                <span className="font-unbounded text-sm font-bold truncate max-w-md">
                  {title}
                </span>
                {isVideoUrl(images[cinemaIndex]) && (
                  <span className="px-2 py-0.5 rounded bg-[#e62b1e] text-white font-mono text-[10px] font-bold uppercase">
                    VIDEO
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3">
                {currentThumbnailUrl === images[cinemaIndex] ? (
                  <span className="px-3 py-1 rounded-full bg-[#e62b1e] text-white font-mono text-xs font-bold flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 fill-white" />
                    <span>Primary Thumbnail</span>
                  </span>
                ) : (
                  <button
                    onClick={(e) => handleSetAsThumbnail(images[cinemaIndex], e)}
                    className="px-3 py-1 rounded-full bg-white/15 hover:bg-[#e62b1e] text-white font-mono text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Star className="w-3.5 h-3.5" />
                    <span>Set as Thumbnail</span>
                  </button>
                )}

                <button
                  onClick={(e) => handleDeleteImage(images[cinemaIndex], e)}
                  className="px-3 py-1 rounded-full bg-red-600/80 hover:bg-red-600 text-white font-mono text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>

                <button
                  onClick={() => setCinemaIndex(null)}
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-[#e62b1e] text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Cinema Main Stage */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-5xl max-h-[75vh] w-full flex items-center justify-center my-auto cursor-default"
            >
              {isVideoUrl(images[cinemaIndex]) ? (
                <video
                  src={images[cinemaIndex]}
                  controls
                  autoPlay
                  playsInline
                  className="max-w-full max-h-[75vh] rounded-lg shadow-2xl bg-black"
                />
              ) : (
                <img
                  src={images[cinemaIndex]}
                  alt={`Cinema view ${cinemaIndex + 1}`}
                  referrerPolicy="no-referrer"
                  className="max-w-full max-h-[75vh] object-contain drop-shadow-2xl rounded-lg"
                />
              )}

              {/* Prev Slide Button */}
              {images.length > 1 && (
                <button
                  onClick={() => {
                    soundManager.playSlide?.();
                    setCinemaIndex((cinemaIndex - 1 + images.length) % images.length);
                  }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/60 hover:bg-white text-white hover:text-black flex items-center justify-center transition-colors cursor-pointer shadow-xl z-20"
                  title="Previous item"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              )}

              {/* Next Slide Button */}
              {images.length > 1 && (
                <button
                  onClick={() => {
                    soundManager.playSlide?.();
                    setCinemaIndex((cinemaIndex + 1) % images.length);
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/60 hover:bg-white text-white hover:text-black flex items-center justify-center transition-colors cursor-pointer shadow-xl z-20"
                  title="Next item"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              )}
            </div>

            {/* Cinema Navigation Strip */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-2 overflow-x-auto max-w-full py-2 px-4 cursor-default"
            >
              {images.map((mediaUrl, i) => {
                const isVid = isVideoUrl(mediaUrl);
                return (
                  <button
                    key={i}
                    onClick={() => setCinemaIndex(i)}
                    className={`w-12 h-12 rounded-lg overflow-hidden border-2 shrink-0 transition-all cursor-pointer relative bg-black ${
                      i === cinemaIndex
                        ? 'border-[#e62b1e] scale-110 ring-2 ring-[#e62b1e]/50'
                        : 'border-transparent opacity-50 hover:opacity-100'
                    }`}
                  >
                    {isVid ? (
                      <>
                        <video src={mediaUrl} muted playsInline className="w-full h-full object-cover" />
                        <Play className="w-2.5 h-2.5 text-white absolute inset-0 m-auto" />
                      </>
                    ) : (
                      <img
                        src={mediaUrl}
                        alt={`Thumb ${i + 1}`}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </AnimatePresence>
  );
};
