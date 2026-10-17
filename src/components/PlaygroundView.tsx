import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ViewMode, ThemeMode } from '../types/portfolio';
import { soundManager } from '../utils/audio';
import { motion, AnimatePresence } from 'motion/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  X,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  Camera,
  RotateCcw,
  Move,
  Sparkles,
  Grid,
  Layers,
  ZoomIn,
  ZoomOut,
  Pencil,
  Plus,
  Trash2,
  Star,
  Check,
  Video,
  Play,
} from 'lucide-react';
import { CircleEditModal } from './CircleEditModal';
import { ProjectGalleryModal } from './ProjectGalleryModal';
import { AddCircleModal } from './AddCircleModal';
import { isVideoUrl } from '../utils/mediaUpload';
import {
  getAllCircleCustomizations,
  saveCircleCustomization,
  getProjectGallery,
  resetCircleCustomization,
  getCustomProjects,
  addCustomProject,
  getRemovedProjectIds,
  removeCircle,
  restoreRemovedCircle,
  restoreAllCircles,
  CircleData,
  CustomCircleItem,
} from '../utils/circleStorage';

gsap.registerPlugin(ScrollTrigger);

interface PlaygroundViewProps {
  onViewChange: (view: ViewMode) => void;
  onOpenContact: () => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
  isAudioOn: boolean;
  onToggleAudio: () => void;
  onOpenImageCustomizer?: (projectId?: string) => void;
  customOverrides?: Record<string, string>;
}

