'use client';

import React, { useState, useRef } from 'react';
import { useEnigameStore } from '@/store/useEnigameStore';
import { Route, RouteDifficulty, DIFFICULTY_LABELS } from '@/types';
import {
  ChevronLeft,
  ShoppingBag,
  CheckCircle2,
  Lock,
  Unlock,
  ArrowRight,
  Sparkles,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { UnlockRouteModal } from './UnlockRouteModal';

const DIFFICULTY_OPTIONS: Array<{ key: 'All' | RouteDifficulty; label: string; stars?: number }> = [
  { key: 'All', label: 'All' },
  { key: 1, label: 'Easy', stars: 1 },
  { key: 2, label: 'Medium', stars: 2 },
  { key: 3, label: 'Hard', stars: 3 },
  { key: 4, label: 'Explorer', stars: 4 },
];

export const RouteStoreView: React.FC = () => {
  const {
    setPointsSubView,
    points,
    routes,
    unlockedRouteIds,
    buyRouteWithPoints,
    viewRouteDetail,
    setActiveTab,
    setRoutesViewStep,
    startRoute,
    setMeetupSubTab,
    showToast,
  } = useEnigameStore();

  const [selectedDifficulty, setSelectedDifficulty] = useState<'All' | RouteDifficulty>('All');
  const [confirmUnlockRoute, setConfirmUnlockRoute] = useState<Route | null>(null);

  // Horizontal Drag-to-slide Ref & Handlers for Difficulty Filter
  const filterTrackRef = useRef<HTMLDivElement>(null);
  const isDraggingFilter = useRef(false);
  const filterStartX = useRef(0);
  const filterScrollLeft = useRef(0);

  const onFilterMouseDown = (e: React.MouseEvent) => {
    if (!filterTrackRef.current) return;
    isDraggingFilter.current = true;
    filterStartX.current = e.pageX - filterTrackRef.current.offsetLeft;
    filterScrollLeft.current = filterTrackRef.current.scrollLeft;
  };

  const onFilterMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingFilter.current || !filterTrackRef.current) return;
    e.preventDefault();
    const x = e.pageX - filterTrackRef.current.offsetLeft;
    const walk = (x - filterStartX.current) * 1.5;
    filterTrackRef.current.scrollLeft = filterScrollLeft.current - walk;
  };

  const onFilterMouseUp = () => {
    isDraggingFilter.current = false;
  };

  // Map route costs based on difficulty
  const getRoutePointCost = (rt: Route) => {
    if (rt.id === 'route-braganca-medieval') return 0; // Default free/starter
    if (rt.difficulty === 1) return 400;
    if (rt.difficulty === 2) return 550;
    if (rt.difficulty === 3) return 700;
    return 850;
  };

  const filteredRoutes = routes.filter((rt) => {
    if (selectedDifficulty === 'All') return true;
    return rt.difficulty === selectedDifficulty;
  });

  const handleUnlock = (route: Route) => {
    const cost = getRoutePointCost(route);
    if (points < cost) {
      showToast(`You need ${cost - points} more Explorer Points to unlock this route!`, 'error');
      return;
    }

    const success = buyRouteWithPoints(route.id, cost);
    if (success) {
      showToast(`"${route.title}" Unlocked!`, 'success');
    }
  };

  const handleInspectRoute = (route: Route) => {
    viewRouteDetail(route, 'points');
  };

  const handleStartRoute = (route: Route) => {
    startRoute(route.id);
    setActiveTab('meetup');
    setMeetupSubTab('map');
    showToast(`"${route.title}" started! Live expedition map active.`, 'success');
  };

  const handleGoToCatalog = () => {
    setRoutesViewStep('select-city');
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
          <span className="text-xs font-bold text-[#FFD269]">{points.toLocaleString()} Points</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="px-5 pt-5 flex-1 flex flex-col gap-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold uppercase tracking-wider text-[#7A7C99]">
            Available Routes ({filteredRoutes.length})
          </span>
          <button
            onClick={handleGoToCatalog}
            className="text-xs font-bold text-[#8E97FD] hover:text-[#7C82ED] flex items-center gap-1 cursor-pointer"
          >
            Catalog <ArrowRight size={14} />
          </button>
        </div>

        {/* Difficulty Filter Chips with smooth horizontal scroll and mouse/touch/wheel drag */}
        <div
          ref={filterTrackRef}
          onMouseDown={onFilterMouseDown}
          onMouseMove={onFilterMouseMove}
          onMouseUp={onFilterMouseUp}
          onMouseLeave={onFilterMouseUp}
          onWheel={(e) => {
            if (filterTrackRef.current && e.deltaY !== 0) {
              filterTrackRef.current.scrollLeft += e.deltaY;
            }
          }}
          className="w-full overflow-x-auto no-scrollbar pb-1 px-1 flex items-center gap-2 touch-pan-x scroll-smooth select-none cursor-grab active:cursor-grabbing animate-card-stagger"
          style={{ animationDelay: '60ms' }}
        >
          {DIFFICULTY_OPTIONS.map((opt) => {
            const isSelected = selectedDifficulty === opt.key;
            return (
              <button
                key={String(opt.key)}
                onClick={(e) => {
                  setSelectedDifficulty(opt.key);
                  e.currentTarget.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                }}
                className={
                  'px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer flex items-center gap-1.5 shrink-0 active:scale-95 ' +
                  (isSelected
                    ? 'bg-[#6979F8] text-white shadow-md shadow-indigo-300/40 scale-105 font-bold animate-pill-pop ring-2 ring-indigo-200/50'
                    : 'bg-white text-[#6F728F] border border-[#E4E7F4] hover:border-[#6979F8]/40 hover:text-[#1E1F3D]')
                }
              >
                <span>{opt.label}</span>
                {opt.stars && (
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: opt.stars }).map((_, sIdx) => (
                      <img
                        key={sIdx}
                        src="/assets/StarSingle.png"
                        alt="★"
                        className="w-2.5 h-2.5 object-contain"
                      />
                    ))}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredRoutes.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 border border-[#EAEFFE] text-center flex flex-col items-center justify-center gap-3 shadow-xs mt-2">
            <div className="w-12 h-12 rounded-full bg-[#EEF0FA] flex items-center justify-center text-[#8E97FD]">
              <AlertCircle size={24} />
            </div>
            <p className="text-sm font-bold text-[#1E1F3D]">No routes found</p>
            <p className="text-xs text-[#7A7C99] max-w-xs">
              There are no mystery routes available for this difficulty level in the store yet.
            </p>
            <button
              onClick={() => setSelectedDifficulty('All')}
              className="mt-2 px-4 py-2 rounded-xl bg-[#8E97FD] text-white text-xs font-bold hover:bg-[#7C82ED] transition-all cursor-pointer active:scale-95"
            >
              Show All Routes
            </button>
          </div>
        ) : (
          /* Routes List */
          <div className="flex flex-col gap-4 mt-1">
            {filteredRoutes.map((route, idx) => {
              const isUnlocked = unlockedRouteIds.includes(route.id);
              const cost = getRoutePointCost(route);
              const canAfford = points >= cost;

              return (
                <div
                  key={route.id}
                  onClick={() => handleInspectRoute(route)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleInspectRoute(route);
                    }
                  }}
                  className={`animate-card-stagger stagger-${Math.min(idx + 1, 8)} bg-white rounded-[28px] overflow-hidden border transition-all shadow-xs hover:shadow-lg cursor-pointer flex flex-col group active:scale-[0.99] ${
                    isUnlocked ? 'border-emerald-200 hover:border-emerald-300' : 'border-[#EAEFFE] hover:border-[#8E97FD]/50'
                  }`}
                >
                  {/* Route Header Image */}
                  <div className="relative h-36 w-full overflow-hidden bg-[#1E1F3D]">
                    <img
                      src={route.coverImage || '/assets/BragancaHome.png'}
                      alt={route.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10" />

                    {/* Top Badge: Unlocked status */}
                    <div className="absolute top-3 left-3">
                      {isUnlocked ? (
                        <span className="px-3 py-1 rounded-full bg-emerald-500 text-white text-[11px] font-bold flex items-center gap-1 shadow-md">
                          <CheckCircle2 size={13} /> Unlocked
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-bold flex items-center gap-1 border border-white/10">
                          <Lock size={12} className="text-[#FFB800]" /> Locked
                        </span>
                      )}
                    </div>

                    {/* Price Tag in Points */}
                    <div className="absolute top-3 right-3">
                      <div className="px-3 py-1 rounded-full bg-[#1E1F3D]/80 backdrop-blur-md border border-white/20 text-white text-[11px] font-bold flex items-center gap-1.5 shadow-md">
                        <Sparkles size={13} className="text-[#FFB800]" />
                        <span>{cost === 0 ? 'Free Starter' : `${cost} Pts`}</span>
                      </div>
                    </div>

                    {/* Bottom Image Info (Inspect button removed as requested) */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-white">
                      <div className="min-w-0 pr-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#FFD269] block">
                          {route.city} • {route.category}
                        </span>
                        <h3 className="text-sm font-bold line-clamp-1 drop-shadow-sm">{route.title}</h3>
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
                      <div className="flex items-center gap-1.5">
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: route.difficulty }).map((_, sIdx) => (
                            <img
                              key={sIdx}
                              src="/assets/StarSingle.png"
                              alt="★"
                              className="w-3 h-3 object-contain"
                            />
                          ))}
                        </div>
                        <span className="text-[11px] font-medium text-[#7A7C99]">
                          {DIFFICULTY_LABELS[route.difficulty]}
                        </span>
                      </div>
                    </div>

                    {/* Action Button: Start Route (Blue) or Unlock (No price) */}
                    <div className="flex items-center gap-2">
                      {isUnlocked ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStartRoute(route);
                          }}
                          className="px-4 py-2 rounded-xl bg-[#8E97FD] hover:bg-[#7C82ED] text-white text-xs font-bold shadow-md shadow-indigo-200 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                        >
                          <Unlock size={14} /> Start Route
                        </button>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setConfirmUnlockRoute(route);
                          }}
                          className={`px-4 py-2 rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 ${
                            canAfford
                              ? 'bg-[#8E97FD] hover:bg-[#7C82ED] text-white shadow-indigo-200'
                              : 'bg-[#EEF0FA] text-[#7A7C99] hover:bg-[#E2E6F5]'
                          }`}
                        >
                          <Sparkles size={14} className={canAfford ? 'text-[#FFD269]' : 'text-[#7A7C99]'} />
                          Unlock
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Big Bottom Action Link to Routes Catalog */}
        <div className="mt-4 mb-6">
          <button
            onClick={handleGoToCatalog}
            className="w-full h-13 rounded-2xl bg-[#1E1F3D] hover:bg-[#2B2D54] text-white font-bold text-xs shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-98 transition-all"
          >
            <span>Explore All European Routes in Catalog</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* Unlock Confirmation Modal with Points Pricing */}
      <UnlockRouteModal
        route={confirmUnlockRoute}
        onClose={() => setConfirmUnlockRoute(null)}
      />
    </div>
  );
};
