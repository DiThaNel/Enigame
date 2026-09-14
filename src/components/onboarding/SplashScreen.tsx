'use client';

import React from 'react';
import { useEnigameStore } from '@/store/useEnigameStore';
import { ChevronRight } from 'lucide-react';

export const SplashScreen: React.FC = () => {
  const { setAppStage } = useEnigameStore();

  const handleProceed = () => {
    setAppStage('language');
  };

  return (
    <div
      onClick={handleProceed}
      className="relative w-full h-full min-h-[640px] flex flex-col justify-between items-center text-white select-none cursor-pointer overflow-hidden bg-[#8E97FD]"
      style={{
        backgroundImage: 'url(/assets/Splash.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Accessible text for screen readers & tests (Splash.png already contains visual branding) */}
      <div className="sr-only">
        <h1>ENIGAME</h1>
        <p>Adventure is in us</p>
      </div>

      {/* Top spacer with Skip button */}
      <div className="w-full pt-14 flex justify-end px-6 z-10">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setAppStage('language');
          }}
          className="text-xs font-semibold px-3 py-1 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white transition-all cursor-pointer"
        >
          Skip
        </button>
      </div>

      {/* Empty center spacer so the graphic in Splash.png is 100% visible and unblocked */}
      <div className="flex-1 w-full" />

      {/* Subtle indicator placed comfortably below the central title graphic */}
      <div className="mb-6 flex flex-col items-center justify-center z-10">
        <div className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/25 backdrop-blur-md text-white text-xs font-semibold shadow-sm animate-pulse hover:bg-white/35 transition-all">
          <span>Tap anywhere to start</span>
          <ChevronRight size={14} />
        </div>
      </div>

      {/* Bottom Copyright matching Figma */}
      <div className="pb-8 text-center text-white/85 text-[11px] leading-relaxed z-10 font-normal">
        <p>&copy; Copyright Enigmavity 2020.</p>
        <p>All rights reserved</p>
      </div>
    </div>
  );
};
