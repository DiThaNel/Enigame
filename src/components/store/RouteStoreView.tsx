'use client';

import React, { useState } from 'react';
import { useEnigameStore } from '@/store/useEnigameStore';
import { Route } from '@/types';
import { ChevronLeft, ShoppingBag, CheckCircle2, Lock, Unlock, ArrowRight, Sparkles, Star, Clock, AlertCircle } from 'lucide-react';

export const RouteStoreView: React.FC = () => {
  const {
    setPointsSubView,
    points,
    routes,
    unlockedRouteIds,
    buyRouteWithPoints,
    viewRouteDetail,
    setActiveTab,
    showToast,
  } = useEnigameStore();

  // Map route costs based on difficulty
  const getRoutePointCost = (rt: Route) => {
    if (rt.id === 'route-braganca-medieval') return 0; // Default free/starter
    if (rt.difficulty === 1) return 400;
    if (rt.difficulty === 2) return 550;
    if (rt.difficulty === 3) return 700;
    return 850;
  };

  const handleUnlock = (route: Route) => {
    const cost = getRoutePointCost(route);
    if (points < cost) {
      showToast(`You need ${cost - points} more Explorer Points to unlock this route!`, 'error');
      return;
    }

    const success = buyRouteWithPoints(route.id, cost);
    if (success) {
      showToast(`"${route.title}" Unlocked for ${cost} Points!`, 'success');
    }
  };

  const handleStartRoute = (route: Route) => {
    viewRouteDetail(route, 'routes');
    setActiveTab('routes');
  };

  return (
    <div className="w-full min-h-screen pb-28 bg-[#F4F6FB] flex flex-col animate-modal-screen select-none relative">
      {/* Curved Purple Header */}
      <div className="relative bg-[#8E97FD] rounded-b-[38px] pt-8 pb-6 px-6 text-white text-center shadow-md shrink-0 z-20">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => setPointsSubView('hub')}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-all cursor-pointer active:scale-95"
            title="Back to Points"
            aria-label="Back"
          >
            <ChevronLeft size={22} />
          </button>
          <div className="flex items-center gap-2">
            <ShoppingBag size={18} className="text-[#FFB800]" />
            <h1 className="text-base font-bold tracking-wide">Route Explorer Store</h1>
          </div>
          <div className="w-9" />
        </div>

        <p className="text-xs text-white/80 font-medium max-w-xs mx-auto">
          Exchange your earned points to unlock new European mystery exploration routes.
        </p>

        {/* Balance Chip */}
        <div className="inline-flex items-center gap-2 mt-4 bg-white/20 px-4 py-1.5 rounded-full backdrop-blur-xs shadow-inner">
          <img src="/assets/StatusCoins.png" alt="Coins" className="w-4 h-4 object-contain" />
          <span className="text-xs font-bold text-white">Your Balance:</span>
          <span className="text-xs font-black text-[#FFD269]">{points.toLocaleString()} Points</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="px-5 pt-5 flex-1 flex flex-col gap-4">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold uppercase tracking-wider text-[#7A7C99]">
            Available Routes ({routes.length})
          </span>
          <button
            onClick={() => setActiveTab('routes')}
            className="text-xs font-bold text-[#8E97FD] hover:text-[#7C82ED] flex items-center gap-1 cursor-pointer"
          >
            Catalog <ArrowRight size={14} />
          </button>
        </div>

        {/* Routes List */}
        <div className="flex flex-col gap-4">
          {routes.map((route, idx) => {
            const isUnlocked = unlockedRouteIds.includes(route.id);
            const cost = getRoutePointCost(route);
            const canAfford = points >= cost;

            return (
              <div
                key={route.id}
                className={`animate-card-stagger stagger-${Math.min(idx + 1, 8)} bg-white rounded-[28px] overflow-hidden border transition-all shadow-xs hover:shadow-md flex flex-col ${
                  isUnlocked ? 'border-emerald-200' : 'border-[#EAEFFE]'
                }`}
              >
                {/* Route Header Image */}
                <div className="relative h-36 w-full overflow-hidden bg-[#1E1F3D]">
                  <img
                    src={route.coverImage || '/assets/BragancaHome.png'}
                    alt={route.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Top Badge: Unlocked status */}
                  <div className="absolute top-3 left-3">
                    {isUnlocked ? (
                      <span className="px-3 py-1 rounded-full bg-emerald-500 text-white text-[11px] font-black flex items-center gap-1 shadow-md">
                        <CheckCircle2 size={13} /> Unlocked
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-bold flex items-center gap-1">
                        <Lock size={12} className="text-[#FFB800]" /> Locked
                      </span>
                    )}
                  </div>

                  {/* Price Tag in Points */}
                  <div className="absolute top-3 right-3">
                    <div className="px-3 py-1 rounded-full bg-[#1E1F3D]/80 backdrop-blur-md border border-white/20 text-white text-[11px] font-black flex items-center gap-1.5 shadow-md">
                      <Sparkles size={13} className="text-[#FFB800]" />
                      <span>{cost === 0 ? 'Free Starter' : `${cost} Pts`}</span>
                    </div>
                  </div>

                  {/* Bottom Image Info */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-white">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#FFD269]">
                        {route.city} • {route.category}
                      </span>
                      <h3 className="text-sm font-bold line-clamp-1">{route.title}</h3>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 text-xs text-[#7A7C99]">
                    <div className="flex items-center gap-1">
                      <Clock size={13} className="text-[#8E97FD]" />
                      <span>{route.durationMinutes} min</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star size={13} className="text-amber-400 fill-amber-400" />
                      <span>Diff {route.difficulty}/4</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  {isUnlocked ? (
                    <button
                      onClick={() => handleStartRoute(route)}
                      className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-md shadow-emerald-200 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                    >
                      <Unlock size={14} /> Start Route
                    </button>
                  ) : (
                    <button
                      onClick={() => handleUnlock(route)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 ${
                        canAfford
                          ? 'bg-[#8E97FD] hover:bg-[#7C82ED] text-white shadow-indigo-200'
                          : 'bg-[#EEF0FA] text-[#7A7C99] hover:bg-[#E2E6F5]'
                      }`}
                    >
                      <Sparkles size={14} className={canAfford ? 'text-[#FFD269]' : 'text-[#7A7C99]'} />
                      Unlock ({cost} Pts)
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Big Bottom Action Link */}
        <div className="mt-4 mb-6">
          <button
            onClick={() => setActiveTab('routes')}
            className="w-full h-13 rounded-2xl bg-[#1E1F3D] hover:bg-[#2B2D54] text-white font-bold text-xs shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-98 transition-all"
          >
            <span>Explore All European Routes in Catalog</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
