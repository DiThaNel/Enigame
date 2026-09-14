'use client';

import React, { useState } from 'react';
import { useEnigameStore } from '@/store/useEnigameStore';
import { ChevronLeft } from 'lucide-react';

export const RouteDetailModal: React.FC = () => {
  const { selectedRouteDetail, setSelectedRouteDetail, setActiveRouteId, setScannerOpen } = useEnigameStore();
  const [giftCode, setGiftCode] = useState('');
  const [isGiftChecked, setIsGiftChecked] = useState(true);

  if (!selectedRouteDetail) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-[390px] h-[95vh] max-h-[820px] bg-[#EEF0FA] rounded-[36px] overflow-hidden flex flex-col shadow-2xl relative">
        {/* Castle Tower Top Background */}
        <div className="relative h-60 w-full overflow-hidden shrink-0">
          <img
            src="/assets/HomeImage.png"
            alt="Castle Tower"
            className="w-full h-full object-cover"
          />
          <button
            onClick={() => setSelectedRouteDetail(null)}
            className="absolute top-5 left-5 w-9 h-9 rounded-full bg-white/70 backdrop-blur-md text-[#1E1F3D] flex items-center justify-center hover:bg-white transition-colors"
          >
            <ChevronLeft size={22} />
          </button>
        </div>

        {/* Main Floating Information Card matching 07.3 */}
        <div className="relative -mt-20 mx-4 bg-white rounded-[32px] p-5 shadow-lg border border-[#EBEFFE] overflow-y-auto max-h-[calc(95vh-14rem)]">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-[#1E1F3D]">Route Name</h2>
            <img src="/assets/RouteNameBadge.png" alt="Badge" className="w-6 h-6 object-contain" />
          </div>

          {/* Blue Narrative Text */}
          <p className="text-xs text-[#6E7BFF] font-medium mt-3 leading-relaxed">
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
          </p>

          {/* Map / Category Preview Snippet */}
          <div className="mt-4 rounded-2xl overflow-hidden border border-[#EEF0FA] relative">
            <img
              src="/assets/RouteNameCategory.png"
              alt="Map Preview"
              className="w-full h-auto object-cover"
            />
          </div>

          {/* 4 Metric Icons Row matching Figma 07.3 */}
          <div className="grid grid-cols-4 gap-2 mt-4 text-center items-center">
            <div className="flex flex-col items-center">
              <img src="/assets/RouteNameHour.png" alt="1 Hour" className="h-6 object-contain" />
              <span className="text-[10px] font-bold text-[#585A7E] mt-1">1 Hour</span>
            </div>
            <div className="flex flex-col items-center">
              <img src="/assets/RouteDificultyStars.png" alt="Difficulty" className="h-4 object-contain" />
              <span className="text-[10px] font-bold text-[#585A7E] mt-2">Difficulty</span>
            </div>
            <div className="flex flex-col items-center">
              <img src="/assets/RouteNameCulture.png" alt="Culture" className="h-6 object-contain" />
              <span className="text-[10px] font-bold text-[#585A7E] mt-1">Culture</span>
            </div>
            <div className="flex flex-col items-center">
              <img src="/assets/RouteNamePrice.png" alt="30€" className="h-6 object-contain" />
              <span className="text-[10px] font-bold text-[#585A7E] mt-1">30€</span>
            </div>
          </div>

          {/* Gifted Code Box */}
          <div className="mt-5 p-4 rounded-2xl border border-[#8E97FD]/50 bg-[#F7F8FE]">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isGiftChecked}
                onChange={(e) => setIsGiftChecked(e.target.checked)}
                className="w-4 h-4 rounded text-[#8E97FD] accent-[#8E97FD]"
              />
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

          {/* Checkout CTA */}
          <button
            onClick={() => {
              setActiveRouteId(selectedRouteDetail.id);
              setSelectedRouteDetail(null);
              setScannerOpen(true);
            }}
            className="w-full h-12 rounded-2xl bg-[#8E97FD] hover:bg-[#7C82ED] text-white font-extrabold text-xs mt-4 shadow-lg shadow-indigo-300/40 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Start Route with QR Checkpoints</span>
          </button>
        </div>
      </div>
    </div>
  );
};
