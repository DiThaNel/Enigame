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
    <div className="w-full min-h-screen pb-28 bg-[#F4F6FB] flex flex-col animate-modal-screen select-none relative">
      {/* Curved Purple Header matching 08 - Points & Rewards */}
      <div className="relative bg-[#989EEC] rounded-b-[44px] pt-7 pb-8 px-6 text-white text-center shadow-md shrink-0">
        {/* Top Avatar - Centered and only Tianna's photo */}
        <div className="flex justify-center mb-2">
          <div>
            <img
              src="/assets/TianaAvatar.png"
              alt={currentUser.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Username */}
        <h2 className="text-base font-bold tracking-wide mt-1">{currentUser.name}</h2>

        {/* Explorer Tier Status Section: Points & Rank */}
        <div className="mt-4 flex flex-col items-center">
          <span className="text-[11px] font-bold tracking-wider uppercase opacity-85 mb-2">
            Tier Status
          </span>

          {/* Points & Rank Badge Container */}
          <div className="bg-white/20 backdrop-blur-md rounded-2xl px-5 py-2.5 flex items-center gap-4 shadow-sm border border-white/25">
            {/* Points Info with Coin Image */}
            <div className="flex items-center gap-2.5 pr-4 border-r border-white/25">
              <img
                src="/assets/StatusCoins.png"
                alt="Coins"
                className="w-6 h-6 object-contain drop-shadow shrink-0"
              />
              <div className="flex flex-col items-start">
                <span className="text-[9px] text-white/80 font-bold uppercase tracking-wider">Explorer Points</span>
                <span className="text-base font-black text-[#FFD269] tracking-wide leading-tight flex items-baseline gap-1">
                  {points.toLocaleString()} <span className="text-xs font-bold text-white">Pts</span>
                </span>
              </div>
            </div>

            {/* Rank with Medal or Star */}
            <div className="flex items-center gap-2.5">
              {userRank === 1 ? (
                <>
                  <img
                    src="/assets/TopPointsMedal.png"
                    alt="Gold Medal"
                    className="w-8 h-8 object-contain drop-shadow"
                  />
                  <div className="flex flex-col items-start">
                    <span className="text-[9px] text-white/80 font-bold uppercase tracking-wider">Rank</span>
                    <span className="text-xs font-black px-2 py-0.5 rounded-full bg-[#FFB800] text-[#1E1F3D]">
                      #1 Gold
                    </span>
                  </div>
                </>
              ) : userRank === 2 ? (
                <>
                  <img
                    src="/assets/SilverPointsMedal.png"
                    alt="Silver Medal"
                    className="w-8 h-8 object-contain drop-shadow"
                  />
                  <div className="flex flex-col items-start">
                    <span className="text-[9px] text-white/80 font-bold uppercase tracking-wider">Rank</span>
                    <span className="text-xs font-black px-2 py-0.5 rounded-full bg-slate-200 text-[#1E1F3D]">
                      #2 Silver
                    </span>
                  </div>
                </>
              ) : userRank === 3 ? (
                <>
                  <img
                    src="/assets/BronzePointsMedal.png"
                    alt="Bronze Medal"
                    className="w-8 h-8 object-contain drop-shadow"
                  />
                  <div className="flex flex-col items-start">
                    <span className="text-[9px] text-white/80 font-bold uppercase tracking-wider">Rank</span>
                    <span className="text-xs font-black px-2 py-0.5 rounded-full bg-amber-700 text-white">
                      #3 Bronze
                    </span>
                  </div>
                </>
              ) : (
                <>
                  {/* Star with Rank number for ranks > 3 */}
                  <div className="relative w-8 h-8 flex items-center justify-center shrink-0">
                    <img
                      src="/assets/StarSingle.png"
                      alt="Star Rank"
                      className="w-6 h-6 object-contain drop-shadow"
                    />
                    <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-[#1E1F3D] pt-0.5">
                      {userRank}
                    </span>
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-[9px] text-white/80 font-bold uppercase tracking-wider">Rank</span>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-white/25 text-white">
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
      <div className="p-6 grid grid-cols-2 gap-4 flex-1">
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
