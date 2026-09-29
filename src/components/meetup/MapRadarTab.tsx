'use client';

import React, { useState } from 'react';
import { useEnigameStore } from '@/store/useEnigameStore';
import { 
  Compass, 
  QrCode, 
  Users, 
  Flag, 
  Sparkles, 
  LocateFixed, 
  CheckCircle2, 
  KeyRound, 
  Play, 
  MapPin, 
  X, 
  ChevronRight, 
  ChevronLeft,
  Award, 
  Clock, 
  AlertCircle,
  HelpCircle,
  ShieldCheck,
  Flame,
  ArrowRight,
  Footprints,
  RotateCcw,
  Trophy
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CompletedRoute, Checkpoint, Explorer } from '@/types';

export const MapRadarTab: React.FC = () => {
  const { 
    explorers, 
    routes, 
    activeRouteId, 
    isRouteInProgress, 
    activeRouteStartedAt, 
    unlockedRouteIds, 
    completedRoutes, 
    startRoute, 
    cancelActiveRoute, 
    finishRouteWithKeyword, 
    setScannerOpen, 
    setSelectedExplorer, 
    showToast, 
    setMeetupSubTab, 
    setActiveTab,
    currentUser 
  } = useEnigameStore();

  // Scroll ref & active card indicator for horizontal carousel
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [isPointerDown, setIsPointerDown] = useState(false);
  const dragStartXRef = React.useRef<number>(0);
  const dragScrollLeftRef = React.useRef<number>(0);
  const hasMovedRef = React.useRef<boolean>(false);
  const touchStartTimeRef = React.useRef<number>(0);

  const scrollToCard = (index: number) => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const clampedIndex = Math.max(0, Math.min(unstartedPurchasedRoutes.length - 1, index));
    const cards = container.querySelectorAll<HTMLElement>('[data-route-card]');
    const target = cards[clampedIndex];
    if (target) {
      const containerWidth = container.clientWidth;
      const cardWidth = target.clientWidth;
      const targetScroll = target.offsetLeft - (containerWidth - cardWidth) / 2;
      container.scrollTo({
        left: Math.max(0, targetScroll),
        behavior: 'smooth',
      });
    } else {
      const cardWidth = 320;
      container.scrollTo({
        left: clampedIndex * cardWidth,
        behavior: 'smooth',
      });
    }
    setActiveCardIndex(clampedIndex);
  };

  const handlePointerStart = (clientX: number) => {
    if (!scrollContainerRef.current) return;
    setIsPointerDown(true);
    hasMovedRef.current = false;
    dragStartXRef.current = clientX;
    dragScrollLeftRef.current = scrollContainerRef.current.scrollLeft;
    touchStartTimeRef.current = Date.now();
  };

  const handlePointerMove = (clientX: number) => {
    if (!isPointerDown || !scrollContainerRef.current) return;
    const deltaX = clientX - dragStartXRef.current;
    if (Math.abs(deltaX) > 6) {
      hasMovedRef.current = true;
    }
    scrollContainerRef.current.scrollLeft = dragScrollLeftRef.current - deltaX;
  };

  const handlePointerEnd = (clientX: number) => {
    if (!isPointerDown) return;
    setIsPointerDown(false);

    const deltaX = clientX - dragStartXRef.current;
    const timeElapsed = Math.max(1, Date.now() - touchStartTimeRef.current);
    const velocity = Math.abs(deltaX) / timeElapsed; // px per ms

    if (deltaX < -40 || (deltaX < -15 && velocity > 0.35)) {
      // Swiped Left -> Next Card
      scrollToCard(activeCardIndex + 1);
    } else if (deltaX > 40 || (deltaX > 15 && velocity > 0.35)) {
      // Swiped Right -> Previous Card
      scrollToCard(activeCardIndex - 1);
    } else {
      // Snap to current card
      scrollToCard(activeCardIndex);
    }
  };

  const handleCarouselScroll = () => {
    if (!scrollContainerRef.current || isPointerDown) return;
    const container = scrollContainerRef.current;
    const cards = container.querySelectorAll<HTMLElement>('[data-route-card]');
    if (cards.length === 0) return;
    
    // Find card closest to center of container
    const containerCenter = container.scrollLeft + container.clientWidth / 2;
    let closestIndex = 0;
    let minDistance = Infinity;

    cards.forEach((card, idx) => {
      const cardCenter = card.offsetLeft + card.clientWidth / 2;
      const dist = Math.abs(containerCenter - cardCenter);
      if (dist < minDistance) {
        minDistance = dist;
        closestIndex = idx;
      }
    });

    setActiveCardIndex(closestIndex);
  };
  
  // Keyword completion modal state
  const [isKeywordModalOpen, setIsKeywordModalOpen] = useState(false);
  const [keywordInput, setKeywordInput] = useState('');
  const [keywordError, setKeywordError] = useState('');
  
  // Celebration completion modal state (reveals the internal timer!)
  const [completionData, setCompletionData] = useState<CompletedRoute | null>(null);

  // Selected checkpoint modal for viewing riddle/details
  const [selectedCheckpoint, setSelectedCheckpoint] = useState<Checkpoint | null>(null);

  // Confirmation dialog for abandoning/canceling active route
  const [isCancelConfirmOpen, setIsCancelConfirmOpen] = useState(false);

  // Filter purchased routes that are NOT completed yet
  const unstartedPurchasedRoutes = routes.filter(
    (r) => unlockedRouteIds.includes(r.id) && !completedRoutes.some((c) => c.routeId === r.id)
  );

  // Active route object (fallback to first available or selected)
  const activeRoute = routes.find((r) => r.id === activeRouteId) || unstartedPurchasedRoutes[0] || routes[0];

  // Candidates for companions on the active route map
  const companionsOnRoute = explorers
    .filter((e) => e.id !== currentUser.id)
    .slice(0, 4);

  // Handle starting a route
  const handleStartRoute = (routeId: string) => {
    startRoute(routeId);
    showToast('Route started! Internal timer active. Follow the live trail and checkpoints.', 'success');
  };

  // Handle submitting guide keyword
  const handleSubmitKeyword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!keywordInput.trim()) {
      setKeywordError('Please enter the secret keyword provided by your guide.');
      return;
    }

    const result = finishRouteWithKeyword(keywordInput);
    if (result.success && result.completedRoute) {
      setKeywordError('');
      setIsKeywordModalOpen(false);
      setKeywordInput('');
      setCompletionData(result.completedRoute);

      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#7C82ED', '#FFB800', '#6C5CE7', '#10B981'],
      });

      showToast(result.message, 'success');
    } else {
      setKeywordError(result.message);
    }
  };

  // If a route is completed, show celebration modal with revealed timer!
  if (completionData) {
    return (
      <div className="w-full h-full min-h-[500px] flex items-center justify-center p-4 bg-[#F4F6FB] animate-fadeIn select-none">
        <div className="w-full max-w-sm bg-white rounded-[32px] p-6 shadow-2xl border border-[#EEF0FA] flex flex-col items-center text-center relative overflow-hidden animate-scaleUp">
          {/* Decorative glowing gradient backdrop */}
          <div className="absolute -top-16 -right-16 w-44 h-44 rounded-full bg-[#7C82ED]/15 blur-2xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-44 h-44 rounded-full bg-[#FFB800]/15 blur-2xl pointer-events-none" />

          {/* Trophy Icon */}
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#7C82ED] to-[#6C5CE7] text-white flex items-center justify-center shadow-lg shadow-indigo-300/50 mb-3 relative z-10">
            <Trophy size={32} />
          </div>

          <span className="text-[11px] font-bold text-[#7C82ED] uppercase tracking-wider block mb-0.5">
            Expedition Certified!
          </span>
          <h2 className="text-xl font-bold text-[#1E1F3D] leading-tight">
            {completionData.routeTitle}
          </h2>
          <span className="text-xs text-[#7A7C99] mt-0.5 font-medium flex items-center gap-1 justify-center">
            <MapPin size={12} className="text-[#7C82ED]" />
            {completionData.city}, {completionData.country}
          </span>

          {/* REVEALED INTERNAL TIMER HERO BADGE */}
          <div className="w-full bg-[#EEF0FF] border border-[#DCE4F5] rounded-2xl p-3.5 my-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white text-[#7C82ED] flex items-center justify-center shadow-sm">
                <Clock size={18} />
              </div>
              <div className="text-left">
                <span className="text-[10px] text-[#7A7C99] font-bold block uppercase tracking-wide">
                  Revealed Time
                </span>
                <span className="text-base font-bold text-[#1E1F3D]">
                  {completionData.completionTime}
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-[#7A7C99] font-bold block uppercase tracking-wide">
                Reward
              </span>
              <span className="text-base font-bold text-[#10B981]">
                +{completionData.rewardPoints} PTS
              </span>
            </div>
          </div>

          {/* European Destination Unlocked Notice */}
          <div className="w-full p-2.5 rounded-xl bg-[#F0FDF4] border border-emerald-200 text-left flex items-start gap-2 mb-3">
            <ShieldCheck size={16} className="text-emerald-600 shrink-0 mt-0.5" />
            <div className="text-[11px] text-emerald-800 leading-snug">
              <span className="font-bold block">European Destination Unlocked:</span>
              <span className="font-medium">{completionData.city}, {completionData.country} has been added to your profile destinations.</span>
            </div>
          </div>

          {/* Companions on expedition */}
          <div className="w-full text-left mb-4">
            <span className="text-[10px] font-bold text-[#8E90B0] uppercase tracking-wide block mb-1.5">
              Expedition Companions ({completionData.participants.length})
            </span>
            <div className="flex items-center gap-1.5">
              {completionData.participants.map((p, idx) => (
                <div key={idx} className="relative group" title={p.name}>
                  <img
                    src={p.avatar || '/assets/TianaAvatar.png'}
                    alt={p.name}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-white shadow-sm"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="w-full flex flex-col gap-2">
            <button
              onClick={() => {
                setCompletionData(null);
                setMeetupSubTab('traveling');
              }}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#7C82ED] to-[#6C5CE7] text-white font-bold text-xs shadow-md shadow-indigo-300/40 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>View in Travels History</span>
              <ArrowRight size={14} />
            </button>

            <button
              onClick={() => setCompletionData(null)}
              className="w-full py-2.5 rounded-2xl bg-[#F4F6FB] text-[#7A7C99] hover:text-[#1E1F3D] font-bold text-xs transition-colors cursor-pointer"
            >
              Back to Maps
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW A: NO ROUTE IN PROGRESS (Purchased Routes Catalog)
  // ==========================================
  if (!isRouteInProgress) {
    return (
      <div className="w-full px-4 pt-3 pb-28 animate-fadeIn select-none">
        {/* Top Banner */}
        <div className="w-full bg-gradient-to-r from-[#6C7BFF] to-[#8E97FD] rounded-3xl p-4.5 text-white shadow-md shadow-indigo-200/50 mb-4 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full bg-white/10 pointer-events-none blur-sm" />
          <div className="absolute -bottom-8 -left-8 w-28 h-28 rounded-full bg-white/10 pointer-events-none blur-sm" />

          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                  <Compass size={18} />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-100 block">
                    Available Expeditions
                  </span>
                  <h2 className="text-base font-bold leading-tight">Your Purchased Routes</h2>
                </div>
              </div>

              <div className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white font-bold text-[11px] flex items-center gap-1 border border-white/25">
                <span>{unstartedPurchasedRoutes.length} Ready</span>
              </div>
            </div>

            <p className="text-[11px] text-indigo-100 font-medium mt-2 leading-relaxed">
              Select a purchased route to start your expedition with your official guide. Upon starting, the hidden background timer and live map will be activated.
            </p>
          </div>
        </div>

        {/* Empty state if all purchased routes have been completed or none purchased */}
        {unstartedPurchasedRoutes.length === 0 ? (
          <div className="w-full bg-white rounded-3xl p-8 border border-[#EEF0FA] shadow-sm text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-[#EEF0FF] text-[#7C82ED] flex items-center justify-center mb-3">
              <CheckCircle2 size={32} />
            </div>
            <h3 className="text-base font-bold text-[#1E1F3D]">All Routes Completed!</h3>
            <p className="text-xs text-[#7A7C99] mt-1.5 max-w-xs leading-relaxed">
              You have no pending routes to start. All your expeditions have been certified in Travels, or you can discover new journeys in the catalog.
            </p>

            <div className="flex flex-col gap-2 mt-5 w-full max-w-xs">
              <button
                onClick={() => setActiveTab('routes')}
                className="w-full py-2.5 rounded-2xl bg-[#7C82ED] hover:bg-[#6C5CE7] text-white font-bold text-xs shadow-md shadow-indigo-200 active:scale-95 transition-all cursor-pointer"
              >
                Explore Routes Catalog
              </button>
              <button
                onClick={() => setMeetupSubTab('traveling')}
                className="w-full py-2.5 rounded-2xl bg-[#EEF0FF] hover:bg-[#E0E5FE] text-[#6C7BFF] font-bold text-xs transition-colors cursor-pointer"
              >
                View History in Travels
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {/* Header above horizontal carousel */}
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#1E1F3D]">
                  Ready Expeditions ({unstartedPurchasedRoutes.length})
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#EEF0FF] text-[#7C82ED] font-bold text-[10px]">
                  Swipe &amp; Choose
                </span>
              </div>

              {unstartedPurchasedRoutes.length > 1 && (
                <div className="flex items-center gap-1.5">
                  <div className="hidden xs:flex items-center gap-1 text-[11px] font-semibold text-[#7C82ED] mr-1">
                    <span>Swipe or drag</span>
                    <ArrowRight size={12} className="animate-pulse" />
                  </div>
                  <button
                    onClick={() => scrollToCard(activeCardIndex - 1)}
                    className="w-7 h-7 rounded-full bg-white border border-[#EEF0FA] text-[#7A7C99] hover:text-[#1E1F3D] flex items-center justify-center shadow-xs cursor-pointer active:scale-95 transition-all"
                    aria-label="Previous Route"
                  >
                    <ChevronLeft size={14} />
                  </button>
                  <button
                    onClick={() => scrollToCard(activeCardIndex + 1)}
                    className="w-7 h-7 rounded-full bg-white border border-[#EEF0FA] text-[#7A7C99] hover:text-[#1E1F3D] flex items-center justify-center shadow-xs cursor-pointer active:scale-95 transition-all"
                    aria-label="Next Route"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              )}
            </div>

            {/* Horizontally scrollable and swipeable cards container */}
            <div
              ref={scrollContainerRef}
              onScroll={handleCarouselScroll}
              onMouseDown={(e) => handlePointerStart(e.pageX)}
              onMouseMove={(e) => {
                if (isPointerDown) {
                  e.preventDefault();
                  handlePointerMove(e.pageX);
                }
              }}
              onMouseUp={(e) => handlePointerEnd(e.pageX)}
              onMouseLeave={(e) => {
                if (isPointerDown) handlePointerEnd(e.pageX);
              }}
              onTouchStart={(e) => handlePointerStart(e.touches[0].clientX)}
              onTouchMove={(e) => handlePointerMove(e.touches[0].clientX)}
              onTouchEnd={(e) => handlePointerEnd(e.changedTouches[0].clientX)}
              onWheel={(e) => {
                if (scrollContainerRef.current && e.deltaY !== 0 && Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
                  scrollContainerRef.current.scrollLeft += e.deltaY;
                }
              }}
              className={`w-full flex items-stretch gap-3.5 overflow-x-auto no-scrollbar pb-3 pt-1 px-1 touch-pan-y scroll-smooth snap-x snap-mandatory select-none ${
                isPointerDown ? 'cursor-grabbing' : 'cursor-grab'
              }`}
            >
              {unstartedPurchasedRoutes.map((route, idx) => (
                <div
                  key={route.id}
                  data-route-card
                  className="w-[84vw] max-w-[330px] shrink-0 snap-center bg-white rounded-3xl overflow-hidden border border-[#EEF0FA] shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  {/* Top Cover Image & Info Badges */}
                  <div>
                    <div className="relative h-44 w-full bg-[#E8EDF5] overflow-hidden select-none">
                      <img
                        src={route.coverImage || '/assets/BragancaHome.png'}
                        alt={route.title}
                        draggable={false}
                        className="w-full h-full object-cover pointer-events-none select-none"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent pointer-events-none" />

                      {/* City badge & distance */}
                      <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 pointer-events-none">
                        <span className="px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md text-[#1E1F3D] font-bold text-[10px] shadow-sm flex items-center gap-1">
                          <MapPin size={10} className="text-[#7C82ED]" />
                          {route.city}, {route.country}
                        </span>
                        <span className="px-2 py-1 rounded-full bg-black/50 backdrop-blur-md text-white font-bold text-[10px]">
                          {route.distanceKm} km
                        </span>
                      </div>

                      {/* Reward Points Tag */}
                      <div className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full bg-[#FFB800] text-[#1E1F3D] font-bold text-[10px] shadow-sm flex items-center gap-1 pointer-events-none">
                        <Award size={12} />
                        <span>+{route.rewardPoints} PTS</span>
                      </div>

                      {/* Title & snippet over bottom image */}
                      <div className="absolute bottom-2.5 left-3 right-3 text-white pointer-events-none">
                        <span className="text-[9px] font-bold text-indigo-200 uppercase tracking-wider block mb-0.5">
                          Expedition #{idx + 1}
                        </span>
                        <h3 className="text-sm font-bold leading-tight line-clamp-1">
                          {route.title}
                        </h3>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-3.5 flex flex-col gap-3">
                      <p className="text-[11px] text-[#7A7C99] line-clamp-2 leading-relaxed">
                        {route.description}
                      </p>

                      {/* Official Guide Box */}
                      <div className="p-2.5 rounded-2xl bg-[#F7F8FD] border border-[#EEF0FA] flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img
                            src={route.guideAvatar || '/assets/TianaAvatar.png'}
                            alt={route.guideName || 'Guide'}
                            draggable={false}
                            className="w-9 h-9 rounded-full object-cover ring-2 ring-[#7C82ED] pointer-events-none"
                          />
                          <div>
                            <span className="text-[9px] font-bold text-[#7C82ED] uppercase tracking-wide block">
                              Assigned Guide
                            </span>
                            <h4 className="text-xs font-bold text-[#1E1F3D]">
                              {route.guideName || 'Official Guide'}
                            </h4>
                          </div>
                        </div>

                        <div className="px-2 py-1 rounded-lg bg-white border border-[#EEF0FA] text-[9px] font-bold text-[#7A7C99] flex items-center gap-1">
                          <KeyRound size={11} className="text-[#7C82ED]" />
                          <span>Secret Word</span>
                        </div>
                      </div>

                      {/* Checkpoints Trail Preview */}
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[11px] font-bold text-[#1E1F3D]">
                            Checkpoints &amp; QR Riddles
                          </span>
                          <span className="text-[10px] font-semibold text-[#7C82ED]">
                            {route.checkpoints.length} Points
                          </span>
                        </div>

                        <div className="flex flex-col gap-1">
                          {route.checkpoints.slice(0, 2).map((cp, cpIdx) => (
                            <div
                              key={cp.id}
                              className="flex items-center justify-between p-1.5 px-2 rounded-xl bg-[#FBFBFE] border border-[#F0F2FA] text-[11px]"
                            >
                              <div className="flex items-center gap-1.5 truncate">
                                <span className="w-4 h-4 rounded-full bg-[#EEF0FF] text-[#7C82ED] font-bold text-[9px] flex items-center justify-center shrink-0">
                                  {cpIdx + 1}
                                </span>
                                <span className="font-semibold text-[#1E1F3D] truncate">
                                  {cp.name}
                                </span>
                              </div>
                              <span className="text-[9px] text-[#8E90B0] shrink-0 ml-1">
                                {cp.landmark || 'Landmark'}
                              </span>
                            </div>
                          ))}
                          {route.checkpoints.length > 2 && (
                            <span className="text-[10px] text-[#8E90B0] font-medium text-center mt-0.5">
                              +{route.checkpoints.length - 2} more checkpoints on trail
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom CTA */}
                  <div className="px-3.5 pb-3.5 pt-0">
                    <button
                      onClick={(e) => {
                        if (hasMovedRef.current) {
                          e.stopPropagation();
                          return;
                        }
                        handleStartRoute(route.id);
                      }}
                      className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#7C82ED] to-[#6C5CE7] text-white font-bold text-xs shadow-md shadow-indigo-300/40 hover:opacity-95 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Play size={14} fill="currentColor" />
                      <span>Start Route Now</span>
                    </button>
                    <span className="text-[9px] text-center text-[#8E90B0] block mt-1.5">
                      Background timer activates upon start
                    </span>
                  </div>
                </div>
              ))}

              {/* Trailing spacer so last card doesn't touch screen edge */}
              <div className="w-2 shrink-0" />
            </div>

            {/* Pagination indicator dots below carousel */}
            {unstartedPurchasedRoutes.length > 1 && (
              <div className="flex items-center justify-center gap-1.5 pt-0.5">
                {unstartedPurchasedRoutes.map((_, dotIdx) => (
                  <button
                    key={dotIdx}
                    onClick={() => scrollToCard(dotIdx)}
                    className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                      activeCardIndex === dotIdx
                        ? 'w-6 bg-[#7C82ED]'
                        : 'w-1.5 bg-[#DCE0F9] hover:bg-[#B8BEEB]'
                    }`}
                    aria-label={`Scroll to route ${dotIdx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // ==========================================
  // VIEW B: ACTIVE ROUTE IN PROGRESS (Live Map, Live Companions, Checkpoints, QR Quizzes)
  // ==========================================
  return (
    <div className="relative w-full h-[calc(100vh-10rem)] max-h-[640px] overflow-hidden bg-[#E9EDF6] animate-fadeIn select-none">
      {/* Interactive Stylized Vector SVG Map */}
      <div className="absolute inset-0 select-none pointer-events-none">
        <svg className="w-full h-full" viewBox="0 0 375 600" preserveAspectRatio="xMidYMid slice">
          {/* Background land */}
          <rect width="375" height="600" fill="#E8EDF5" />
          
          {/* River / Water body */}
          <path
            d="M-20,120 Q120,180 200,80 T390,140 L390,0 L-20,0 Z"
            fill="#D5E4F7"
          />
          <path
            d="M320,60 Q340,120 375,180 L375,60 Z"
            fill="#C8DCF5"
          />

          {/* Green Parks */}
          <path
            d="M180,240 Q260,220 280,310 T190,380 Z"
            fill="#D6EBD7"
          />
          <path
            d="M30,350 Q90,340 100,420 T20,440 Z"
            fill="#D6EBD7"
          />

          {/* Road Network */}
          <path
            d="M-10,320 L140,300 L240,410 L385,390"
            stroke="#FFFFFF"
            strokeWidth="14"
            fill="none"
          />
          <path
            d="M140,40 L150,290 L160,580"
            stroke="#FFFFFF"
            strokeWidth="12"
            fill="none"
          />
          <path
            d="M230,120 L240,410 L310,590"
            stroke="#FFFFFF"
            strokeWidth="10"
            fill="none"
          />

          {/* Active Trail Path (Lavender Dashed Line) */}
          <path
            d="M80,420 Q120,330 160,310 T220,190 Q270,140 290,85"
            stroke="#7C82ED"
            strokeWidth="4"
            strokeDasharray="6 4"
            fill="none"
          />
        </svg>
      </div>

      {/* TOP FLOATING HUD BAR: Route Status & Guide Note */}
      <div className="absolute top-3 left-4 right-4 z-20 flex items-center justify-between gap-2 pointer-events-auto">
        <div className="bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-md border border-[#EEF0FA] flex items-center gap-2.5 flex-1 min-w-0">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block">
                In Progress
              </span>
              <span className="text-[9px] text-[#8E90B0] font-medium truncate">
                • Background Timer
              </span>
            </div>
            <h3 className="text-xs font-bold text-[#1E1F3D] truncate leading-tight">
              {activeRoute.title}
            </h3>
          </div>
        </div>

        {/* Cancel / Abandon button */}
        <button
          onClick={() => setIsCancelConfirmOpen(true)}
          className="w-10 h-10 rounded-2xl bg-white/95 backdrop-blur-md shadow-md border border-[#EEF0FA] text-[#8E90B0] hover:text-red-500 flex items-center justify-center transition-colors cursor-pointer shrink-0"
          title="Pause or abandon route"
        >
          <X size={18} />
        </button>
      </div>

      {/* FLOATING MAP CONTROLS (Right side) */}
      <div className="absolute top-16 right-4 flex flex-col gap-2 z-20 pointer-events-auto">
        <button 
          onClick={() => showToast('Compass aligned to North', 'info')}
          aria-label="Compass"
          className="w-9 h-9 rounded-2xl bg-white shadow-md border border-[#EEF0FA] text-[#7C82ED] flex items-center justify-center hover:bg-[#EEF0FF] transition-colors cursor-pointer"
        >
          <Compass size={18} />
        </button>
        <button 
          onClick={() => showToast('GPS location synced in real time', 'success')}
          aria-label="Center Location"
          className="w-9 h-9 rounded-2xl bg-white shadow-md border border-[#EEF0FA] text-[#7C82ED] flex items-center justify-center hover:bg-[#EEF0FF] transition-colors cursor-pointer"
        >
          <LocateFixed size={18} />
        </button>
      </div>

      {/* INTERACTIVE MAP PINS */}
      {/* 1. CURRENT USER PIN (at start of trail) */}
      <div className="absolute top-[420px] left-[80px] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10">
        <div className="px-2 py-0.5 bg-[#1E1F3D] text-white font-bold text-[8px] rounded-full shadow-md mb-1 border border-white/30">
          You (On Route)
        </div>
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-[#7C82ED] ring-4 ring-white shadow-xl flex items-center justify-center">
            <img
              src={currentUser.avatar || '/assets/TianaAvatar.png'}
              alt={currentUser.name}
              className="w-9 h-9 rounded-full object-cover"
            />
          </div>
          <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full ring-2 ring-white animate-pulse" />
        </div>
      </div>

      {/* 2. COMPANIONS ON ROUTE (Interactive Clickable Pins) */}
      {/* Companion 1: Marco Polo (120m) */}
      {companionsOnRoute[0] && (
        <div
          onClick={() => setSelectedExplorer(companionsOnRoute[0])}
          className="absolute top-[310px] left-[160px] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer group z-10 transition-transform active:scale-95"
        >
          <div className="flex items-center gap-1 px-2 py-0.5 bg-white/95 rounded-full shadow-md border border-[#EEF0FA] mb-1 group-hover:scale-105 transition-transform">
            <span className="text-[9px] font-bold text-[#1E1F3D]">
              {companionsOnRoute[0].nickname || companionsOnRoute[0].name.split(' ')[0]}
            </span>
            <span className="text-[8px] font-bold text-[#7C82ED]">120m</span>
          </div>
          <div className="relative">
            <img
              src={companionsOnRoute[0].avatar || '/assets/TianaAvatar.png'}
              alt={companionsOnRoute[0].name}
              className="w-9 h-9 rounded-full object-cover ring-3 ring-[#7C82ED] shadow-md group-hover:ring-4 transition-all"
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white" />
          </div>
        </div>
      )}

      {/* Companion 2: Sofia Ramos (240m) */}
      {companionsOnRoute[1] && (
        <div
          onClick={() => setSelectedExplorer(companionsOnRoute[1])}
          className="absolute top-[190px] left-[220px] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer group z-10 transition-transform active:scale-95"
        >
          <div className="flex items-center gap-1 px-2 py-0.5 bg-white/95 rounded-full shadow-md border border-[#EEF0FA] mb-1 group-hover:scale-105 transition-transform">
            <span className="text-[9px] font-bold text-[#1E1F3D]">
              {companionsOnRoute[1].nickname || companionsOnRoute[1].name.split(' ')[0]}
            </span>
            <span className="text-[8px] font-bold text-[#7C82ED]">240m</span>
          </div>
          <div className="relative">
            <img
              src={companionsOnRoute[1].avatar || '/assets/TianaAvatar.png'}
              alt={companionsOnRoute[1].name}
              className="w-9 h-9 rounded-full object-cover ring-3 ring-[#7C82ED] shadow-md group-hover:ring-4 transition-all"
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white" />
          </div>
        </div>
      )}

      {/* Companion 3: Lucas Silva (380m) */}
      {companionsOnRoute[2] && (
        <div
          onClick={() => setSelectedExplorer(companionsOnRoute[2])}
          className="absolute top-[135px] left-[265px] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer group z-10 transition-transform active:scale-95"
        >
          <div className="flex items-center gap-1 px-2 py-0.5 bg-white/95 rounded-full shadow-md border border-[#EEF0FA] mb-1 group-hover:scale-105 transition-transform">
            <span className="text-[9px] font-bold text-[#1E1F3D]">
              {companionsOnRoute[2].nickname || companionsOnRoute[2].name.split(' ')[0]}
            </span>
            <span className="text-[8px] font-bold text-[#7C82ED]">380m</span>
          </div>
          <div className="relative">
            <img
              src={companionsOnRoute[2].avatar || '/assets/TianaAvatar.png'}
              alt={companionsOnRoute[2].name}
              className="w-9 h-9 rounded-full object-cover ring-3 ring-[#7C82ED] shadow-md group-hover:ring-4 transition-all"
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white" />
          </div>
        </div>
      )}

      {/* 3. CHECKPOINTS ON TRAIL */}
      {/* Checkpoint 1: Active QR Clue */}
      <div 
        onClick={() => setSelectedCheckpoint(activeRoute.checkpoints[0] || null)}
        className="absolute top-[250px] left-[190px] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer group z-10"
      >
        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#6C5CE7] to-[#8D93FF] text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform ring-4 ring-white animate-pulse">
          <QrCode size={16} />
        </div>
        <div className="px-2 py-0.5 bg-white text-[#6C5CE7] font-bold text-[9px] rounded-md shadow-sm mt-1 border border-[#EEF0FA]">
          {activeRoute.checkpoints[0]?.name || 'QR Checkpoint'}
        </div>
      </div>

      {/* Checkpoint 2: Golden Landmark Flag */}
      <div 
        onClick={() => setSelectedCheckpoint(activeRoute.checkpoints[1] || null)}
        className="absolute top-[85px] left-[290px] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer group z-10"
      >
        <div className="px-2 py-0.5 bg-[#FFB800] text-[#1E1F3D] font-bold text-[9px] rounded-md shadow-sm mb-1">
          Final Landmark
        </div>
        <div className="w-8 h-8 rounded-full bg-[#FFB800] text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform ring-4 ring-white">
          <Flag size={15} fill="currentColor" />
        </div>
      </div>

      {/* FLOATING BOTTOM SHEET HUD */}
      <div className="absolute bottom-3 left-4 right-4 z-20 pointer-events-auto">
        <div className="bg-white/95 backdrop-blur-md rounded-3xl p-4 shadow-2xl border border-[#EEF0FA] animate-slideUp">
          <div className="w-10 h-1 bg-[#DCE0F9] rounded-full mx-auto mb-2.5" />
          
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-[#7C82ED] uppercase tracking-wide block">
                Guide: {activeRoute.guideName || 'Diogo Dias'}
              </span>
              <h3 className="text-sm font-bold text-[#1E1F3D] leading-tight">
                {activeRoute.title}
              </h3>
            </div>

            {/* Companions Avatars */}
            <div className="flex items-center">
              <div className="flex -space-x-2 mr-1.5">
                {companionsOnRoute.slice(0, 3).map((e, idx) => (
                  <img
                    key={idx}
                    src={e.avatar || '/assets/TianaAvatar.png'}
                    alt={e.name}
                    className="w-7 h-7 rounded-full ring-2 ring-white object-cover"
                  />
                ))}
              </div>
              <span className="text-[10px] font-bold text-[#7A7C99]">
                +{companionsOnRoute.length} on route
              </span>
            </div>
          </div>

          {/* Checkpoint Progress Indicator */}
          <div className="mt-2.5">
            <div className="flex items-center justify-between text-[10px] font-bold mb-1">
              <span className="text-[#7C82ED]">Checkpoints &amp; QR Riddles</span>
              <span className="text-[#7A7C99]">{activeRoute.checkpoints.length} Points</span>
            </div>
            <div className="w-full h-1.5 bg-[#EEF0FF] rounded-full overflow-hidden">
              <div className="w-1/2 h-full bg-gradient-to-r from-[#7C82ED] to-[#6C5CE7] rounded-full" />
            </div>
          </div>

          {/* PRIMARY ACTION BUTTONS */}
          <div className="grid grid-cols-2 gap-2 mt-3.5">
            {/* 1. Scan QR Clue Button */}
            <button
              onClick={() => setScannerOpen(true)}
              className="h-11 rounded-2xl bg-white border border-[#DCE4F5] hover:bg-[#F4F6FB] text-[#1E1F3D] font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
            >
              <QrCode size={16} className="text-[#7C82ED]" />
              <span>Scan QR Clue</span>
            </button>

            {/* 2. Finalize with Guide Keyword Button */}
            <button
              onClick={() => {
                setKeywordError('');
                setIsKeywordModalOpen(true);
              }}
              className="h-11 rounded-2xl bg-gradient-to-r from-[#7C82ED] to-[#6C5CE7] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-indigo-300/40 active:scale-95 transition-all cursor-pointer"
            >
              <KeyRound size={16} />
              <span>Guide Keyword</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* MODAL 1: CHECKPOINT ENIGMA / QR DETAILS                   */}
      {/* ========================================================= */}
      {selectedCheckpoint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="w-full max-w-sm bg-white rounded-[32px] p-5 shadow-2xl animate-scaleUp flex flex-col gap-3.5 relative">
            <button
              onClick={() => setSelectedCheckpoint(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#F4F6FB] flex items-center justify-center text-[#7A7C99] hover:text-[#1E1F3D] cursor-pointer"
            >
              <X size={16} />
            </button>

            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-[#EEF0FF] text-[#7C82ED] flex items-center justify-center shrink-0">
                <QrCode size={20} />
              </div>
              <div>
                <span className="text-[10px] font-bold text-[#7C82ED] uppercase tracking-wider block">
                  Checkpoint &amp; Riddle
                </span>
                <h3 className="text-sm font-bold text-[#1E1F3D]">
                  {selectedCheckpoint.name}
                </h3>
              </div>
            </div>

            <div className="p-3 bg-[#F7F8FD] rounded-2xl border border-[#EEF0FA] flex flex-col gap-1.5 text-xs">
              <span className="font-bold text-[#1E1F3D]">Landmark:</span>
              <span className="text-[#585A7E]">{selectedCheckpoint.landmark || 'Historic landmark'}</span>
              
              <span className="font-bold text-[#1E1F3D] mt-1">Riddle:</span>
              <p className="text-[#585A7E] italic bg-white p-2 rounded-xl border border-[#EEF0FA]">
                "{selectedCheckpoint.riddle || 'Locate the bronze coat of arms plaque and scan the QR code to claim 100 PTS.'}"
              </p>
            </div>

            <button
              onClick={() => {
                setSelectedCheckpoint(null);
                setScannerOpen(true);
              }}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#7C82ED] to-[#6C5CE7] text-white font-bold text-xs shadow-md shadow-indigo-300/40 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <QrCode size={16} />
              <span>Open Riddle QR Scanner</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: GUIDE KEYWORD COMPLETION (Official Certification) */}
      {/* ========================================================= */}
      {isKeywordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="w-full max-w-sm bg-white rounded-[32px] p-5 shadow-2xl animate-scaleUp flex flex-col gap-4 relative">
            <button
              onClick={() => setIsKeywordModalOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#F4F6FB] flex items-center justify-center text-[#7A7C99] hover:text-[#1E1F3D] cursor-pointer"
            >
              <X size={16} />
            </button>

            {/* Guide Header Info */}
            <div className="flex items-center gap-3">
              <img
                src={activeRoute.guideAvatar || '/assets/TianaAvatar.png'}
                alt={activeRoute.guideName || 'Guide'}
                className="w-12 h-12 rounded-full object-cover ring-3 ring-[#7C82ED]"
              />
              <div>
                <span className="text-[10px] font-bold text-[#7C82ED] uppercase tracking-wider block">
                  Official Guide Certification
                </span>
                <h3 className="text-sm font-bold text-[#1E1F3D]">
                  {activeRoute.guideName || 'Expedition Guide'}
                </h3>
                <span className="text-[11px] text-[#7A7C99]">
                  {activeRoute.city}, {activeRoute.country}
                </span>
              </div>
            </div>

            <p className="text-xs text-[#585A7E] leading-relaxed">
              Your official tour guide will provide the secret keyword when concluding the route. Enter it here to stop the internal timer and certify your expedition into Travels.
            </p>

            {/* Keyword Input Form */}
            <form onSubmit={handleSubmitKeyword} className="flex flex-col gap-3">
              <div>
                <label className="text-xs font-bold text-[#1E1F3D] block mb-1.5">
                  Secret Keyword:
                </label>
                <input
                  type="text"
                  value={keywordInput}
                  onChange={(e) => {
                    setKeywordInput(e.target.value.toUpperCase());
                    setKeywordError('');
                  }}
                  placeholder={`EX: ${activeRoute.guideKeyword || 'CITADEL'}`}
                  className="w-full p-3 rounded-xl border border-[#DCE4F5] bg-[#F7F8FD] text-sm font-bold text-[#1E1F3D] tracking-wider uppercase focus:outline-none focus:border-[#7C82ED] text-center"
                  autoFocus
                />
                {keywordError && (
                  <p className="text-[11px] text-red-500 font-semibold mt-1 flex items-center gap-1">
                    <AlertCircle size={12} />
                    {keywordError}
                  </p>
                )}
              </div>

              {/* Helpful Guide Testing Hint */}
              <div 
                onClick={() => setKeywordInput(activeRoute.guideKeyword || 'CITADEL')}
                className="p-2.5 bg-[#EEF0FF] rounded-xl border border-[#D6DCFA] text-[11px] text-[#6C7BFF] font-medium flex items-center justify-between cursor-pointer hover:bg-[#E3E8FE] transition-colors"
                title="Tap to autofill the guide's keyword for testing"
              >
                <div className="flex items-center gap-1.5">
                  <HelpCircle size={14} />
                  <span>Guide Hint: <strong>"{activeRoute.guideKeyword || 'CITADEL'}"</strong></span>
                </div>
                <span className="text-[10px] font-bold underline">Use</span>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#7C82ED] to-[#6C5CE7] text-white font-bold text-xs shadow-md shadow-indigo-300/40 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer mt-1"
              >
                <CheckCircle2 size={16} />
                <span>Certify &amp; Complete Route</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 3: CANCEL / ABANDON CONFIRMATION                    */}
      {/* ========================================================= */}
      {isCancelConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="w-full max-w-xs bg-white rounded-[28px] p-5 shadow-2xl animate-scaleUp flex flex-col items-center text-center gap-3">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center">
              <RotateCcw size={22} />
            </div>

            <h3 className="text-sm font-bold text-[#1E1F3D]">
              Pause or Abandon Route?
            </h3>
            <p className="text-xs text-[#7A7C99] leading-relaxed">
              You can restart this expedition at any time from this Maps tab.
            </p>

            <div className="flex flex-col gap-2 w-full mt-1">
              <button
                onClick={() => {
                  cancelActiveRoute();
                  setIsCancelConfirmOpen(false);
                  showToast('Route paused. You can resume anytime.', 'info');
                }}
                className="w-full py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-xs transition-colors cursor-pointer"
              >
                Yes, Abandon Route
              </button>
              <button
                onClick={() => setIsCancelConfirmOpen(false)}
                className="w-full py-2 rounded-xl bg-[#F4F6FB] text-[#7A7C99] hover:text-[#1E1F3D] font-bold text-xs transition-colors cursor-pointer"
              >
                Continue Expedition
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