interface PlaygroundItem {
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

const PLAYGROUND_PORTFOLIO_ITEMS: PlaygroundItem[] = [
  {
    id: 'pg-better-candle',
    index: '01',
    title: 'BETTER CANDLE "FRESH INGREDIENTS"',
    subtitle: 'Organic illustrated box packaging with fluid type',
    category: 'Packaging',
    year: '2023',
    tool: 'Adobe Illustrator',
    client: 'Better Candle Co. / Fortune Studios',
    imageUrl: '/projects/better-candle.png',
    aspect: 'portrait',
    description: 'Playful organic packaging illustration with flowing purple lettering, fresh tomato, broccoli, carrot vector art, and warm sunny orange fields.',
    processNotes: 'Engineered custom dielines for eco-friendly soy wax candle boxes, emphasizing clean natural ingredients with whimsical fluid typography.',
    tags: ['Candle Packaging', 'Fluid Typography', 'Illustration', 'Eco-friendly'],
  },
  {
    id: 'pg-harmony',
    index: '02',
    title: 'HARMONY ACOUSTIC APP & BRAND',
    subtitle: 'Mindful sound design waveform interface',
    category: 'Logofolio & Branding',
    year: '2023',
    tool: 'Illustrator // Figma',
    client: 'Harmony Living / Abstract Reality',
    imageUrl: '/projects/harmony-brand-design.png',
    aspect: 'portrait',
    description: 'Golden glowing smartphone UI with sound waveform glyph, connecting mindful tranquility, acoustic design, and ergonomic lifestyle hardware.',
    processNotes: 'Engineered dark-mode glowing app icons, minimalist grid interface, and harmonious typography for mindful audio products.',
    tags: ['App Identity', 'Sound Design', 'Dark UI', 'Acoustics'],
  },
  {
    id: 'pg-biocule',
    index: '03',
    title: 'BIOCULE "WHERE SCIENCE MEETS GLAMOUR"',
    subtitle: 'Clinical bioactive skincare editorial branding',
    category: 'Campaigns & Festivals',
    year: '2023',
    tool: 'Photoshop // Illustrator',
    client: 'Biocule Skincare / Culture Boat',
    imageUrl: '/projects/rebranding-for-biocule.png',
    aspect: 'portrait',
    description: 'Fine oval monogram and luxury editorial beauty typography bridging molecular clinical dermatological efficacy with glamorous consumer appeal.',
    processNotes: 'Developed social media campaign templates, influencer PR unboxing aesthetics, and laboratory-tested brand messaging for Gen Z and millennial skincare.',
    tags: ['Clean Science', 'Skincare Branding', 'Social Campaign', 'Editorial Beauty'],
  },
  {
    id: 'pg-the-trost',
    index: '05',
    title: 'THE TROST META ADS',
    subtitle: 'High-converting social ad creatives and artist announcements',
    category: 'Campaigns & Festivals',
    year: '2024',
    tool: 'Photoshop // Illustrator',
    client: 'The Trost / Culture Boat',
    imageUrl: '/projects/the-trost.webp',
    aspect: 'landscape',
    description: 'High-impact Meta Ads campaign and artist lineup creatives for The Trost, featuring perforated ticket layouts, day-wise artist reveals, and dynamic social conversion assets.',
    processNotes: 'Engineered high-converting social media advertising assets and lineup announcement posts optimized for Instagram and Facebook feeds.',
    tags: ['Meta Ads', 'Performance Creative', 'Social Campaign', 'Typography'],
  },
  {
    id: 'pg-horology',
    index: '05',
    title: 'ALL ABOUT HOROLOGY MONOGRAM',
    subtitle: 'Golden-ratio mechanical chronometer insignia',
    category: 'Logofolio & Branding',
    year: '2024',
    tool: 'Adobe Illustrator',
    client: 'All About Horology / Abstract Reality',
    imageUrl: '/projects/all-about-horology.webp',
    aspect: 'portrait',
    description: 'Precision luxury timepiece monogram and guilloché-inspired mark created for mechanical watch journalism and horological collectors.',
    processNotes: 'Engineered an overlapping monogram with circular golden-ratio proportions that scales seamlessly from watch dials to luxury embossed business cards.',
    tags: ['Logofolio', 'Monogram', 'Watchmaking', 'Vector Precision'],
  },
  {
    id: 'pg-superdry',
    index: '06',
    title: 'SUPERDRY STREETWEAR CAMPAIGN',
    subtitle: 'Flat half-price seasonal retail visual system',
    category: 'Campaigns & Festivals',
    year: '2024',
    tool: 'Photoshop // Premiere Pro',
    client: 'Superdry India / Culture Boat',
    imageUrl: '/projects/superdry-campaign.webp',
    aspect: 'landscape',
    description: 'Layered photo-manipulation and neon-infused promo posters combining British tailoring with Japanese vintage graphics.',
    processNotes: 'Focused on high-impact retail signage and fast-cut social video edits, spotlighting apparel cuts with bold 3D extruded lettering and summer duotone textures.',
    tags: ['Retail Campaign', 'Streetwear', 'Photo Manipulation', 'Ad Graphics'],
  },
  {
    id: 'pg-combine',
    index: '07',
    title: 'COMBINE SPORTS ATHLETIC SYSTEM',
    subtitle: 'Forward-leaning dynamic vector logomark',
    category: 'Logofolio & Branding',
    year: '2024',
    tool: 'Adobe Illustrator',
    client: 'Combine Sports / Fortune Studios',
    imageUrl: '/projects/combine-sports.webp',
    aspect: 'portrait',
    description: 'Athletic mark and stadium billboard study conveying velocity, endurance, and unity through sharp geometric angles.',
    processNotes: 'Designed an interlocking chevron lettermark suitable for apparel embroidery, high-visibility stadium billboards, and motion stingers for athlete reels.',
    tags: ['Sports Branding', 'Lettermark', 'Vector Art', 'Logofolio'],
  },
  {
    id: 'pg-video-reels',
    index: '08',
    title: 'COMMERCIAL VIDEO & REEL SHOWCASE',
    subtitle: 'Multi-client rhythm editing & kinetic graphics',
    category: 'Motion & Video',
    year: '2024—2025',
    tool: 'Premiere Pro // After Effects',
    client: 'Soledition / SUPERDRY / Araiya / Moira / Combine Sports / SIS',
    imageUrl: '/projects/video-projects.webp',
    aspect: 'landscape',
    description: 'Commercial video reel exploration spanning music festivals, streetwear launches, luxury resorts, and corporate security spots.',
    processNotes: 'Explored multi-track audio synchronicity, dynamic speed ramps, cinematic LUT grading, and custom lower-third kinetic text animations.',
    tags: ['Video Editing', 'Motion Graphics', 'Premiere Pro', 'Commercial Cuts'],
  },
  {
    id: 'pg-cha-drops',
    index: '09',
    title: 'CHA TEA FLAVOURING DROPS',
    subtitle: 'Botanical liquid tea drops apothecary packaging',
    category: 'Packaging',
    year: '2024',
    tool: 'Illustrator // Photoshop',
    client: 'Cha Tea Co. / Fortune Studios',
    imageUrl: '/projects/cha-tea-drops.webp',
    aspect: 'portrait',
    description: 'Dropper bottle label architecture and carton packaging celebrating regional Indian tea notes: Hyderabadi Chai, Delhi Kadak, Elaichi Blend, and Mumbai Cutting.',
    processNotes: 'Combined natural organic leaf photography with warm earthy color codes and elegant serif typography for a high-end gourmet apothecary feel.',
    tags: ['Packaging', 'Apothecary', 'Botanical', 'Label Design'],
  },
  {
    id: 'pg-themonk-lookbook',
    index: '10',
    title: 'LOOKBOOK — THEMONK',
    subtitle: 'Minimalist editorial fashion publication system',
    category: 'Editorial & Lookbooks',
    year: '2024',
    tool: 'InDesign // Illustrator',
    client: 'TheMonk Clothing / Culture Boat',
    imageUrl: '/projects/lookbook-themonk.webp',
    aspect: 'portrait',
    description: 'Clean editorial catalog spread exploring asymmetric Swiss grid systems, ample white space, and bilingual typography for contemporary streetwear.',
    processNotes: 'Established modular typographic hierarchies and metallic accent specifications for lookbook distribution across international wholesale buyers.',
    tags: ['Lookbook', 'Editorial Grid', 'Fashion Design', 'Swiss Grid'],
  },
  {
    id: 'pg-masala',
    index: '11',
    title: 'MASALA SYNERGY PATTERNS & UNIFORMS',
    subtitle: 'Culinary spices botanical pattern & storefront design',
    category: 'Logofolio & Branding',
    year: '2024',
    tool: 'Illustrator // Photoshop',
    client: 'Masala Synergy Spices / Abstract Reality',
    imageUrl: '/projects/masala-synergy.webp',
    aspect: 'landscape',
    description: 'Deep teal botanical spice illustration pattern, custom barista apron mockup, and architectural storefront signage.',
    processNotes: 'Harmonized Indian heritage spices (star anise, cinnamon, dried chili, cardamom) into a cohesive luxury repeat pattern and branded staff merchandise.',
    tags: ['Spice Branding', 'Repeat Pattern', 'Merchandise', 'Packaging'],
  },
  {
    id: 'pg-shuchi',
    index: '12',
    title: 'SHUCHI BELTINGS FACTORY SIGNAGE',
    subtitle: 'Industrial conveyor manufacturing corporate identity',
    category: 'Logofolio & Branding',
    year: '2023',
    tool: 'Adobe Illustrator',
    client: 'Shuchi Beltings Ltd. / Fortune Studios',
    imageUrl: '/projects/shuchi-beltings.webp',
    aspect: 'portrait',
    description: 'Architectural factory facade installation with the red conveyor belt loop emblem for heavy industrial logistics and mining conveyor manufacturing.',
    processNotes: 'Crafted technical vector marks built to endure large-scale industrial signage, fleet livery, and machinery nameplates.',
    tags: ['Industrial Design', 'Corporate Identity', 'Signage System', 'CAD Vectors'],
  },
  {
    id: 'pg-cha-brochure',
    index: '13',
    title: 'CHA "UNLEASH THE MAGIC" BROCHURE',
    subtitle: 'Tactile editorial storybook for single-origin tea flushes',
    category: 'Editorial & Lookbooks',
    year: '2024',
    tool: 'InDesign // Photoshop',
    client: 'Cha Tea Co. / Fortune Studios',
    imageUrl: '/projects/cha-brochure.webp',
    aspect: 'landscape',
    description: 'Spread layout detailing brewing instructions, botanical ingredients, and flavor profiles for retail buyers and tea enthusiasts.',
    processNotes: 'Integrated warm wooden textures, rustic tea bowl photography, and clear instructional copy to turn ordinary tea into an extraordinary experience.',
    tags: ['Brochure', 'Editorial Spread', 'Print Production', 'Tea Story'],
  },
  {
    id: 'pg-themonk-tokyo',
    index: '14',
    title: 'THE WORLD COLLECTION / TOKYO EYEWEAR',
    subtitle: 'Frameless titanium sunglasses luxury lookbook',
    category: 'Editorial & Lookbooks',
    year: '2024',
    tool: 'Photoshop // InDesign',
    client: 'TheMonk Eyewear / Culture Boat',
    imageUrl: '/projects/the-world-collection-tokyo.webp',
    aspect: 'landscape',
    description: 'Technical product catalog highlighting frameless titanium sunglasses with Japanese aesthetics, colorways, and bespoke gift packaging.',
    processNotes: 'Showcased micro-details of gold with black accents, silver with blue accents, and rose gold finishes in clean multi-page lookbook spreads.',
    tags: ['Eyewear Lookbook', 'Product Catalog', 'Titanium Frames', 'Bilingual Typography'],
  },
  {
    id: 'pg-soledition',
    index: '15',
    title: 'SOLEDITION STREETWEAR FESTIVAL',
    subtitle: 'High-voltage sneaker festival visual identity & stage graphics',
    category: 'Campaigns & Festivals',
    year: '2024',
    tool: 'Photoshop // Illustrator',
    client: 'Soledition / Culture Boat',
    imageUrl: '/projects/soledition-2024.webp',
    aspect: 'landscape',
    description: 'High-voltage streetwear festival branding, stage screen visuals, wristbands, and artist announcement drops.',
    processNotes: 'Merged bold neon typography with distressed halftone textures and sneaker culture aesthetic.',
    tags: ['Streetwear Festival', 'Sneaker Culture', 'Event Branding', 'Stage Visuals'],
  },
  {
    id: 'pg-superdry-outlet',
    index: '16',
    title: 'SUPERDRY FLAGSHIP OUTLET',
    subtitle: 'Architectural retail store graphics & seasonal windows',
    category: 'Campaigns & Festivals',
    year: '2024',
    tool: 'Illustrator // CAD',
    client: 'Superdry / Culture Boat',
    imageUrl: '/projects/superdry-outlet.webp',
    aspect: 'landscape',
    description: 'Retail storefront installations, vinyl wall wraps, and window graphics for Superdry outlet openings.',
    processNotes: 'Scaled British vintage collegiate lettering and distressed industrial graphics across high-traffic shopping mall store displays.',
    tags: ['Retail Architecture', 'Storefront Graphics', 'Window Display', 'Superdry'],
  },
  {
    id: 'pg-themonk-frames',
    index: '17',
    title: 'THEMONK TITANIUM EYEWEAR',
    subtitle: 'Minimalist editorial frames & optical packaging',
    category: 'Editorial & Lookbooks',
    year: '2024',
    tool: 'InDesign // Photoshop',
    client: 'TheMonk Eyewear / Culture Boat',
    imageUrl: '/projects/the-monk-eyewear.webp',
    aspect: 'portrait',
    description: 'Editorial eyewear campaign spotlighting titanium frames, anti-reflective lenses, and bespoke matte carrying cases.',
    processNotes: 'Captured fine micro-engravings on temples and designed clean multi-page lookbook spreads with Japanese grid typography.',
    tags: ['Eyewear Design', 'Lookbook', 'Titanium Frames', 'Minimalist'],
  },
  {
    id: 'pg-masala-store',
    index: '18',
    title: 'MASALA SYNERGY FLAGSHIP STORE',
    subtitle: 'Spice apothecary storefront & environmental branding',
    category: 'Logofolio & Branding',
    year: '2024',
    tool: 'Illustrator // Photoshop',
    client: 'Masala Synergy / Abstract Reality',
    imageUrl: '/projects/masala-synergy-store.webp',
    aspect: 'landscape',
    description: 'Environmental store architecture, bespoke spice jar shelving, and brass logo emblem installation for retail spice boutique.',
    processNotes: 'Bridged warm terracotta tones with modern brass hardware and botanical spice patterns.',
    tags: ['Store Architecture', 'Retail Branding', 'Spice Boutique', 'Environmental Design'],
  },
];

type CategoryFilter = 'All' | 'Campaigns & Festivals' | 'Logofolio & Branding' | 'Editorial & Lookbooks' | 'Packaging' | 'Motion & Video';

const PLACEHOLDER_CURATED_IMAGES = [
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1508615039623-a25605d2b022?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80',
];

interface AppleWatchZoomGridProps {
  items: PlaygroundItem[];
  theme: ThemeMode;
  onSelectItem: (item: PlaygroundItem, circleId: string) => void;
  onEditCircle: (item: PlaygroundItem, circleId: string, currentTitle: string, currentImageUrl: string, currentVideoUrl?: string) => void;
  onDeleteCircle: (circleId: string, currentTitle: string) => void;
  onOpenAddCircle: () => void;
  isAudioOn: boolean;
  activeCategory: CategoryFilter;
  circleCustomizations: Record<string, CircleData>;
  onResetAllCircles?: () => void;
  isCirclesModified?: boolean;
}

export const AppleWatchZoomGrid: React.FC<AppleWatchZoomGridProps> = ({
  items,
  theme,
  onSelectItem,
  onEditCircle,
  onDeleteCircle,
  onOpenAddCircle,
  isAudioOn,
  activeCategory,
  circleCustomizations,
  onResetAllCircles,
  isCirclesModified = false,
}) => {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const gridContainerRef = useRef<HTMLDivElement | null>(null);
  const cursorPanRef = useRef<HTMLDivElement | null>(null);
  const quickPanX = useRef<gsap.QuickToFunc | null>(null);
  const quickPanY = useRef<gsap.QuickToFunc | null>(null);

  // Initial zoom level at 100% as requested
  const [zoomPercent, setZoomPercent] = useState<number>(100);
  const [activeBubble, setActiveBubble] = useState<PlaygroundItem | null>(null);
  const [hoveredBubbleId, setHoveredBubbleId] = useState<string | null>(null);
  const lastSoundTimeRef = useRef<number>(0);

  // Dimensions & Spacing engineered for ZERO OVERLAP and GENEROUS NEGATIVE SPACE:
  // Base bubble diameter: 120px
  // Center-to-center spacing: 220px (leaving 100px of negative breathing space at rest)
  // Max hover scale (1.28x) + neighbor scale (1.12x) = 76.8px + 67.2px = 144px < 220px (76px gap minimum)
  const bubbleSize = 120;
  const spacing = 220;

  // Generate regular hexagonal closest-packing lattice sorted by distance from center
  const hexPositions = useMemo(() => {
    const maxR = 9;
    const raw: Array<{ x: number; y: number; dist: number }> = [];

    for (let q = -maxR; q <= maxR; q++) {
      for (let r = -maxR; r <= maxR; r++) {
        if (Math.abs(q + r) <= maxR) {
          const x = spacing * (q + r / 2);
          const y = spacing * ((Math.sqrt(3) / 2) * r);
          const dist = Math.hypot(x, y);
          raw.push({ x, y, dist });
        }
      }
    }

    // Sort strictly from center outward (0,0 is index 0)
    raw.sort((a, b) => a.dist - b.dist);
    return raw;
  }, [spacing]);

  // Map each item to exactly ONE position: NO REPEATING CIRCLES!
  const clusterItems = useMemo(() => {
    return items.map((item, idx) => {
      const pos = hexPositions[idx] || { x: 0, y: 0, dist: 0 };
      const custom = circleCustomizations[item.id];
      const finalTitle = custom?.title || item.title;
      const finalImageUrl = custom?.imageUrl || item.imageUrl;
      const finalVideoUrl = custom?.videoUrl || item.videoUrl;
      const finalMediaType = custom?.mediaType || (isVideoUrl(finalVideoUrl || finalImageUrl) ? 'video' : 'image');

      return {
        id: item.id,
        x: pos.x,
        y: pos.y,
        item,
        title: finalTitle,
        imageUrl: finalImageUrl,
        videoUrl: finalVideoUrl,
        mediaType: finalMediaType,
        distFromCenter: pos.dist,
      };
    });
  }, [items, hexPositions, circleCustomizations]);

  // Set initial active bubble to center
  useEffect(() => {
    const centerItem = clusterItems.find((b) => b.distFromCenter < 50) || clusterItems[0];
    if (centerItem) {
      setActiveBubble(centerItem.item);
    }
  }, [clusterItems]);

  // Setup buttery GSAP quickTo for smooth cursor-following grid pan
  useEffect(() => {
    if (!cursorPanRef.current) return;
    quickPanX.current = gsap.quickTo(cursorPanRef.current, 'x', {
      duration: 0.65,
      ease: 'power2.out',
    });
    quickPanY.current = gsap.quickTo(cursorPanRef.current, 'y', {
      duration: 0.65,
      ease: 'power2.out',
    });
  }, []);

  // Track cursor movement across viewport and pan the grid smoothly
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const normX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const normY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;

    // Fluid canvas panning as cursor moves
    const maxPanX = 360;
    const maxPanY = 240;

    quickPanX.current?.(-normX * maxPanX);
    quickPanY.current?.(-normY * maxPanY);
  };

