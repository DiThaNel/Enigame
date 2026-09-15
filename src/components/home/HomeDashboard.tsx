'use client';

import React, { useState, useRef } from 'react';
import { useEnigameStore } from '@/store/useEnigameStore';

export const HomeDashboard: React.FC = () => {
  const { setActiveTab, setMeetupSubTab, setScannerOpen, routes, viewRouteDetail, setRoutesViewStep } = useEnigameStore();

  const [activeIndex, setActiveIndex] = useState(0);
  const [shuffleDirection, setShuffleDirection] = useState<'left' | 'right' | null>(null);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef(0);

  const featuredRoutes = routes.slice(0, 4);
  const count = featuredRoutes.length || 1;
  const currentRoute = featuredRoutes[activeIndex % count] || routes[0];

  const handleNext = () => {
    if (shuffleDirection) return;
    setShuffleDirection('right');
    setTimeout(() => {
      setActiveIndex((prev) => (prev + 1) % count);
      setShuffleDirection(null);
    }, 320);
  };

  const handlePrev = () => {
    if (shuffleDirection) return;
    setShuffleDirection('left');
    setTimeout(() => {
      setActiveIndex((prev) => (prev - 1 + count) % count);
      setShuffleDirection(null);
    }, 320);
  };

  const handleDiscover = () => {
    viewRouteDetail(currentRoute, 'home');
  };

  // Drag / Swipe gesture handlers
  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    startXRef.current = clientX;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const delta = clientX - startXRef.current;
    setDragOffset(Math.max(-150, Math.min(150, delta)));
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    if (dragOffset > 55) {
      setDragOffset(0);
      handleNext();
    } else if (dragOffset < -55) {
      setDragOffset(0);
      handlePrev();
    } else {
      setDragOffset(0);
    }
  };

  return (
    <div
      className="w-full flex flex-col pb-6 bg-[#EEF0FA] relative overflow-x-hidden select-none"
      style={{
        backgroundImage: 'url(/assets/Lenguaje.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'top center',
      }}
    >
      {/* Top Search & Actions Section - Compact Spacing */}
      <div className="w-full pt-3 px-4 pb-1 z-20">
        <div className="bg-white/95 backdrop-blur-md rounded-[24px] p-3 shadow-[0_8px_25px_rgba(142,151,253,0.12)] border border-[#EAEFFE]">
          {/* Search Input Bar with Search.png from assets */}
          <div className="relative w-full">
            <input
              type="text"
              placeholder="What are you looking for?"
              className="w-full h-10 pl-10 pr-3 rounded-xl border border-[#D5D8FC] text-xs font-medium text-[#1E1F3D] placeholder-[#989EEC] focus:outline-none focus:border-[#8E97FD] bg-[#F7F8FE]"
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center pointer-events-none">
              <img src="/assets/Search.png" alt="Search" className="w-3.5 h-3.5 object-contain" />
            </div>
          </div>

          {/* 4 Circular Action Buttons: Map, Routes, QR Code, Users */}
          <div className="grid grid-cols-4 gap-2 mt-2.5 text-center">
            <button
              aria-label="Map"
              onClick={() => {
                setActiveTab('meetup');
                setMeetupSubTab('map');
              }}
              className="flex flex-col items-center gap-1 group active:scale-95 transition-transform cursor-pointer"
            >
              <div className="w-11 h-11 rounded-full bg-[#8E97FD] flex items-center justify-center text-white shadow-sm shadow-indigo-300/30 group-hover:bg-[#7C82ED] transition-colors">
                <img src="/assets/HomeSearchbar.png" alt="" className="w-6 h-6 object-contain brightness-0 invert" />
              </div>
              <span className="text-[10px] font-bold text-[#8E97FD]">Map</span>
            </button>

            <button
              aria-label="Routes"
              onClick={() => {
                setRoutesViewStep('select-city');
                setActiveTab('routes');
              }}
              className="flex flex-col items-center gap-1 group active:scale-95 transition-transform cursor-pointer"
            >
              <div className="w-11 h-11 rounded-full bg-[#8E97FD] flex items-center justify-center text-white shadow-sm shadow-indigo-300/30 group-hover:bg-[#7C82ED] transition-colors">
                <img src="/assets/RouteSearchbar.png" alt="" className="w-6 h-6 object-contain brightness-0 invert" />
              </div>
              <span className="text-[10px] font-bold text-[#8E97FD]">Routes</span>
            </button>

            <button
              aria-label="QR Code"
              onClick={() => setScannerOpen(true)}
              className="flex flex-col items-center gap-1 group active:scale-95 transition-transform cursor-pointer"
            >
              <div className="w-11 h-11 rounded-full bg-[#8E97FD] flex items-center justify-center text-white shadow-sm shadow-indigo-300/30 group-hover:bg-[#7C82ED] transition-colors">
                <img src="/assets/QRCodeSearchBar.png" alt="" className="w-6 h-6 object-contain brightness-0 invert" />
              </div>
              <span className="text-[10px] font-bold text-[#8E97FD]">QR Code</span>
            </button>

            <button
              aria-label="Users"
              onClick={() => {
                setActiveTab('meetup');
                setMeetupSubTab('explorers');
              }}
              className="flex flex-col items-center gap-1 group active:scale-95 transition-transform cursor-pointer"
            >
              <div className="w-11 h-11 rounded-full bg-[#8E97FD] flex items-center justify-center text-white shadow-sm shadow-indigo-300/30 group-hover:bg-[#7C82ED] transition-colors">
                <img src="/assets/UserSearchBar.png" alt="" className="w-6 h-6 object-contain brightness-0 invert" />
              </div>
              <span className="text-[10px] font-bold text-[#8E97FD]">Users</span>
            </button>
          </div>
        </div>
      </div>

      {/* Carousel Section: Compact spacing */}
      <div className="w-full px-4 pt-1 pb-2 flex flex-col items-center justify-center">

        {/* 3D Card Shuffle Deck Container */}
        <div
          className="relative w-full max-w-[315px] h-[500px] mt-4 flex items-center justify-center cursor-grab active:cursor-grabbing"
          onMouseDown={handleTouchStart}
          onMouseMove={handleTouchMove}
          onMouseUp={handleTouchEnd}
          onMouseLeave={handleTouchEnd}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Stack of 3 cards */}
          {[2, 1, 0].map((stackPosition) => {
            const routeIdx = (activeIndex + stackPosition) % count;
            const r = featuredRoutes[routeIdx];
            if (!r) return null;

            const isFront = stackPosition === 0;
            const isSecond = stackPosition === 1;
            const isThird = stackPosition === 2;

            let transform = '';
            let zIndex = 10;
            let opacity = 0.7;
            let transition = isDragging && isFront ? 'none' : 'all 380ms cubic-bezier(0.22, 1, 0.36, 1)';

            if (isFront) {
              zIndex = 30;
              opacity = 1;
              if (shuffleDirection === 'right') {
                transform = 'translateX(130%) rotate(18deg) scale(0.9)';
                opacity = 0;
              } else if (shuffleDirection === 'left') {
                transform = 'translateX(-130%) rotate(-18deg) scale(0.9)';
                opacity = 0;
              } else if (isDragging) {
                const rotate = dragOffset * 0.08;
                transform = `translateX(${dragOffset}px) rotate(${rotate}deg)`;
              } else {
                transform = 'translateY(0px) rotate(0deg) scale(1)';
              }
            } else if (isSecond) {
              zIndex = 20;
              opacity = 0.88;
              if (shuffleDirection) {
                transform = 'translateY(0px) rotate(0deg) scale(1)';
                opacity = 1;
              } else {
                transform = 'translateY(-14px) rotate(2.5deg) scale(0.95)';
              }
            } else if (isThird) {
              zIndex = 10;
              opacity = 0.7;
              if (shuffleDirection) {
                transform = 'translateY(-14px) rotate(2.5deg) scale(0.95)';
                opacity = 0.88;
              } else {
                transform = 'translateY(-26px) rotate(-2.5deg) scale(0.90)';
              }
            }

            return (
              <div
                key={`${r.id}-${stackPosition}`}
                style={{ transform, zIndex, opacity, transition }}
                onClick={() => {
                  if (isFront && !isDragging && Math.abs(dragOffset) < 5) {
                    handleDiscover();
                  }
                }}
                className="absolute inset-0 rounded-[30px] overflow-hidden shadow-[0_18px_40px_rgba(30,31,61,0.25)] bg-[#1E1F3D] cursor-pointer border border-white/20 flex flex-col justify-between select-none"
              >
                {/* Castle Photo Background */}
                <div className="absolute inset-0 z-0">
                  <img
                    src={
                      routeIdx % 3 === 0
                        ? '/assets/BragancaHome.png'
                        : routeIdx % 3 === 1
                        ? '/assets/HomeImage.png'
                        : '/assets/ExperiencesCarousel.png'
                    }
                    alt={r.title}
                    className="w-full h-full object-cover pointer-events-none"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/25" />
                </div>

                {/* Top Card Text: Browse our routes with promotions. */}
                <div className="relative z-10 p-5 pt-5 text-center">
                  <h2 className="text-lg sm:text-xl font-bold text-white tracking-wide leading-snug drop-shadow-md">
                    Browse our routes
                    <br />
                    with promotions.
                  </h2>
                </div>

                {/* Bottom Details: Pagination Dots, Route Title and Discover! Button */}
                <div className="relative z-10 p-4 pb-5 flex flex-col items-center gap-2.5">
                  {/* Pagination Dots placed INSIDE the card, ABOVE the route title and button */}
                  <div className="flex items-center gap-2 mb-0.5 z-20">
                    {featuredRoutes.map((_, dotIdx) => {
                      const isActive = activeIndex % count === dotIdx;
                      return (
                        <button
                          key={dotIdx}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (dotIdx !== activeIndex % count) {
                              setShuffleDirection(dotIdx > activeIndex % count ? 'right' : 'left');
                              setTimeout(() => {
                                setActiveIndex(dotIdx);
                                setShuffleDirection(null);
                              }, 280);
                            }
                          }}
                          className={
                            'h-2 rounded-full transition-all duration-300 cursor-pointer ' +
                            (isActive ? 'w-6 bg-[#8E97FD] shadow-sm' : 'w-2 bg-white/40 hover:bg-white/70')
                          }
                          aria-label={`Go to slide ${dotIdx + 1}`}
                        />
                      );
                    })}
                  </div>

                  {/* Route Title Badge */}
                  <div className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-[11px] font-semibold shadow-sm text-center max-w-[220px] truncate">
                    {r.title}
                  </div>

                  {/* Discover! Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDiscover();
                    }}
                    className="w-full max-w-[220px] h-11 py-2.5 px-6 rounded-full bg-[#8E97FD] hover:bg-[#7C82ED] text-white font-semibold text-sm tracking-wider shadow-md shadow-indigo-400/30 transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center mt-0.5"
                  >
                    Discover!
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
