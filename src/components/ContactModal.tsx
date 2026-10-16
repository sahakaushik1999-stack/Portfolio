import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { soundManager } from '../utils/audio';
import { Check } from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState<boolean>(false);
  const email = 'sahakaushik1999@gmail.com';

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    soundManager.playClick();
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/60 backdrop-blur-md overflow-y-auto"
      >
        {/* Container for the Two Overlapping Cards */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-4xl flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-0 my-auto py-8"
        >
          {/* ================= CARD 1: CREDITS (Light / Silver Card - Reference Image 3) ================= */}
          <motion.div
            initial={{ opacity: 0, x: -30, y: 20, rotate: -6 }}
            animate={{ opacity: 1, x: 0, y: 0, rotate: -3 }}
            exit={{ opacity: 0, x: -30, y: 20, rotate: -6 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-[370px] sm:w-[380px] bg-[#d9d9d7] text-[#111111] p-7 sm:p-8 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] border border-[#c4c4c2] relative z-10 lg:-mr-12 lg:-mt-8 flex flex-col justify-between select-none"
            style={{ transformOrigin: 'bottom right' }}
          >
            {/* Credits Title */}
            <div className="mb-6">
              <h3 className="font-serif-display text-3xl font-bold tracking-tight text-[#111111]">
                CREDITS
              </h3>
            </div>

            {/* 2x2 Grid of Roles & Names */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-5 text-left mb-6">
              {/* Graphic Design & Video */}
              <div>
                <div className="font-sans text-xs text-neutral-500 font-semibold mb-0.5">
                  Design &amp; Direction
                </div>
                <div className="font-sans text-sm sm:text-base font-bold text-[#111111]">
                  Kaushik Saha
                </div>
              </div>

              {/* Behance Showcase */}
              <div>
                <div className="font-sans text-xs text-neutral-500 font-semibold mb-0.5">
                  Behance Portfolio
                </div>
                <div className="font-sans text-sm sm:text-base font-bold text-[#111111]">
                  @kaushiksaha1
                </div>
              </div>

              {/* Fonts */}
              <div>
                <div className="font-sans text-xs text-neutral-500 font-semibold mb-0.5">
                  Typography
                </div>
                <div className="font-sans text-sm sm:text-base font-bold text-[#111111] leading-snug">
                  <div>Unbounded</div>
                  <div>Gotham</div>
                </div>
              </div>

              {/* Tools */}
              <div>
                <div className="font-sans text-xs text-neutral-500 font-semibold mb-0.5">
                  Core Tools
                </div>
                <div className="font-sans text-sm sm:text-base font-bold text-[#111111]">
                  Adobe CC Suite
                </div>
              </div>
            </div>

            {/* Avatar Illustration with Peace Sign (Matching Reference Image 3) */}
            <div className="flex justify-center pt-2">
              <svg width="150" height="110" viewBox="0 0 150 110" fill="none">
                {/* Torso & patterned Hawaiian floral shirt */}
                <path
                  d="M45 110 L45 85 C55 75 95 75 105 85 L105 110 Z"
                  fill="#78787c"
                  stroke="#111111"
                  strokeWidth="2.5"
                />
                {/* White flower prints on shirt */}
                <circle cx="60" cy="95" r="4" fill="#ffffff" />
                <circle cx="90" cy="98" r="4" fill="#ffffff" />

                {/* Raised Hand with Peace Sign ✌️ */}
                <g stroke="#111111" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="#ffffff">
                  {/* Palm */}
                  <path d="M38 78 C35 78 30 75 28 68 C26 62 30 58 35 60 L42 66" />
                  {/* Peace Finger 1 */}
                  <path d="M34 60 L31 40 C30 36 34 35 36 38 L40 55" />
                  {/* Peace Finger 2 */}
                  <path d="M40 55 L45 42 C47 38 51 40 50 44 L46 62" />
                  {/* Folded fingers */}
                  <path d="M42 66 C44 65 47 67 47 70 C47 74 44 76 40 76" />
                </g>

                {/* Head */}
                <ellipse cx="75" cy="52" rx="26" ry="30" fill="#ffffff" stroke="#111111" strokeWidth="2.5" />

                {/* Cap */}
                <path
                  d="M52 40 C52 24 98 24 98 40 Z"
                  fill="#ffffff"
                  stroke="#111111"
                  strokeWidth="2.5"
                />
                {/* Cap peak */}
                <path
                  d="M48 38 C48 38 60 33 105 38"
                  stroke="#111111"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />

                {/* Round Glasses */}
                <circle cx="67" cy="50" r="7" stroke="#111111" strokeWidth="2.2" fill="#ffffff" />
                <circle cx="83" cy="50" r="7" stroke="#111111" strokeWidth="2.2" fill="#ffffff" />
                <line x1="74" y1="50" x2="76" y2="50" stroke="#111111" strokeWidth="2" />
                {/* Eyes */}
                <circle cx="67" cy="50" r="2" fill="#111111" />
                <circle cx="83" cy="50" r="2" fill="#111111" />

                {/* Smile */}
                <path d="M71 63 C74 66 78 66 81 63" stroke="#111111" strokeWidth="2.2" strokeLinecap="round" />
              </svg>
            </div>
          </motion.div>

          {/* ================= CARD 2: COME SAY HI (Dark Black Card - Reference Image 4) ================= */}
          <motion.div
            initial={{ opacity: 0, x: 30, y: 20, rotate: 4 }}
            animate={{ opacity: 1, x: 0, y: 0, rotate: 1.5 }}
            exit={{ opacity: 0, x: 30, y: 20, rotate: 4 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
            className="w-full max-w-[420px] sm:w-[440px] bg-[#141416] text-white p-7 sm:p-9 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.85)] border border-[#232328] relative z-20 flex flex-col justify-between select-none"
            style={{ transformOrigin: 'top left' }}
          >
            {/* Title */}
            <div className="mb-7">
              <h2 className="font-serif-display text-3xl sm:text-4xl font-medium tracking-normal text-white">
                COME SAY HI
              </h2>
            </div>

            {/* Content Sections matching Image 4 */}
            <div className="space-y-5 text-left">
              {/* Primary Contact: Drop me a line (Dedicated row for pristine alignment of email ID) */}
              <div className="pb-3 border-b border-white/10">
                <div className="font-sans text-xs text-neutral-400 font-medium mb-1">
                  Drop me a line
                </div>
                <button
                  onClick={handleCopyEmail}
                  className="group font-sans text-base sm:text-lg font-bold text-white hover:text-[#e62b1e] transition-colors flex items-center justify-between gap-2 cursor-pointer text-left w-full"
                  title="Click to copy email"
                >
                  <span className="tracking-tight select-all">{email}</span>
                  {copied ? (
                    <span className="flex items-center gap-1 text-xs text-emerald-400 font-medium py-0.5 px-2 rounded bg-emerald-500/10 shrink-0">
                      <Check className="w-3.5 h-3.5" /> Copied!
                    </span>
                  ) : (
                    <span className="text-[11px] font-mono-tabular uppercase tracking-wider text-neutral-500 group-hover:text-neutral-300 transition-colors shrink-0">
                      (Copy)
                    </span>
                  )}
                </button>
              </div>

              {/* Row 1: Hear me yapping about design + More design stuff */}
              <div className="grid grid-cols-2 gap-4">
                {/* Hear me yapping about design */}
                <div>
                  <div className="font-sans text-xs text-neutral-400 font-medium mb-1">
                    Hear me yapping about design
                  </div>
                  <a
                    href="https://youtube.com"
                    target="_blank"
                    rel="noreferrer"
                    className="font-sans text-sm sm:text-base font-bold text-white hover:text-[#e62b1e] transition-colors block"
                  >
                    YouTube
                  </a>
                </div>

                {/* More design stuff */}
                <div>
                  <div className="font-sans text-xs text-neutral-400 font-medium mb-1">
                    More design stuff
                  </div>
                  <div className="font-sans text-sm sm:text-base font-bold text-white space-y-0.5">
                    <div>
                      <a href="https://behance.net/gallery/207168461/Portfolio" target="_blank" rel="noreferrer" className="hover:text-[#e62b1e] transition-colors">
                        Behance
                      </a>
                    </div>
                    <div>
                      <a href="https://dribbble.com" target="_blank" rel="noreferrer" className="hover:text-[#e62b1e] transition-colors">
                        Dribbble
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 2: Design & life updates lately + Things I captured along the way */}
              <div className="grid grid-cols-2 gap-4">
                {/* Design & life updates lately */}
                <div>
                  <div className="font-sans text-xs text-neutral-400 font-medium mb-1">
                    Design &amp; life updates lately
                  </div>
                  <div className="font-sans text-sm sm:text-base font-bold text-white space-y-0.5">
                    <div>
                      <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-[#e62b1e] transition-colors">
                        LinkedIn
                      </a>
                    </div>
                    <div>
                      <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-[#e62b1e] transition-colors">
                        Instagram
                      </a>
                    </div>
                    <div>
                      <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-[#e62b1e] transition-colors">
                        Facebook
                      </a>
                    </div>
                  </div>
                </div>

                {/* Things I captured along the way */}
                <div>
                  <div className="font-sans text-xs text-neutral-400 font-medium mb-1">
                    Things I captured along the way
                  </div>
                  <div className="font-sans text-sm sm:text-base font-bold text-white space-y-0.5">
                    <div>
                      <a href="https://unsplash.com" target="_blank" rel="noreferrer" className="hover:text-[#e62b1e] transition-colors">
                        Unsplash
                      </a>
                    </div>
                    <div>
                      <a href="https://pexels.com" target="_blank" rel="noreferrer" className="hover:text-[#e62b1e] transition-colors">
                        Pexels
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Row: Close Button (Matching Image 4) */}
              <div className="pt-1 flex justify-end">
                <button
                  onClick={() => {
                    soundManager.playClick();
                    onClose();
                  }}
                  className="font-sans text-sm sm:text-base font-bold text-white hover:text-[#e62b1e] transition-colors flex items-center gap-1.5 cursor-pointer py-1 px-3 border border-white/20 hover:border-[#e62b1e]"
                >
                  <span>Close</span>
                  <span>✕</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};
