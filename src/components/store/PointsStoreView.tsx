'use client';

import React from 'react';
import { ChevronRight, Sparkles } from 'lucide-react';
import { useEnigameStore } from '@/store/useEnigameStore';
import { MOCK_LEADERBOARD } from '@/data/mockData';
import { LeaderboardView } from './LeaderboardView';
import { ActivityView } from './ActivityView';
import { RouteStoreView } from './RouteStoreView';
import { CouponsView } from './CouponsView';

export const PointsStoreView: React.FC = () => {
  const { points, rankPoints: storeRankPoints, currentUser, pointsSubView, setPointsSubView, setWealthTitlesModalOpen } = useEnigameStore();

  const rankPoints = storeRankPoints ?? Math.max(1000, points);

  // Dynamically calculate user rank based on real points vs leaderboard
  const userRank = React.useMemo(() => {
    const list = MOCK_LEADERBOARD.map((u) =>
      u.isCurrentUser ? { ...u, points: rankPoints } : u
    );
    list.sort((a, b) => b.points - a.points);
    const foundIndex = list.findIndex(
      (u) => u.isCurrentUser || u.id === currentUser.id
    );
    return foundIndex !== -1 ? foundIndex + 1 : 8;
  }, [rankPoints, currentUser.id]);

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
        <h1 className="text-base font-bold tracking-wide drop-shadow-xs">Points & Rewards</h1>
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
        <h2 className="text-base font-bold text-[#1E1F3D] mt-2.5 tracking-tight font-semibold">
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
          <div
            onClick={() => setWealthTitlesModalOpen(true)}
            className="w-full bg-[#F4F6FB] hover:bg-[#EEF0FA] rounded-2xl px-3.5 py-2.5 flex items-center justify-center border border-[#EEF0FA] shadow-2xs cursor-pointer transition-colors group/card"
            title="Click to view Secret Wealth Titles"
          >
            {/* Points Info with Coin Image */}
            <div className="flex items-center gap-2 pr-3 border-r border-[#E0E3F5]">
              <img
                src="/assets/StatusCoins.png"
                alt="Coins"
                className="w-6 h-6 object-contain drop-shadow shrink-0"
              />
              <div className="flex flex-col items-start">
                <span className="text-[9px] text-[#7A7C99] font-bold uppercase tracking-wider">Explorer Points</span>
                <span className="text-sm font-bold text-[#6C7BFF] tracking-wide leading-tight flex items-baseline gap-1">
                  {points.toLocaleString()} <span className="text-[10px] font-bold text-[#6C7BFF]">Pts</span>
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
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#FFB800] text-[#1E1F3D]">
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
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-[#1E1F3D]">
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
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-700 text-white">
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

          {/* Secret Wealth Titles interactive trigger */}
          <button
            type="button"
            onClick={() => setWealthTitlesModalOpen(true)}
            className="mt-2 text-[10px] font-bold text-[#8E97FD] hover:text-[#6979F8] flex items-center gap-1 cursor-pointer transition-colors active:scale-95 px-2.5 py-0.5 rounded-full hover:bg-[#EEF0FF]"
          >
            <Sparkles size={11} className="text-amber-400" />
            <span>Secret Wealth Titles (10k, 25k, 50k, 100k)</span>
            <ChevronRight size={10} />
          </button>
        </div>
      </div>

      {/* 4 Action Cards Grid matching 08 - Points & Rewards */}
      <div className="px-5 pt-3.5 pb-6 grid grid-cols-2 gap-3.5 relative z-10 flex-1">
        {/* 1. Leaderboard Card */}
        <div
          onClick={() => setPointsSubView('leaderboard')}
          className="animate-card-stagger stagger-1 bg-white rounded-[28px] p-4 shadow-[0_8px_24px_rgba(30,31,61,0.06)] border border-[#EAEFFE] hover:border-[#FFB800]/50 hover:shadow-[0_12px_28px_rgba(255,184,0,0.14)] flex flex-col items-center text-center cursor-pointer group active:scale-[0.97] transition-all duration-300 relative overflow-hidden"
        >
          {/* Ambient Glow */}
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-[#FFB800]/10 rounded-full blur-xl pointer-events-none group-hover:scale-125 transition-transform duration-500" />

          {/* Top Micro Row: Themed Pill + Arrow */}
          <div className="w-full flex items-center justify-between z-10 mb-2">
            <span className="text-[9px] font-bold uppercase tracking-wider text-[#D97706] bg-[#FFF8E7] px-2 py-0.5 rounded-full border border-[#FFE299]/60 shadow-2xs">
              Top 50
            </span>
            <div className="w-5 h-5 rounded-full bg-[#F4F6FB] flex items-center justify-center text-[#A5A7C4] group-hover:text-[#D97706] group-hover:bg-[#FFF8E7] transition-colors">
              <ChevronRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>

          {/* 3D Asset Pedestal Pod */}
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FFF9EB] via-white to-[#EEF0FA] border border-[#FFEBB3]/60 flex items-center justify-center p-2.5 my-1 shadow-2xs group-hover:scale-108 group-hover:rotate-1 transition-all duration-300">
            <img
              src="/assets/PointsLeaderboards.png"
              alt="Leaderboard"
              className="w-full h-full object-contain drop-shadow-xs"
            />
          </div>

          {/* Typography */}
          <div className="mt-1 flex flex-col items-center z-10">
            <h3 className="text-sm font-bold text-[#1E1F3D] group-hover:text-[#6979F8] transition-colors leading-tight">
              Leaderboard
            </h3>
            <span className="text-[10px] font-semibold text-[#8E90B0] mt-0.5">
              Global Rankings
            </span>
          </div>
        </div>

        {/* 2. Activity Card */}
        <div
          onClick={() => setPointsSubView('activity')}
          className="animate-card-stagger stagger-2 bg-white rounded-[28px] p-4 shadow-[0_8px_24px_rgba(30,31,61,0.06)] border border-[#EAEFFE] hover:border-[#38BDF8]/50 hover:shadow-[0_12px_28px_rgba(56,189,248,0.14)] flex flex-col items-center text-center cursor-pointer group active:scale-[0.97] transition-all duration-300 relative overflow-hidden"
        >
          {/* Ambient Glow */}
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-[#38BDF8]/10 rounded-full blur-xl pointer-events-none group-hover:scale-125 transition-transform duration-500" />

          {/* Top Micro Row: Themed Pill + Arrow */}
          <div className="w-full flex items-center justify-between z-10 mb-2">
            <span className="text-[9px] font-bold uppercase tracking-wider text-[#0284C7] bg-[#EBF5FF] px-2 py-0.5 rounded-full border border-[#BAE6FD]/60 shadow-2xs">
              History
            </span>
            <div className="w-5 h-5 rounded-full bg-[#F4F6FB] flex items-center justify-center text-[#A5A7C4] group-hover:text-[#0284C7] group-hover:bg-[#EBF5FF] transition-colors">
              <ChevronRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>

          {/* 3D Asset Pedestal Pod */}
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#F0F9FF] via-white to-[#EEF0FA] border border-[#BAE6FD]/60 flex items-center justify-center p-2.5 my-1 shadow-2xs group-hover:scale-108 group-hover:rotate-1 transition-all duration-300">
            <img
              src="/assets/PointsActivity.png"
              alt="Activity"
              className="w-full h-full object-contain drop-shadow-xs"
            />
          </div>

          {/* Typography */}
          <div className="mt-1 flex flex-col items-center z-10">
            <h3 className="text-sm font-bold text-[#1E1F3D] group-hover:text-[#6979F8] transition-colors leading-tight">
              Activity
            </h3>
            <span className="text-[10px] font-semibold text-[#8E90B0] mt-0.5">
              Quests &amp; Points
            </span>
          </div>
        </div>

        {/* 3. Store Card */}
        <div
          onClick={() => setPointsSubView('store')}
          className="animate-card-stagger stagger-3 bg-white rounded-[28px] p-4 shadow-[0_8px_24px_rgba(30,31,61,0.06)] border border-[#EAEFFE] hover:border-[#8E97FD]/60 hover:shadow-[0_12px_28px_rgba(142,151,253,0.18)] flex flex-col items-center text-center cursor-pointer group active:scale-[0.97] transition-all duration-300 relative overflow-hidden"
        >
          {/* Ambient Glow */}
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-[#8E97FD]/12 rounded-full blur-xl pointer-events-none group-hover:scale-125 transition-transform duration-500" />

          {/* Top Micro Row: Themed Pill + Arrow */}
          <div className="w-full flex items-center justify-between z-10 mb-2">
            <span className="text-[9px] font-bold uppercase tracking-wider text-[#7C3AED] bg-[#F5F3FF] px-2 py-0.5 rounded-full border border-[#DDD6FE]/60 shadow-2xs">
              Rewards
            </span>
            <div className="w-5 h-5 rounded-full bg-[#F4F6FB] flex items-center justify-center text-[#A5A7C4] group-hover:text-[#7C3AED] group-hover:bg-[#F5F3FF] transition-colors">
              <ChevronRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>

          {/* 3D Asset Pedestal Pod */}
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#F5F3FF] via-white to-[#EEF0FA] border border-[#DDD6FE]/60 flex items-center justify-center p-2.5 my-1 shadow-2xs group-hover:scale-108 group-hover:rotate-1 transition-all duration-300">
            <img
              src="/assets/PointsStore.png"
              alt="Store"
              className="w-full h-full object-contain drop-shadow-xs"
            />
          </div>

          {/* Typography */}
          <div className="mt-1 flex flex-col items-center z-10">
            <h3 className="text-sm font-bold text-[#1E1F3D] group-hover:text-[#6979F8] transition-colors leading-tight">
              Store
            </h3>
            <span className="text-[10px] font-semibold text-[#8E90B0] mt-0.5">
              Perks &amp; Badges
            </span>
          </div>
        </div>

        {/* 4. Coupons Card */}
        <div
          onClick={() => setPointsSubView('coupons')}
          className="animate-card-stagger stagger-4 bg-white rounded-[28px] p-4 shadow-[0_8px_24px_rgba(30,31,61,0.06)] border border-[#EAEFFE] hover:border-[#F43F5E]/50 hover:shadow-[0_12px_28px_rgba(244,63,94,0.14)] flex flex-col items-center text-center cursor-pointer group active:scale-[0.97] transition-all duration-300 relative overflow-hidden"
        >
          {/* Ambient Glow */}
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-[#F43F5E]/10 rounded-full blur-xl pointer-events-none group-hover:scale-125 transition-transform duration-500" />

          {/* Top Micro Row: Themed Pill + Arrow */}
          <div className="w-full flex items-center justify-between z-10 mb-2">
            <span className="text-[9px] font-bold uppercase tracking-wider text-[#E11D48] bg-[#FFF1F2] px-2 py-0.5 rounded-full border border-[#FECDD3]/60 shadow-2xs">
              Vouchers
            </span>
            <div className="w-5 h-5 rounded-full bg-[#F4F6FB] flex items-center justify-center text-[#A5A7C4] group-hover:text-[#E11D48] group-hover:bg-[#FFF1F2] transition-colors">
              <ChevronRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>

          {/* 3D Asset Pedestal Pod */}
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FFF1F2] via-white to-[#EEF0FA] border border-[#FECDD3]/60 flex items-center justify-center p-2.5 my-1 shadow-2xs group-hover:scale-108 group-hover:rotate-1 transition-all duration-300">
            <img
              src="/assets/PointsCoupon.png"
              alt="Coupons"
              className="w-full h-full object-contain drop-shadow-xs"
            />
          </div>

          {/* Typography */}
          <div className="mt-1 flex flex-col items-center z-10">
            <h3 className="text-sm font-bold text-[#1E1F3D] group-hover:text-[#6979F8] transition-colors leading-tight">
              Coupons
            </h3>
            <span className="text-[10px] font-semibold text-[#8E90B0] mt-0.5">
              Gifts &amp; Promos
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
