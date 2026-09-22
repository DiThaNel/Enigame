'use client';

import React from 'react';
import { useEnigameStore } from '@/store/useEnigameStore';
import { X, Share2 } from 'lucide-react';

export const PhotoLightboxModal: React.FC = () => {
  const { lightboxPhoto, setLightboxPhoto, showToast } = useEnigameStore();

  if (!lightboxPhoto) return null;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Enigame Quest Photo',
        text: 'Check out this expedition photo from Enigame!',
        url: window.location.href,
      }).catch(() => {});
    } else {
      showToast('🔗 Photo link copied to clipboard', 'info');
    }
  };

  return (
    <div 
      onClick={() => setLightboxPhoto(null)}
      className="absolute inset-0 z-[95] bg-black/85 backdrop-blur-md flex items-center justify-center p-3.5 sm:p-5 animate-fadeIn select-none overflow-y-auto"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-[390px] w-full bg-white rounded-[32px] overflow-hidden shadow-2xl animate-scaleUp flex flex-col my-auto"
      >
        {/* Close Button */}
        <button
          onClick={() => setLightboxPhoto(null)}
          className="absolute top-3.5 right-3.5 w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-colors cursor-pointer z-20 backdrop-blur-xs shadow-md"
          aria-label="Close photo"
        >
          <X size={18} />
        </button>

        {/* Big Tall Photo Container - Expanded upwards and downwards */}
        <div className="w-full h-[470px] sm:h-[530px] bg-neutral-950 flex items-center justify-center overflow-hidden">
          <img 
            src={lightboxPhoto} 
            alt="Expedition Highlight" 
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = '/assets/BragancaHome.png';
            }}
            className="w-full h-full object-cover" 
          />
        </div>

        {/* Footer Info & Share */}
        <div className="p-4 bg-white flex items-center justify-between shrink-0 border-t border-[#EEF0FA]">
          <span className="text-xs font-bold text-[#1E1F3D]">Enigame Verified Quest Photo</span>
          <button 
            onClick={handleShare}
            className="text-xs font-bold text-[#8E97FD] hover:text-[#7C82ED] flex items-center gap-1.5 cursor-pointer transition-colors px-3 py-1.5 rounded-xl bg-[#F4F6FB] hover:bg-[#EEF0FF]"
          >
            <Share2 size={14} /> 
            <span>Share</span>
          </button>
        </div>
      </div>
    </div>
  );
};
