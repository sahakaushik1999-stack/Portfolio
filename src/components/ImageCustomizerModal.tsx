import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Project, ThemeMode } from '../types/portfolio';
import {
  saveImageOverride,
  removeImageOverride,
  resetAllImageOverrides,
  processImageFile,
} from '../utils/imageStorage';
import { soundManager } from '../utils/audio';
import {
  Upload,
  Link as LinkIcon,
  RotateCcw,
  Check,
  X,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  Database,
  Trash2,
  Sparkles,
} from 'lucide-react';

interface ImageCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  theme: ThemeMode;
  initialProjectId?: string;
  customOverrides: Record<string, string>;
}

// Built-in library presets that the user can pick from anytime
const PRESET_LIBRARY = [
  {
    id: 'cha-tea-drops',
    title: 'Cha Tea Drops (Brochure 2024)',
    url: '/projects/cha-tea-drops.png',
  },
  {
    id: 'better-candle',
    title: 'Better Candle Packaging',
    url: '/projects/better-candle.png',
  },
  {
    id: 'harmony',
    title: 'Harmony Audio Lifestyle',
    url: '/projects/harmony-brand-design.png',
  },
  {
    id: 'biocule',
    title: 'Biocule Skincare Clean Science',
    url: '/projects/rebranding-for-biocule.png',
  },
  {
    id: 'the-trost',
    title: 'The Trost (Meta Ads)',
    url: '/projects/the-trost.webp',
  },
  {
    id: 'superdry',
    title: 'Superdry Urban Movement',
    url: '/projects/superdry.webp',
  },
  {
    id: 'horology',
    title: 'All About Horology Luxury Timepieces',
    url: '/projects/all-about-horology.webp',
  },
  {
    id: 'combine-sports',
    title: 'Combine Sports Identity',
    url: '/projects/combine-sports.webp',
  },
  {
    id: 'video-projects',
    title: 'Video Projects & Motion Teasers',
    url: '/projects/video-projects.webp',
  },
];

