/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ViewMode, ThemeMode, Project } from './types/portfolio';
import { PROJECTS } from './data/portfolioData';
import { soundManager } from './utils/audio';
import { IntroCurtain } from './components/IntroCurtain';
import { ProjectShowcase3D } from './components/ProjectShowcase3D';
import { PlaygroundView } from './components/PlaygroundView';
import { AboutView } from './components/AboutView';
import { ShowreelModal } from './components/ShowreelModal';
import { ContactModal } from './components/ContactModal';
import { ProjectDetailModal } from './components/ProjectDetailModal';
import { ImageCustomizerModal } from './components/ImageCustomizerModal';
import { ParticleTransitionOverlay } from './components/ParticleTransitionOverlay';
import { AnimatePresence, motion } from 'motion/react';
import {
  getAllImageOverrides,
  subscribeToImageOverrides,
  getSynchronousOverrides,
} from './utils/imageStorage';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewMode>('work');
  const [targetView, setTargetView] = useState<ViewMode>('work');
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [theme, setTheme] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('huyml_theme') as ThemeMode;
      if (saved) return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  const [isAudioOn, setIsAudioOn] = useState<boolean>(false);
  const [isIntroVisible, setIsIntroVisible] = useState<boolean>(false);
  const [isShowreelOpen, setIsShowreelOpen] = useState<boolean>(false);
  const [isContactOpen, setIsContactOpen] = useState<boolean>(false);
  const [selectedCaseStudy, setSelectedCaseStudy] = useState<Project | null>(null);

  // Persistent Custom Image Overrides state
  const [customOverrides, setCustomOverrides] = useState<Record<string, string>>(() =>
    getSynchronousOverrides()
  );
  const [isCustomizerOpen, setIsCustomizerOpen] = useState<boolean>(false);
  const [customizerProjectId, setCustomizerProjectId] = useState<string | undefined>(undefined);

  // Hydrate custom images from IndexedDB on startup and subscribe to updates
  useEffect(() => {
    getAllImageOverrides().then((overrides) => {
      setCustomOverrides(overrides);
    });
    return subscribeToImageOverrides((overrides) => {
      setCustomOverrides(overrides);
    });
  }, []);

  // Compute active projects with overridden images
  const activeProjects = React.useMemo(() => {
    return PROJECTS.map((proj) => {
      const override = customOverrides[proj.id];
      if (override) {
        return { ...proj, imageUrl: override };
      }
      return proj;
    });
  }, [customOverrides]);

  const openImageCustomizer = (projectId?: string) => {
    soundManager.playClick();
    setCustomizerProjectId(projectId);
    setIsCustomizerOpen(true);
  };

  // Smooth particle disintegration page transition handler
  const handleNavigate = (newView: ViewMode) => {
    if (newView === currentView || isTransitioning) return;
    soundManager.playClick();
    setTargetView(newView);
    setIsTransitioning(true);
  };

  // Sync theme with DOM root class & localStorage
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('huyml_theme', theme);
  }, [theme]);

  // Audio state toggle handler
  const toggleAudio = () => {
    const newState = !isAudioOn;
    setIsAudioOn(newState);
    soundManager.setEnabled(newState);
  };

  // Theme toggle handler
  const toggleTheme = () => {
    soundManager.playClick();
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Global Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.key === 't' || e.key === 'T') {
        toggleTheme();
      } else if (e.key === 'm' || e.key === 'M') {
        toggleAudio();
      } else if (e.key === '1') {
        handleNavigate('work');
      } else if (e.key === '2') {
        handleNavigate('about');
      } else if (e.key === '3') {
        handleNavigate('playground');
      } else if (e.key === 'c' || e.key === 'C') {
        soundManager.playClick();
        setIsContactOpen(true);
      } else if (e.key === 'i' || e.key === 'I' || e.key === 'e' || e.key === 'E') {
        openImageCustomizer();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAudioOn, theme, currentView, isTransitioning, activeProjects]);

  return (
    <div
      className={`min-h-screen w-full transition-colors duration-300 overflow-x-hidden flex flex-col font-sans ${
        theme === 'dark'
          ? 'bg-[#0c0c0e] text-[#f4f4f4]'
          : 'bg-[#f4f4f1] text-[#0c0c0e]'
      }`}
    >
      {/* Signature Animated Intro Curtain (Available on replay) */}
      {isIntroVisible && (
        <IntroCurtain onComplete={() => setIsIntroVisible(false)} />
      )}

      {/* Cinematic Particle Disintegration Page Transition */}
      <ParticleTransitionOverlay
        isActive={isTransitioning}
        targetView={targetView}
        theme={theme}
        onSwitchView={(v) => setCurrentView(v)}
        onComplete={() => setIsTransitioning(false)}
      />

      {/* Main Content Views with Seamless Motion Transitions */}
      <main className="flex-1 w-full relative">
        <AnimatePresence mode="wait">
          {currentView === 'work' && (
            <motion.div
              key="work"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="w-full h-full"
            >
              <ProjectShowcase3D
                projects={activeProjects}
                currentView={currentView}
                onViewChange={handleNavigate}
                onOpenContact={() => setIsContactOpen(true)}
                onOpenShowreel={() => setIsShowreelOpen(true)}
                onSelectCaseStudy={(proj) => setSelectedCaseStudy(proj)}
                theme={theme}
                onToggleTheme={toggleTheme}
                isAudioOn={isAudioOn}
                onToggleAudio={toggleAudio}
                onOpenImageCustomizer={openImageCustomizer}
                customOverrides={customOverrides}
              />
            </motion.div>
          )}

          {currentView === 'playground' && (
            <motion.div
              key="playground"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="w-full"
            >
              <PlaygroundView
                onViewChange={handleNavigate}
                onOpenContact={() => setIsContactOpen(true)}
                theme={theme}
                onToggleTheme={toggleTheme}
                isAudioOn={isAudioOn}
                onToggleAudio={toggleAudio}
                onOpenImageCustomizer={openImageCustomizer}
                customOverrides={customOverrides}
              />
            </motion.div>
          )}

          {currentView === 'about' && (
            <motion.div
              key="about"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="w-full"
            >
              <AboutView
                onViewChange={handleNavigate}
                onOpenContact={() => setIsContactOpen(true)}
                theme={theme}
                onToggleTheme={toggleTheme}
                isAudioOn={isAudioOn}
                onToggleAudio={toggleAudio}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Two-Card Contact Modal ("COME SAY HI" + "CREDITS") - Accessible from ANY page */}
      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />

      {/* Video Showreel Player Modal */}
      <ShowreelModal
        isOpen={isShowreelOpen}
        onClose={() => setIsShowreelOpen(false)}
      />

      {/* Deep-Dive Project Case Study Modal */}
      <ProjectDetailModal
        project={selectedCaseStudy}
        onClose={() => setSelectedCaseStudy(null)}
        onNextProject={() => {
          if (!selectedCaseStudy) return;
          const currentIndex = activeProjects.findIndex((p) => p.id === selectedCaseStudy.id);
          const nextIndex = (currentIndex + 1) % activeProjects.length;
          setSelectedCaseStudy(activeProjects[nextIndex]);
        }}
        onPrevProject={() => {
          if (!selectedCaseStudy) return;
          const currentIndex = activeProjects.findIndex((p) => p.id === selectedCaseStudy.id);
          const prevIndex = (currentIndex - 1 + activeProjects.length) % activeProjects.length;
          setSelectedCaseStudy(activeProjects[prevIndex]);
        }}
      />

      {/* Persistent Website Image Customizer Modal */}
      <ImageCustomizerModal
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
        projects={activeProjects}
        theme={theme}
        initialProjectId={customizerProjectId}
        customOverrides={customOverrides}
      />
    </div>
  );
}
