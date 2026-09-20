'use client';

const InstagramIcon = ({ size = 18, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

import React from 'react';
import { useEnigameStore } from '@/store/useEnigameStore';
import { X, MessageSquare, MapPin, Award, UserPlus } from 'lucide-react';

export const ExplorerProfileModal: React.FC = () => {
  const { selectedExplorer, setSelectedExplorer } = useEnigameStore();

  if (!selectedExplorer) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-[430px] bg-white rounded-t-[36px] sm:rounded-[36px] overflow-hidden shadow-2xl animate-slideUp">
        {/* Header */}
        <div className="relative h-28 bg-gradient-to-r from-[#7C82ED] to-[#6C5CE7] px-5 pt-4 flex items-start justify-between text-white">
          <span className="text-xs font-semibold bg-white/20 px-3 py-1 rounded-full">
            Explorer Profile
          </span>
          <button
            onClick={() => setSelectedExplorer(null)}
            className="w-8 h-8 rounded-full bg-black/20 flex items-center justify-center hover:bg-black/40 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Avatar & Content */}
        <div className="px-6 pb-6 pt-0 relative flex flex-col items-center text-center">
          <div className="relative -mt-14 mb-3">
            <img
              src="/assets/TianaAvatar.png"
              alt={selectedExplorer.name}
              className="w-24 h-24 rounded-full object-cover shadow-xl"
            />
            <span className="absolute bottom-1 right-1 bg-[#FFB800] text-[#1E1F3D] text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm">
              Lvl {selectedExplorer.level}
            </span>
          </div>

          <h2 className="text-xl font-extrabold text-[#1E1F3D]">{selectedExplorer.name}</h2>
          <span className="text-xs font-bold text-[#7C82ED] mt-0.5">{selectedExplorer.rankTitle}</span>
          <p className="text-xs text-[#7A7C99] mt-2 italic px-4">"{selectedExplorer.bio}"</p>

          {/* Tags */}
          <div className="flex items-center gap-2 mt-4">
            <span className="flex items-center gap-1 text-[11px] font-semibold bg-[#F4F6FB] text-[#585A7E] px-3 py-1 rounded-xl">
              <MapPin size={13} className="text-[#7C82ED]" />
              {selectedExplorer.city}
            </span>
            <span className="text-[11px] font-semibold bg-[#F4F6FB] text-[#585A7E] px-3 py-1 rounded-xl">
              {selectedExplorer.gender} • {selectedExplorer.ageGroup}
            </span>
          </div>

          {/* Badges showcase */}
          <div className="w-full mt-5 text-left">
            <h4 className="text-xs font-bold text-[#1E1F3D] mb-2 flex items-center gap-1.5">
              <Award size={15} className="text-[#FFB800]" />
              <span>Earned Badges</span>
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {selectedExplorer.badges.map((b, idx) => (
                <span
                  key={idx}
                  className="text-[11px] font-medium bg-[#EEF0FF] text-[#7C82ED] px-2.5 py-1 rounded-lg"
                >
                  {b}
                </span>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="w-full flex items-center gap-3 mt-6">
            <button
              onClick={() => alert(`Message sent to ${selectedExplorer.name}!`)}
              className="flex-1 h-12 rounded-2xl bg-[#7C82ED] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-indigo-300/30 active:scale-95 transition-transform"
            >
              <MessageSquare size={16} />
              <span>Message</span>
            </button>
            <button
              onClick={() => alert(`Wave sent to ${selectedExplorer.name}!`)}
              className="h-12 px-5 rounded-2xl border border-[#EEF0FA] text-[#585A7E] font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-[#F4F6FB] active:scale-95 transition-transform"
            >
              <UserPlus size={16} className="text-[#7C82ED]" />
              <span>Wave</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};