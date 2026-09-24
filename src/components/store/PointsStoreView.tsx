'use client';

import React from 'react';
import { useEnigameStore } from '@/store/useEnigameStore';
import { MOCK_LEADERBOARD } from '@/data/mockData';
import { LeaderboardView } from './LeaderboardView';
import { ActivityView } from './ActivityView';
import { RouteStoreView } from './RouteStoreView';
import { CouponsView } from './CouponsView';

export const PointsStoreView: React.FC = () => {
  const { points, currentUser, pointsSubView, setPointsSubView } = useEnigameStore();

  // Dynamically calculate user rank based on real points vs leaderboard
  const userRank = React.useMemo(() => {
    const list = MOCK_LEADERBOARD.map((u) =>
      u.isCurrentUser ? { ...u, points } : u
    );
    list.sort((a, b) => b.points - a.points);
    const foundIndex = list.findIndex(
      (u) => u.isCurrentUser || u.id === currentUser.id
    );
    return foundIndex !== -1 ? foundIndex + 1 : 8;
  }, [points, currentUser.id]);

  // Sub-views routing
  if (pointsSubView === 'leaderboard') {
    return <LeaderboardView />;
  }

  if (pointsSubView === 'activity') {
    return <ActivityView />;
  }

  if (pointsSubView === 'store') {
    return <RouteStoreView />;
  }

  if (pointsSubView === 'coupons') {
    return <CouponsView />;
  }

  return (
    <div className="w-full min-h-screen pb-28 bg-[#F4F6FC] flex flex-col relative overflow-hidden select-none animate-fadeIn">
      {/* Background Curved Wave & Dashed Trail matching Profile tab */}
      <div className="absolute top-0 left-0 right-0 h-48 bg-[#8E97FD] rounded-b-[44px] z-0 shadow-sm overflow-hidden">
        {/* Subtle decorative curved dashed lines */}
        <svg className="absolute inset-0 w-full h-full opacity-25 pointer-events-none" viewBox="0 0 375 180" fill="none">
          <path d="M-20 60 C80 20, 160 120, 260 50 C320 10, 360 80, 400 60" stroke="white" strokeWidth="2.5" strokeDasharray="6 6" />
          <path d="M30 140 C110 90, 220 160, 320 100 C360 80, 390 120, 420 110" stroke="white" strokeWidth="2" strokeDasharray="5 5" />
        </svg>
      </div>

      {/* Top Header Title */}
      <div className="relative z-10 px-6 pt-5 pb-1 flex items-center justify-center text-white">
        <h1 className="text-base font-extrabold tracking-wide drop-shadow-xs">Points & Rewards</h1>
      </div>

      {/* Main Points Floating White Card matching Profile tab design */}
      <div className="mx-5 mt-3.5 bg-white rounded-[32px] p-5 shadow-[0_12px_36px_rgba(142,151,253,0.18)] border border-[#EAEFFE] flex flex-col items-center text-center relative z-10 animate-card-fade-up">
        {/* Profile Avatar Frame with Portugal flag badge matching Profile */}
        <div className="relative w-20 h-20 rounded-full shadow-sm">
          <img
            src="/assets/TianaAvatar.png"
            alt={currentUser.name}
            className="w-full h-full rounded-full object-cover bg-white"
          />
          {/* National flag badge */}
          <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full overflow-hidden border-2 border-white shadow-sm flex items-center justify-center bg-white">
            <img src="/assets/PT.png" alt="Portugal" className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Username */}
        <h2 className="text-base font-black text-[#1E1F3D] mt-2.5 tracking-tight font-semibold">
          {currentUser.name}
        </h2>

        {/* Thin Divider */}
        <div className="w-full h-px bg-[#8e97fd]/40 my-3" />

        {/* Explorer Tier Status Section: Points & Rank */}
        <div className="w-full flex flex-col items-center">
          <span className="text-[10px] font-bold tracking-wider uppercase text-[#8E90B0] mb-2">
            Tier Status
          </span>

          {/* Points & Rank Badge Container inside floating card */}
          <div className="w-full bg-[#F4F6FB] rounded-2xl px-3.5 py-2.5 flex items-center justify-center border border-[#EEF0FA] shadow-2xs">
            {/* Points Info with Coin Image */}
            <div className="flex items-center gap-2 pr-3 border-r border-[#E0E3F5]">
              <img
                src="/assets/StatusCoins.png"
                alt="Coins"
                className="w-6 h-6 object-contain drop-shadow shrink-0"
              />
              <div className="flex flex-col items-start">
                <span className="text-[9px] text-[#7A7C99] font-bold uppercase tracking-wider">Explorer Points</span>
                <span className="text-sm font-black text-[#6C7BFF] tracking-wide leading-tight flex items-baseline gap-1">
                  {points.toLocaleString()} <span className="text-[10px] font-bold text-[#1E1F3D]">Pts</span>
                </span>
              </div>
            </div>

            {/* Rank with Medal or Star */}
            <div className="flex items-center gap-2 pl-2">
              {userRank === 1 ? (
                <>
                  <img
                    src="/assets/TopPointsMedal.png"
                    alt="Gold Medal"
                    className="w-7 h-7 object-contain drop-shadow"
                  />
                  <div className="flex flex-col items-start">
                    <span className="text-[9px] text-[#7A7C99] font-bold uppercase tracking-wider">Rank</span>
                    <span className="text-[11px] font-black px-2 py-0.5 rounded-full bg-[#FFB800] text-[#1E1F3D]">
                      #1 Gold
                    </span>
                  </div>
                </>
              ) : userRank === 2 ? (
                <>
                  <img
                    src="/assets/SilverPointsMedal.png"
                    alt="Silver Medal"
                    className="w-7 h-7 object-contain drop-shadow"
                  />
                  <div className="flex flex-col items-start">
                    <span className="text-[9px] text-[#7A7C99] font-bold uppercase tracking-wider">Rank</span>
                    <span className="text-[11px] font-black px-2 py-0.5 rounded-full bg-slate-200 text-[#1E1F3D]">
                      #2 Silver
                    </span>
                  </div>
                </>
              ) : userRank === 3 ? (
                <>
                  <img
                    src="/assets/BronzePointsMedal.png"
                    alt="Bronze Medal"
                    className="w-7 h-7 object-contain drop-shadow"
                  />
                  <div className="flex flex-col items-start">
                    <span className="text-[9px] text-[#7A7C99] font-bold uppercase tracking-wider">Rank</span>
                    <span className="text-[11px] font-black px-2 py-0.5 rounded-full bg-amber-700 text-white">
                      #3 Bronze
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div className="relative w-7 h-7 flex items-center justify-center shrink-0">
                    <img
                      src="/assets/StarSingle.png"
                      alt="Star Rank"
                      className="w-5 h-5 object-contain drop-shadow"
                    />
                    <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-[#1E1F3D] pt-0.5">
                      {userRank}
                    </span>
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-[9px] text-[#7A7C99] font-bold uppercase tracking-wider">Rank</span>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#EEF0FF] text-[#7C82ED]">
                      Rank #{userRank}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 4 Action Cards Grid matching 08 - Points & Rewards */}
      <div className="px-5 pt-4 pb-6 grid grid-cols-2 gap-3.5 relative z-10 flex-1">
        {/* 1. Leaderboard Card */}
        <div
          onClick={() => setPointsSubView('leaderboard')}
          className="animate-card-stagger stagger-1 bg-white rounded-[28px] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-[#EAEFFE] flex flex-col items-center justify-center gap-3 cursor-pointer group active:scale-95 transition-all hover:shadow-md hover:border-[#8E97FD]/50"
        >
          <div className="w-16 h-16 flex items-center justify-center">
            <img
              src="/assets/PointsLeaderboards.png"
              alt="Leaderboard"
              className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
            />
          </div>
          <span className="text-xs font-bold text-[#8E97FD] group-hover:text-[#7C82ED]">Leaderboard</span>
        </div>

        {/* 2. Activity Card */}
        <div
          onClick={() => setPointsSubView('activity')}
          className="animate-card-stagger stagger-2 bg-white rounded-[28px] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-[#EAEFFE] flex flex-col items-center justify-center gap-3 cursor-pointer group active:scale-95 transition-all hover:shadow-md hover:border-[#8E97FD]/50"
        >
          <div className="w-16 h-16 flex items-center justify-center">
            <img
              src="/assets/PointsActivity.png"
              alt="Activity"
              className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
            />
          </div>
          <span className="text-xs font-bold text-[#8E97FD] group-hover:text-[#7C82ED]">Activity</span>
        </div>

        {/* 3. Store Card */}
        <div
          onClick={() => setPointsSubView('store')}
          className="animate-card-stagger stagger-3 bg-white rounded-[28px] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-[#EAEFFE] flex flex-col items-center justify-center gap-3 cursor-pointer group active:scale-95 transition-all hover:shadow-md hover:border-[#8E97FD]/50"
        >
          <div className="w-16 h-16 flex items-center justify-center">
            <img
              src="/assets/PointsStore.png"
              alt="Store"
              className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
            />
          </div>
          <span className="text-xs font-bold text-[#8E97FD] group-hover:text-[#7C82ED]">Store</span>
        </div>

        {/* 4. Coupons Card */}
        <div
          onClick={() => setPointsSubView('coupons')}
          className="animate-card-stagger stagger-4 bg-white rounded-[28px] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-[#EAEFFE] flex flex-col items-center justify-center gap-3 cursor-pointer group active:scale-95 transition-all hover:shadow-md hover:border-[#8E97FD]/50"
        >
          <div className="w-16 h-16 flex items-center justify-center">
            <img
              src="/assets/PointsCoupon.png"
              alt="Coupons"
              className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
            />
          </div>
          <span className="text-xs font-bold text-[#8E97FD] group-hover:text-[#7C82ED]">Coupons</span>
        </div>
      </div>
    </div>
  );
};
