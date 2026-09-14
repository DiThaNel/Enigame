'use client';

import React from 'react';
import { useEnigameStore } from '@/store/useEnigameStore';
import { ArrowLeft } from 'lucide-react';

export const SelectLanguageScreen: React.FC = () => {
  const { setLanguage, setAppStage } = useEnigameStore();

  const handleSelectLanguage = (lang: 'pt' | 'en') => {
    setLanguage(lang);
    setAppStage('auth');
  };

  return (
    <div
      className="relative w-full h-full min-h-[640px] flex flex-col justify-between items-center text-[#3F414E] select-none overflow-hidden bg-[#EEF0FA]"
      style={{
        backgroundImage: 'url(/assets/Lenguaje.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Top Header with Back button */}
      <div className="w-full pt-12 px-6 flex items-center justify-between z-10">
        <button
          onClick={() => setAppStage('splash')}
          className="w-9 h-9 rounded-full bg-white/70 hover:bg-white text-[#3F414E] flex items-center justify-center shadow-sm transition-all cursor-pointer"
          aria-label="Back to Splash"
        >
          <ArrowLeft size={18} />
        </button>
        <span className="text-xs font-semibold tracking-wider uppercase text-[#3F414E]/60">
          Select Language
        </span>
        <div className="w-9" />
      </div>

      {/* Two Big Circular Flags: Figma Frame 02 - Select language */}
      <div className="flex flex-col items-center justify-center gap-10 my-auto z-10">
        {/* Portugal Flag Button */}
        <button
          onClick={() => handleSelectLanguage('pt')}
          className="group relative flex flex-col items-center focus:outline-none transition-transform active:scale-95 cursor-pointer"
          aria-label="Português"
        >
          <div className="w-36 h-36 sm:w-40 sm:h-40 rounded-full overflow-hidden shadow-[0_16px_36px_rgba(0,0,0,0.18)] transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_20px_42px_rgba(142,151,253,0.35)] ring-4 ring-white/60 group-hover:ring-[#8E97FD]">
            <img
              src="/assets/Bandera Portugal.png"
              alt="Bandeira Portugal"
              className="w-full h-full object-cover"
            />
          </div>
          <span className="mt-3 text-sm font-bold text-[#3F414E] tracking-wide opacity-80 group-hover:opacity-100 group-hover:text-[#6979F8] transition-colors">
            Português
          </span>
        </button>

        {/* USA / English Flag Button */}
        <button
          onClick={() => handleSelectLanguage('en')}
          className="group relative flex flex-col items-center focus:outline-none transition-transform active:scale-95 cursor-pointer"
          aria-label="English"
        >
          <div className="w-36 h-36 sm:w-40 sm:h-40 rounded-full overflow-hidden shadow-[0_16px_36px_rgba(0,0,0,0.18)] transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_20px_42px_rgba(142,151,253,0.35)] ring-4 ring-white/60 group-hover:ring-[#8E97FD] bg-[#B22234] flex items-center justify-center relative">
            <svg viewBox="0 0 100 100" className="w-full h-full object-cover">
              <clipPath id="circleClip">
                <circle cx="50" cy="50" r="50" />
              </clipPath>
              <g clipPath="url(#circleClip)">
                <rect width="100" height="100" fill="#B22234" />
                <rect y="7.69" width="100" height="7.69" fill="#FFFFFF" />
                <rect y="23.07" width="100" height="7.69" fill="#FFFFFF" />
                <rect y="38.45" width="100" height="7.69" fill="#FFFFFF" />
                <rect y="53.83" width="100" height="7.69" fill="#FFFFFF" />
                <rect y="69.21" width="100" height="7.69" fill="#FFFFFF" />
                <rect y="84.59" width="100" height="7.69" fill="#FFFFFF" />

                <rect width="45" height="53.84" fill="#3C3B6E" />

                {[
                  [7, 7], [16, 7], [25, 7], [34, 7],
                  [11, 14], [20, 14], [30, 14],
                  [7, 21], [16, 21], [25, 21], [34, 21],
                  [11, 28], [20, 28], [30, 28],
                  [7, 35], [16, 35], [25, 35], [34, 35],
                  [11, 42], [20, 42], [30, 42],
                  [7, 49], [16, 49], [25, 49], [34, 49]
                ].map(([cx, cy], i) => (
                  <circle key={i} cx={cx} cy={cy} r="1.8" fill="#FFFFFF" />
                ))}
              </g>
            </svg>
          </div>
          <span className="mt-3 text-sm font-bold text-[#3F414E] tracking-wide opacity-80 group-hover:opacity-100 group-hover:text-[#6979F8] transition-colors">
            English
          </span>
        </button>
      </div>

      {/* Footer hint */}
      <div className="pb-8 text-center font-bold text-[#3F414E]/60 text-xs z-10">
        Choose your preferred language
      </div>
    </div>
  );
};
