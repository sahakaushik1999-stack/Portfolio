import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Project } from '../types/portfolio';
import { ProjectVisual } from './ProjectVisual';
import { X, ArrowRight, Award, CheckCircle2 } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface ProjectDetailModalProps {
  project: Project | null;
  onClose: () => void;
  onNextProject?: () => void;
  onPrevProject?: () => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  onClose,
  onNextProject,
  onPrevProject,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!project) return null;

  return (
    <AnimatePresence>
      <div
        onClick={onClose}
        className="fixed inset-0 z-50 overflow-y-auto overscroll-contain bg-black/85 backdrop-blur-md px-3 sm:px-6 md:px-8 py-6 sm:py-10 flex flex-col items-center justify-start min-h-screen"
      >
        <motion.div
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.97, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: 16 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-4xl bg-[#f7f7f5] dark:bg-[#0c0c0e] text-neutral-900 dark:text-neutral-100 border border-neutral-300 dark:border-neutral-800 shadow-2xl shrink-0 my-auto sm:my-4"
        >
          {/* Header (Sticky so close button and title are always reachable without clipping) */}
          <div className="sticky top-0 z-30 flex items-center justify-between px-6 sm:px-8 py-4 sm:py-5 bg-[#f7f7f5]/95 dark:bg-[#0c0c0e]/95 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center gap-3">
              <span className="font-syne text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
                {project.title}
              </span>
              <span className="font-mono-tabular text-xs font-bold text-[#e62b1e]">
                #{project.index}
              </span>
            </div>

            <button
              onClick={() => {
                soundManager.playClick();
                onClose();
              }}
              className="p-2 -mr-2 text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer rounded-full hover:bg-black/5 dark:hover:bg-white/10"
              aria-label="Close project modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Media Container */}
          <div className="relative aspect-video max-h-[55vh] w-full bg-black overflow-hidden border-b border-neutral-200 dark:border-neutral-800">
            <ProjectVisual project={project} isActive={true} />
          </div>

          {/* Content Body */}
          <div className="p-6 sm:p-10 space-y-8">
            {/* Metadata Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 bg-neutral-100 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 text-xs font-mono-tabular">
              <div>
                <span className="text-neutral-400 uppercase text-[10px] block">Brand</span>
                <span className="font-medium text-neutral-900 dark:text-white">{project.client}</span>
              </div>
              <div>
                <span className="text-neutral-400 uppercase text-[10px] block">Category</span>
                <span className="font-medium text-neutral-900 dark:text-white">{project.category}</span>
              </div>
              <div>
                <span className="text-neutral-400 uppercase text-[10px] block">Agency & Studio</span>
                <span className="font-medium text-neutral-900 dark:text-white">{project.agency}</span>
              </div>
            </div>

            {/* Overview */}
            <div>
              <h3 className="font-syne text-lg font-bold text-neutral-900 dark:text-white mb-2">
                Overview
              </h3>
              <p className="font-sans text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
                {project.caseStudy.overview}
              </p>
            </div>

            {/* Challenge & Solution Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/40">
                <h4 className="font-mono-tabular text-xs uppercase tracking-wider text-[#e62b1e] font-bold mb-2">
                  The Challenge
                </h4>
                <p className="font-sans text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  {project.caseStudy.challenge}
                </p>
              </div>

              <div className="p-5 border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/40">
                <h4 className="font-mono-tabular text-xs uppercase tracking-wider text-emerald-500 font-bold mb-2">
                  The Solution
                </h4>
                <p className="font-sans text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  {project.caseStudy.solution}
                </p>
              </div>
            </div>

            {/* Deliverables & Real Impact Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div>
                <h4 className="font-mono-tabular text-xs uppercase tracking-wider text-neutral-400 mb-3">
                  Key Deliverables
                </h4>
                <div className="flex flex-wrap gap-2">
                  {project.caseStudy.deliverables.map((item, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 text-xs font-mono-tabular bg-neutral-200/80 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-mono-tabular text-xs uppercase tracking-wider text-neutral-400 mb-3">
                  Measurable Impact
                </h4>
                <div className="grid grid-cols-3 gap-3">
                  {project.caseStudy.metrics.map((m, i) => (
                    <div key={i} className="p-3 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-center">
                      <div className="font-syne text-base font-bold text-neutral-900 dark:text-white">
                        {m.value}
                      </div>
                      <div className="font-mono-tabular text-[9px] text-neutral-500 uppercase mt-0.5">
                        {m.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Footer Controls */}
          <div className="px-6 sm:px-10 py-4 bg-neutral-100 dark:bg-neutral-900/80 border-t border-neutral-200 dark:border-neutral-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono-tabular">
            <span className="text-neutral-500 hidden sm:inline">
              Press [Esc] to exit
            </span>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <a
                href="https://www.behance.net/gallery/207168461/Portfolio"
                target="_blank"
                rel="noreferrer"
                className="px-3.5 sm:px-4 py-2 font-bold uppercase tracking-wider bg-transparent border border-neutral-300 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 hover:text-[#e62b1e] hover:border-[#e62b1e] transition-colors text-center"
              >
                View on Behance ↗
              </a>
              <button
                onClick={() => {
                  soundManager.playClick();
                  onClose();
                }}
                className="px-4 py-2 font-bold uppercase tracking-wider bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-[#e62b1e] hover:text-white transition-colors cursor-pointer text-center"
              >
                Done Viewing
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
