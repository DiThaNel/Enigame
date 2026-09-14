'use client';

import React, { useState } from 'react';
import { X, Compass } from 'lucide-react';

interface UserGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserGuideModal: React.FC<UserGuideModalProps> = ({ isOpen, onClose }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  if (!isOpen) return null;

  const slides = [
    { src: '/assets/Userguide.png', alt: 'User Guide 1 - Welcome to Enigame' },
    { src: '/assets/Userguide2.png', alt: 'User Guide 2 - Explore Routes' },
    { src: '/assets/Userguide3.png', alt: 'User Guide 3 - QR Clues and Riddles' },
    { src: '/assets/Userguide4.png', alt: 'User Guide 4 - Connect and Earn Rewards' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="relative w-full max-w-[360px] bg-[#EEF0FA] rounded-[36px] overflow-hidden shadow-2xl flex flex-col items-center">
        {/* Top bar with close button */}
        <div className="w-full flex items-center justify-between p-4 z-10">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#8E97FD]">
            <Compass size={16} />
            <span>Enigame Guide</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center text-[#1E1F3D] hover:bg-black/20 transition-colors"
            aria-label="Close Guide"
          >
            <X size={18} />
          </button>
        </div>

        {/* Slide Graphic from Figma Userguide */}
        <div className="w-full px-4 flex items-center justify-center min-h-[420px]">
          <img
            src={slides[currentSlide].src}
            alt={slides[currentSlide].alt}
            className="w-full h-auto max-h-[460px] object-contain rounded-2xl shadow-sm"
          />
        </div>

        {/* Carousel Dots & Controls */}
        <div className="w-full p-6 flex flex-col items-center gap-4">
          <div className="flex items-center gap-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={"h-2 rounded-full transition-all " + (
                  currentSlide === idx ? "w-6 bg-[#8E97FD]" : "w-2 bg-[#A5A7C4]/50"
                )}
              />
            ))}
          </div>

          <div className="w-full flex items-center justify-between gap-3">
            <button
              onClick={() => setCurrentSlide((prev) => Math.max(0, prev - 1))}
              disabled={currentSlide === 0}
              className="flex-1 h-11 rounded-full border border-[#8E97FD]/40 text-[#8E97FD] font-bold text-xs disabled:opacity-30 disabled:pointer-events-none hover:bg-[#8E97FD]/10 transition-colors"
            >
              Previous
            </button>

            {currentSlide < slides.length - 1 ? (
              <button
                onClick={() => setCurrentSlide((prev) => Math.min(slides.length - 1, prev + 1))}
                className="flex-1 h-11 rounded-full bg-[#8E97FD] hover:bg-[#7C82ED] text-white font-bold text-xs shadow-md transition-all"
              >
                Next
              </button>
            ) : (
              <button
                onClick={onClose}
                className="flex-1 h-11 rounded-full bg-[#8E97FD] hover:bg-[#7C82ED] text-white font-bold text-xs shadow-md transition-all"
              >
                Start Exploring!
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