export const ImageCustomizerModal: React.FC<ImageCustomizerModalProps> = ({
  isOpen,
  onClose,
  projects,
  theme,
  initialProjectId,
  customOverrides,
}) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    initialProjectId || projects[0]?.id || ''
  );
  const [activeTab, setActiveTab] = useState<'upload' | 'url' | 'library'>('upload');
  const [urlInput, setUrlInput] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync selected project if initialProjectId changes
  useEffect(() => {
    if (initialProjectId && projects.some((p) => p.id === initialProjectId)) {
      setSelectedProjectId(initialProjectId);
    } else if (!selectedProjectId && projects.length > 0) {
      setSelectedProjectId(projects[0].id);
    }
  }, [initialProjectId, projects]);

  const selectedProject =
    projects.find((p) => p.id === selectedProjectId) || projects[0];

  const currentActiveUrl =
    (selectedProject && customOverrides[selectedProject.id]) ||
    selectedProject?.imageUrl ||
    '';

  const hasOverride = Boolean(
    selectedProject && customOverrides[selectedProject.id]
  );

  const customCount = Object.keys(customOverrides).length;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Keyboard escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Handle file drop or selection
  const handleFile = async (file: File) => {
    if (!file || !file.type.startsWith('image/')) {
      showToast('Please select a valid image file (PNG, JPG, WebP, SVG)');
      return;
    }
    try {
      setIsProcessing(true);
      soundManager.playClick();
      const processedDataUrl = await processImageFile(file, 1920);
      await saveImageOverride(selectedProject.id, processedDataUrl);
      showToast(`✓ Image for "${selectedProject.title}" saved permanently!`);
    } catch (err) {
      console.error(err);
      showToast('Failed to process image file. Please try another image.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    try {
      setIsProcessing(true);
      soundManager.playClick();
      await saveImageOverride(selectedProject.id, urlInput.trim());
      showToast(`✓ Image URL saved for "${selectedProject.title}"!`);
      setUrlInput('');
    } catch (err) {
      console.error(err);
      showToast('Failed to save image URL.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSelectPreset = async (presetUrl: string, presetTitle: string) => {
    try {
      soundManager.playClick();
      await saveImageOverride(selectedProject.id, presetUrl);
      showToast(`✓ Applied "${presetTitle}" to ${selectedProject.title}!`);
    } catch (err) {
      console.error(err);
      showToast('Failed to apply preset.');
    }
  };

  const handleResetCurrent = async () => {
    if (!selectedProject) return;
    try {
      soundManager.playClick();
      await removeImageOverride(selectedProject.id);
      showToast(`✓ Reset "${selectedProject.title}" to default image.`);
    } catch (err) {
      console.error(err);
    }
  };

  const handleResetAll = async () => {
    if (
      window.confirm(
        'Are you sure you want to restore all original portfolio images? Any custom uploads will be cleared.'
      )
    ) {
      try {
        soundManager.playClick();
        await resetAllImageOverrides();
        showToast('✓ All images reset to default portfolio values.');
      } catch (err) {
        console.error(err);
      }
    }
  };

  const currentIndex = projects.findIndex((p) => p.id === selectedProjectId);
  const handlePrevProject = () => {
    if (projects.length === 0) return;
    const prev = (currentIndex - 1 + projects.length) % projects.length;
    setSelectedProjectId(projects[prev].id);
  };
  const handleNextProject = () => {
    if (projects.length === 0) return;
    const next = (currentIndex + 1) % projects.length;
    setSelectedProjectId(projects[next].id);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-8 bg-black/80 backdrop-blur-md overflow-y-auto"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className={`relative w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden border flex flex-col max-h-[92vh] ${
              theme === 'light'
                ? 'bg-[#ffffff] text-[#0c0c0e] border-neutral-200'
                : 'bg-[#121215] text-[#f4f4f4] border-neutral-800'
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 sm:px-7 py-4 border-b border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#e62b1e]/10 text-[#e62b1e] flex items-center justify-center font-bold">
                  <ImageIcon size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-syne text-lg sm:text-xl font-black uppercase tracking-tight">
                      Website Image Manager
                    </h2>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-green-500/10 text-green-600 dark:text-green-400">
                      <Database size={10} /> Auto-Saved & Persistent
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Replace or customize card images. Your uploads are permanently saved and will show every time you open the website.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {customCount > 0 && (
                  <button
                    onClick={handleResetAll}
                    title="Reset all custom images"
                    className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold text-neutral-600 hover:text-red-500 dark:text-neutral-400 dark:hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={13} />
                    Reset All ({customCount})
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-neutral-500 hover:text-black dark:hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Horizontal Project Carousel Strip */}
            <div className="px-5 sm:px-7 py-3 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30 overflow-x-auto scrollbar-thin">
              <div className="flex items-center gap-2 min-w-max">
                <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-neutral-400 mr-2 select-none">
                  Select Card:
                </span>
                {projects.map((proj) => {
                  const isSelected = proj.id === selectedProjectId;
                  const isCustomized = Boolean(customOverrides[proj.id]);
                  return (
                    <button
                      key={proj.id}
                      onClick={() => {
                        soundManager.playClick();
                        setSelectedProjectId(proj.id);
                      }}
                      className={`relative flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-black text-white dark:bg-white dark:text-black font-bold shadow-md scale-105'
                          : 'bg-neutral-200/60 dark:bg-neutral-800/60 hover:bg-neutral-300/80 dark:hover:bg-neutral-700/80 text-neutral-700 dark:text-neutral-300'
                      }`}
                    >
                      <span>{proj.index}</span>
                      <span className="max-w-[120px] truncate">{proj.title}</span>
                      {isCustomized && (
                        <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" title="Custom image active" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Body: Two columns (Left: 4:5 Card Preview, Right: Upload Controls) */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-7 grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              {/* Left Column: Live Card Preview (4:5 Aspect Ratio matching 3D ribbon) */}
              <div className="md:col-span-5 flex flex-col items-center">
                <div className="w-full flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-neutral-500 uppercase">
                      Card Preview ({selectedProject?.index})
                    </span>
                    {hasOverride && (
                      <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                        Custom Active
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={handlePrevProject}
                      className="p-1 rounded hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"
                      title="Previous project"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button
                      onClick={handleNextProject}
                      className="p-1 rounded hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"
                      title="Next project"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>

                {/* 4:5 Card Box */}
                <div className="relative w-full max-w-[280px] aspect-[4/5] rounded-xl overflow-hidden shadow-2xl border border-neutral-300/60 dark:border-neutral-700/60 bg-neutral-900 group">
                  {currentActiveUrl ? (
                    <img
                      src={currentActiveUrl}
                      alt={selectedProject?.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center text-neutral-400">
                      <ImageIcon size={32} className="mb-2 opacity-50" />
                      <span className="text-xs font-mono">No Image</span>
                    </div>
                  )}

                  {/* Gradient Overlay & Metadata Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none flex flex-col justify-between p-4">
                    <div className="flex items-center justify-between">
                      <span className="font-syne font-black text-xl text-white drop-shadow">
                        {selectedProject?.index}
                      </span>
                      <span className="font-mono text-[10px] uppercase font-bold text-white/80 bg-black/50 px-2 py-0.5 rounded backdrop-blur-sm">
                        {selectedProject?.category}
                      </span>
                    </div>
                    <div>
                      <div className="text-[11px] font-mono text-white/70 uppercase">
                        {selectedProject?.client}
                      </div>
                      <h4 className="font-syne font-black text-base text-white leading-tight uppercase">
                        {selectedProject?.title}
                      </h4>
                    </div>
                  </div>
                </div>

                {/* Reset button for currently selected project */}
                {hasOverride && (
                  <button
                    onClick={handleResetCurrent}
                    className="mt-3 flex items-center gap-1.5 text-xs font-mono text-neutral-500 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                  >
                    <RotateCcw size={12} />
                    Restore Default Image
                  </button>
                )}
              </div>

              {/* Right Column: Upload / URL / Preset Tabs */}
              <div className="md:col-span-7 flex flex-col gap-4">
                {/* Method Navigation Tabs */}
                <div className="flex items-center gap-2 p-1 rounded-xl bg-neutral-100 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700/60">
                  <button
                    onClick={() => setActiveTab('upload')}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                      activeTab === 'upload'
                        ? 'bg-white dark:bg-neutral-700 text-black dark:text-white shadow-sm'
                        : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
                    }`}
                  >
                    <Upload size={14} />
                    Upload Image
                  </button>
                  <button
                    onClick={() => setActiveTab('library')}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                      activeTab === 'library'
                        ? 'bg-white dark:bg-neutral-700 text-black dark:text-white shadow-sm'
                        : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
                    }`}
                  >
                    <Sparkles size={14} />
                    Preset Library
                  </button>
                  <button
                    onClick={() => setActiveTab('url')}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                      activeTab === 'url'
                        ? 'bg-white dark:bg-neutral-700 text-black dark:text-white shadow-sm'
                        : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
                    }`}
                  >
                    <LinkIcon size={14} />
                    Image URL
                  </button>
                </div>

                {/* Tab 1: Upload from Computer */}
                {activeTab === 'upload' && (
                  <div className="flex flex-col gap-3">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleFile(e.target.files[0]);
                        }
                      }}
                    />

                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`w-full p-8 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                        isDragging
                          ? 'border-[#e62b1e] bg-[#e62b1e]/5 scale-[1.01]'
                          : 'border-neutral-300 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-500 bg-neutral-50/60 dark:bg-neutral-900/40'
                      }`}
                    >
                      <div className="w-12 h-12 rounded-2xl bg-neutral-200/80 dark:bg-neutral-800 flex items-center justify-center mb-3 text-neutral-600 dark:text-neutral-300">
                        <Upload size={22} />
                      </div>
                      <div className="font-syne font-bold text-sm mb-1 uppercase tracking-tight">
                        {isProcessing ? 'Processing Image...' : 'Click to Upload or Drag & Drop'}
                      </div>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-sm mb-3">
                        Select any PNG, JPG, WebP, or SVG from your device. It will be stored in your browser storage and stay updated every time you visit.
                      </p>
                      <span className="px-4 py-2 rounded-lg text-xs font-mono font-bold bg-black text-white dark:bg-white dark:text-black">
                        Browse Files
                      </span>
                    </div>

                    <div className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Automatic 1920px retina optimization keeps 3D perspective animations running at 60fps.
                    </div>
                  </div>
                )}

                {/* Tab 2: Preset Library (including Cha Tea Drops!) */}
                {activeTab === 'library' && (
                  <div className="flex flex-col gap-3">
                    <div className="text-xs text-neutral-500 dark:text-neutral-400">
                      Choose from recently uploaded design assets and portfolio project imagery:
                    </div>

                    <div className="grid grid-cols-3 gap-3 max-h-[310px] overflow-y-auto p-1 scrollbar-thin">
                      {PRESET_LIBRARY.map((item) => {
                        const isCurrentlyActive = currentActiveUrl === item.url;
                        return (
                          <button
                            key={item.id}
                            onClick={() => handleSelectPreset(item.url, item.title)}
                            className={`group relative rounded-xl overflow-hidden aspect-[4/5] border text-left cursor-pointer transition-all ${
                              isCurrentlyActive
                                ? 'border-[#e62b1e] ring-2 ring-[#e62b1e] scale-[1.02]'
                                : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-400'
                            }`}
                          >
                            <img
                              src={item.url}
                              alt={item.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-2">
                              <span className="text-[10px] font-mono font-bold text-white leading-tight line-clamp-2">
                                {item.title}
                              </span>
                            </div>
                            {isCurrentlyActive && (
                              <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-[#e62b1e] text-white flex items-center justify-center shadow">
                                <Check size={12} />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Tab 3: Image URL Input */}
                {activeTab === 'url' && (
                  <form onSubmit={handleUrlSubmit} className="flex flex-col gap-3">
                    <label className="text-xs font-mono font-bold text-neutral-600 dark:text-neutral-400">
                      Paste Public Image URL:
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                        placeholder="https://images.unsplash.com/photo-..."
                        className="flex-1 px-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-[#e62b1e]"
                      />
                      <button
                        type="submit"
                        disabled={!urlInput.trim() || isProcessing}
                        className="px-4 py-2.5 rounded-xl bg-black text-white dark:bg-white dark:text-black font-mono font-bold text-xs uppercase disabled:opacity-50 cursor-pointer"
                      >
                        Apply
                      </button>
                    </div>
                    <p className="text-[11px] text-neutral-500">
                      You can paste links from Behance, Unsplash, Imgur, or direct CDN image links.
                    </p>
                  </form>
                )}

                {/* Storage & Persistence Details */}
                <div className="mt-auto pt-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
                  <div className="flex items-center gap-1.5 font-mono text-[11px]">
                    <Database size={13} className="text-emerald-500" />
                    <span>Stored in IndexedDB & Browser Cache</span>
                  </div>
                  <button
                    onClick={onClose}
                    className="px-5 py-2 rounded-xl font-mono text-xs font-bold bg-black text-white dark:bg-white dark:text-black uppercase cursor-pointer hover:opacity-90 transition-opacity"
                  >
                    Done & Close
                  </button>
                </div>
              </div>
            </div>

            {/* Toast Notification */}
            <AnimatePresence>
              {toastMessage && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="absolute bottom-5 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl bg-black text-white dark:bg-white dark:text-black font-mono text-xs font-bold shadow-2xl flex items-center gap-2 border border-neutral-700"
                >
                  <Check size={14} className="text-emerald-400" />
                  {toastMessage}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