  const handleMouseLeave = () => {
    setHoveredBubbleId(null);
    quickPanX.current?.(0);
    quickPanY.current?.(0);
  };

  // Prevent outer page from scrolling up/down when scrolling on canvas, and smooth-zoom canvas instead!
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      // Prevent browser default scroll so the page doesn't go up!
      e.preventDefault();
      e.stopPropagation();

      const delta = e.deltaY;
      setZoomPercent((prev) => {
        // Scrolling down (delta > 0) -> Zoom In
        // Scrolling up (delta < 0) -> Zoom Out
        const step = delta > 0 ? 9 : -9;
        return Math.min(320, Math.max(70, prev + step));
      });
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      el.removeEventListener('wheel', onWheel);
    };
  }, []);

  // Smoothly update grid container scale based on zoomPercent
  useEffect(() => {
    if (!gridContainerRef.current) return;
    gsap.to(gridContainerRef.current, {
      scale: zoomPercent / 100,
      duration: 0.32,
      ease: 'power2.out',
    });
  }, [zoomPercent]);

  // Find hovered bubble coordinates to calculate neighbor distances
  const hoveredBubble = useMemo(() => {
    if (!hoveredBubbleId) return null;
    return clusterItems.find((b) => b.id === hoveredBubbleId) || null;
  }, [hoveredBubbleId, clusterItems]);

  return (
    <div
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative w-full h-[calc(100vh-170px)] min-h-[640px] max-h-[920px] select-none rounded-2xl overflow-hidden border shadow-2xl transition-colors duration-300 ${
        theme === 'light'
          ? 'bg-gradient-to-b from-[#f3f2ee] via-[#eeede8] to-[#e7e6e0] border-black/10'
          : 'bg-gradient-to-b from-[#0c0c10] via-[#09090c] to-[#070709] border-white/10'
      }`}
    >
      {/* ================= BACKGROUND MAIN TITLE LAYER (Positioned BEHIND circular images: z-10) ================= */}
      <div className="absolute inset-0 z-10 pointer-events-none flex flex-col items-center justify-center text-center px-4 select-none overflow-hidden">
        {/* Eyebrow kicker */}
        <div className="font-mono-tabular text-xs sm:text-sm font-black uppercase tracking-widest text-[#e62b1e] mb-3 flex items-center gap-2 drop-shadow-xs">
          <span className="w-2.5 h-2.5 rounded-full bg-[#e62b1e] animate-pulse" />
          <span>RECENT WORKS // 2020—2026 ARCHIVE</span>
        </div>

        {/* Monumental Title sitting behind circular images */}
        <h1 className="font-unbounded font-black text-5xl sm:text-7xl md:text-8xl lg:text-9xl tracking-tight uppercase leading-[0.88] text-neutral-900/35 dark:text-white/20 drop-shadow-xs max-w-6xl select-none">
          The Dimension
        </h1>

        {/* Subtitle / Active Item details */}
        <div className="mt-4 font-unbounded font-bold text-xs sm:text-sm md:text-base text-[#e62b1e] uppercase tracking-wider flex items-center gap-2 drop-shadow-sm">
          <span>{activeBubble?.title || 'Apple Watch Zooming Canvas'}</span>
          <span className="text-neutral-400 dark:text-neutral-600">•</span>
          <span>{activeBubble?.category.split(' ')[0] || 'Hexagonal Grid'}</span>
        </div>
      </div>

      {/* ================= FIXED BOTTOM HUD OVERLAY (z-30) ================= */}
      <div className="absolute inset-x-0 bottom-4 sm:bottom-6 z-30 pointer-events-none flex flex-col sm:flex-row items-center justify-between px-4 sm:px-8 gap-3">
        {/* Left: Interactive Zoom Controls + Add Circle HUD */}
        <div className="flex items-center gap-2 font-mono-tabular text-xs font-bold px-3 py-1.5 rounded-full border shadow-lg backdrop-blur-md transition-colors pointer-events-auto bg-white/90 dark:bg-black/90 border-black/10 dark:border-white/15 text-neutral-900 dark:text-neutral-100">
          <span className="text-[#e62b1e] hidden sm:inline">ZOOM:</span>
          
          {/* Zoom Out Button */}
          <button
            onClick={() => {
              soundManager.playClick();
              setZoomPercent((prev) => Math.max(70, prev - 15));
            }}
            className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-black/10 dark:hover:bg-white/10 text-neutral-700 dark:text-neutral-300 transition-colors cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>

          {/* Interactive Zoom Slider */}
          <input
            type="range"
            min="70"
            max="300"
            value={zoomPercent}
            onChange={(e) => setZoomPercent(Number(e.target.value))}
            className="w-16 sm:w-24 accent-[#e62b1e] cursor-pointer"
          />

          {/* Zoom In Button */}
          <button
            onClick={() => {
              soundManager.playClick();
              setZoomPercent((prev) => Math.min(300, prev + 15));
            }}
            className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-black/10 dark:hover:bg-white/10 text-neutral-700 dark:text-neutral-300 transition-colors cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>

          <span className="w-12 text-center">{zoomPercent}%</span>

          {/* 100% Reset Button */}
          {zoomPercent !== 100 && (
            <button
              onClick={() => {
                soundManager.playClick();
                setZoomPercent(100);
              }}
              className="px-2 py-0.5 rounded bg-[#e62b1e]/15 hover:bg-[#e62b1e]/25 text-[#e62b1e] text-[10px] uppercase font-bold transition-colors cursor-pointer ml-1"
              title="Reset to 100% Zoom"
            >
              100%
            </button>
          )}

          {/* Vertical Separator */}
          <span className="w-[1px] h-4 bg-neutral-300 dark:bg-neutral-700 mx-1" />

          {/* Add Circle Action Button */}
          <button
            onClick={() => {
              soundManager.playClick();
              onOpenAddCircle();
            }}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#e62b1e] hover:bg-[#d02418] text-white text-[11px] font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-sm"
            title="Add a new circle to the canvas"
          >
            <Plus className="w-3 h-3" />
            <span>Add Circle</span>
          </button>

          {/* Reset All Circles (if any circles modified/removed) */}
          {isCirclesModified && onResetAllCircles && (
            <button
              onClick={() => {
                if (window.confirm('Reset all circles to default portfolio set?')) {
                  soundManager.playClick();
                  onResetAllCircles();
                }
              }}
              className="flex items-center gap-1 px-2 py-0.5 rounded bg-black/5 dark:bg-white/10 text-neutral-600 dark:text-neutral-300 hover:text-[#e62b1e] text-[10px] font-bold uppercase transition-colors cursor-pointer ml-1"
              title="Restore all default circles"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Scroll & Interaction Hint */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-full border shadow-lg backdrop-blur-md text-xs font-mono-tabular font-bold pointer-events-auto bg-white/90 dark:bg-black/90 border-black/10 dark:border-white/15 text-neutral-800 dark:text-neutral-200">
          <Move className="w-3.5 h-3.5 text-[#e62b1e] animate-bounce" />
          <span className="uppercase tracking-wider text-[10px] sm:text-xs">
            Scroll to zoom • Move cursor to pan • Circles enlarge on proximity • Click to open
          </span>
        </div>
      </div>

      {/* ================= ZOOMING & PANNING HONEYCOMB GRID LAYER (z-20, in front of text) ================= */}
      <div
        className="absolute inset-0 flex items-center justify-center overflow-hidden"
      >
        <div
          ref={gridContainerRef}
          className="relative z-20 w-0 h-0 flex items-center justify-center will-change-transform"
          style={{ transformOrigin: 'center center' }}
        >
          {/* Cursor-follower container that pans smoothly as cursor moves */}
          <div
            ref={cursorPanRef}
            className="relative w-0 h-0 flex items-center justify-center will-change-transform"
          >
            {/* Render Circles: Exactly 1 circle per item (NO repeats, ZERO overlap, generous negative space) */}
            {clusterItems.map(({ id, x, y, item, title: circleTitle, imageUrl, videoUrl, mediaType }) => {
              const isCategoryMatch = activeCategory === 'All' || item.category === activeCategory;
              const isDirectHovered = hoveredBubbleId === id;
              const isVideo = mediaType === 'video' || isVideoUrl(videoUrl) || isVideoUrl(imageUrl);
              const videoSrc = videoUrl || (isVideoUrl(imageUrl) ? imageUrl : undefined);

              // Calculate proximity sizing: surrounding circles enlarge slightly without overlapping
              let circleScale = 1.0;
              let circleZIndex = 20;
              let isNeighbor = false;

              if (hoveredBubble) {
                const distToHovered = Math.hypot(x - hoveredBubble.x, y - hoveredBubble.y);
                if (distToHovered < 10) {
                  // Direct hovered circle: Focus size (1.28x scale)
                  circleScale = 1.28;
                  circleZIndex = 50;
                } else if (distToHovered < spacing * 1.3) {
                  // Immediate neighbor ring: slightly bigger than normal (1.12x scale)
                  circleScale = 1.12;
                  circleZIndex = 40;
                  isNeighbor = true;
                } else {
                  circleScale = 1.0;
                  circleZIndex = 20;
                }
              }

              return (
                <div
                  key={id}
                  onClick={() => {
                    soundManager.playClick();
                    onSelectItem(item, id);
                  }}
                  onMouseEnter={() => {
                    setHoveredBubbleId(id);
                    setActiveBubble(item);
                    const now = Date.now();
                    if (isAudioOn && now - lastSoundTimeRef.current > 70) {
                      lastSoundTimeRef.current = now;
                      soundManager.playSlide?.();
                    }
                  }}
                  onMouseLeave={() => {
                    setHoveredBubbleId((curr) => (curr === id ? null : curr));
                  }}
                  style={{
                    width: `${bubbleSize}px`,
                    height: `${bubbleSize}px`,
                    transform: `translate3d(${x}px, ${y}px, 0px) scale(${circleScale})`,
                    zIndex: circleZIndex,
                  }}
                  className={`absolute rounded-full transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group cursor-pointer ${
                    isCategoryMatch ? 'opacity-100' : 'opacity-30'
                  }`}
                  title={`${circleTitle} • Click to open ${isVideo ? 'video player & gallery' : 'gallery'}`}
                >
                  {/* Circular Bubble Card */}
                  <div
                    className={`relative w-full h-full rounded-full overflow-hidden transition-all duration-300 border-2 bg-black ${
                      isDirectHovered
                        ? 'border-[#e62b1e] ring-4 ring-[#e62b1e]/60 shadow-[0_24px_50px_rgba(230,43,30,0.5),0_0_35px_rgba(230,43,30,0.35)] scale-105'
                        : isNeighbor
                        ? 'border-white/80 dark:border-white/40 ring-2 ring-[#e62b1e]/30 shadow-[0_16px_36px_rgba(0,0,0,0.3)]'
                        : 'shadow-[0_10px_24px_rgba(0,0,0,0.16)] dark:shadow-[0_14px_35px_rgba(0,0,0,0.65)]'
                    } ${
                      theme === 'light'
                        ? 'border-white/90 ring-1 ring-black/5'
                        : 'border-white/20 ring-1 ring-white/10'
                    }`}
                  >
                    {/* Media: Live Auto-playing Looping Video or Image */}
                    {isVideo && videoSrc ? (
                      <video
                        src={videoSrc}
                        autoPlay
                        loop
                        muted
                        playsInline
                        preload="auto"
                        className={`w-full h-full object-cover object-center select-none pointer-events-none rounded-full transition-transform duration-300 ${
                          isDirectHovered ? 'scale-110 brightness-105' : 'group-hover:scale-105'
                        }`}
                      />
                    ) : (
                      <img
                        src={imageUrl}
                        alt={circleTitle}
                        draggable={false}
                        loading="lazy"
                        className={`w-full h-full object-cover object-center select-none pointer-events-none rounded-full transition-transform duration-300 ${
                          isDirectHovered ? 'scale-110 brightness-105' : 'group-hover:scale-105'
                        }`}
                      />
                    )}

                    {/* Video badge indicator */}
                    {isVideo && (
                      <div className="absolute top-2 right-2 z-10 w-5 h-5 rounded-full bg-black/75 backdrop-blur-xs flex items-center justify-center text-white shadow-md border border-white/20 pointer-events-none">
                        <Play className="w-2.5 h-2.5 fill-white text-white ml-0.5" />
                      </div>
                    )}

                    {/* Glossy Spherical Highlight Reflection */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/15 to-white/35 rounded-full pointer-events-none" />

                    {/* Subtle rim border */}
                    <div className="absolute inset-0 rounded-full border border-black/10 dark:border-white/10 pointer-events-none" />
                  </div>

                  {/* Dynamic Project Tooltip Badge when Circle is Hovered */}
                  {isDirectHovered && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="absolute -bottom-11 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1 bg-black/95 dark:bg-white/95 text-white dark:text-black font-unbounded text-[10px] font-black uppercase rounded-full shadow-2xl z-50 flex items-center gap-2 ring-1 ring-[#e62b1e]/60"
                    >
                      <span className="truncate max-w-[130px]">{circleTitle}</span>
                      
                      {isVideo && (
                        <span className="px-1.5 py-0.5 rounded bg-[#e62b1e] text-[8px] font-mono font-bold tracking-wider text-white">
                          VIDEO
                        </span>
                      )}

                      {/* Open Gallery Action Button */}
                      <button
                        onClick={() => {
                          soundManager.playClick();
                          onSelectItem(item, id);
                        }}
                        className="px-2 py-0.5 rounded bg-[#e62b1e] text-white font-mono font-bold text-[9px] hover:bg-[#d02418] transition-colors cursor-pointer"
                        title="Open video player & gallery"
                      >
                        {isVideo ? 'PLAY' : 'GALLERY'}
                      </button>

                      {/* Edit Thumbnail / Name Action Button */}
                      <button
                        onClick={() => {
                          soundManager.playClick();
                          onEditCircle(item, id, circleTitle, imageUrl, videoSrc);
                        }}
                        className="p-1 rounded hover:bg-white/20 dark:hover:bg-black/10 text-neutral-300 dark:text-neutral-700 hover:text-[#e62b1e] transition-colors cursor-pointer flex items-center gap-0.5 font-mono text-[9px] font-bold"
                        title="Change circle media, upload video & edit name"
                      >
                        <Pencil className="w-2.5 h-2.5 text-[#e62b1e]" />
                        <span>EDIT</span>
                      </button>

                      {/* Remove Circle Action Button */}
                      <button
                        onClick={() => {
                          soundManager.playClick();
                          onDeleteCircle(id, circleTitle);
                        }}
                        className="p-1 rounded hover:bg-red-500/20 text-neutral-400 hover:text-red-500 transition-colors cursor-pointer flex items-center gap-0.5 font-mono text-[9px] font-bold"
                        title="Remove circle from canvas"
                      >
                        <Trash2 className="w-2.5 h-2.5 text-red-500" />
                        <span className="text-red-500">REMOVE</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}

            {/* "+ Add Circle" Ghost Node on Canvas at the next lattice slot */}
            {hexPositions[clusterItems.length] && (
              <div
                onClick={() => {
                  soundManager.playClick();
                  onOpenAddCircle();
                }}
                style={{
                  width: `${bubbleSize}px`,
                  height: `${bubbleSize}px`,
                  transform: `translate3d(${hexPositions[clusterItems.length].x}px, ${hexPositions[clusterItems.length].y}px, 0px)`,
                  zIndex: 15,
                }}
                className="absolute rounded-full flex flex-col items-center justify-center border-2 border-dashed border-[#e62b1e]/50 hover:border-[#e62b1e] bg-[#e62b1e]/5 hover:bg-[#e62b1e]/15 transition-all cursor-pointer group shadow-sm hover:scale-105"
                title="Add a new circular project to canvas"
              >
                <div className="w-9 h-9 rounded-full bg-[#e62b1e]/15 group-hover:bg-[#e62b1e] group-hover:text-white text-[#e62b1e] flex items-center justify-center transition-colors mb-1 shadow-sm">
                  <Plus className="w-4 h-4" />
                </div>
                <span className="font-mono-tabular text-[9px] font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 group-hover:text-[#e62b1e]">
                  + Add Circle
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

interface DimensionMatrixCanvasProps {
  items: PlaygroundItem[];
  theme: ThemeMode;
  onSelectItem: (item: PlaygroundItem) => void;
  activeCategory: CategoryFilter;
  isAudioOn: boolean;
}

export const DimensionMatrixCanvas: React.FC<DimensionMatrixCanvasProps> = ({
  items,
  theme,
  onSelectItem,
  activeCategory,
  isAudioOn,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [dimensions, setDimensions] = useState<{ width: number; height: number }>({
    width: 1200,
    height: 720,
  });

  const panRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [focusedItem, setFocusedItem] = useState<PlaygroundItem | null>(null);
  const [showDragHint, setShowDragHint] = useState<boolean>(true);
  const [isPointerDown, setIsPointerDown] = useState<boolean>(false);

  const isDraggingRef = useRef<boolean>(false);
  const hasMovedRef = useRef<boolean>(false);
  const startPointerRef = useRef<{ x: number; y: number; time: number }>({ x: 0, y: 0, time: 0 });
  const lastPointerRef = useRef<{ x: number; y: number; time: number }>({ x: 0, y: 0, time: 0 });
  const velocityRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const momentumFrameRef = useRef<number | null>(null);
  const recenterFrameRef = useRef<number | null>(null);
  const lastSoundItemIdRef = useRef<string | null>(null);

  // ResizeObserver for responsive canvas bounds
  useEffect(() => {
    if (!containerRef.current) return;
    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({
          width: Math.max(rect.width, 320),
          height: Math.max(rect.height, 460),
        });
      }
    };
    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Responsive squircle card dimensions
  const isMobile = dimensions.width < 640;
  const isTablet = dimensions.width >= 640 && dimensions.width < 1024;
  const cardSize = isMobile ? 116 : isTablet ? 144 : 168;
  const gap = isMobile ? 18 : isTablet ? 22 : 28;
  const cell = cardSize + gap;
  const borderRadius = isMobile ? '22px' : isTablet ? '28px' : '34px';

  // Stop animations
  const stopAnimations = () => {
    if (momentumFrameRef.current) {
      cancelAnimationFrame(momentumFrameRef.current);
      momentumFrameRef.current = null;
    }
    if (recenterFrameRef.current) {
      cancelAnimationFrame(recenterFrameRef.current);
      recenterFrameRef.current = null;
    }
  };

  // Pointer Down
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    stopAnimations();

    isDraggingRef.current = true;
    hasMovedRef.current = false;
    setIsPointerDown(true);

    const now = performance.now();
    startPointerRef.current = { x: e.clientX, y: e.clientY, time: now };
    lastPointerRef.current = { x: e.clientX, y: e.clientY, time: now };
    velocityRef.current = { x: 0, y: 0 };

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Ignore
    }
  };

  // Pointer Move
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;

    const dx = e.clientX - lastPointerRef.current.x;
    const dy = e.clientY - lastPointerRef.current.y;
    const now = performance.now();

    const distFromStart = Math.hypot(
      e.clientX - startPointerRef.current.x,
      e.clientY - startPointerRef.current.y
    );
    if (distFromStart > 5) {
      hasMovedRef.current = true;
      setShowDragHint(false);
    }

    panRef.current.x += dx;
    panRef.current.y += dy;

    const dt = Math.max(now - lastPointerRef.current.time, 10);
    const vx = (dx / dt) * 16;
    const vy = (dy / dt) * 16;
    velocityRef.current = {
      x: velocityRef.current.x * 0.35 + vx * 0.65,
      y: velocityRef.current.y * 0.35 + vy * 0.65,
    };

    lastPointerRef.current = { x: e.clientX, y: e.clientY, time: now };
    setPan({ x: panRef.current.x, y: panRef.current.y });
  };

  // Pointer Up
  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    setIsPointerDown(false);

    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // Ignore
    }

    // Tap/Click Detection without drag
    if (!hasMovedRef.current && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      const col = Math.floor((clickX - panRef.current.x) / cell);
      const row = Math.floor((clickY - panRef.current.y) / cell);
      const cardX = col * cell + panRef.current.x;
      const cardY = row * cell + panRef.current.y;

      if (
        clickX >= cardX &&
        clickX <= cardX + cardSize &&
        clickY >= cardY &&
        clickY <= cardY + cardSize
      ) {
        const itemIdx =
          (((row * 7 + col) % items.length) + items.length) % items.length;
        const clickedItem = items[itemIdx];
        if (clickedItem) {
          soundManager.playClick();
          onSelectItem(clickedItem);
          return;
        }
      }
    }

    // Momentum Glide Loop
    let vx = velocityRef.current.x * 0.88;
    let vy = velocityRef.current.y * 0.88;

    const step = () => {
      vx *= 0.94;
      vy *= 0.94;

      panRef.current.x += vx;
      panRef.current.y += vy;
      setPan({ x: panRef.current.x, y: panRef.current.y });

      if (Math.hypot(vx, vy) > 0.08) {
        momentumFrameRef.current = requestAnimationFrame(step);
      } else {
        momentumFrameRef.current = null;
      }
    };

    if (Math.hypot(vx, vy) > 0.15) {
      momentumFrameRef.current = requestAnimationFrame(step);
    }
  };

  // Passive Wheel / Trackpad Pan
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      stopAnimations();
      setShowDragHint(false);

      panRef.current.x -= e.deltaX * 0.75;
      panRef.current.y -= e.deltaY * 0.75;
      setPan({ x: panRef.current.x, y: panRef.current.y });
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, []);

  // Recenter to origin
  const handleRecenter = () => {
    soundManager.playClick();
    stopAnimations();

    const startX = panRef.current.x;
    const startY = panRef.current.y;
    const startTime = performance.now();
    const duration = 500;

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);

      panRef.current.x = startX * (1 - ease);
      panRef.current.y = startY * (1 - ease);
      setPan({ x: panRef.current.x, y: panRef.current.y });

      if (progress < 1) {
        recenterFrameRef.current = requestAnimationFrame(animate);
      } else {
        panRef.current = { x: 0, y: 0 };
        setPan({ x: 0, y: 0 });
        recenterFrameRef.current = null;
      }
    };

    recenterFrameRef.current = requestAnimationFrame(animate);
  };

  // Calculate Visible Cards
  const visibleCards: Array<{
    col: number;
    row: number;
    x: number;
    y: number;
    item: PlaygroundItem;
    distToCenter: number;
    isCenter: boolean;
  }> = [];

  const centerX = dimensions.width / 2;
  const centerY = dimensions.height / 2;

  const minCol = Math.floor((-pan.x - cell) / cell);
  const maxCol = Math.ceil((dimensions.width - pan.x + cell) / cell);
  const minRow = Math.floor((-pan.y - cell) / cell);
  const maxRow = Math.ceil((dimensions.height - pan.y + cell) / cell);

  let closestDist = Infinity;
  let closestItem: PlaygroundItem | null = null;

  for (let r = minRow; r <= maxRow; r++) {
    for (let c = minCol; c <= maxCol; c++) {
      const x = c * cell + pan.x;
      const y = r * cell + pan.y;

      const itemIdx =
        (((r * 7 + c) % items.length) + items.length) % items.length;
      const item = items[itemIdx];

      const cardCenterX = x + cardSize / 2;
      const cardCenterY = y + cardSize / 2;
      const dist = Math.hypot(cardCenterX - centerX, cardCenterY - centerY);

      if (dist < closestDist) {
        closestDist = dist;
        closestItem = item;
      }

      visibleCards.push({
        col: c,
        row: r,
        x,
        y,
        item,
        distToCenter: dist,
        isCenter: false,
      });
    }
  }

  // Update center item & sound
  if (closestItem && closestItem.id !== focusedItem?.id) {
    setFocusedItem(closestItem);
    if (isAudioOn && lastSoundItemIdRef.current !== closestItem.id) {
      lastSoundItemIdRef.current = closestItem.id;
      soundManager.playSlide?.();
    }
  }

  visibleCards.forEach((c) => {
    if (closestItem && c.item.id === closestItem.id && c.distToCenter === closestDist) {
      c.isCenter = true;
    }
  });

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className={`relative w-full h-[620px] sm:h-[680px] lg:h-[740px] xl:h-[780px] overflow-hidden select-none border border-black/10 dark:border-white/10 rounded-2xl md:rounded-3xl shadow-inner transition-colors duration-300 ${
        isPointerDown ? 'cursor-grabbing' : 'cursor-grab'
      } ${
        theme === 'light'
          ? 'bg-gradient-to-b from-[#f5f4f0] via-[#efeee9] to-[#e8e7e1]'
          : 'bg-gradient-to-b from-[#0c0c10] via-[#09090c] to-[#070709]'
      }`}
      style={{ touchAction: 'none' }}
    >
      {/* ================= BACKGROUND TYPOGRAPHY (Layered behind floating cards) ================= */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none z-0 px-4 text-center">
        {/* Top Kicker Label */}
        <div className="font-mono-tabular text-xs sm:text-sm font-black uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-1.5 sm:mb-2 transition-all duration-300 drop-shadow-xs">
          {focusedItem?.client || 'KAUSHIK SAHA'} // RECENT WORKS
        </div>

        {/* Main Central Title ("The Dimension" exactly matching video) */}
        <h2 className="font-unbounded font-black text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl tracking-tight uppercase leading-[0.92] text-neutral-900/90 dark:text-white/90 drop-shadow-sm transition-all duration-300 max-w-5xl">
          The Dimension
        </h2>

        {/* Bottom Subtitle / Collection Identifier */}
        <div className="font-unbounded font-black text-xs sm:text-sm md:text-base text-[#e62b1e] uppercase tracking-wider mt-2.5 sm:mt-4 transition-all duration-300 flex items-center gap-2">
          <span>{focusedItem?.title || 'Selected Archive'}</span>
          <span className="text-neutral-400 dark:text-neutral-600">•</span>
          <span>{focusedItem?.year || 'Coll. 01'}</span>
        </div>
      </div>

      {/* ================= FLOATING SQUIRCLE CARDS (Layered at z-10, gliding over typography) ================= */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {visibleCards.map(({ col, row, x, y, item, isCenter }) => {
          const isCategoryMatch =
            activeCategory === 'All' || item.category === activeCategory;

          return (
            <div
              key={`${col}_${row}_${item.id}`}
              style={{
                width: `${cardSize}px`,
                height: `${cardSize}px`,
                transform: `translate3d(${x}px, ${y}px, 0px)`,
                borderRadius,
              }}
              className={`absolute top-0 left-0 transition-opacity duration-300 pointer-events-auto ${
                isCategoryMatch ? 'opacity-100' : 'opacity-25'
              }`}
            >
              <div
                style={{ borderRadius }}
                className={`relative w-full h-full overflow-hidden transition-all duration-200 group border cursor-pointer ${
                  isCenter
                    ? 'scale-[1.03] shadow-[0_16px_36px_rgba(0,0,0,0.22)] dark:shadow-[0_20px_45px_rgba(0,0,0,0.7)] border-[#e62b1e]'
                    : 'shadow-[0_10px_24px_rgba(0,0,0,0.12)] dark:shadow-[0_14px_32px_rgba(0,0,0,0.5)] border-black/10 dark:border-white/15 hover:border-[#e62b1e] hover:scale-[1.05]'
                } ${
                  theme === 'light' ? 'bg-white' : 'bg-[#18181b]'
                }`}
              >
                {/* Image */}
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  draggable={false}
                  loading="lazy"
                  className="w-full h-full object-cover object-center select-none pointer-events-none rounded-[inherit]"
                />

                {/* Glass Gloss Reflection */}
                <div
                  style={{ borderRadius }}
                  className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/20 pointer-events-none"
                />

                {/* Subtle Center Focus Indicator */}
                {isCenter && (
                  <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#e62b1e] shadow-[0_0_8px_#e62b1e]" />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ================= FLOATING CANVAS CONTROLS ================= */}
      {/* Recenter Button */}
      <button
        onClick={handleRecenter}
        className={`absolute bottom-4 right-4 z-30 px-3.5 py-2 rounded-full backdrop-blur-md border shadow-lg flex items-center gap-1.5 font-mono text-xs font-bold transition-all cursor-pointer ${
          theme === 'light'
            ? 'bg-white/85 text-black border-black/10 hover:border-[#e62b1e] hover:text-[#e62b1e]'
            : 'bg-black/85 text-white border-white/15 hover:border-[#e62b1e] hover:text-[#e62b1e]'
        }`}
        title="Reset canvas pan to origin"
      >
        <RotateCcw className="w-3.5 h-3.5 text-[#e62b1e]" />
        <span className="uppercase tracking-wider">Recenter</span>
      </button>

      {/* Floating Drag Guide Pill */}
      {showDragHint && (
        <div
          className={`absolute bottom-4 left-1/2 -translate-x-1/2 z-30 px-4 py-2 rounded-full backdrop-blur-md border shadow-lg flex items-center gap-2 font-mono text-xs font-bold pointer-events-none transition-opacity duration-500 ${
            theme === 'light'
              ? 'bg-white/90 text-neutral-800 border-black/10'
              : 'bg-black/90 text-neutral-200 border-white/15'
          }`}
        >
          <Move className="w-3.5 h-3.5 text-[#e62b1e] animate-pulse" />
          <span className="uppercase tracking-wider text-[10px] sm:text-xs">
            Drag in any direction • Click card to inspect
          </span>
        </div>
      )}
    </div>
  );
};

export const PlaygroundView: React.FC<PlaygroundViewProps> = ({
  onViewChange,
  onOpenContact,
  theme,
  onToggleTheme,
  isAudioOn,
  onToggleAudio,
  onOpenImageCustomizer,
  customOverrides,
}) => {
  const [timeString, setTimeString] = useState<string>('17:46');
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('All');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [viewLayout, setViewLayout] = useState<'apple' | 'matrix' | 'grid'>('apple');

  // Circle customizations (custom names, custom thumbnails, custom galleries)
  const [circleCustomizations, setCircleCustomizations] = useState<Record<string, CircleData>>(() =>
    getAllCircleCustomizations()
  );

  // Custom user-added projects & removed circle IDs
  const [customProjects, setCustomProjects] = useState<CustomCircleItem[]>(() => getCustomProjects());
  const [removedProjectIds, setRemovedProjectIds] = useState<string[]>(() => getRemovedProjectIds());
  const [isAddCircleOpen, setIsAddCircleOpen] = useState<boolean>(false);
  const [toastNotice, setToastNotice] = useState<{ message: string; undoCircleId?: string } | null>(null);

  // Active circle opened in Project Gallery Modal
  const [activeGalleryCircle, setActiveGalleryCircle] = useState<{
    item: PlaygroundItem;
    circleId: string;
  } | null>(null);

  // Active circle opened in Circle Customizer / Edit Modal
  const [editingCircle, setEditingCircle] = useState<{
    item: PlaygroundItem;
    circleId: string;
    currentTitle: string;
    currentImageUrl: string;
    currentVideoUrl?: string;
  } | null>(null);

  // Sync circle customizations, custom projects, and removals from storage
  useEffect(() => {
    const handleUpdate = () => {
      setCircleCustomizations(getAllCircleCustomizations());
      setCustomProjects(getCustomProjects());
      setRemovedProjectIds(getRemovedProjectIds());
    };
    window.addEventListener('kaushik_circles_updated', handleUpdate);
    return () => window.removeEventListener('kaushik_circles_updated', handleUpdate);
  }, []);

  // Dynamically map custom image overrides, custom added circles, and filter out removed circles
  const itemsWithOverrides = React.useMemo(() => {
    const allItems: PlaygroundItem[] = [
      ...PLAYGROUND_PORTFOLIO_ITEMS,
      ...(customProjects as unknown as PlaygroundItem[]),
    ];

    // Filter out removed circles
    const activeItems = allItems.filter((item) => !removedProjectIds.includes(item.id));

    return activeItems.map((item) => {
      const key = item.id.replace('pg-', '');
      const imageOverride =
        circleCustomizations[item.id]?.imageUrl || customOverrides?.[key] || item.imageUrl;
      const titleOverride = circleCustomizations[item.id]?.title || item.title;
      const videoOverride = circleCustomizations[item.id]?.videoUrl || item.videoUrl;
      const mediaTypeOverride = circleCustomizations[item.id]?.mediaType || item.mediaType;
      return {
        ...item,
        imageUrl: imageOverride,
        title: titleOverride,
        videoUrl: videoOverride,
        mediaType: mediaTypeOverride,
      };
    });
  }, [customProjects, removedProjectIds, customOverrides, circleCustomizations]);

  const handleRemoveCircle = (circleId: string, title?: string) => {
    removeCircle(circleId);
    soundManager.playClick();
    setRemovedProjectIds(getRemovedProjectIds());
    setCustomProjects(getCustomProjects());
    if (activeGalleryCircle?.circleId === circleId) {
      setActiveGalleryCircle(null);
    }
    if (editingCircle?.circleId === circleId) {
      setEditingCircle(null);
    }
    setToastNotice({
      message: `Circle "${title || 'Project'}" removed`,
      undoCircleId: circleId,
    });
    setTimeout(() => {
      setToastNotice((prev) => (prev?.undoCircleId === circleId ? null : prev));
    }, 4500);
  };

  const handleRestoreCircle = (circleId: string) => {
    restoreRemovedCircle(circleId);
    soundManager.playClick();
    setRemovedProjectIds(getRemovedProjectIds());
    setToastNotice(null);
  };

  const handleAddCircle = (newCircleData: {
    title: string;
    subtitle: string;
    category: 'Campaigns & Festivals' | 'Logofolio & Branding' | 'Editorial & Lookbooks' | 'Packaging' | 'Motion & Video';
    imageUrl: string;
    videoUrl?: string;
    mediaType?: 'image' | 'video';
    client: string;
    year: string;
    gallery: string[];
  }) => {
    const newId = `pg-custom-${Date.now()}`;
    const newProjectItem: CustomCircleItem = {
      id: newId,
      index: String(itemsWithOverrides.length + 1).padStart(2, '0'),
      title: newCircleData.title,
      subtitle: newCircleData.subtitle,
      category: newCircleData.category,
      year: newCircleData.year,
      tool: 'Photoshop // Illustrator',
      client: newCircleData.client,
      imageUrl: newCircleData.imageUrl,
      videoUrl: newCircleData.videoUrl,
      mediaType: newCircleData.mediaType,
      aspect: 'landscape',
      description: newCircleData.subtitle,
      processNotes: 'User-created custom circle on recent works canvas.',
      tags: [newCircleData.category, 'Custom Project'],
    };

    addCustomProject(newProjectItem, newCircleData.gallery);
    setCustomProjects(getCustomProjects());
    setToastNotice({ message: `Circle "${newCircleData.title}" added to canvas!` });
    setTimeout(() => setToastNotice(null), 3500);
  };

  const handleResetAllCircles = () => {
    restoreAllCircles();
    setRemovedProjectIds([]);
    setToastNotice({ message: 'All circles restored to default!' });
    setTimeout(() => setToastNotice(null), 3000);
  };

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

  // Keyboard navigation for active gallery project
  useEffect(() => {
    if (!activeGalleryCircle) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;
      if (e.key === 'Escape') setActiveGalleryCircle(null);
      if (e.key === 'ArrowRight' || e.key === 'j') {
        const curItems = activeCategory === 'All'
          ? itemsWithOverrides
          : itemsWithOverrides.filter((item) => item.category === activeCategory);
        const curIdx = curItems.findIndex((i) => i.id === activeGalleryCircle.item.id);
        if (curIdx !== -1) {
          soundManager.playSlide?.();
          const nextItem = curItems[(curIdx + 1) % curItems.length];
          setActiveGalleryCircle({ item: nextItem, circleId: nextItem.id });
        }
      }
      if (e.key === 'ArrowLeft' || e.key === 'k') {
        const curItems = activeCategory === 'All'
          ? itemsWithOverrides
          : itemsWithOverrides.filter((item) => item.category === activeCategory);
        const curIdx = curItems.findIndex((i) => i.id === activeGalleryCircle.item.id);
        if (curIdx !== -1) {
          soundManager.playSlide?.();
          const prevItem = curItems[(curIdx - 1 + curItems.length) % curItems.length];
          setActiveGalleryCircle({ item: prevItem, circleId: prevItem.id });
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeGalleryCircle, activeCategory, itemsWithOverrides]);

  const filteredItems = activeCategory === 'All'
    ? itemsWithOverrides
    : itemsWithOverrides.filter((item) => item.category === activeCategory);

  const categories: CategoryFilter[] = [
    'All',
    'Campaigns & Festivals',
    'Logofolio & Branding',
    'Editorial & Lookbooks',
    'Packaging',
    'Motion & Video',
  ];

  return (
    <div
      className={`w-full min-h-screen transition-colors duration-300 font-sans px-4 md:px-6 lg:px-8 xl:px-14 pb-16 flex flex-col justify-between overflow-x-hidden ${
        theme === 'light' ? 'bg-[#f4f4f1] text-[#0c0c0e]' : 'bg-[#09090b] text-[#f4f4f4]'
      }`}
    >
      {/* ================= TABLET & MOBILE HEADER (Visible on screens < md) ================= */}
      <div className="flex md:hidden items-center justify-between w-full pt-4 pb-3 border-b border-black/10 dark:border-white/10 select-none">
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

        {/* Center Brandmark */}
        <div className="font-unbounded font-black text-base sm:text-lg tracking-tight text-[#0c0c0e] dark:text-white">
          KAUSHIK©
        </div>

        {/* Right: Audio + Clock + Quick Day / Night Theme Toggle */}
        <div className="flex items-center gap-3 sm:gap-5">
          <button
            onClick={onToggleAudio}
            className="hidden sm:flex items-center gap-1 font-gotham text-xs text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white cursor-pointer"
          >
            <span>Audio {isAudioOn ? 'On' : 'Off'}</span>
          </button>
          <span className="hidden md:inline font-mono-tabular text-[11px] text-neutral-500 font-medium">
            IST, {timeString}
          </span>
          <button
            onClick={onToggleTheme}
            className="font-mono-tabular text-xs font-bold px-2 py-1 uppercase tracking-wider rounded border border-neutral-400 dark:border-neutral-700 text-[#0c0c0e] dark:text-white cursor-pointer active:scale-95 transition-transform"
          >
            {theme === 'light' ? 'NIGHT' : 'DAY'}
          </button>
        </div>
      </div>

      {/* ================= TABLET & MOBILE NAVIGATION DRAWER ================= */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col justify-between p-6 md:hidden"
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-white/20 pb-4">
              <span className="font-unbounded font-black text-lg text-white">
                NAVIGATION
              </span>
              <button
                onClick={() => {
                  soundManager.playClick();
                  setIsMobileMenuOpen(false);
                }}
                className="w-9 h-9 flex items-center justify-center text-white text-xl font-bold rounded-full bg-white/10"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Nav Links */}
            <div className="flex flex-col space-y-6 my-auto font-unbounded text-2xl sm:text-3xl font-black uppercase text-left">
              {/* WORK */}
              <button
                onClick={() => {
                  soundManager.playClick();
                  setIsMobileMenuOpen(false);
                  onViewChange('work');
                }}
                className="text-white hover:text-[#e62b1e] transition-colors cursor-pointer text-left flex items-center"
              >
                <span className="w-7 inline-flex items-center shrink-0 text-xl" />
                <span>WORK</span>
              </button>

              {/* ABOUT */}
              <button
                onClick={() => {
                  soundManager.playClick();
                  setIsMobileMenuOpen(false);
                  onViewChange('about');
                }}
                className="text-white hover:text-[#e62b1e] transition-colors cursor-pointer text-left flex items-center"
              >
                <span className="w-7 inline-flex items-center shrink-0 text-xl" />
                <span>ABOUT</span>
              </button>

              {/* RECENT WORKS (Active) */}
              <button
                onClick={() => {
                  soundManager.playClick();
                  setIsMobileMenuOpen(false);
                  onViewChange('playground');
                }}
                className="text-[#e62b1e] flex items-center cursor-pointer text-left whitespace-nowrap"
              >
                <span className="w-7 inline-flex items-center shrink-0 text-xl">→</span>
                <span>RECENT WORKS</span>
              </button>

              {/* CONTACT */}
              <button
                onClick={() => {
                  soundManager.playClick();
                  setIsMobileMenuOpen(false);
                  onOpenContact();
                }}
                className="text-white hover:text-[#e62b1e] transition-colors cursor-pointer text-left flex items-center"
              >
                <span className="w-7 inline-flex items-center shrink-0 text-xl" />
                <span>CONTACT</span>
              </button>
            </div>

            {/* Drawer Footer */}
            <div className="border-t border-white/20 pt-4 flex items-center justify-between text-xs text-neutral-300 font-mono-tabular">
              <span>IST, {timeString}</span>
              <button
                onClick={() => {
                  soundManager.playClick();
                  onOpenContact();
                }}
                className="text-white underline hover:text-[#e62b1e]"
              >
                sahakaushik1999@gmail.com
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= TOP HEADER (Desktop >= md: Aligned with Work & About) ================= */}
      <div className="hidden md:flex w-full items-start justify-between gap-6 lg:gap-8 pt-4 md:pt-6 lg:pt-8 xl:pt-10 mb-8 select-none">
        {/* Left: Menu Navigation Stack */}
        <div className="w-56 sm:w-64 lg:w-72 shrink-0">
          <div className="font-gotham font-semibold text-[10px] md:text-xs text-neutral-600 dark:text-neutral-400 mb-2 md:mb-2.5 tracking-wider select-none">
            Menu
          </div>
          <nav className="flex flex-col font-unbounded text-base md:text-lg lg:text-xl xl:text-2xl font-black tracking-tight uppercase leading-[0.95] space-y-1">
            {/* WORK */}
            <button
              onClick={() => {
                soundManager.playClick();
                onViewChange('work');
              }}
              className={`text-left flex items-center group transition-colors cursor-pointer whitespace-nowrap hover:text-[#e62b1e] ${
                theme === 'light' ? 'text-[#0c0c0e]' : 'text-white'
              }`}
            >
              <span className="w-4 md:w-5 inline-flex items-center shrink-0 font-black text-sm md:text-base sm:text-lg" />
              <span className="group-hover:opacity-80 transition-opacity">WORK</span>
            </button>

            {/* ABOUT */}
            <button
              onClick={() => {
                soundManager.playClick();
                onViewChange('about');
              }}
              className={`text-left flex items-center group transition-colors cursor-pointer whitespace-nowrap hover:text-[#e62b1e] ${
                theme === 'light' ? 'text-[#0c0c0e]' : 'text-white'
              }`}
            >
              <span className="w-4 md:w-5 inline-flex items-center shrink-0 font-black text-sm md:text-base sm:text-lg" />
              <span className="group-hover:opacity-80 transition-opacity">ABOUT</span>
            </button>

            {/* RECENT WORKS (Active View) */}
            <button
              onClick={() => {
                soundManager.playClick();
                onViewChange('playground');
              }}
              className="text-left flex items-center transition-colors cursor-pointer whitespace-nowrap text-[#e62b1e]"
            >
              <span className="w-4 md:w-5 inline-flex items-center shrink-0 font-black text-sm md:text-base sm:text-lg">→</span>
              <span>RECENT WORKS</span>
            </button>

            {/* CONTACT */}
            <button
              onClick={() => {
                soundManager.playClick();
                onOpenContact();
              }}
              className={`text-left flex items-center group transition-colors cursor-pointer whitespace-nowrap hover:text-[#e62b1e] ${
                theme === 'light' ? 'text-[#0c0c0e]' : 'text-white'
              }`}
            >
              <span className="w-4 md:w-5 inline-flex items-center shrink-0 font-black text-sm md:text-base sm:text-lg" />
              <span className="group-hover:opacity-80 transition-opacity">CONTACT</span>
            </button>
          </nav>
        </div>

        {/* Center: Audio & Working Globally */}
        <div className="hidden md:flex items-start gap-12 lg:gap-16 font-gotham text-xs">
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
            <span className="font-gotham text-[11px] text-neutral-500 dark:text-neutral-400 font-medium">
              IST, {timeString}
            </span>
          </div>
        </div>

        {/* Right: Change Images Button & Day / Night Theme Switcher & Inquiries */}
        <div className="flex items-center gap-4 sm:gap-6">
          {onOpenImageCustomizer && (
            <button
              onClick={() => onOpenImageCustomizer()}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-mono text-xs font-bold transition-all cursor-pointer border shadow-sm ${
                theme === 'light'
                  ? 'bg-[#0c0c0e] text-white border-black hover:bg-neutral-800'
                  : 'bg-white text-black border-white hover:bg-neutral-200'
              }`}
              title="Change website images (persistently stored)"
            >
              <Camera size={13} className="text-[#e62b1e]" />
              <span className="uppercase tracking-wider">Change Images</span>
              {Object.keys(customOverrides || {}).length > 0 && (
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              )}
            </button>
          )}

          {/* Day / Night Theme Switcher */}
          <div className="flex items-center gap-1 font-gotham text-xs tracking-wider pt-0.5">
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
            <span className="text-neutral-500 dark:text-neutral-400 mr-1.5">For inquiries</span>
            <button
              onClick={() => {
                soundManager.playClick();
                onOpenContact();
              }}
              className="underline font-bold hover:text-[#e62b1e] transition-colors cursor-pointer"
            >
              sahakaushik1999@gmail.com
            </button>
          </div>
        </div>
      </div>

      {/* ================= GALLERY CONTROLS / FILTER BAR ================= */}
      <div className="w-full flex flex-col md:flex-row md:items-center justify-between gap-4 py-3 mb-8 border-b border-black/10 dark:border-white/10 select-none">
        {/* Left: Minimalist Category Filters with Counts */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            const count = cat === 'All'
              ? PLAYGROUND_PORTFOLIO_ITEMS.length
              : PLAYGROUND_PORTFOLIO_ITEMS.filter((i) => i.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => {
                  soundManager.playClick();
                  setActiveCategory(cat);
                }}
                className={`px-3 py-1.5 font-gotham text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-[#e62b1e] text-white'
                    : theme === 'light'
                    ? 'text-neutral-700 hover:text-black hover:bg-black/5'
                    : 'text-neutral-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>{cat}</span>
                <span className="text-[10px] font-mono-tabular opacity-75">
                  ({count})
                </span>
              </button>
            );
          })}
        </div>

        {/* Right: Layout Density (Dimension Canvas vs Compact Grid) */}
        <div className="flex items-center gap-3 shrink-0 text-xs font-gotham font-bold uppercase">
          <span className="text-neutral-500 font-mono-tabular hidden sm:inline">
            {filteredItems.length} {filteredItems.length === 1 ? 'WORK' : 'WORKS'}
          </span>
          <div className="flex items-center border border-black/15 dark:border-white/15 p-0.5 rounded-full overflow-hidden bg-black/[0.03] dark:bg-white/[0.03]">
            {/* Apple Watch Zoom Grid (Default) */}
            <button
              onClick={() => {
                soundManager.playClick();
                setViewLayout('apple');
              }}
              className={`px-3 py-1 text-[11px] font-bold tracking-wider cursor-pointer transition-colors flex items-center gap-1.5 rounded-full ${
                viewLayout === 'apple'
                  ? 'bg-[#e62b1e] text-white shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
              }`}
              title="Apple Watch Interface: Infinite Canvas Zooming Grid (GSAP ScrollTrigger)"
            >
              <ZoomIn className="w-3.5 h-3.5" />
              <span>Apple Watch Zoom</span>
            </button>

            {/* The Dimension 2D Matrix */}
            <button
              onClick={() => {
                soundManager.playClick();
                setViewLayout('matrix');
              }}
              className={`px-3 py-1 text-[11px] font-bold tracking-wider cursor-pointer transition-colors flex items-center gap-1.5 rounded-full ${
                viewLayout === 'matrix'
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
              }`}
              title="Interactive Dimension Matrix Canvas (Draggable Squircle Grid)"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Dimension 2D</span>
            </button>

            {/* Classic Grid View */}
            <button
              onClick={() => {
                soundManager.playClick();
                setViewLayout('grid');
              }}
              className={`px-3 py-1 text-[11px] font-bold tracking-wider cursor-pointer transition-colors flex items-center gap-1.5 rounded-full ${
                viewLayout === 'grid'
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
              }`}
              title="Classic Grid View"
            >
              <Grid className="w-3.5 h-3.5" />
              <span>Grid View</span>
            </button>
          </div>
        </div>
      </div>

      {/* ================= CONDITIONAL RECENT WORKS VIEW ================= */}
      {viewLayout === 'apple' ? (
        <div className="w-full pb-8">
          <AppleWatchZoomGrid
            items={itemsWithOverrides}
            theme={theme}
            onSelectItem={(item, circleId) => {
              setActiveGalleryCircle({ item, circleId });
            }}
            onEditCircle={(item, circleId, title, imageUrl, videoUrl) => {
              setEditingCircle({
                item,
                circleId,
                currentTitle: title,
                currentImageUrl: imageUrl,
                currentVideoUrl: videoUrl,
              });
            }}
            onDeleteCircle={(circleId, title) => {
              handleRemoveCircle(circleId, title);
            }}
            onOpenAddCircle={() => setIsAddCircleOpen(true)}
            isAudioOn={isAudioOn}
            activeCategory={activeCategory}
            circleCustomizations={circleCustomizations}
            onResetAllCircles={handleResetAllCircles}
            isCirclesModified={removedProjectIds.length > 0 || customProjects.length > 0}
          />
        </div>
      ) : viewLayout === 'matrix' ? (
        <div className="w-full pb-8">
          <DimensionMatrixCanvas
            items={itemsWithOverrides}
            theme={theme}
            onSelectItem={(item) => setActiveGalleryCircle({ item, circleId: item.id })}
            activeCategory={activeCategory}
            isAudioOn={isAudioOn}
          />
        </div>
      ) : (
        <div className="w-full grid gap-6 sm:gap-8 lg:gap-10 pb-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                soundManager.playClick();
                setActiveGalleryCircle({ item, circleId: item.id });
              }}
              className="group cursor-pointer flex flex-col select-none"
            >
              {/* Visual Container: 100% Imagery Dominant with Smooth Hover Zoom */}
              <div className="relative w-full aspect-[16/10] overflow-hidden bg-neutral-200 dark:bg-neutral-900 flex items-center justify-center border-0 shadow-none">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  className="w-full h-full object-cover object-center group-hover:scale-[1.035] transition-transform duration-700 ease-out"
                />

                {/* Minimalist Floating Preview Pill on Hover */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <span className="px-3 py-1.5 bg-black/85 backdrop-blur-md text-white text-[11px] font-gotham font-bold uppercase tracking-wider flex items-center gap-1 shadow-lg">
                    <span>VIEW GALLERY</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-[#e62b1e]" />
                  </span>
                </div>

                {/* Subtle Index Tag */}
                <div className="absolute bottom-3 left-3 pointer-events-none">
                  <span className="font-mono-tabular text-xs font-black text-white drop-shadow-md bg-black/60 px-2 py-0.5 backdrop-blur-sm">
                    {item.index}
                  </span>
                </div>
              </div>

              {/* Ultra-Clean Minimal Caption */}
              <div className="pt-3 pb-1 flex items-baseline justify-between gap-3">
                <h3 className="font-unbounded text-sm sm:text-base font-black tracking-tight text-[#0c0c0e] dark:text-white group-hover:text-[#e62b1e] transition-colors leading-tight truncate">
                  {item.title}
                </h3>
                <span className="font-mono-tabular text-[11px] uppercase tracking-wider text-neutral-500 shrink-0 font-semibold">
                  {item.category.split(' ')[0]}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ================= PROJECT GALLERY MODAL (Gallery + Add / Delete Images) ================= */}
      {activeGalleryCircle && (
        <ProjectGalleryModal
          isOpen={true}
          onClose={() => setActiveGalleryCircle(null)}
          circleId={activeGalleryCircle.circleId}
          projectId={activeGalleryCircle.item.id}
          title={
            circleCustomizations[activeGalleryCircle.circleId]?.title ||
            circleCustomizations[activeGalleryCircle.item.id]?.title ||
            activeGalleryCircle.item.title
          }
          category={activeGalleryCircle.item.category}
          client={activeGalleryCircle.item.client}
          currentThumbnailUrl={
            circleCustomizations[activeGalleryCircle.circleId]?.imageUrl ||
            circleCustomizations[activeGalleryCircle.item.id]?.imageUrl ||
            activeGalleryCircle.item.imageUrl
          }
          galleryImages={getProjectGallery(
            activeGalleryCircle.circleId,
            activeGalleryCircle.item.id,
            activeGalleryCircle.item.imageUrl
          )}
          theme={theme}
          onUpdateGallery={(newImages) => {
            saveCircleCustomization(activeGalleryCircle.circleId, { gallery: newImages });
          }}
          onSetThumbnail={(newThumb) => {
            if (isVideoUrl(newThumb)) {
              saveCircleCustomization(activeGalleryCircle.circleId, {
                imageUrl: newThumb,
                videoUrl: newThumb,
                mediaType: 'video',
              });
            } else {
              saveCircleCustomization(activeGalleryCircle.circleId, {
                imageUrl: newThumb,
                mediaType: 'image',
              });
            }
          }}
          onUpdateTitle={(newTitle) => {
            saveCircleCustomization(activeGalleryCircle.circleId, { title: newTitle });
          }}
          onOpenCircleCustomizer={() => {
            const currentThumb =
              circleCustomizations[activeGalleryCircle.circleId]?.imageUrl ||
              circleCustomizations[activeGalleryCircle.item.id]?.imageUrl ||
              activeGalleryCircle.item.imageUrl;
            const currentName =
              circleCustomizations[activeGalleryCircle.circleId]?.title ||
              circleCustomizations[activeGalleryCircle.item.id]?.title ||
              activeGalleryCircle.item.title;
            const currentVideo =
              circleCustomizations[activeGalleryCircle.circleId]?.videoUrl ||
              circleCustomizations[activeGalleryCircle.item.id]?.videoUrl ||
              activeGalleryCircle.item.videoUrl;
            setEditingCircle({
              item: activeGalleryCircle.item,
              circleId: activeGalleryCircle.circleId,
              currentTitle: currentName,
              currentImageUrl: currentThumb,
              currentVideoUrl: currentVideo,
            });
          }}
          onDeleteCircle={(circleId) => {
            handleRemoveCircle(circleId, activeGalleryCircle.item.title);
            setActiveGalleryCircle(null);
          }}
        />
      )}

      {/* ================= CIRCLE CUSTOMIZER MODAL (Change Thumbnail & Name) ================= */}
      {editingCircle && (
        <CircleEditModal
          isOpen={true}
          onClose={() => setEditingCircle(null)}
          circleId={editingCircle.circleId}
          initialTitle={editingCircle.currentTitle}
          initialImageUrl={editingCircle.currentImageUrl}
          initialVideoUrl={editingCircle.currentVideoUrl || editingCircle.item.videoUrl}
          galleryImages={getProjectGallery(
            editingCircle.circleId,
            editingCircle.item.id,
            editingCircle.currentImageUrl
          )}
          theme={theme}
          onSave={(title, imageUrl, videoUrl, mediaType) => {
            saveCircleCustomization(editingCircle.circleId, {
              title,
              imageUrl,
              videoUrl,
              mediaType,
            });
            setEditingCircle(null);
          }}
          onReset={() => {
            resetCircleCustomization(editingCircle.circleId);
            setEditingCircle(null);
          }}
          onDeleteCircle={(circleId) => {
            handleRemoveCircle(circleId, editingCircle.currentTitle);
            setEditingCircle(null);
          }}
        />
      )}

      {/* ================= ADD NEW CIRCLE MODAL ================= */}
      {isAddCircleOpen && (
        <AddCircleModal
          isOpen={true}
          onClose={() => setIsAddCircleOpen(false)}
          theme={theme}
          onAddCircle={handleAddCircle}
        />
      )}

      {/* ================= TOAST NOTIFICATION WITH UNDO ================= */}
      {toastNotice && (
        <div className="fixed bottom-6 right-6 z-[99] flex items-center gap-3 px-4 py-2.5 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-mono-tabular text-xs font-bold shadow-2xl border border-white/20 dark:border-black/20 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <span>{toastNotice.message}</span>
          {toastNotice.undoCircleId && (
            <button
              onClick={() => handleRestoreCircle(toastNotice.undoCircleId!)}
              className="px-2 py-0.5 rounded bg-[#e62b1e] text-white hover:bg-[#d02418] transition-colors cursor-pointer text-[11px] uppercase font-bold"
            >
              Undo
            </button>
          )}
          <button
            onClick={() => setToastNotice(null)}
            className="p-0.5 hover:opacity-75 cursor-pointer ml-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
