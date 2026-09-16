'use client';

import React, { useState } from 'react';
import { useEnigameStore } from '@/store/useEnigameStore';
import { ChevronLeft } from 'lucide-react';

export const PointsStoreView: React.FC = () => {
  const { points, currentUser } = useEnigameStore();
  const [activeModal, setActiveModal] = useState<'leaderboard' | 'activity' | 'store' | 'coupons' | null>(null);

  return (
    <div className="w-full min-h-screen pb-24 bg-[#F4F6FC] flex flex-col">
      {/* Curved Purple Header matching 08 - Points */}
      <div className="relative bg-[#989EEC] rounded-b-[44px] pt-4 pb-8 px-6 text-white text-center shadow-md">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={() => {}}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
          >
            <ChevronLeft size={24} />
          </button>

          {/* Top Avatar */}
          <div className="w-20 h-20 rounded-full p-1 bg-white/20 shadow-md">
            <img
              src="/assets/TianaAvatar.png"
              alt={currentUser.name}
              className="w-full h-full rounded-full object-cover"
            />
          </div>

          {/* Currency / Language Icon from Figma */}
          <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center">
            <img src="/assets/Lenguaje.png" alt="Currency" className="w-7 h-7 object-contain" />
          </div>
        </div>

        {/* Username */}
        <h2 className="text-base font-bold tracking-wide mt-1">Tiana Rosser</h2>

        {/* Total Points */}
        <div className="mt-4">
          <span className="text-lg font-black tracking-wide">1000 Points</span>
        </div>

        {/* Coins graphic ($10.00) from Figma */}
        <div className="flex flex-col items-center justify-center mt-2">
          <img
            src="/assets/StatusCoins.png"
            alt="10.00"
            className="h-10 object-contain"
          />
        </div>

        {/* Status & Stars Slider */}
        <div className="mt-4 flex flex-col items-center">
          <span className="text-xs font-bold tracking-wider uppercase opacity-90 mb-2">Status</span>
          
          {/* Status Stars / Medals row from Figma */}
          <div className="flex items-center gap-3">
            <img src="/assets/TopPointsMedal.png" alt="Star" className="w-6 h-6 object-contain drop-shadow" />
            <img src="/assets/SilverPointsMedal.png" alt="Star" className="w-6 h-6 object-contain drop-shadow" />
            <img src="/assets/BronzePointsMedal.png" alt="Star" className="w-6 h-6 object-contain drop-shadow" />
            <img src="/assets/PointsMedal.png" alt="Star" className="w-6 h-6 object-contain drop-shadow" />
            <img src="/assets/PointsMedal.png" alt="Star" className="w-6 h-6 object-contain drop-shadow opacity-70" />
            <img src="/assets/PointsMedal.png" alt="Star" className="w-6 h-6 object-contain drop-shadow opacity-50" />
          </div>
        </div>
      </div>

      {/* 4 Action Cards Grid matching 08 - Points */}
      <div className="p-6 grid grid-cols-2 gap-4">
        {/* Leaderboard Card */}
        <div
          onClick={() => setActiveModal('leaderboard')}
          className="animate-card-stagger stagger-1 bg-white rounded-[28px] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-[#EAEFFE] flex flex-col items-center justify-center gap-3 cursor-pointer group active:scale-95 transition-all hover:shadow-md"
        >
          <div className="w-16 h-16 flex items-center justify-center">
            <img
              src="/assets/PointsLeaderboards.png"
              alt="Leaderboard"
              className="w-full h-full object-contain group-hover:scale-110 transition-transform"
            />
          </div>
          <span className="text-xs font-bold text-[#8E97FD] group-hover:text-[#7C82ED]">Leaderboard</span>
        </div>

        {/* Activity Card */}
        <div
          onClick={() => setActiveModal('activity')}
          className="animate-card-stagger stagger-2 bg-white rounded-[28px] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-[#EAEFFE] flex flex-col items-center justify-center gap-3 cursor-pointer group active:scale-95 transition-all hover:shadow-md"
        >
          <div className="w-16 h-16 flex items-center justify-center">
            <img
              src="/assets/PointsActivity.png"
              alt="Activity"
              className="w-full h-full object-contain group-hover:scale-110 transition-transform"
            />
          </div>
          <span className="text-xs font-bold text-[#8E97FD] group-hover:text-[#7C82ED]">Activity</span>
        </div>

        {/* Store Card */}
        <div
          onClick={() => setActiveModal('store')}
          className="animate-card-stagger stagger-3 bg-white rounded-[28px] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-[#EAEFFE] flex flex-col items-center justify-center gap-3 cursor-pointer group active:scale-95 transition-all hover:shadow-md"
        >
          <div className="w-16 h-16 flex items-center justify-center">
            <img
              src="/assets/PointsStore.png"
              alt="Store"
              className="w-full h-full object-contain group-hover:scale-110 transition-transform"
            />
          </div>
          <span className="text-xs font-bold text-[#8E97FD] group-hover:text-[#7C82ED]">Store</span>
        </div>

        {/* Coupons Card */}
        <div
          onClick={() => setActiveModal('coupons')}
          className="animate-card-stagger stagger-4 bg-white rounded-[28px] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-[#EAEFFE] flex flex-col items-center justify-center gap-3 cursor-pointer group active:scale-95 transition-all hover:shadow-md"
        >
          <div className="w-16 h-16 flex items-center justify-center">
            <img
              src="/assets/PointsCoupon.png"
              alt="Coupons"
              className="w-full h-full object-contain group-hover:scale-110 transition-transform"
            />
          </div>
          <span className="text-xs font-bold text-[#8E97FD] group-hover:text-[#7C82ED]">Coupons</span>
        </div>
      </div>

      {/* Interactive Feature Modal */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 w-full max-w-[340px] shadow-2xl text-center animate-scaleUp">
            <h3 className="text-base font-extrabold capitalize text-[#1E1F3D]">
              {activeModal}
            </h3>
            <p className="text-xs text-[#7A7C99] mt-2">
              Browse your {activeModal} rewards, explore leaderboards, and redeem exclusive discounts in Bragança!
            </p>
            <button
              onClick={() => setActiveModal(null)}
              className="w-full h-11 mt-5 rounded-xl bg-[#8E97FD] hover:bg-[#7C82ED] text-white font-bold text-xs"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
