'use client';

import React, { useState } from 'react';
import { useEnigameStore } from '@/store/useEnigameStore';
import { ArrowLeft, ChevronRight } from 'lucide-react';

export const UserGuideScreen: React.FC = () => {
  const { setAppStage } = useEnigameStore();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 0,
      image: '/assets/Userguide.png',
      title: 'Choose between diferent locations.',
      description: 'Discover Enigame locations and find out where your adventure begins.',
    },
    {
      id: 1,
      image: '/assets/Userguide2.png',
      title: 'See our routes and points of interest.',
      description: 'Discover Enigame routes and points of interest to decipher the puzzles.',
    },
    {
      id: 2,
      image: '/assets/Userguide3.png',
      title: 'Check out the list of achievements.',
      description: 'Complete missions and achievements to earn great rewards.',
    },
    {
      id: 3,
      image: '/assets/Userguide4.png',
      title: 'Dive into the Enigame map.',
      description: 'Decipher the puzzles in the marked places and get clues through the QR code scan.',
    },
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      setAppStage('main');
    }
  };

  const handleBack = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    } else {
      setAppStage('auth');
    }
  };

  const current = slides[currentSlide];

  return (
    <div
      className="relative w-full h-full min-h-[680px] flex flex-col justify-between items-center text-[#3F414E] select-none overflow-y-auto no-scrollbar bg-[#EEF0FA]"
      style={{
        backgroundImage: 'url(/assets/Lenguaje.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Top Header */}
      <div className="w-full pt-12 px-6 flex items-center justify-between z-10">
        <button
          onClick={handleBack}
          className="w-9 h-9 rounded-full bg-white/70 hover:bg-white text-[#3F414E] flex items-center justify-center shadow-sm transition-all cursor-pointer"
          aria-label="Back"
        >
          <ArrowLeft size={18} />
        </button>

        <button
          onClick={() => setAppStage('main')}
          className="text-xs font-semibold px-3 py-1 rounded-full bg-[#8E97FD] hover:bg-white/80 text-[#FFFFFF] hover:text-[#8E97FD] transition-all cursor-pointer"
        >
          Skip
        </button>
      </div>

      {/* Main Illustration and Text from Figma Frames 04 - 04.3 */}
      <div className="w-full flex-1 px-6 flex flex-col items-center justify-center text-center z-10 my-auto">
        {/* Illustration */}
        <div className="w-full flex items-center justify-center">
          <img
            src={current.image}
            alt={current.title}
            className="max-h-full max-w-full object-contain drop-shadow-md transition-all duration-300 transform scale-100"
          />
        </div>

        {/* Text Block */}
        <div className="mt-4 max-w-xs flex flex-col items-center">
          <h2 className="text-xl sm:text-2xl font-medium text-[#4D5BC9] leading-tight">
            {current.title}
          </h2>
          <div className="w-40 h-0.5 bg-[#4D5BC9] my-3 rounded-full" />
          <p className="text-md sm:text-md text-[#4D5BC9] mt-1 leading-relaxed font-regular">
            {current.description}
          </p>
        </div>

        {/* Button on Step 4 matching Figma 04.3 "Let the Adventure Begin >" */}
        {currentSlide === 3 ? (
          <div className="w-full max-w-xs mt-6">
            <button
              onClick={() => setAppStage('main')}
              className="w-full h-13 py-3.5 px-6 rounded-full bg-[#8E97FD] hover:bg-[#7C82ED] text-white font-semibold text-sm tracking-wide shadow-[0_12px_24px_rgba(142,151,253,0.35)] transition-all active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Let the Adventure Begin</span>
              <ChevronRight size={18} />
            </button>
          </div>
        ) : (
          <div className="w-full max-w-xs mt-6">
            <button
              onClick={handleNext}
              className="w-full h-12 py-3 px-6 rounded-full bg-white hover:bg-neutral-50 text-[#4D5BC9] font-semibold text-sm tracking-wide shadow-sm border border-[#E0E2EE] transition-all active:scale-[0.99] flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Next</span>
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>

      {/* Segmented 4-bar Progress Indicator matching Figma Frames 04 to 04.3 */}
      <div className="pb-10 pt-4 flex items-center justify-center gap-2 z-10">
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            onClick={() => setCurrentSlide(index)}
            aria-label={'Slide ' + (index + 1)}
            className={'h-1.5 rounded-full transition-all duration-300 cursor-pointer ' + (
              currentSlide === index
                ? 'w-10 bg-[#4D5BC9]'
                : 'w-7 bg-white/70 hover:bg-white'
            )}
          />
        ))}
      </div>
    </div>
  );
};
