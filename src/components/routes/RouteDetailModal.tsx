'use client';

import React, { useState } from 'react';
import { useEnigameStore } from '@/store/useEnigameStore';
import { ChevronLeft, Star, Check } from 'lucide-react';
import { DIFFICULTY_LABELS } from '@/types';
import { RouteMapPreview } from './RouteMapPreview';

export const RouteDetailModal: React.FC = () => {
  const {
    selectedRouteDetail,
    setSelectedRouteDetail,
    setActiveRouteId,
    setScannerOpen,
    unlockedRouteIds,
  } = useEnigameStore();
  const [giftCode, setGiftCode] = useState('');
  const [isGiftChecked, setIsGiftChecked] = useState(true);

  if (!selectedRouteDetail) return null;

  const isUnlocked = unlockedRouteIds.includes(selectedRouteDetail.id);

  const formatDuration = (mins: number) => {
    if (mins === 60) return '1 Hour';
    if (mins % 60 === 0) return `${mins / 60} Hours`;
    if (mins > 60) {
      const h = Math.floor(mins / 60);
      const m = mins % 60;
      return m > 0 ? `${h}h ${m}m` : `${h} Hours`;
    }
    return `${mins} min`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-[390px] h-[95vh] max-h-[820px] bg-[#EEF0FA] rounded-[36px] overflow-hidden flex flex-col shadow-2xl relative animate-slideUp">
        {/* Castle Tower Top Background */}
        <div className="relative h-60 w-full overflow-hidden shrink-0">
          <img
            src={selectedRouteDetail.coverImage || "/assets/HomeImage.png"}
            alt={selectedRouteDetail.title}
            className="w-full h-full object-cover"
          />
          <button
            onClick={() => setSelectedRouteDetail(null)}
            className="absolute top-5 left-5 w-9 h-9 rounded-full bg-white/70 backdrop-blur-md text-[#1E1F3D] flex items-center justify-center hover:bg-white transition-colors cursor-pointer"
          >
            <ChevronLeft size={22} />
          </button>
        </div>

        {/* Main Floating Information Card matching 07.3 */}
        <div className="relative -mt-20 mx-4 bg-white rounded-[32px] p-5 shadow-lg border border-[#EBEFFE] overflow-y-auto max-h-[calc(95vh-14rem)]">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#1E1F3D]">
              {selectedRouteDetail.title}
            </h2>
            <img src="/assets/RouteNameBadge.png" alt="Badge" className="w-6 h-6 object-contain shrink-0 ml-2" />
          </div>

          {/* Blue Narrative Text */}
          <p className="text-xs text-[#6E7BFF] font-medium mt-3 leading-relaxed">
            {selectedRouteDetail.description}
          </p>

          {/* Dynamic Vector Route Map Preview tailored to route */}
          <div className="mt-4">
            <RouteMapPreview route={selectedRouteDetail} />
          </div>

          {/* 4 Metric Icons Row matching Figma 07.3 */}
          <div className="grid grid-cols-4 gap-2 mt-4 text-center items-center py-2 border-y border-[#F2F4FD]">
            <div className="flex flex-col items-center">
              <img src="/assets/RouteNameHour.png" alt="Hour" className="h-6 object-contain" />
              <span className="text-[10px] font-bold text-[#585A7E] mt-1">
                {formatDuration(selectedRouteDetail.durationMinutes)}
              </span>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center gap-1 h-6">
                {Array.from({ length: selectedRouteDetail.difficulty }).map((_, starIdx) => (
                  <img
                    key={starIdx}
                    src="/assets/StarSingle.png"
                    alt="Star"
                    className="w-4 h-4 object-contain"
                  />
                ))}
              </div>
              <span className="text-[10px] font-bold text-[#585A7E] mt-1">
                {DIFFICULTY_LABELS[selectedRouteDetail.difficulty]}
              </span>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center gap-1 h-6">
                {Array.from({ length: selectedRouteDetail.culture }).map((_, cIdx) => (
                  <img
                    key={cIdx}
                    src="/assets/CultureSingle.png"
                    alt="Culture"
                    className="w-4 h-4 object-contain"
                  />
                ))}
              </div>
              <span className="text-[10px] font-bold text-[#585A7E] mt-1">
                Culture
              </span>
            </div>
            <div className="flex flex-col items-center">
              <img src="/assets/RouteNamePrice.png" alt="Price" className="h-6 object-contain" />
              <span className="text-[10px] font-bold text-[#585A7E] mt-1">
                {selectedRouteDetail.price}€
              </span>
            </div>
          </div>

          {/* Unlocked Route Banner OR Gifted Code Box */}
          {isUnlocked ? (
            <div className="mt-5 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between animate-fadeIn">
              <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs">
                <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                <span>Unlocked &amp; Ready to Explore</span>
              </div>
              <span className="text-[10px] bg-emerald-200/70 text-emerald-800 font-black px-2.5 py-0.5 rounded-full uppercase">
                Free Access
              </span>
            </div>
          ) : (
            <div className="mt-5 p-4 rounded-2xl border border-[#8E97FD]/50 bg-[#F7F8FE]">
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isGiftChecked}
                  onChange={(e) => setIsGiftChecked(e.target.checked)}
                  className="sr-only"
                />
                <div
                  className={`w-5 h-5 rounded flex items-center justify-center shrink-0 transition-all border ${
                    isGiftChecked
                      ? 'bg-[#8E97FD] border-[#8E97FD]'
                      : 'bg-white border-[#A1A4B2]'
                  }`}
                >
                  {isGiftChecked && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
                </div>
                <span className="text-xs font-bold text-[#6E7BFF]">
                  Use your gifted code for a 100% Discount on this route
                </span>
              </label>

              {isGiftChecked && (
                <input
                  type="text"
                  placeholder="ENTER PROMO CODE"
                  value={giftCode}
                  onChange={(e) => setGiftCode(e.target.value)}
                  className="w-full h-10 mt-3 px-3 rounded-xl border border-[#8E97FD]/40 text-xs font-bold text-[#1E1F3D] focus:outline-none uppercase bg-white"
                />
              )}
            </div>
          )}

          {/* Checkout / Start CTA */}
          <button
            onClick={() => {
              setActiveRouteId(selectedRouteDetail.id);
              setSelectedRouteDetail(null);
              setScannerOpen(true);
            }}
            className={`w-full h-12 rounded-2xl text-white font-bold text-xs mt-4 shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer ${
              isUnlocked
                ? 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-200'
                : 'bg-[#8E97FD] hover:bg-[#7C82ED] shadow-indigo-300/40'
            }`}
          >
            <span>{isUnlocked ? 'Start Expedition Now' : 'Start Route with QR Checkpoints'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
