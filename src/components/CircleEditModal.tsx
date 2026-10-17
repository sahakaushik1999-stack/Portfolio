import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ThemeMode } from '../types/portfolio';
import { soundManager } from '../utils/audio';
import { processImageFile } from '../utils/imageStorage';
import {
  uploadVideoToServer,
  fetchServerVideos,
  deleteServerVideo,
  isVideoUrl,
  formatFileSize,
  ServerVideoItem,
} from '../utils/mediaUpload';
import {
  X,
  Upload,
  Link as LinkIcon,
  RotateCcw,
  Check,
  Sparkles,
  Image as ImageIcon,
  CheckCircle2,
  Trash2,
  Video,
  Play,
  HardDrive,
  Film,
} from 'lucide-react';

interface CircleEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  circleId: string;
  initialTitle: string;
  initialImageUrl: string;
  initialVideoUrl?: string;
  initialMediaType?: 'image' | 'video';
  galleryImages?: string[];
  theme: ThemeMode;
  onSave: (title: string, imageUrl: string, videoUrl?: string, mediaType?: 'image' | 'video') => void;
  onReset?: () => void;
  onDeleteCircle?: (circleId: string) => void;
}

const PRESET_THUMBNAILS = [
  { title: 'Better Candle', url: '/projects/better-candle.png' },
  { title: 'Harmony Acoustic', url: '/projects/harmony-brand-design.png' },
  { title: 'Biocule Skincare', url: '/projects/rebranding-for-biocule.png' },
  { title: 'The Trost Ads', url: '/projects/the-trost.webp' },
  { title: 'All About Horology', url: '/projects/all-about-horology.webp' },
  { title: 'Superdry Movement', url: '/projects/superdry-campaign.webp' },
  { title: 'Combine Sports', url: '/projects/combine-sports.webp' },
  { title: 'Cha Tea Brochure', url: '/projects/cha-brochure.webp' },
  { title: 'Tokyo Eyewear Lookbook', url: '/projects/the-world-collection-tokyo.webp' },
  { title: 'Soledition Sneaker Fest', url: '/projects/soledition-2024.webp' },
  { title: 'Masala Synergy Apothecary', url: '/projects/masala-synergy.webp' },
  { title: 'Shuchi Industrial CAD', url: '/projects/shuchi-beltings.webp' },
  { title: 'Abstract 3D Liquid', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80' },
  { title: 'Prism Geometry', url: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=600&q=80' },
  { title: 'Cyberpunk Neon', url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80' },
];

// Curated high quality motion video presets for testing & instant use
const PRESET_VIDEOS = [
  {
    title: '3D Liquid Chrome Loop',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-abstract-liquid-reflections-in-motion-42514-large.mp4',
    subtitle: 'Metallic fluid simulation',
  },
  {
    title: 'Neon Light Tunnel 60fps',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-futuristic-tunnel-with-neon-lights-42516-large.mp4',
    subtitle: 'Cyberpunk geometric tunnel',
  },
  {
    title: 'Digital Particles Wave',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-digital-particles-in-motion-42517-large.mp4',
    subtitle: 'Kinetic particle swarm',
  },
];

export const CircleEditModal: React.FC<CircleEditModalProps> = ({
  isOpen,
  onClose,
  circleId,
  initialTitle,
  initialImageUrl,
  initialVideoUrl,
  initialMediaType,
  galleryImages = [],
  theme,
  onSave,
  onReset,
  onDeleteCircle,
}) => {
  const [title, setTitle] = useState<string>(initialTitle);
  const [mediaUrl, setMediaUrl] = useState<string>(initialVideoUrl || initialImageUrl);
  const [mediaType, setMediaType] = useState<'image' | 'video'>(
    initialMediaType || (isVideoUrl(initialVideoUrl || initialImageUrl) ? 'video' : 'image')
  );
  const [activeTab, setActiveTab] = useState<'upload-video' | 'server-videos' | 'upload-image' | 'presets' | 'gallery' | 'url'>('upload-video');
  const [urlInput, setUrlInput] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [serverVideos, setServerVideos] = useState<ServerVideoItem[]>([]);
  const [isLoadingServerVideos, setIsLoadingServerVideos] = useState<boolean>(false);
  const [serverStatusNotice, setServerStatusNotice] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const videoInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setTitle(initialTitle);
      const initialMedia = initialVideoUrl || initialImageUrl;
      setMediaUrl(initialMedia);
      const isVid = isVideoUrl(initialMedia) || initialMediaType === 'video';
      setMediaType(isVid ? 'video' : 'image');
      setUrlInput('');
      setSavedSuccess(false);
      setUploadProgress(0);
      setServerStatusNotice(null);
      loadServerVideos();
    }
  }, [isOpen, initialTitle, initialImageUrl, initialVideoUrl, initialMediaType]);

  const loadServerVideos = async () => {
    setIsLoadingServerVideos(true);
    const videos = await fetchServerVideos();
    setServerVideos(videos);
    setIsLoadingServerVideos(false);
  };

  if (!isOpen) return null;

  // Handle uploading a video directly to the Express server
  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsProcessing(true);
      setUploadProgress(5);
      soundManager.playSlide?.();

      const result = await uploadVideoToServer(file, (percent) => {
        setUploadProgress(percent);
      });

      if (result.success && result.url) {
        setMediaUrl(result.url);
        setMediaType('video');
        setServerStatusNotice(`Video uploaded & stored on server: ${result.filename}`);
        await loadServerVideos();
      }
    } catch (err) {
      console.error('Failed to upload video to server:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle regular image file upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsProcessing(true);
      soundManager.playSlide?.();
      const compressedUrl = await processImageFile(file, 2048);
      setMediaUrl(compressedUrl);
      setMediaType('image');
    } catch (err) {
      console.error('Failed to process image file:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApplyUrl = () => {
    if (!urlInput.trim()) return;
    soundManager.playClick();
    const cleanUrl = urlInput.trim();
    setMediaUrl(cleanUrl);
    setMediaType(isVideoUrl(cleanUrl) ? 'video' : 'image');
    setUrlInput('');
  };

  const handleDeleteServerVideo = async (filename: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm(`Delete "${filename}" permanently from server?`)) return;
    soundManager.playClick();
    const ok = await deleteServerVideo(filename);
    if (ok) {
      setServerVideos((curr) => curr.filter((v) => v.filename !== filename));
      if (mediaUrl.includes(filename)) {
        setMediaUrl(initialImageUrl);
        setMediaType('image');
      }
    }
  };

  const handleSave = () => {
    soundManager.playClick();
    const finalTitle = title.trim() || initialTitle;
    if (mediaType === 'video') {
      onSave(finalTitle, mediaUrl, mediaUrl, 'video');
    } else {
      onSave(finalTitle, mediaUrl, undefined, 'image');
    }
    setSavedSuccess(true);
    setTimeout(() => {
      onClose();
    }, 450);
  };

  const isCurrentVideo = mediaType === 'video' || isVideoUrl(mediaUrl);

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
          className={`relative max-w-xl w-full rounded-2xl border shadow-2xl overflow-hidden cursor-default transition-colors ${
            theme === 'light'
              ? 'bg-[#fbfbfa] text-[#0c0c0e] border-neutral-300'
              : 'bg-[#101014] text-white border-neutral-800'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-black/10 dark:border-white/10">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#e62b1e]" />
              <h2 className="font-unbounded font-black text-sm sm:text-base uppercase tracking-tight">
                Customize Circle Media & Name
              </h2>
            </div>
            <button
              onClick={() => {
                soundManager.playClick();
                onClose();
              }}
              className="w-8 h-8 flex items-center justify-center rounded-full text-neutral-500 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 space-y-6">
            {/* Live Circle Preview Card */}
            <div className="flex items-center gap-4 sm:gap-5 p-4 rounded-xl bg-black/[0.03] dark:bg-white/[0.03] border border-black/10 dark:border-white/10">
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden shrink-0 border-2 border-[#e62b1e] ring-4 ring-[#e62b1e]/30 shadow-lg bg-black">
                {isCurrentVideo ? (
                  <video
                    src={mediaUrl}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover object-center"
                  />
                ) : (
                  <img
                    src={mediaUrl}
                    alt={title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center"
                  />
                )}
                {/* Video tag overlay badge */}
                {isCurrentVideo && (
                  <div className="absolute top-1.5 right-1.5 z-10 w-4 h-4 rounded-full bg-black/80 flex items-center justify-center text-white">
                    <Play className="w-2 h-2 fill-white ml-0.5" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/15 to-white/30 pointer-events-none rounded-full" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono-tabular font-bold uppercase tracking-wider text-[#e62b1e]">
                    LIVE PREVIEW
                  </span>
                  {isCurrentVideo && (
                    <span className="px-1.5 py-0.2 rounded bg-[#e62b1e] text-white text-[9px] font-mono font-bold uppercase">
                      VIDEO
                    </span>
                  )}
                </div>
                <h3 className="font-unbounded font-black text-base truncate mt-0.5">
                  {title || 'Untitled Circle'}
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 font-mono-tabular mt-1 truncate">
                  {mediaUrl.startsWith('/uploads/') ? 'Stored on Server' : mediaUrl.slice(0, 45)}
                </p>
              </div>
            </div>

            {/* Field: Circle Name / Title */}
            <div>
              <label className="block text-xs font-mono-tabular font-bold uppercase tracking-wider mb-2 text-neutral-600 dark:text-neutral-300">
                Circle Name / Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter custom circle name..."
                className={`w-full px-4 py-2.5 rounded-lg border font-unbounded text-sm font-bold tracking-tight outline-none transition-all ${
                  theme === 'light'
                    ? 'bg-white border-neutral-300 focus:border-[#e62b1e] text-neutral-900'
                    : 'bg-[#18181e] border-neutral-700 focus:border-[#e62b1e] text-white'
                }`}
              />
            </div>

            {/* Field: Choose or Upload Media */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-mono-tabular font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-300">
                  Circle Media (Videos & Images)
                </label>
                <span className="text-[11px] font-mono font-semibold text-[#e62b1e]">
                  Server Storage Enabled
                </span>
              </div>

              {/* Navigation Tabs */}
              <div className="flex items-center gap-1 p-1 rounded-lg bg-black/[0.04] dark:bg-white/[0.04] border border-black/10 dark:border-white/10 mb-4 text-xs font-mono-tabular font-bold flex-wrap">
                <button
                  type="button"
                  onClick={() => setActiveTab('upload-video')}
                  className={`py-1.5 px-2.5 rounded-md transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    activeTab === 'upload-video'
                      ? 'bg-[#e62b1e] text-white shadow-xs'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
                  }`}
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Upload Video</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('server-videos');
                    loadServerVideos();
                  }}
                  className={`py-1.5 px-2.5 rounded-md transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    activeTab === 'server-videos'
                      ? 'bg-[#e62b1e] text-white shadow-xs'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
                  }`}
                >
                  <HardDrive className="w-3.5 h-3.5" />
                  <span>Server Videos ({serverVideos.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('upload-image')}
                  className={`py-1.5 px-2.5 rounded-md transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    activeTab === 'upload-image'
                      ? 'bg-[#e62b1e] text-white shadow-xs'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
                  }`}
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Photo</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('presets')}
                  className={`py-1.5 px-2.5 rounded-md transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    activeTab === 'presets'
                      ? 'bg-[#e62b1e] text-white shadow-xs'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Presets</span>
                </button>

                {galleryImages.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setActiveTab('gallery')}
                    className={`py-1.5 px-2.5 rounded-md transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      activeTab === 'gallery'
                        ? 'bg-[#e62b1e] text-white shadow-xs'
                        : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
                    }`}
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Gallery</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setActiveTab('url')}
                  className={`py-1.5 px-2.5 rounded-md transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    activeTab === 'url'
                      ? 'bg-[#e62b1e] text-white shadow-xs'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
                  }`}
                >
                  <LinkIcon className="w-3.5 h-3.5" />
                  <span>URL</span>
                </button>
              </div>

              {/* Tab: Upload Video to Server */}
              {activeTab === 'upload-video' && (
                <div>
                  <input
                    ref={videoInputRef}
                    type="file"
                    accept="video/mp4,video/webm,video/quicktime,video/ogg,video/m4v"
                    onChange={handleVideoUpload}
                    className="hidden"
                  />
                  <div
                    onClick={() => videoInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all text-center ${
                      theme === 'light'
                        ? 'border-neutral-300 hover:border-[#e62b1e] bg-white hover:bg-neutral-50'
                        : 'border-neutral-700 hover:border-[#e62b1e] bg-[#18181e] hover:bg-[#1f1f27]'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-full bg-[#e62b1e]/10 text-[#e62b1e] flex items-center justify-center shadow-inner">
                      <Video className="w-6 h-6" />
                    </div>
                    <span className="font-unbounded font-black text-xs uppercase tracking-tight">
                      {isProcessing ? `Uploading Video (${uploadProgress}%)...` : 'Click to Upload Video to Server'}
                    </span>
                    <span className="text-[11px] text-neutral-500 font-mono-tabular">
                      MP4, WebM, MOV up to 200MB • Automatically saved to server
                    </span>

                    {/* Upload progress bar */}
                    {isProcessing && (
                      <div className="w-full max-w-xs mt-3 h-2 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#e62b1e] transition-all duration-200 rounded-full"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    )}
                  </div>

                  {serverStatusNotice && (
                    <div className="mt-3 p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-bold flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
                      <span className="truncate">{serverStatusNotice}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Tab: Server Stored Videos */}
              {activeTab === 'server-videos' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-neutral-500 uppercase">
                      Videos Stored on Server ({serverVideos.length})
                    </span>
                    <button
                      type="button"
                      onClick={loadServerVideos}
                      className="text-xs font-mono text-[#e62b1e] hover:underline cursor-pointer"
                    >
                      Refresh
                    </button>
                  </div>

                  {isLoadingServerVideos ? (
                    <div className="py-8 text-center text-xs font-mono text-neutral-500">
                      Loading server videos...
                    </div>
                  ) : serverVideos.length === 0 ? (
                    <div className="py-8 text-center rounded-xl border border-dashed border-neutral-300 dark:border-neutral-700 p-4">
                      <Film className="w-8 h-8 mx-auto text-neutral-400 mb-2 opacity-50" />
                      <p className="text-xs font-mono text-neutral-500">
                        No videos uploaded to the server yet.
                      </p>
                      <button
                        type="button"
                        onClick={() => setActiveTab('upload-video')}
                        className="mt-2 text-xs font-mono font-bold text-[#e62b1e] hover:underline cursor-pointer"
                      >
                        Upload your first video now
                      </button>
                    </div>
                  ) : (
                    <div className="max-h-56 overflow-y-auto space-y-2 pr-1">
                      {serverVideos.map((vid) => {
                        const isSelected = mediaUrl === vid.url;
                        return (
                          <div
                            key={vid.filename}
                            onClick={() => {
                              soundManager.playSlide?.();
                              setMediaUrl(vid.url);
                              setMediaType('video');
                            }}
                            className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-all ${
                              isSelected
                                ? 'border-[#e62b1e] bg-[#e62b1e]/10'
                                : 'border-black/10 dark:border-white/10 hover:border-[#e62b1e]/50 bg-black/[0.02] dark:bg-white/[0.02]'
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-10 h-10 rounded-full overflow-hidden bg-black shrink-0 relative flex items-center justify-center">
                                <video
                                  src={vid.url}
                                  muted
                                  playsInline
                                  className="w-full h-full object-cover"
                                />
                                <Play className="w-3 h-3 text-white absolute" />
                              </div>
                              <div className="min-w-0">
                                <p className="text-xs font-mono font-bold truncate">
                                  {vid.filename}
                                </p>
                                <p className="text-[10px] text-neutral-500 font-mono">
                                  {formatFileSize(vid.size)} • {new Date(vid.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              {isSelected && (
                                <span className="px-2 py-0.5 rounded-full bg-[#e62b1e] text-white text-[10px] font-mono font-bold uppercase">
                                  Selected
                                </span>
                              )}
                              <button
                                type="button"
                                onClick={(e) => handleDeleteServerVideo(vid.filename, e)}
                                className="p-1 rounded text-neutral-400 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                                title="Delete from server"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Tab: Upload Photo */}
              {activeTab === 'upload-image' && (
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all text-center ${
                      theme === 'light'
                        ? 'border-neutral-300 hover:border-[#e62b1e] bg-white hover:bg-neutral-50'
                        : 'border-neutral-700 hover:border-[#e62b1e] bg-[#18181e] hover:bg-[#1f1f27]'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-[#e62b1e]/10 text-[#e62b1e] flex items-center justify-center">
                      <Upload className="w-5 h-5" />
                    </div>
                    <span className="font-unbounded font-black text-xs uppercase tracking-tight">
                      {isProcessing ? 'Processing Image...' : 'Click to Upload Image'}
                    </span>
                    <span className="text-[11px] text-neutral-500 font-mono-tabular">
                      PNG, WebP, JPG, SVG up to 10MB
                    </span>
                  </div>
                </div>
              )}

              {/* Tab: Presets */}
              {activeTab === 'presets' && (
                <div className="space-y-3">
                  <div>
                    <span className="block text-[11px] font-mono font-bold text-neutral-500 uppercase mb-2">
                      Motion Video Loops (Sample)
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {PRESET_VIDEOS.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            soundManager.playSlide?.();
                            setMediaUrl(preset.url);
                            setMediaType('video');
                          }}
                          className={`p-2 rounded-xl border text-left flex items-center gap-2 cursor-pointer transition-all ${
                            mediaUrl === preset.url
                              ? 'border-[#e62b1e] bg-[#e62b1e]/10'
                              : 'border-black/10 dark:border-white/10 hover:border-[#e62b1e]/50'
                          }`}
                        >
                          <div className="w-8 h-8 rounded-full overflow-hidden bg-black shrink-0 relative flex items-center justify-center">
                            <video src={preset.url} muted playsInline className="w-full h-full object-cover" />
                            <Play className="w-2.5 h-2.5 text-white absolute" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[11px] font-mono font-bold truncate">{preset.title}</p>
                            <p className="text-[9px] text-neutral-500 truncate">{preset.subtitle}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="block text-[11px] font-mono font-bold text-neutral-500 uppercase mb-2">
                      Curated Image Thumbnails
                    </span>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 max-h-36 overflow-y-auto p-1">
                      {PRESET_THUMBNAILS.map((preset, idx) => {
                        const isSelected = mediaUrl === preset.url;
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              soundManager.playSlide?.();
                              setMediaUrl(preset.url);
                              setMediaType('image');
                            }}
                            className={`group relative aspect-square rounded-full overflow-hidden border-2 transition-all cursor-pointer ${
                              isSelected
                                ? 'border-[#e62b1e] scale-105 shadow-md ring-2 ring-[#e62b1e]/50'
                                : 'border-transparent hover:scale-105 opacity-80 hover:opacity-100'
                            }`}
                            title={preset.title}
                          >
                            <img
                              src={preset.url}
                              alt={preset.title}
                              className="w-full h-full object-cover"
                            />
                            {isSelected && (
                              <div className="absolute inset-0 bg-[#e62b1e]/40 flex items-center justify-center text-white">
                                <Check className="w-3.5 h-3.5" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab: Project Gallery Images */}
              {activeTab === 'gallery' && galleryImages.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-48 overflow-y-auto p-1">
                  {galleryImages.map((img, idx) => {
                    const isSelected = mediaUrl === img;
                    const isVid = isVideoUrl(img);
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          soundManager.playSlide?.();
                          setMediaUrl(img);
                          setMediaType(isVid ? 'video' : 'image');
                        }}
                        className={`group relative aspect-[16/11] rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                          isSelected
                            ? 'border-[#e62b1e] scale-105 shadow-md'
                            : 'border-transparent hover:scale-105 opacity-80 hover:opacity-100'
                        }`}
                      >
                        {isVid ? (
                          <video src={img} muted playsInline className="w-full h-full object-cover" />
                        ) : (
                          <img src={img} alt={`Gallery item ${idx}`} className="w-full h-full object-cover" />
                        )}
                        {isSelected && (
                          <div className="absolute inset-0 bg-[#e62b1e]/40 flex items-center justify-center text-white">
                            <Check className="w-4 h-4" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Tab: Custom Media URL */}
              {activeTab === 'url' && (
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      placeholder="Paste image or video URL (e.g. https://... or /uploads/...)"
                      className={`flex-1 px-3.5 py-2 rounded-lg border text-xs font-mono outline-none ${
                        theme === 'light'
                          ? 'bg-white border-neutral-300 focus:border-[#e62b1e] text-neutral-900'
                          : 'bg-[#18181e] border-neutral-700 focus:border-[#e62b1e] text-white'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={handleApplyUrl}
                      className="px-4 py-2 rounded-lg bg-[#e62b1e] hover:bg-[#d02418] text-white font-mono text-xs font-bold uppercase transition-colors cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>
                  <span className="block text-[11px] text-neutral-500 font-mono-tabular">
                    Supports MP4, WebM, MOV video links or JPG, PNG, WebP images.
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02]">
            <div className="flex items-center gap-4">
              {onReset && (
                <button
                  type="button"
                  onClick={() => {
                    soundManager.playClick();
                    onReset();
                  }}
                  className="flex items-center gap-1.5 text-xs font-mono-tabular font-bold uppercase text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Default</span>
                </button>
              )}

              {onDeleteCircle && (
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm(`Are you sure you want to remove the "${title}" circle from recent works?`)) {
                      soundManager.playClick();
                      onDeleteCircle(circleId);
                      onClose();
                    }
                  }}
                  className="flex items-center gap-1.5 text-xs font-mono-tabular font-bold uppercase text-red-500 hover:text-red-600 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove Circle</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => {
                  soundManager.playClick();
                  onClose();
                }}
                className="px-4 py-2 rounded-lg border border-black/15 dark:border-white/15 text-xs font-mono-tabular font-bold uppercase hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={savedSuccess}
                className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-[#e62b1e] hover:bg-[#d02418] text-white text-xs font-mono-tabular font-bold uppercase shadow-lg transition-all cursor-pointer disabled:opacity-75"
              >
                {savedSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Saved!</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
