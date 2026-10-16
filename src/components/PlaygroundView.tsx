import React, { useState, useEffect } from 'react';
import { ViewMode, ThemeMode } from '../types/portfolio';
import { soundManager } from '../utils/audio';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, ChevronRight, ArrowUpRight, Camera } from 'lucide-react';

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
];

type CategoryFilter = 'All' | 'Campaigns & Festivals' | 'Logofolio & Branding' | 'Editorial & Lookbooks' | 'Packaging' | 'Motion & Video';

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
  const [selectedItem, setSelectedItem] = useState<PlaygroundItem | null>(null);
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('All');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [viewLayout, setViewLayout] = useState<'large' | 'grid'>('large');

  // Dynamically map custom image overrides if present
  const itemsWithOverrides = React.useMemo(() => {
    return PLAYGROUND_PORTFOLIO_ITEMS.map((item) => {
      const key = item.id.replace('pg-', '');
      const override = customOverrides?.[key];
      if (override) {
        return { ...item, imageUrl: override };
      }
      return item;
    });
  }, [customOverrides]);

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

  // Keyboard navigation for Lightbox modal
  useEffect(() => {
    if (!selectedItem) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedItem(null);
      if (e.key === 'ArrowRight' || e.key === 'j') {
        const curItems = activeCategory === 'All'
          ? itemsWithOverrides
          : itemsWithOverrides.filter((item) => item.category === activeCategory);
        const curIdx = curItems.findIndex((i) => i.id === selectedItem.id);
        if (curIdx !== -1) {
          soundManager.playSlide();
          setSelectedItem(curItems[(curIdx + 1) % curItems.length]);
        }
      }
      if (e.key === 'ArrowLeft' || e.key === 'k') {
        const curItems = activeCategory === 'All'
          ? itemsWithOverrides
          : itemsWithOverrides.filter((item) => item.category === activeCategory);
        const curIdx = curItems.findIndex((i) => i.id === selectedItem.id);
        if (curIdx !== -1) {
          soundManager.playSlide();
          setSelectedItem(curItems[(curIdx - 1 + curItems.length) % curItems.length]);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedItem, activeCategory, itemsWithOverrides]);

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

        {/* Right: Layout Density (Editorial 2-Col vs Compact 3-Col Grid) */}
        <div className="hidden sm:flex items-center gap-4 shrink-0 text-xs font-gotham font-bold uppercase">
          <span className="text-neutral-500 font-mono-tabular">
            {filteredItems.length} {filteredItems.length === 1 ? 'WORK' : 'WORKS'}
          </span>
          <div className="flex items-center border border-black/15 dark:border-white/15 p-0.5">
            <button
              onClick={() => {
                soundManager.playClick();
                setViewLayout('large');
              }}
              className={`px-2.5 py-1 text-[11px] font-bold tracking-wider cursor-pointer transition-colors ${
                viewLayout === 'large'
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
              }`}
              title="Large Editorial View (2 Columns)"
            >
              Editorial
            </button>
            <button
              onClick={() => {
                soundManager.playClick();
                setViewLayout('grid');
              }}
              className={`px-2.5 py-1 text-[11px] font-bold tracking-wider cursor-pointer transition-colors ${
                viewLayout === 'grid'
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
              }`}
              title="Compact Grid View (3 Columns)"
            >
              Grid
            </button>
          </div>
        </div>
      </div>

      {/* ================= IMAGERY-DOMINANT RECENT WORKS GALLERY ================= */}
      <div
        className={`w-full grid gap-6 sm:gap-8 lg:gap-10 pb-8 ${
          viewLayout === 'large'
            ? 'grid-cols-1 md:grid-cols-2'
            : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
        }`}
      >
        {filteredItems.map((item) => (
          <div
            key={item.id}
            onClick={() => {
              soundManager.playClick();
              setSelectedItem(item);
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
                  <span>EXPAND</span>
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

            {/* Ultra-Clean Minimal Caption (Title + Category only — Very Less Text) */}
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

      {/* ================= FULL-SCREEN IMAGERY LIGHTBOX MODAL ================= */}
      {selectedItem && (
        <div
          onClick={() => setSelectedItem(null)}
          className="fixed inset-0 z-50 overflow-y-auto overscroll-contain bg-black/90 backdrop-blur-md px-3 sm:px-6 md:px-10 py-6 sm:py-10 flex flex-col items-center justify-start min-h-screen cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#f7f7f5] dark:bg-[#0c0c0e] text-[#0c0c0e] dark:text-white max-w-5xl w-full border border-neutral-300 dark:border-neutral-800 shadow-2xl relative my-auto sm:my-4 cursor-default shrink-0 overflow-hidden"
          >
            {/* Modal Header */}
            <div className="sticky top-0 z-30 bg-[#f7f7f5]/95 dark:bg-[#0c0c0e]/95 backdrop-blur-md flex justify-between items-center px-6 py-4 border-b border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center gap-3">
                <span className="font-mono-tabular text-xs font-bold text-[#e62b1e]">
                  {selectedItem.index} / {filteredItems.length < 10 ? `0${filteredItems.length}` : filteredItems.length}
                </span>
                <h3 className="font-unbounded text-base sm:text-lg font-black uppercase tracking-tight truncate max-w-md sm:max-w-xl">
                  {selectedItem.title}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                {/* Previous Slide Button */}
                <button
                  onClick={() => {
                    soundManager.playSlide();
                    const curIdx = filteredItems.findIndex((i) => i.id === selectedItem.id);
                    if (curIdx !== -1) {
                      setSelectedItem(filteredItems[(curIdx - 1 + filteredItems.length) % filteredItems.length]);
                    }
                  }}
                  className="w-8 h-8 flex items-center justify-center text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer rounded-full"
                  title="Previous Artwork (Left Arrow)"
                  aria-label="Previous artwork"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {/* Next Slide Button */}
                <button
                  onClick={() => {
                    soundManager.playSlide();
                    const curIdx = filteredItems.findIndex((i) => i.id === selectedItem.id);
                    if (curIdx !== -1) {
                      setSelectedItem(filteredItems[(curIdx + 1) % filteredItems.length]);
                    }
                  }}
                  className="w-8 h-8 flex items-center justify-center text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer rounded-full"
                  title="Next Artwork (Right Arrow)"
                  aria-label="Next artwork"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Close Button */}
                <button
                  onClick={() => setSelectedItem(null)}
                  className="w-8 h-8 flex items-center justify-center text-neutral-600 dark:text-neutral-400 hover:text-[#e62b1e] hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer rounded-full ml-1"
                  aria-label="Close preview"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Giant High-Res Cinema Image Stage — Maximum Imagery Presence */}
            <div className="w-full h-[72vh] max-h-[820px] bg-black/95 flex items-center justify-center p-2 sm:p-4 overflow-hidden">
              <img
                src={selectedItem.imageUrl}
                alt={selectedItem.title}
                referrerPolicy="no-referrer"
                className="max-w-full max-h-full object-contain drop-shadow-2xl"
              />
            </div>

            {/* Clean Minimalist Bottom Strip */}
            <div className="px-6 py-4 flex flex-wrap items-center justify-between gap-3 text-xs font-mono-tabular border-t border-neutral-200 dark:border-neutral-800 bg-neutral-100/60 dark:bg-neutral-900/60">
              <div className="flex items-center gap-3">
                <span className="font-bold text-[#e62b1e]">{selectedItem.category}</span>
                <span className="text-neutral-400">—</span>
                <span className="text-neutral-600 dark:text-neutral-400 font-sans font-medium">{selectedItem.client}</span>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-neutral-500 hidden sm:inline">Use [←] and [→] to browse</span>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="px-4 py-1.5 font-gotham text-xs font-bold uppercase bg-neutral-900 text-white dark:bg-white dark:text-black hover:bg-[#e62b1e] dark:hover:bg-[#e62b1e] dark:hover:text-white transition-colors cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
