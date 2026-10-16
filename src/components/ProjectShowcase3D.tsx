import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Project, ViewMode, ThemeMode } from '../types/portfolio';
import { ProjectVisual } from './ProjectVisual';
import { soundManager } from '../utils/audio';
import { Camera } from 'lucide-react';

interface ProjectShowcase3DProps {
  projects: Project[];
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  onOpenContact: () => void;
  onOpenShowreel: () => void;
  onSelectCaseStudy: (project: Project) => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
  isAudioOn: boolean;
  onToggleAudio: () => void;
  onOpenImageCustomizer?: (projectId?: string) => void;
  customOverrides?: Record<string, string>;
}

const ITEM_HEIGHT = 168; // Height allocated for each directory project item

export const ProjectShowcase3D: React.FC<ProjectShowcase3DProps> = ({
  projects,
  onViewChange,
  onOpenContact,
  onOpenShowreel,
  onSelectCaseStudy,
  theme,
  onToggleTheme,
  isAudioOn,
  onToggleAudio,
  onOpenImageCustomizer,
  customOverrides,
}) => {
  const [virtualIndex, setVirtualIndex] = useState<number>(0);
  const total = projects.length || 1;
  const activeIndex = ((virtualIndex % total) + total) % total;
  const activeProject = projects[activeIndex] || projects[0];

  const prevIndex = (activeIndex - 1 + total) % total;
  const nextIndex = (activeIndex + 1) % total;
  const prevProject = projects[prevIndex] || projects[0];
  const nextProject = projects[nextIndex] || projects[0];

  const [timeString, setTimeString] = useState<string>('17:16');
  const [isScrolling, setIsScrolling] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [windowWidth, setWindowWidth] = useState<number>(() =>
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Wheel and drag throttling
  const wheelAccumulatorRef = useRef<number>(0);
  const isTransitioningRef = useRef<boolean>(false);
  const dragStartYRef = useRef<number | null>(null);
  const scrollBlurTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);

  // Trigger gaussian blur effect on the metadata area during every scroll
  const triggerScrollBlur = useCallback(() => {
    setIsScrolling(true);
    if (scrollBlurTimeoutRef.current) {
      clearTimeout(scrollBlurTimeoutRef.current);
    }
    scrollBlurTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false);
    }, 380);
  }, []);

  // Cleanup blur timeout on unmount
  useEffect(() => {
    return () => {
      if (scrollBlurTimeoutRef.current) {
        clearTimeout(scrollBlurTimeoutRef.current);
      }
    };
  }, []);

  // Live Indian Standard Time (IST) Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      };
      setTimeString(new Intl.DateTimeFormat('en-GB', options).format(now));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Infinite Navigation by Step Offset
  const stepProject = useCallback(
    (delta: number) => {
      triggerScrollBlur();
      soundManager.playSlide();
      setVirtualIndex((prev) => prev + delta);
    },
    [triggerScrollBlur]
  );

  // Direct Click to Slot on the Infinite Carousel
  const goToVirtualIndex = useCallback(
    (targetSlot: number) => {
      triggerScrollBlur();
      soundManager.playSlide();
      setVirtualIndex(targetSlot);
    },
    [triggerScrollBlur]
  );

  // Keyboard navigation with infinite looping
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight' || e.key === 'j') {
        e.preventDefault();
        stepProject(1);
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft' || e.key === 'k') {
        e.preventDefault();
        stepProject(-1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [stepProject]);

  // Smooth Infinite Wheel Transition Listener
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      triggerScrollBlur();
      wheelAccumulatorRef.current += e.deltaY;

      if (isTransitioningRef.current) return;

      const threshold = 35;
      if (wheelAccumulatorRef.current > threshold) {
        isTransitioningRef.current = true;
        wheelAccumulatorRef.current = 0;
        stepProject(1);
        setTimeout(() => {
          isTransitioningRef.current = false;
        }, 280);
      } else if (wheelAccumulatorRef.current < -threshold) {
        isTransitioningRef.current = true;
        wheelAccumulatorRef.current = 0;
        stepProject(-1);
        setTimeout(() => {
          isTransitioningRef.current = false;
        }, 280);
      }
    },
    [stepProject, triggerScrollBlur]
  );

  // Drag Gesture Handlers with Infinite Looping
  const handleMouseDown = (e: React.MouseEvent) => {
    dragStartYRef.current = e.clientY;
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (dragStartYRef.current === null) return;
    const deltaY = dragStartYRef.current - e.clientY;
    if (deltaY > 25) {
      stepProject(1);
    } else if (deltaY < -25) {
      stepProject(-1);
    }
    dragStartYRef.current = null;
  };

  // Mobile Touch Swipe Handlers for Infinite Project Carousel
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null || touchStartYRef.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartXRef.current;
    const deltaY = e.changedTouches[0].clientY - touchStartYRef.current;
    touchStartXRef.current = null;
    touchStartYRef.current = null;

    if (Math.abs(deltaX) > 35 && Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX < 0) {
        stepProject(1);
      } else {
        stepProject(-1);
      }
    } else if (Math.abs(deltaY) > 40) {
      if (deltaY < 0) {
        stepProject(1);
      } else {
        stepProject(-1);
      }
    }
  };

  // Generate continuous active slot window around virtualIndex for infinite scroll
  const slotOffsets = [-4, -3, -2, -1, 0, 1, 2, 3, 4];
  const activeSlots = slotOffsets.map((offset) => virtualIndex + offset);

  return (
    <div
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className={`relative w-full h-screen sm:min-h-[720px] overflow-hidden select-none transition-colors duration-500 font-sans ${
        theme === 'light'
          ? 'bg-[#f4f4f1] text-[#0c0c0e]'
          : 'bg-[#09090b] text-[#f4f4f4]'
      }`}
    >
      {/* ================= WEBSITE VIEW (Visible on tablets md >= 768px and desktop to deliver the signature website experience) ================= */}
      <div className="hidden md:block w-full h-full relative">
        {/* ================= BACKGROUND: 3D DIAGONAL RIBBON (Infinite Circular Deck, 4:5 Aspect Ratio) ================= */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none perspective-container overflow-hidden z-10">
        <div className="relative w-[220px] md:w-[240px] lg:w-[320px] xl:w-[380px] 2xl:w-[460px] max-w-[34vw] max-h-[65vh] aspect-[4/5] preserve-3d">
          {projects.map((proj, idx) => {
            // Infinite circular neighborhood calculation
            let offset = (((idx - activeIndex) % total) + total) % total;
            if (offset > total / 2) offset -= total;

            // Only render neighborhood for top 60fps performance
            if (offset < -2 || offset > 3) return null;

            // 3D trajectory calculation along the diagonal perspective path for 4:5 cards, dynamically tuned for tablet and desktop
            const isTablet = windowWidth < 1024;
            const isSmallDesktop = windowWidth >= 1024 && windowWidth < 1280;

            let x = 0;
            let y = 0;
            let z = 0;
            let rotateZ = 0;
            let rotateY = 0;
            let scale = 1;
            let opacity = 1;
            let zIndex = 20 - Math.abs(offset);

            if (offset === 0) {
              // Active Center Card: 4:5 aspect ratio, centered, slight organic tilt
              x = 0;
              y = 0;
              z = isTablet ? 30 : isSmallDesktop ? 38 : 45;
              rotateZ = -2.5;
              rotateY = 0;
              scale = 1.02;
              opacity = 1;
              zIndex = 30;
            } else if (offset === 1) {
              // Card Ahead: fanning out to top-right safely within central corridor
              x = isTablet ? 34 : isSmallDesktop ? 80 : 135;
              y = isTablet ? -24 : isSmallDesktop ? -45 : -75;
              z = isTablet ? -75 : isSmallDesktop ? -100 : -130;
              rotateZ = -4.5;
              rotateY = isTablet ? -6 : -8;
              scale = isTablet ? 0.82 : 0.85;
              opacity = 0.85;
              zIndex = 25;
            } else if (offset === 2) {
              // Further Card Ahead
              x = isTablet ? 64 : isSmallDesktop ? 155 : 250;
              y = isTablet ? -48 : isSmallDesktop ? -90 : -145;
              z = isTablet ? -145 : isSmallDesktop ? -195 : -250;
              rotateZ = -6.5;
              rotateY = isTablet ? -9 : -12;
              scale = isTablet ? 0.68 : 0.70;
              opacity = isTablet ? 0.38 : 0.48;
              zIndex = 20;
            } else if (offset > 2) {
              // Incoming from top-right
              x = isTablet ? 90 : isSmallDesktop ? 220 : 340;
              y = isTablet ? -70 : isSmallDesktop ? -130 : -210;
              z = isTablet ? -210 : isSmallDesktop ? -280 : -360;
              rotateZ = -8.0;
              scale = 0.55;
              opacity = 0;
              zIndex = 10;
            } else if (offset === -1) {
              // Card Behind: Descending to lower-left safely
              x = isTablet ? -34 : isSmallDesktop ? -75 : -125;
              y = isTablet ? 24 : isSmallDesktop ? 45 : 75;
              z = isTablet ? -48 : isSmallDesktop ? -60 : -68;
              rotateZ = 4.2;
              rotateY = isTablet ? 6 : 8;
              scale = isTablet ? 0.84 : 0.88;
              opacity = 0.75;
              zIndex = 15;
            } else if (offset < -1) {
              // Outgoing to lower-left
              x = isTablet ? -64 : isSmallDesktop ? -145 : -230;
              y = isTablet ? 48 : isSmallDesktop ? 90 : 145;
              z = isTablet ? -105 : isSmallDesktop ? -125 : -155;
              rotateZ = 7.5;
              scale = isTablet ? 0.70 : 0.72;
              opacity = isTablet ? 0.32 : 0.38;
              zIndex = 5;
            }

            const isCurrent = offset === 0;

            return (
              <motion.div
                key={proj.id}
                onClick={() => {
                  if (isCurrent) {
                    onSelectCaseStudy(proj);
                  } else {
                    let diff = (((idx - activeIndex) % total) + total) % total;
                    if (diff > total / 2) diff -= total;
                    stepProject(diff);
                  }
                }}
                initial={false}
                animate={{
                  x,
                  y,
                  z,
                  rotateZ,
                  rotateY,
                  scale,
                  opacity,
                }}
                transition={{
                  duration: 0.65,
                  ease: [0.16, 1, 0.3, 1], // snappy luxury spring curve
                }}
                style={{
                  zIndex,
                  transformStyle: 'preserve-3d',
                }}
                className="absolute inset-0 pointer-events-auto cursor-pointer border-0 shadow-none outline-none ring-0 overflow-hidden aspect-[4/5]"
              >
                <ProjectVisual project={proj} isActive={isCurrent} />

                {/* Case Study & Image Customizer Hover hints on active card */}
                {isCurrent && (
                  <div className="absolute inset-0 bg-black/45 opacity-0 hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2.5 p-4 z-40">
                    <span className="px-4 py-2 bg-white text-black font-mono-tabular text-xs font-bold uppercase tracking-wider shadow-xl hover:bg-neutral-200 transition-colors">
                      View Case Study
                    </span>
                    {onOpenImageCustomizer && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenImageCustomizer(proj.id);
                        }}
                        className="px-3.5 py-1.5 bg-black/90 text-white border border-white/40 rounded-full font-mono-tabular text-[11px] font-bold uppercase tracking-wider shadow-xl hover:bg-[#e62b1e] hover:border-[#e62b1e] transition-all flex items-center gap-1.5 cursor-pointer backdrop-blur-sm"
                        title="Change this card's image"
                      >
                        <Camera size={13} className="text-[#e62b1e] group-hover:text-white" />
                        <span>Change Card Image</span>
                      </button>
                    )}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ================= LEFT COLUMN: MENU + METADATA + SERIAL NUMBER ================= */}
      <div className="absolute left-4 md:left-6 lg:left-8 xl:left-14 top-0 bottom-0 w-40 md:w-44 lg:w-56 xl:w-64 2xl:w-72 z-20 flex flex-col justify-between py-5 md:py-6 lg:py-8 xl:py-10 pointer-events-none">
        {/* Top: Menu & Navigation Stack (Never Blurred - Crisp and Legible) */}
        <div className="pointer-events-auto">
          <div className="font-mono-tabular text-[10px] md:text-xs text-neutral-600 dark:text-neutral-400 mb-2 md:mb-2.5 tracking-wider select-none font-semibold">
            Menu
          </div>
          <nav className="flex flex-col font-syne text-base md:text-lg lg:text-xl xl:text-2xl font-black tracking-tight uppercase leading-[0.88] space-y-0.5">
            {/* WORK */}
            <button
              onClick={() => {
                soundManager.playClick();
                onViewChange('work');
              }}
              className={`text-left flex items-center gap-1.5 group transition-colors cursor-pointer ${
                theme === 'light' ? 'text-[#0c0c0e]' : 'text-white'
              }`}
            >
              <span className="font-black text-sm md:text-base sm:text-lg">→</span>
              <span className="hover:opacity-70 transition-opacity">WORK</span>
            </button>

            {/* ABOUT */}
            <button
              onClick={() => {
                soundManager.playClick();
                onViewChange('about');
              }}
              className={`text-left pl-3.5 md:pl-4 sm:pl-5 hover:opacity-70 transition-opacity cursor-pointer ${
                theme === 'light' ? 'text-[#0c0c0e]' : 'text-white'
              }`}
            >
              ABOUT
            </button>

            {/* RECENT WORKS */}
            <button
              onClick={() => {
                soundManager.playClick();
                onViewChange('playground');
              }}
              className={`text-left pl-3.5 md:pl-4 sm:pl-5 hover:opacity-70 transition-opacity cursor-pointer ${
                theme === 'light' ? 'text-[#0c0c0e]' : 'text-white'
              }`}
            >
              RECENT WORKS
            </button>

            {/* CONTACT */}
            <button
              onClick={() => {
                soundManager.playClick();
                onOpenContact();
              }}
              className={`text-left pl-3.5 md:pl-4 sm:pl-5 hover:opacity-70 transition-opacity cursor-pointer ${
                theme === 'light' ? 'text-[#0c0c0e]' : 'text-white'
              }`}
            >
              CONTACT
            </button>
          </nav>
        </div>

        {/* Middle: Project Metadata (BRAND, CATEGORY - Perfectly Aligned Grid with Baseline Alignment) */}
        <div
          className={`pointer-events-auto hidden md:block transition-all duration-300 ease-out will-change-[filter,opacity,transform] ${
            isScrolling
              ? 'filter blur-[6px] opacity-35 scale-[0.98]'
              : 'filter blur-0 opacity-100 scale-100'
          }`}
        >
          <div className="grid grid-cols-[74px_1fr] md:grid-cols-[84px_1fr] lg:grid-cols-[92px_1fr] items-baseline gap-x-2.5 md:gap-x-3.5 lg:gap-x-4 gap-y-2 md:gap-y-2.5 lg:gap-y-3">
            {/* Brand */}
            <span className="font-mono-tabular text-[10px] md:text-xs text-neutral-500 dark:text-neutral-400 uppercase tracking-wider select-none font-semibold">
              Brand
            </span>
            <div
              className={`font-sans text-xs sm:text-sm font-bold leading-normal truncate ${
                theme === 'light' ? 'text-[#0c0c0e]' : 'text-white'
              }`}
            >
              {activeProject.client || activeProject.title}
            </div>

            {/* Category */}
            <span className="font-mono-tabular text-[10px] md:text-xs text-neutral-500 dark:text-neutral-400 uppercase tracking-wider select-none font-semibold">
              Category
            </span>
            <div
              className={`font-sans text-xs sm:text-sm font-bold leading-normal truncate ${
                theme === 'light' ? 'text-[#0c0c0e]' : 'text-white'
              }`}
            >
              {activeProject.category}
            </div>
          </div>
        </div>

        {/* Bottom: SCROLL, SELECTED WORK, Giant Serial Number + Revealed /14 (Never Blurred) */}
        <div className="pointer-events-auto select-none">
          {/* SCROLL label */}
          <div className="font-mono-tabular text-[9px] md:text-[10px] lg:text-[11px] tracking-widest uppercase text-neutral-600 dark:text-neutral-400 font-bold mb-0.5 select-none">
            SCROLL
          </div>

          {/* SELECTED WORK label */}
          <div className="font-mono-tabular text-[9px] md:text-[10px] lg:text-[11px] tracking-widest uppercase text-neutral-600 dark:text-neutral-400 font-bold mb-1 select-none">
            SELECTED WORK
          </div>

          {/* Numerals: Big number + Dynamic Project Count */}
          <div className="flex items-baseline relative z-30">
            <span
              className={`font-syne text-5xl md:text-6xl lg:text-7xl 2xl:text-[6.5rem] font-black select-none leading-none inline-block tracking-tighter ${
                theme === 'light' ? 'text-[#0c0c0e]' : 'text-white'
              }`}
            >
              {activeProject.index}
            </span>
            <span className="relative z-50 inline-block ml-2 md:ml-3 sm:ml-4 font-mono-tabular text-sm md:text-base lg:text-lg font-bold text-neutral-600 dark:text-neutral-400 select-none">
              /{projects.length < 10 ? `0${projects.length}` : projects.length}
            </span>
          </div>
        </div>
      </div>

      {/* ================= TOP BAR (Middle & Right Items) ================= */}
      <header className="absolute top-0 left-0 right-0 z-20 pt-4 md:pt-6 lg:pt-8 xl:pt-10 px-4 md:px-6 lg:px-8 xl:px-14 flex items-start justify-between pointer-events-none">
        {/* Left spacer matching Menu width so middle items sit in the exact same aligned position across pages */}
        <div className="w-40 md:w-44 lg:w-56 xl:w-64 2xl:w-72 shrink-0 pointer-events-none" />

        {/* Center: Audio & Working Globally (Positioned identically across all pages) */}
        <div className="hidden md:flex items-start gap-3 md:gap-5 lg:gap-10 xl:gap-16 font-mono-tabular text-xs pointer-events-auto">
          {/* Audio Toggle */}
          <button
            onClick={onToggleAudio}
            className={`hover:opacity-70 transition-opacity flex items-center gap-1 cursor-pointer pt-0.5 ${
              theme === 'light' ? 'text-[#0c0c0e]' : 'text-neutral-200'
            }`}
          >
            <span>Audio {isAudioOn ? 'On' : 'Off'}</span>
            <span className="opacity-50">—</span>
          </button>

          {/* Working Globally & Live IST Clock */}
          <div className="flex flex-col text-left font-sans">
            <span
              className={`text-xs font-bold tracking-tight ${
                theme === 'light' ? 'text-[#0c0c0e]' : 'text-white'
              }`}
            >
              Working globally
            </span>
            <span className="font-mono-tabular text-[11px] text-neutral-500 dark:text-neutral-400 font-medium">
              IST, {timeString}
            </span>
          </div>
        </div>

        {/* Right: Change Images Button & Day / Night Theme Switcher & Inquiries */}
        <div className="flex items-center gap-2.5 md:gap-4 lg:gap-6 pointer-events-auto">
          {/* Prominent Change Images Button */}
          {onOpenImageCustomizer && (
            <button
              onClick={() => onOpenImageCustomizer(activeProject.id)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-mono-tabular text-xs font-bold transition-all cursor-pointer border shadow-sm ${
                theme === 'light'
                  ? 'bg-[#0c0c0e] text-white border-black hover:bg-neutral-800'
                  : 'bg-white text-black border-white hover:bg-neutral-200'
              }`}
              title="Change and customize website images (auto-saved and persistent)"
            >
              <Camera size={13} className="text-[#e62b1e]" />
              <span className="uppercase tracking-wider">Change Images</span>
              {Object.keys(customOverrides || {}).length > 0 && (
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Custom images active" />
              )}
            </button>
          )}

          {/* Day / Night Theme Switcher */}
          <div className="flex items-center gap-1 font-mono-tabular text-xs tracking-wider pt-0.5">
            <button
              onClick={onToggleTheme}
              className={`px-1 py-0.5 uppercase transition-colors cursor-pointer ${
                theme === 'light'
                  ? 'font-bold text-[#0c0c0e] underline decoration-2'
                  : 'text-neutral-400 hover:text-white'
              }`}
              title="Switch to Daytime Theme (Light)"
            >
              Day
            </button>
            <span className="text-neutral-400 select-none">/</span>
            <button
              onClick={onToggleTheme}
              className={`px-1 py-0.5 uppercase transition-colors cursor-pointer ${
                theme === 'dark'
                  ? 'font-bold text-white underline decoration-2'
                  : 'text-neutral-500 hover:text-[#0c0c0e]'
              }`}
              title="Switch to Nighttime Theme (Dark)"
            >
              Night
            </button>
          </div>

          {/* Inquiries */}
          <div
            className={`font-sans text-xs pt-0.5 ${
              theme === 'light' ? 'text-[#0c0c0e]' : 'text-neutral-200'
            }`}
          >
            <span className="hidden xl:inline text-neutral-500 dark:text-neutral-400 mr-1.5">For inquiries</span>
            <button
              onClick={() => {
                soundManager.playClick();
                onOpenContact();
              }}
              className="underline font-bold hover:text-[#e62b1e] transition-colors cursor-pointer text-xs"
            >
              sahakaushik1999@gmail.com
            </button>
          </div>
        </div>
      </header>

      {/* ================= RIGHT COLUMN: INFINITE SMOOTH VERTICAL CAROUSEL ================= */}
      <aside className="absolute right-4 md:right-6 lg:right-8 xl:right-14 top-0 bottom-0 z-20 w-40 md:w-44 lg:w-56 xl:w-72 2xl:w-80 flex flex-col items-center justify-center pointer-events-none">
        {/* Smooth gradient vertical viewport with top/bottom edge fade */}
        <div className="relative w-full h-[52vh] md:h-[56vh] max-h-[440px] lg:max-h-[520px] flex items-center justify-center overflow-hidden [mask-image:linear-gradient(to_bottom,transparent_0%,black_16%,black_84%,transparent_100%)]">
          {activeSlots.map((slotIndex) => {
            const projectIndex = ((slotIndex % total) + total) % total;
            const proj = projects[projectIndex];
            const isCurrent = slotIndex === virtualIndex;
            const distFromCenter = Math.abs(slotIndex - virtualIndex);
            const dynamicItemHeight = windowWidth < 1024 ? 128 : 160;

            return (
              <motion.div
                key={slotIndex}
                onClick={() => goToVirtualIndex(slotIndex)}
                initial={false}
                animate={{
                  y: (slotIndex - virtualIndex) * dynamicItemHeight,
                  opacity: isCurrent ? 1 : distFromCenter === 1 ? 0.32 : distFromCenter === 2 ? 0.16 : 0.08,
                  scale: isCurrent ? 1 : 0.96,
                }}
                transition={{
                  duration: 0.55,
                  ease: [0.16, 1, 0.3, 1], // silky luxury spring curve matching ref video
                }}
                className={`absolute w-full flex flex-col items-center justify-center shrink-0 cursor-pointer select-none py-1 pointer-events-auto transition-opacity duration-300 ${
                  isCurrent ? '' : 'hover:opacity-75'
                }`}
                style={{
                  top: '50%',
                  marginTop: -dynamicItemHeight / 2,
                  height: dynamicItemHeight,
                }}
              >
                {/* Category in small muted caps (Matching Reference Video: Meta Ads) */}
                <div className="font-mono-tabular text-[8px] md:text-[9px] lg:text-[10px] uppercase tracking-widest text-[#e62b1e] dark:text-[#e62b1e] font-semibold mb-0.5 md:mb-1 text-center truncate max-w-full">
                  {proj.category || 'Meta Ads'}
                </div>

                {/* Studio / Client Title (Matching Reference Video: Bold, wide, uppercase) */}
                <h3
                  className={`font-syne text-xs md:text-sm lg:text-lg xl:text-2xl font-black tracking-tight uppercase text-center leading-tight ${
                    isCurrent
                      ? theme === 'light'
                        ? 'text-[#0c0c0e]'
                        : 'text-white'
                      : theme === 'light'
                      ? 'text-neutral-400'
                      : 'text-neutral-500'
                  }`}
                >
                  {proj.title}
                </h3>

                {/* Centered subtle dash (Matching Reference Video) */}
                <div className="text-neutral-400 my-0.5 text-xs select-none text-center">—</div>

                {/* Multi-line Description (Matching Reference Video: Based on the image) */}
                <p
                  className={`font-sans text-[9px] md:text-[10px] lg:text-xs max-w-[140px] md:max-w-[170px] lg:max-w-xs leading-relaxed px-1 text-center line-clamp-3 ${
                    isCurrent
                      ? theme === 'light'
                        ? 'text-[#222222]'
                        : 'text-[#d4d4d8]'
                      : 'text-neutral-400 dark:text-neutral-500'
                  }`}
                >
                  {proj.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </aside>

      {/* ================= BOTTOM RIGHT ('25 showreel ▶) ================= */}
      <footer className="absolute right-4 md:right-6 lg:right-8 xl:right-14 bottom-4 md:bottom-6 lg:bottom-10 z-20 pointer-events-auto">
        <button
          onClick={() => {
            soundManager.playClick();
            onOpenShowreel();
          }}
          className={`flex items-center gap-1.5 font-mono-tabular text-xs tracking-wider uppercase hover:text-[#e62b1e] dark:hover:text-[#e62b1e] transition-colors cursor-pointer group ${
            theme === 'light' ? 'text-[#0c0c0e]' : 'text-white'
          }`}
        >
          <span className="underline font-bold decoration-current group-hover:decoration-[#e62b1e]">
            '25 showreel
          </span>
          <span className="text-[10px] leading-none">▶</span>
        </button>
      </footer>
      </div> {/* End Desktop View Container */}

      {/* ================= MOBILE VIEW (Visible on mobile phones < md to give full touch experience) ================= */}
      <div className="block md:hidden w-full h-full relative overflow-hidden flex flex-col justify-between py-3 sm:py-4 px-4 sm:px-6 z-20">
        {/* Top Header: Hamburger (left) + KAUSHIK© (center) + Audio/Clock (tablet) + Day/Night Quick Switch (right) */}
        <div className="relative flex items-center justify-between w-full pt-1 pb-1 z-30 shrink-0">
          {/* Two-Line Clean Minimalist Hamburger Menu */}
          <button
            onClick={() => {
              soundManager.playClick();
              setIsMobileMenuOpen(true);
            }}
            className="w-10 h-8 flex flex-col justify-center gap-[5px] cursor-pointer"
            aria-label="Open navigation menu"
          >
            <span className="w-7 h-[2.5px] bg-[#0c0c0e] dark:bg-white transition-colors" />
            <span className="w-5 h-[2.5px] bg-[#0c0c0e] dark:bg-white transition-colors" />
          </button>

          {/* Center Brandmark: KAUSHIK© */}
          <div className="font-unbounded font-black text-lg sm:text-xl tracking-tight text-[#0c0c0e] dark:text-white select-none">
            KAUSHIK©
          </div>

          {/* Right: Audio + Clock + Quick Day/Night Toggle + Inquiry on Tablet */}
          <div className="flex items-center gap-2 sm:gap-4 md:gap-5">
            {onOpenImageCustomizer && (
              <button
                onClick={() => onOpenImageCustomizer(activeProject.id)}
                className="p-1.5 rounded border border-neutral-300 dark:border-neutral-700 text-[#0c0c0e] dark:text-white cursor-pointer active:scale-95 transition-transform flex items-center gap-1 font-mono text-[11px] font-bold"
                title="Change Card Image"
              >
                <Camera size={13} className="text-[#e62b1e]" />
                <span className="hidden xs:inline">IMAGES</span>
              </button>
            )}
            <button
              onClick={onToggleAudio}
              className="hidden sm:flex items-center gap-1 font-mono-tabular text-xs text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white cursor-pointer"
            >
              <span>Audio {isAudioOn ? 'On' : 'Off'}</span>
            </button>
            <span className="hidden md:inline font-mono-tabular text-[11px] text-neutral-500 font-medium">
              IST, {timeString}
            </span>
            <button
              onClick={onToggleTheme}
              className="font-mono-tabular text-xs font-bold px-2 py-1 uppercase tracking-wider rounded border border-neutral-300 dark:border-neutral-700 text-[#0c0c0e] dark:text-white cursor-pointer active:scale-95 transition-transform"
            >
              {theme === 'light' ? 'NIGHT' : 'DAY'}
            </button>
          </div>
        </div>

        {/* Main Mobile Stage: Clean single-column stack with safe bounded geometry */}
        <div className="relative w-full flex-1 flex flex-col justify-between my-auto py-1 z-20 min-h-0">
          {/* Mobile: Big Serial Index */}
          <div className="flex items-baseline px-1 select-none shrink-0">
            <span className="font-unbounded text-5xl sm:text-6xl font-black tracking-tighter text-[#0c0c0e] dark:text-white leading-none">
              {activeProject.index}
            </span>
            <span className="font-gotham text-xs font-bold text-neutral-600 dark:text-neutral-400 ml-2">
              /{projects.length < 10 ? `0${projects.length}` : projects.length}
            </span>
            <div className="ml-auto flex items-center gap-3">
              <span className="hidden sm:inline font-mono-tabular text-xs text-neutral-500 uppercase font-semibold">
                {activeProject.client}
              </span>
              <span className="font-gotham text-[10px] sm:text-xs uppercase font-bold tracking-widest text-[#e62b1e]">
                {activeProject.category}
              </span>
            </div>
          </div>

          {/* 3D ACCORDION DECK: Bounded vertical footprint ensures zero overlapping */}
          <div className="relative w-full flex-1 flex items-center justify-center pointer-events-none perspective-container py-2 min-h-0">
            <div className="relative w-[210px] xs:w-[240px] sm:w-[280px] max-w-[75vw] max-h-[48vh] aspect-[4/5] preserve-3d">
              {projects.map((proj, idx) => {
                let offset = (((idx - activeIndex) % total) + total) % total;
                if (offset > total / 2) offset -= total;
                if (offset < -2 || offset > 2) return null;

                // Safe bounded geometry: cards fan horizontally and in depth, keeping vertical footprint strictly controlled
                let x = 0;
                let y = 0;
                let z = 0;
                let rotateZ = 0;
                let rotateY = 0;
                let scale = 1;
                let opacity = 1;
                let zIndex = 20 - Math.abs(offset);

                if (offset === 0) {
                  x = 0;
                  y = 0;
                  z = 30;
                  rotateZ = -2.8;
                  rotateY = 0;
                  scale = 1.02;
                  opacity = 1;
                  zIndex = 30;
                } else if (offset === 1) {
                  x = 42;
                  y = -10;
                  z = -55;
                  rotateZ = -5.5;
                  rotateY = -8;
                  scale = 0.88;
                  opacity = 0.85;
                  zIndex = 25;
                } else if (offset === 2) {
                  x = 80;
                  y = -18;
                  z = -110;
                  rotateZ = -8.0;
                  rotateY = -12;
                  scale = 0.76;
                  opacity = 0.45;
                  zIndex = 20;
                } else if (offset === -1) {
                  x = -40;
                  y = 10;
                  z = -45;
                  rotateZ = 5.2;
                  rotateY = 8;
                  scale = 0.88;
                  opacity = 0.85;
                  zIndex = 15;
                } else if (offset === -2) {
                  x = -78;
                  y = 18;
                  z = -95;
                  rotateZ = 8.5;
                  scale = 0.74;
                  opacity = 0.4;
                  zIndex = 10;
                }

                const isCurrent = offset === 0;

                return (
                  <motion.div
                    key={proj.id}
                    onClick={() => {
                      if (isCurrent) {
                        onSelectCaseStudy(proj);
                      } else {
                        let diff = (((idx - activeIndex) % total) + total) % total;
                        if (diff > total / 2) diff -= total;
                        stepProject(diff);
                      }
                    }}
                    initial={false}
                    animate={{
                      x,
                      y,
                      z,
                      rotateZ,
                      rotateY,
                      scale,
                      opacity,
                    }}
                    transition={{
                      duration: 0.55,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    style={{
                      zIndex,
                      transformStyle: 'preserve-3d',
                    }}
                    className="absolute inset-0 pointer-events-auto cursor-pointer border-0 shadow-none outline-none ring-0 overflow-hidden aspect-[4/5] active:scale-[0.98] transition-transform"
                  >
                    <ProjectVisual project={proj} isActive={isCurrent} />

                    {/* Tap Cue on Active Card */}
                    {isCurrent && (
                      <div className="absolute inset-0 bg-black/15 opacity-0 active:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="px-3 py-1 bg-white text-black font-gotham text-[10px] font-bold uppercase tracking-wider shadow-lg">
                          Tap To Open Case Study
                        </span>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Mobile Only: Centered Project Details (Hidden on tablet where side info column is active) */}
          <div className="flex md:hidden flex-col items-center text-center px-2 z-30 mt-1 shrink-0">
            <span className="font-gotham text-[11px] font-bold text-[#e62b1e] dark:text-[#e62b1e] tracking-wider uppercase">
              {activeProject.category || 'Meta Ads'}
            </span>
            <h2 className="font-unbounded font-black text-xl xs:text-2xl tracking-tight text-[#0c0c0e] dark:text-white uppercase mt-0.5 leading-tight">
              {activeProject.title}
            </h2>
            <div className="w-8 h-[2px] bg-[#e62b1e] mx-auto my-1.5" />
            <p className="font-gotham text-xs text-[#18181b] dark:text-[#e4e4e7] leading-relaxed max-w-[300px] mx-auto font-medium line-clamp-2">
              {activeProject.description}
            </p>
          </div>
        </div>

        {/* Mobile Only: Bottom Interactive Bar (Hidden on tablet where controls are integrated on the left) */}
        <div className="flex md:hidden items-center justify-between w-full pt-2 border-t border-black/10 dark:border-white/10 z-30 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => stepProject(-1)}
              className="w-8 h-8 rounded-full border border-neutral-300 dark:border-neutral-700 flex items-center justify-center text-xs font-bold text-[#0c0c0e] dark:text-white active:scale-90 transition-transform cursor-pointer"
              aria-label="Previous project"
            >
              ←
            </button>
            <button
              onClick={() => stepProject(1)}
              className="w-8 h-8 rounded-full border border-neutral-300 dark:border-neutral-700 flex items-center justify-center text-xs font-bold text-[#0c0c0e] dark:text-white active:scale-90 transition-transform cursor-pointer"
              aria-label="Next project"
            >
              →
            </button>
          </div>

          <button
            onClick={() => {
              soundManager.playClick();
              onOpenShowreel();
            }}
            className="font-mono-tabular text-xs underline font-bold text-[#0c0c0e] dark:text-white hover:text-[#e62b1e] cursor-pointer"
          >
            '25 showreel ▶
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              onSelectCaseStudy(activeProject);
            }}
            className="font-gotham text-xs font-bold uppercase tracking-wider text-[#e62b1e] hover:underline cursor-pointer flex items-center gap-1"
          >
            <span>Case Study</span>
            <span>↗</span>
          </button>
        </div>
      </div>

      {/* ================= MOBILE NAVIGATION MENU DRAWER ================= */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 bg-[#f4f4f1] dark:bg-[#0c0c0e] text-[#0c0c0e] dark:text-white flex flex-col justify-between p-8"
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <span className="font-unbounded font-black text-xl tracking-tight">KAUSHIK©</span>
              <button
                onClick={() => {
                  soundManager.playClick();
                  setIsMobileMenuOpen(false);
                }}
                className="w-10 h-10 flex items-center justify-center text-2xl font-bold cursor-pointer hover:opacity-70"
                aria-label="Close navigation menu"
              >
                ✕
              </button>
            </div>

            {/* Menu Links */}
            <nav className="flex flex-col space-y-4 my-auto">
              {(['work', 'about', 'playground'] as ViewMode[]).map((view) => (
                <button
                  key={view}
                  onClick={() => {
                    soundManager.playClick();
                    setIsMobileMenuOpen(false);
                    onViewChange(view);
                  }}
                  className="font-unbounded font-black text-3xl sm:text-4xl text-left uppercase hover:text-[#e62b1e] transition-colors cursor-pointer"
                >
                  {view === 'playground' ? 'RECENT WORKS' : view}
                </button>
              ))}
              <button
                onClick={() => {
                  soundManager.playClick();
                  setIsMobileMenuOpen(false);
                  onOpenContact();
                }}
                className="font-unbounded font-black text-4xl text-left uppercase hover:text-[#e62b1e] transition-colors cursor-pointer"
              >
                CONTACT
              </button>
            </nav>

            {/* Bottom Controls */}
            <div className="flex items-center justify-between pt-6 border-t border-black/10 dark:border-white/10 font-mono-tabular text-xs">
              <button
                onClick={() => {
                  soundManager.playClick();
                  onToggleTheme();
                }}
                className="uppercase font-bold underline cursor-pointer"
              >
                Theme: {theme}
              </button>
              <button
                onClick={() => {
                  soundManager.playClick();
                  onToggleAudio();
                }}
                className="uppercase cursor-pointer"
              >
                Audio: {isAudioOn ? 'On' : 'Off'}
              </button>
              <span className="font-sans text-[11px] text-neutral-500">IST, {timeString}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
