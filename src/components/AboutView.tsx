import React, { useState, useEffect } from 'react';
import { ViewMode, ThemeMode } from '../types/portfolio';
import { ABOUT_DATA } from '../data/portfolioData';
import { soundManager } from '../utils/audio';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, FileText, Download, Mail, Phone, ExternalLink, GraduationCap, Briefcase, Wrench, Award, ChevronRight } from 'lucide-react';

interface AboutViewProps {
  onViewChange: (view: ViewMode) => void;
  onOpenContact: () => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
  isAudioOn: boolean;
  onToggleAudio: () => void;
}

export const AboutView: React.FC<AboutViewProps> = ({
  onViewChange,
  onOpenContact,
  theme,
  onToggleTheme,
  isAudioOn,
  onToggleAudio,
}) => {
  const [timeString, setTimeString] = useState<string>('17:46');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [copiedEmail, setCopiedEmail] = useState<boolean>(false);
  const [copiedPhone, setCopiedPhone] = useState<boolean>(false);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Kolkata', // IST timezone to match main page & live clock
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

  const handleCopyEmail = () => {
    soundManager.playClick();
    navigator.clipboard.writeText(ABOUT_DATA.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2200);
  };

  const handleCopyPhone = () => {
    soundManager.playClick();
    navigator.clipboard.writeText(ABOUT_DATA.phone);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2200);
  };

  const handleOpenResume = () => {
    soundManager.playClick();
    setIsResumeModalOpen(true);
  };

  return (
    <div
      className={`w-full min-h-screen transition-colors duration-300 font-sans flex flex-col justify-between overflow-x-hidden ${
        theme === 'light' ? 'bg-[#f4f4f1] text-[#0c0c0e]' : 'bg-[#09090b] text-[#f4f4f4]'
      }`}
    >
      {/* ================= TABLET & MOBILE TOP BAR (< md screens) ================= */}
      <div className="flex md:hidden items-center justify-between w-full px-4 sm:px-6 pt-4 pb-3 border-b border-black/10 dark:border-white/10 select-none">
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

        {/* Right: Audio + Theme Toggle */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onToggleAudio}
            className="flex items-center gap-1 font-mono-tabular text-[11px] text-neutral-600 dark:text-neutral-400"
          >
            <span>{isAudioOn ? 'Audio On' : 'Muted'}</span>
          </button>
          <button
            onClick={onToggleTheme}
            className="font-mono-tabular text-xs font-bold px-2 py-1 uppercase tracking-wider rounded border border-neutral-400 dark:border-neutral-700 text-[#0c0c0e] dark:text-white cursor-pointer active:scale-95 transition-transform"
          >
            {theme === 'light' ? 'NIGHT' : 'DAY'}
          </button>
        </div>
      </div>

      {/* ================= MOBILE NAVIGATION DRAWER ================= */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col justify-between p-6 md:hidden"
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
                className="w-9 h-9 flex items-center justify-center text-white text-xl font-bold rounded-full bg-white/10 cursor-pointer"
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

              {/* ABOUT (Active) */}
              <button
                onClick={() => {
                  soundManager.playClick();
                  setIsMobileMenuOpen(false);
                  onViewChange('about');
                }}
                className="text-[#e62b1e] flex items-center cursor-pointer text-left"
              >
                <span className="w-7 inline-flex items-center shrink-0 text-xl">→</span>
                <span>ABOUT</span>
              </button>

              {/* RECENT WORKS */}
              <button
                onClick={() => {
                  soundManager.playClick();
                  setIsMobileMenuOpen(false);
                  onViewChange('playground');
                }}
                className="text-white hover:text-[#e62b1e] transition-colors cursor-pointer text-left flex items-center whitespace-nowrap"
              >
                <span className="w-7 inline-flex items-center shrink-0 text-xl" />
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
            <div className="border-t border-white/20 pt-4 flex flex-col gap-2 text-xs text-neutral-300 font-mono-tabular">
              <div className="flex items-center justify-between">
                <span>IST, {timeString}</span>
                <button
                  onClick={handleOpenResume}
                  className="text-[#e62b1e] font-bold uppercase underline"
                >
                  View Updated Resume
                </button>
              </div>
              <div className="flex flex-col gap-1 text-[11px]">
                <button
                  onClick={handleCopyEmail}
                  className="text-white underline hover:text-[#e62b1e] text-left truncate"
                >
                  {copiedEmail ? 'Copied!' : ABOUT_DATA.email}
                </button>
                <button
                  onClick={handleCopyPhone}
                  className="text-white underline hover:text-[#e62b1e] text-left"
                >
                  {copiedPhone ? 'Copied!' : ABOUT_DATA.phone}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= DESKTOP & TABLET TOP SECTION (>= md: Identically Aligned with Work Page) ================= */}
      <div className="hidden md:flex w-full items-start justify-between px-4 md:px-6 lg:px-8 xl:px-14 pt-4 md:pt-6 lg:pt-8 xl:pt-10 mb-4 lg:mb-6 select-none">
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

            {/* ABOUT (Active View) */}
            <button
              onClick={() => {
                soundManager.playClick();
                onViewChange('about');
              }}
              className="text-left flex items-center transition-colors cursor-pointer whitespace-nowrap text-[#e62b1e]"
            >
              <span className="w-4 md:w-5 inline-flex items-center shrink-0 font-black text-sm md:text-base sm:text-lg">→</span>
              <span>ABOUT</span>
            </button>

            {/* RECENT WORKS */}
            <button
              onClick={() => {
                soundManager.playClick();
                onViewChange('playground');
              }}
              className={`text-left flex items-center group transition-colors cursor-pointer whitespace-nowrap hover:text-[#e62b1e] ${
                theme === 'light' ? 'text-[#0c0c0e]' : 'text-white'
              }`}
            >
              <span className="w-4 md:w-5 inline-flex items-center shrink-0 font-black text-sm md:text-base sm:text-lg" />
              <span className="group-hover:opacity-80 transition-opacity">RECENT WORKS</span>
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
        <div className="flex items-start gap-8 lg:gap-12 xl:gap-16 font-mono-tabular text-xs">
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

        {/* Right: Theme Switcher, Inquiries, and Personality Bullet List */}
        <div className="flex flex-col items-end space-y-3.5">
          <div className="flex items-start gap-5 lg:gap-8">
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

            {/* Inquiries / Direct Line */}
            <div
              className={`font-sans text-xs pt-0.5 ${
                theme === 'light' ? 'text-[#0c0c0e]' : 'text-neutral-200'
              }`}
            >
              <span className="text-neutral-600 dark:text-neutral-400 mr-1.5">For inquiries:</span>
              <button
                onClick={handleCopyPhone}
                className="underline font-bold hover:text-[#e62b1e] transition-colors cursor-pointer mr-2"
                title="Click to copy phone number"
              >
                {copiedPhone ? 'Copied phone!' : ABOUT_DATA.phone}
              </button>
              <button
                onClick={handleCopyEmail}
                className="underline font-bold hover:text-[#e62b1e] transition-colors cursor-pointer"
                title="Click to copy email"
              >
                {copiedEmail ? 'Copied email!' : ABOUT_DATA.email}
              </button>
            </div>
          </div>

          {/* Red Personality Bullet List Updated as per Resume */}
          <div className="font-sans text-xs lg:text-sm font-black text-[#e62b1e] uppercase tracking-tight leading-snug text-right">
            <div>SR. GRAPHIC DESIGNER AT THE TROST</div>
            <div>6+ YEARS PROFESSIONAL EXPERIENCE</div>
            <div>PERFORMANCE META ADS (3.5–6x ROAS)</div>
            <div>CREATIVE DIRECTION &amp; BRAND STRATEGY</div>
            <div>ARENA ANIMATION &amp; DU ALUMNUS</div>
            <div>SCALED CONTENT OUTPUT BY 3x</div>
            <div>DEEP ADOBE CREATIVE SUITE FLUENCY</div>
          </div>
        </div>
      </div>

      {/* ================= TABLET & MOBILE BIO BANNER (< md screens) ================= */}
      <div className="md:hidden px-4 pt-3 pb-2 select-none">
        <div className="flex items-center justify-between text-[11px] font-mono-tabular uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-2">
          <span>ABOUT // KAUSHIK SAHA</span>
          <span>IST {timeString}</span>
        </div>

        <div className="bg-black/5 dark:bg-white/5 p-3.5 border-l-2 border-[#e62b1e] space-y-1.5">
          <div className="font-syne text-sm font-black text-[#e62b1e] uppercase tracking-tight">
            SR. GRAPHIC DESIGNER — THE TROST
          </div>
          <p className="font-sans text-xs font-semibold text-[#0c0c0e] dark:text-neutral-200 leading-relaxed">
            6+ Years Experience • Leading in-house creative team for Health &amp; Wellness B2C brand • Meta Ads 3.5–6x ROAS • Creative Direction &amp; Brand Strategy
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleCopyPhone}
              className="font-mono-tabular text-xs font-bold underline text-neutral-800 dark:text-neutral-200 hover:text-[#e62b1e] cursor-pointer"
            >
              {copiedPhone ? '✓ Phone Copied!' : ABOUT_DATA.phone}
            </button>
            <button
              onClick={handleCopyEmail}
              className="font-mono-tabular text-xs font-bold underline text-neutral-800 dark:text-neutral-200 hover:text-[#e62b1e] cursor-pointer"
            >
              {copiedEmail ? '✓ Email Copied!' : ABOUT_DATA.email}
            </button>
            <button
              onClick={handleOpenResume}
              className="font-mono-tabular text-[11px] font-bold px-2.5 py-1 bg-[#e62b1e] text-white rounded uppercase tracking-wider cursor-pointer ml-auto"
            >
              View Updated Resume
            </button>
          </div>
        </div>
      </div>

      {/* ================= HERO CENTER: 20 - AVATAR - TO 26 (2020—2026 Archive) ================= */}
      <div className="relative w-full py-2 sm:py-4 md:py-6 flex items-center justify-between select-none overflow-visible max-w-4xl mx-auto px-4">
        {/* Left: Giant "20" */}
        <div className="flex-1 flex justify-center">
          <span className="font-unbounded text-5xl sm:text-7xl md:text-8xl xl:text-9xl font-black tracking-tighter text-neutral-400 dark:text-neutral-600 leading-none select-none drop-shadow-sm">
            20
          </span>
        </div>

        {/* Center: Illustrated Avatar Face with Dotted Texture Baseball Cap */}
        <div className="relative z-20 shrink-0 mx-2 sm:mx-4 flex justify-center">
          <svg
            className="w-20 xs:w-28 sm:w-36 md:w-40 lg:w-44 xl:w-52 h-auto max-w-[190px]"
            viewBox="0 0 220 250"
            fill="none"
          >
            <defs>
              {/* Halftone / Dot pattern for the baseball cap */}
              <pattern id="dotPatternAbout" x="0" y="0" width="6" height="6" patternUnits="userSpaceOnUse">
                <circle cx="3" cy="3" r="1.5" fill="#222222" />
              </pattern>
            </defs>

            {/* Neck and collar */}
            <path d="M90 200 L90 240 L130 240 L130 200" fill="#ffffff" stroke="#111111" strokeWidth="4" />

            {/* Head Contour */}
            <path
              d="M60 90 C45 160 60 215 110 220 C160 215 175 160 160 90 Z"
              fill="#ffffff"
              stroke="#111111"
              strokeWidth="4.5"
            />

            {/* Black Hair sideburns */}
            <path d="M56 100 C52 140 68 160 70 170 L60 170 C50 145 48 115 56 100 Z" fill="#111111" />
            <path d="M164 100 C168 140 152 160 150 170 L160 170 C170 145 172 115 164 100 Z" fill="#111111" />

            {/* Cap Crown with dotted halftone texture pattern */}
            <path
              d="M52 110 C50 30 170 30 168 110 Z"
              fill="url(#dotPatternAbout)"
              stroke="#111111"
              strokeWidth="4"
            />
            {/* Cap background behind dots */}
            <path
              d="M52 110 C50 30 170 30 168 110 Z"
              fill="#dcdcdc"
              style={{ mixBlendMode: 'multiply' }}
            />

            {/* Curved Cap Visor */}
            <path
              d="M45 106 C45 106 65 118 110 118 C155 118 175 106 175 106 C175 106 160 128 110 128 C60 128 45 106 45 106 Z"
              fill="#222222"
              stroke="#111111"
              strokeWidth="3.5"
            />

            {/* Round Glasses */}
            <circle cx="85" cy="142" r="19" stroke="#111111" strokeWidth="4" fill="#ffffff" />
            <circle cx="135" cy="142" r="19" stroke="#111111" strokeWidth="4" fill="#ffffff" />
            <line x1="104" y1="140" x2="116" y2="140" stroke="#111111" strokeWidth="4" />

            {/* Pupils & Eyebrows */}
            <circle cx="85" cy="142" r="4.5" fill="#111111" />
            <circle cx="135" cy="142" r="4.5" fill="#111111" />
            <path d="M72 120 C76 115 94 115 98 120" stroke="#111111" strokeWidth="3" strokeLinecap="round" />
            <path d="M122 120 C126 115 144 115 148 120" stroke="#111111" strokeWidth="3" strokeLinecap="round" />

            {/* Nose */}
            <path d="M110 144 L108 158 L114 160" stroke="#111111" strokeWidth="3" strokeLinecap="round" />

            {/* Neutral calm mouth */}
            <line x1="98" y1="178" x2="122" y2="178" stroke="#111111" strokeWidth="3.5" strokeLinecap="round" />

            {/* Left Ear with 'x' Earring */}
            <path d="M54 135 C42 140 42 165 54 170" stroke="#111111" strokeWidth="3.5" fill="#ffffff" />
            <text x="39" y="166" fontSize="13" fontWeight="bold" fill="#111111">✕</text>
            <path d="M166 135 C178 140 178 165 166 170" stroke="#111111" strokeWidth="3.5" fill="#ffffff" />
          </svg>
        </div>

        {/* Right: "TO 26" */}
        <div className="flex-1 flex items-center justify-center relative">
          <span className="font-unbounded text-xs sm:text-base md:text-lg font-black text-[#e62b1e] tracking-tight uppercase mr-1 sm:mr-2">
            TO
          </span>
          <span className="font-unbounded text-5xl sm:text-7xl md:text-8xl xl:text-9xl font-black tracking-tighter text-neutral-400 dark:text-neutral-600 leading-none select-none drop-shadow-sm">
            26
          </span>
        </div>
      </div>

      {/* ================= BOTTOM 4-COLUMN MONOGRAPH (Updated Resume Content) ================= */}
      <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-14 pb-8">
        <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-8 pt-6 border-t border-neutral-300 dark:border-neutral-800 text-xs">
          {/* Col 1: Education (from updated resume) */}
          <div className="space-y-3.5 bg-black/[0.02] dark:bg-white/[0.02] p-4 lg:p-5 rounded border border-black/5 dark:border-white/5 flex flex-col justify-between">
            <div className="space-y-3.5">
              <div className="font-mono-tabular text-xs uppercase font-bold text-neutral-900 dark:text-neutral-100 tracking-wider border-b border-black/15 dark:border-white/15 pb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-[#e62b1e]" />
                  <span>Education</span>
                </span>
                <span className="text-[#e62b1e] font-mono-tabular font-bold">01</span>
              </div>

              <div className="space-y-4 font-sans text-xs leading-relaxed text-[#0c0c0e] dark:text-neutral-100">
                {/* Diploma in Animation & Multimedia */}
                <div className="pb-3 border-b border-black/5 dark:border-white/5">
                  <div className="text-sm font-black text-[#e62b1e]">Diploma in Animation &amp; Multimedia</div>
                  <div className="text-neutral-900 dark:text-neutral-100 font-semibold text-xs mt-0.5">
                    Arena Animation
                  </div>
                  <div className="font-mono-tabular text-[11px] text-neutral-600 dark:text-neutral-400 mt-0.5">
                    Multimedia &amp; Motion Design Specialization
                  </div>
                </div>

                {/* Bachelor of Commerce */}
                <div className="pb-2">
                  <div className="text-sm font-black text-[#0c0c0e] dark:text-white">Bachelor of Commerce</div>
                  <div className="text-neutral-900 dark:text-neutral-100 font-semibold text-xs mt-0.5">
                    Sri Aurobindo College
                  </div>
                  <div className="font-mono-tabular text-[11px] text-neutral-600 dark:text-neutral-400 mt-0.5">
                    University of Delhi
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-black/10 dark:border-white/10 flex items-center justify-between text-[11px] font-mono-tabular text-neutral-500">
              <span>Location: New Delhi, India</span>
              <span className="text-[#e62b1e]">Arena &amp; DU</span>
            </div>
          </div>

          {/* Col 2: Experience (The Trost, Cultre Boat, Abstract Reality, Fortune Studios) */}
          <div className="space-y-3.5 bg-black/[0.02] dark:bg-white/[0.02] p-4 lg:p-5 rounded border border-black/5 dark:border-white/5 flex flex-col justify-between">
            <div className="space-y-3.5">
              <div className="font-mono-tabular text-xs uppercase font-bold text-neutral-900 dark:text-neutral-100 tracking-wider border-b border-black/15 dark:border-white/15 pb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-[#e62b1e]" />
                  <span>Experience</span>
                </span>
                <span className="text-[#e62b1e] font-mono-tabular font-bold">02</span>
              </div>

              <div className="space-y-3 font-sans text-xs leading-relaxed text-[#0c0c0e] dark:text-neutral-100">
                {/* 1. The Trost (Current) */}
                <div className="pb-2.5 border-b border-black/5 dark:border-white/5">
                  <div className="flex items-baseline justify-between">
                    <div className="text-sm font-black text-[#e62b1e]">The Trost</div>
                    <div className="font-mono-tabular text-[10px] text-neutral-500 font-bold uppercase">May 2025 – Aug 2026</div>
                  </div>
                  <div className="font-bold text-neutral-950 dark:text-neutral-100 text-[11px]">
                    Sr. Graphic Designer
                  </div>
                  <div className="text-[11px] text-neutral-600 dark:text-neutral-300 mt-0.5 leading-snug">
                    Lead in-house creative team for Health &amp; Wellness B2C brand. Direct Meta ads delivering 3.5–6x ROAS; scaled output by 3x and led sold-out launch.
                  </div>
                </div>

                {/* 2. Cultre Boat */}
                <div className="pb-2.5 border-b border-black/5 dark:border-white/5">
                  <div className="flex items-baseline justify-between">
                    <div className="text-xs font-black text-neutral-900 dark:text-white">Cultre Boat</div>
                    <div className="font-mono-tabular text-[10px] text-neutral-500 font-semibold">Sep 2024 – Apr 2025</div>
                  </div>
                  <div className="font-bold text-neutral-800 dark:text-neutral-200 text-[11px]">
                    Communication Designer
                  </div>
                  <div className="text-[11px] text-neutral-600 dark:text-neutral-400 mt-0.5 leading-snug">
                    50+ weekly assets for Masala Synergy, Vasansi Jaipur, &amp; The Box Boutique. Motion creatives with 3.6x higher engagement.
                  </div>
                </div>

                {/* 3. Abstract Reality & Fortune Studios */}
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <div className="font-bold text-neutral-900 dark:text-white">Abstract Reality</div>
                    <div className="text-[10px] text-neutral-500 font-mono-tabular">Jan – Sep 2024</div>
                    <div className="text-[10px] text-neutral-600 dark:text-neutral-400">Graphic Designer</div>
                  </div>
                  <div>
                    <div className="font-bold text-neutral-900 dark:text-white">Fortune Studios</div>
                    <div className="text-[10px] text-neutral-500 font-mono-tabular">Aug 2020 – Dec 2023</div>
                    <div className="text-[10px] text-neutral-600 dark:text-neutral-400">Graphic Designer</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-black/10 dark:border-white/10 flex items-center justify-between text-[11px] font-mono-tabular text-neutral-500">
              <span>Total: 6+ Years Across Industry</span>
              <span className="text-[#e62b1e]">D2C &amp; Agency</span>
            </div>
          </div>

          {/* Col 3: Skills (from updated resume) */}
          <div className="space-y-3.5 bg-black/[0.02] dark:bg-white/[0.02] p-4 lg:p-5 rounded border border-black/5 dark:border-white/5 flex flex-col justify-between">
            <div className="space-y-3.5">
              <div className="font-mono-tabular text-xs uppercase font-bold text-neutral-900 dark:text-neutral-100 tracking-wider border-b border-black/15 dark:border-white/15 pb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Wrench className="w-3.5 h-3.5 text-[#e62b1e]" />
                  <span>Skills</span>
                </span>
                <span className="text-[#e62b1e] font-mono-tabular font-bold">03</span>
              </div>

              {/* Core Skills from Resume */}
              <div className="space-y-2 font-sans text-xs leading-relaxed">
                <div className="font-mono-tabular text-[10px] uppercase font-bold text-neutral-500 tracking-wider mb-1">
                  Core Disciplines
                </div>
                {ABOUT_DATA.skills.map((skill, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 p-1.5 rounded bg-black/[0.02] dark:bg-white/[0.02] border border-black/5 dark:border-white/5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#e62b1e]" />
                    <span className="font-bold text-neutral-950 dark:text-white text-xs">{skill}</span>
                  </div>
                ))}

                {/* Software Mastery */}
                <div className="pt-2">
                  <div className="font-mono-tabular text-[10px] uppercase font-bold text-neutral-500 tracking-wider mb-1">
                    Software Fluency
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                    <div className="p-1 rounded bg-black/[0.02] dark:bg-white/[0.02] font-semibold text-neutral-800 dark:text-neutral-200">
                      • Photoshop
                    </div>
                    <div className="p-1 rounded bg-black/[0.02] dark:bg-white/[0.02] font-semibold text-neutral-800 dark:text-neutral-200">
                      • Illustrator
                    </div>
                    <div className="p-1 rounded bg-black/[0.02] dark:bg-white/[0.02] font-semibold text-neutral-800 dark:text-neutral-200">
                      • Premiere Pro
                    </div>
                    <div className="p-1 rounded bg-black/[0.02] dark:bg-white/[0.02] font-semibold text-neutral-800 dark:text-neutral-200">
                      • After Effects
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-black/10 dark:border-white/10 flex items-center justify-between text-[11px] font-mono-tabular text-neutral-500">
              <span>Adobe Creative Suite</span>
              <span className="text-[#e62b1e]">Deep Fluency</span>
            </div>
          </div>

          {/* Col 4: Summary & Contact (from updated resume) */}
          <div className="space-y-3.5 bg-black/[0.02] dark:bg-white/[0.02] p-4 lg:p-5 rounded border border-black/5 dark:border-white/5 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="font-mono-tabular text-xs uppercase font-bold text-neutral-900 dark:text-neutral-100 tracking-wider border-b border-black/15 dark:border-white/15 pb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-[#e62b1e]" />
                  <span>Summary &amp; Contact</span>
                </span>
                <span className="text-[#e62b1e] font-mono-tabular font-bold">04</span>
              </div>

              {/* Exact Summary from Resume */}
              <p className="font-sans text-[11px] leading-relaxed text-neutral-800 dark:text-neutral-200 font-medium">
                {ABOUT_DATA.summary}
              </p>

              {/* Contact Information */}
              <div className="pt-1 space-y-1.5 text-xs font-mono-tabular">
                <button
                  onClick={handleCopyPhone}
                  className="w-full flex items-center justify-between p-1.5 rounded bg-black/[0.03] dark:bg-white/[0.03] hover:bg-[#e62b1e]/10 transition-colors text-left cursor-pointer group"
                >
                  <span className="flex items-center gap-1.5 text-neutral-600 dark:text-neutral-400 font-sans">
                    <Phone className="w-3 h-3 text-[#e62b1e]" />
                    <span>Phone:</span>
                  </span>
                  <span className="font-bold text-neutral-900 dark:text-white group-hover:text-[#e62b1e]">
                    {copiedPhone ? 'Copied!' : ABOUT_DATA.phone}
                  </span>
                </button>

                <button
                  onClick={handleCopyEmail}
                  className="w-full flex items-center justify-between p-1.5 rounded bg-black/[0.03] dark:bg-white/[0.03] hover:bg-[#e62b1e]/10 transition-colors text-left cursor-pointer group"
                >
                  <span className="flex items-center gap-1.5 text-neutral-600 dark:text-neutral-400 font-sans">
                    <Mail className="w-3 h-3 text-[#e62b1e]" />
                    <span>Email:</span>
                  </span>
                  <span className="font-bold text-neutral-900 dark:text-white group-hover:text-[#e62b1e] truncate max-w-[140px]">
                    {copiedEmail ? 'Copied!' : ABOUT_DATA.email}
                  </span>
                </button>
              </div>
            </div>

            {/* Action Bar: View Resume Modal */}
            <div className="pt-2 border-t border-black/10 dark:border-white/10 flex items-center gap-2">
              <button
                onClick={handleOpenResume}
                className="w-full py-2 px-3 bg-[#e62b1e] text-white hover:bg-[#c92217] transition-colors rounded text-xs font-mono-tabular font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>View Full Resume</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ================= COMPREHENSIVE RESUME MODAL (Formatted exactly as uploaded image.png) ================= */}
      <AnimatePresence>
        {isResumeModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
            onClick={() => setIsResumeModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-white text-[#111111] shadow-2xl border border-neutral-300 p-6 sm:p-10 select-text font-sans"
            >
              {/* Modal Top Bar (Print & Close controls) */}
              <div className="flex items-center justify-between pb-4 border-b border-neutral-200 mb-6 text-xs font-mono-tabular">
                <span className="text-[#e62b1e] font-bold uppercase tracking-wider">
                  KAUSHIK SAHA — UPDATED RESUME
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.print()}
                    className="p-1.5 px-3 rounded border border-neutral-300 hover:bg-neutral-100 transition-colors flex items-center gap-1.5 font-bold uppercase cursor-pointer"
                    title="Print or Save as PDF"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Print / PDF</span>
                  </button>
                  <button
                    onClick={() => setIsResumeModalOpen(false)}
                    className="p-1.5 rounded hover:bg-neutral-100 transition-colors cursor-pointer"
                    aria-label="Close"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Exact Resume Layout (Left vertical bar + Right content matching image.png) */}
              <div className="grid grid-cols-[100px_1fr] sm:grid-cols-[130px_1fr] md:grid-cols-[160px_1fr] border border-black">
                {/* Left Column: Vertical KAUSHIK SAHA */}
                <div className="border-r border-black flex items-center justify-center p-4 bg-white select-none">
                  <div
                    className="font-unbounded font-black tracking-wider text-black text-2xl sm:text-3xl md:text-4xl uppercase whitespace-nowrap"
                    style={{
                      writingMode: 'vertical-rl',
                      transform: 'rotate(180deg)',
                      letterSpacing: '0.18em',
                    }}
                  >
                    KAUSHIK SAHA
                  </div>
                </div>

                {/* Right Column: Resume Body */}
                <div className="flex flex-col">
                  {/* Header Row: GRAPHIC DESIGNER + Contact info */}
                  <div className="border-b border-black p-4 sm:p-6 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                    <h1 className="font-unbounded font-black text-lg sm:text-xl md:text-2xl tracking-tight text-black uppercase">
                      GRAPHIC DESIGNER
                    </h1>
                    <div className="font-sans text-xs sm:text-sm text-neutral-800 text-right sm:text-right font-medium">
                      <div className="font-bold">{ABOUT_DATA.phone}</div>
                      <div>{ABOUT_DATA.email}</div>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 sm:p-6 space-y-6">
                    {/* Summary Section */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-2.5 h-2.5 bg-black" />
                        <h2 className="font-unbounded font-bold text-sm sm:text-base text-black uppercase">
                          Summary
                        </h2>
                      </div>
                      <p className="font-sans text-xs sm:text-sm leading-relaxed text-neutral-800 text-justify">
                        {ABOUT_DATA.summary}
                      </p>
                    </div>

                    {/* Experience Section */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="w-2.5 h-2.5 bg-black" />
                        <h2 className="font-unbounded font-bold text-sm sm:text-base text-black uppercase">
                          Experience
                        </h2>
                      </div>

                      <div className="space-y-5">
                        {/* 1. The Trost */}
                        <div>
                          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mb-1">
                            <div>
                              <span className="font-bold text-sm sm:text-base text-black">Sr. Graphic Designer</span>{' '}
                              <span className="italic text-neutral-600 text-xs sm:text-sm">(May 2025 – Aug 2026)</span>
                            </div>
                            <div className="font-bold text-sm sm:text-base text-black">The Trost</div>
                          </div>
                          <ul className="list-disc list-outside ml-4 space-y-1 font-sans text-xs sm:text-sm text-neutral-800 leading-relaxed">
                            <li>Lead an in-house creative team for a Health &amp; Wellness B2C brand, managing creative strategy and execution across all channels.</li>
                            <li>Built and optimized Meta ad creative systems, consistently delivering 3.5–6x ROAS across Facebook, Instagram, and WhatsApp.</li>
                            <li>Scaled monthly creative output by 3x and reduced production time by ~40% through AI-powered workflows.</li>
                            <li>Led end-to-end creative for a product launch that sold out its first batch within one week.</li>
                            <li>Developed retention creatives that contributed to a 22% uplift in repeat purchase rate.</li>
                            <li>Partner closely with marketing and growth teams to align creative decisions with acquisition and retention KPIs.</li>
                          </ul>
                        </div>

                        {/* 2. Cultre Boat */}
                        <div>
                          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mb-1">
                            <div>
                              <span className="font-bold text-sm sm:text-base text-black">Communication Designer</span>{' '}
                              <span className="italic text-neutral-600 text-xs sm:text-sm">(Sep 2024 - Apr 2025)</span>
                            </div>
                            <div className="font-bold text-sm sm:text-base text-black">Cultre Boat</div>
                          </div>
                          <ul className="list-disc list-outside ml-4 space-y-1 font-sans text-xs sm:text-sm text-neutral-800 leading-relaxed">
                            <li>Delivered 50+ digital and print assets weekly for fashion and lifestyle brands including Masala Synergy, Vasansi Jaipur, and The Box Boutique.</li>
                            <li>Led end-to-end brand identity development for two client brands, spanning logo systems, typography, colour palettes, stationery, and uniforms.</li>
                            <li>Directed motion-led social creatives that achieved 3.6x higher engagement than static content.</li>
                            <li>Reduced client revision cycles by 30% by developing stronger creative briefs and trend-driven promotional assets.</li>
                          </ul>
                        </div>

                        {/* 3. Abstract Reality & Fortune Studios */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                          <div className="border-t border-neutral-200 pt-2">
                            <div className="font-bold text-sm text-black">Graphic Designer</div>
                            <div className="italic text-neutral-600 text-xs">(Jan 2024 - Sep 2024)</div>
                            <div className="font-bold text-sm text-neutral-900 mt-0.5">Abstract Reality Studios</div>
                          </div>
                          <div className="border-t border-neutral-200 pt-2">
                            <div className="font-bold text-sm text-black">Graphic Designer</div>
                            <div className="italic text-neutral-600 text-xs">(Aug 2020 - Dec 2023)</div>
                            <div className="font-bold text-sm text-neutral-900 mt-0.5">Fortune Studios</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Split: Skills & Education */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                      {/* Skills */}
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="w-2.5 h-2.5 bg-black" />
                          <h2 className="font-unbounded font-bold text-sm sm:text-base text-black uppercase">
                            Skills
                          </h2>
                        </div>
                        <ul className="list-disc list-outside ml-4 space-y-1 font-sans text-xs sm:text-sm text-neutral-800">
                          <li>Creative Direction</li>
                          <li>Brand Strategy</li>
                          <li>Campaign Concepting</li>
                          <li>Art Direction</li>
                          <li>Visual Storytelling</li>
                        </ul>
                      </div>

                      {/* Education */}
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="w-2.5 h-2.5 bg-black" />
                          <h2 className="font-unbounded font-bold text-sm sm:text-base text-black uppercase">
                            Education
                          </h2>
                        </div>
                        <ul className="list-disc list-outside ml-4 space-y-2 font-sans text-xs sm:text-sm text-neutral-800">
                          <li>
                            <div className="font-semibold">Diploma in Animation &amp; Multimedia</div>
                            <div className="italic text-neutral-600 text-xs">(Arena Animation)</div>
                          </li>
                          <li>
                            <div className="font-semibold">Bachelor of Commerce</div>
                            <div className="italic text-neutral-600 text-xs">(Sri Aurobindo College)</div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-xs">
                <a
                  href={ABOUT_DATA.behanceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="font-bold text-[#e62b1e] hover:underline flex items-center gap-1 font-mono-tabular"
                >
                  <span>View Behance Portfolio</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleCopyPhone}
                    className="px-3 py-1.5 border border-neutral-300 rounded font-mono-tabular font-bold hover:bg-neutral-100 transition-colors cursor-pointer"
                  >
                    {copiedPhone ? 'Copied Phone!' : ABOUT_DATA.phone}
                  </button>
                  <button
                    onClick={handleCopyEmail}
                    className="px-3 py-1.5 border border-neutral-300 rounded font-mono-tabular font-bold hover:bg-neutral-100 transition-colors cursor-pointer"
                  >
                    {copiedEmail ? 'Copied Email!' : ABOUT_DATA.email}
                  </button>
                  <button
                    onClick={() => setIsResumeModalOpen(false)}
                    className="px-4 py-1.5 bg-[#e62b1e] text-white rounded font-mono-tabular font-bold uppercase hover:bg-[#c92217] transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
