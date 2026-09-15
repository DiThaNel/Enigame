'use client';

import React, { useState, useRef } from 'react';
import { Route, DIFFICULTY_LABELS } from '@/types';
import { Star, ChevronLeft, ChevronRight, Layers, Sparkles, Clock } from 'lucide-react';

interface CardShuffleRoutesProps {
  routes: Route[];
  onSelectRoute: (route: Route) => void;
  ctaText?: string;
  badgeText?: string;
  showCategoryTabs?: boolean;
}

export const CardShuffleRoutes: React.FC<CardShuffleRoutesProps> = ({
  routes,
  onSelectRoute,
  ctaText = 'View Route Details',
  badgeText,
  showCategoryTabs = false,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'tech' | 'tech-explorer' | 'explorer'>('all');
  const [shuffleDirection, setShuffleDirection] = useState<'left' | 'right' | null>(null);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef(0);

  // Filter routes if category tabs are active
  const filteredRoutes = routes.filter((r) => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'tech') return r.category === 'experiences';
    if (selectedCategory === 'tech-explorer') return r.category === 'adventure';
    return r.category === 'tour';
  });

  const currentList = filteredRoutes.length > 0 ? filteredRoutes : routes;
  const count = currentList.length;
  const currentRoute = currentList[activeIndex % count];

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

  const handleShuffle = () => {
    handleNext();
  };

  // Touch and mouse drag handlers for card swipe
  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    startXRef.current = clientX;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const delta = clientX - startXRef.current;
    // Limit drag to reasonable distance
    setDragOffset(Math.max(-160, Math.min(160, delta)));
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    if (dragOffset > 70) {
      // Swiped right
      setDragOffset(0);
      handleNext();
    } else if (dragOffset < -70) {
      // Swiped left
      setDragOffset(0);
      handlePrev();
    } else {
      // Snap back
      setDragOffset(0);
    }
  };

  return (
    <div className="w-full flex flex-col items-center select-none">
      {/* Category Tabs (if enabled) */}
      {showCategoryTabs && (
        <div className="w-full flex items-center justify-around border-b border-[#EEF0FA] pb-3 mb-5 px-3">
          {(
            [
              { id: 'tech', label: 'Tech Route' },
              { id: 'tech-explorer', label: 'Tech/Explorer' },
              { id: 'explorer', label: 'Explorer' },
            ] as const
          ).map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                setActiveIndex(0);
              }}
              className={"text-xs font-extrabold transition-all relative pb-1 cursor-pointer " + (
                selectedCategory === cat.id
                  ? "text-[#6979F8] border-b-2 border-[#6979F8]"
                  : "text-[#A5A7C4] hover:text-[#585A7E]"
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>
      )}

      {/* 3D Card Stack Container */}
      <div
        className="relative w-full max-w-[330px] h-[410px] flex items-center justify-center pt-8"
        onMouseDown={handleTouchStart}
        onMouseMove={handleTouchMove}
        onMouseUp={handleTouchEnd}
        onMouseLeave={handleTouchEnd}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Render 3 cards in the deck */}
        {[2, 1, 0].map((stackPosition) => {
          const routeIndex = (activeIndex + stackPosition) % count;
          const route = currentList[routeIndex];
          if (!route) return null;

          const isFront = stackPosition === 0;
          const isSecond = stackPosition === 1;
          const isThird = stackPosition === 2;

          let transform = '';
          let zIndex = 10;
          let opacity = 0.65;
          let transition = isDragging && isFront ? 'none' : 'all 350ms cubic-bezier(0.34, 1.56, 0.64, 1)';

          if (isFront) {
            zIndex = 30;
            opacity = 1;
            if (shuffleDirection === 'right') {
              transform = 'translateX(130%) rotate(20deg) scale(0.9)';
              opacity = 0;
            } else if (shuffleDirection === 'left') {
              transform = 'translateX(-130%) rotate(-20deg) scale(0.9)';
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
              transform = 'translateY(-18px) rotate(3deg) scale(0.94)';
            }
          } else if (isThird) {
            zIndex = 10;
            opacity = 0.68;
            if (shuffleDirection) {
              transform = 'translateY(-18px) rotate(3deg) scale(0.94)';
              opacity = 0.88;
            } else {
              transform = 'translateY(-34px) rotate(-3deg) scale(0.88)';
            }
          }

          return (
            <div
              key={`${route.id}-${stackPosition}`}
              style={{
                transform,
                zIndex,
                opacity,
                transition,
              }}
              onClick={() => {
                if (isFront && !isDragging && Math.abs(dragOffset) < 5) {
                  onSelectRoute(route);
                }
              }}
              className="absolute inset-x-0 bottom-0 top-6 rounded-[34px] overflow-hidden shadow-[0_22px_50px_rgba(30,31,61,0.28)] bg-[#1E1F3D] cursor-pointer border border-white/20 flex flex-col justify-between"
            >
              {/* Cover Image Background */}
              <div className="absolute inset-0 z-0 overflow-hidden">
                <img
                  src={
                    routeIndex % 3 === 0
                      ? '/assets/BragancaHome.png'
                      : routeIndex % 3 === 1
                      ? '/assets/HomeImage.png'
                      : '/assets/ExperiencesCarousel.png'
                  }
                  alt={route.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />
              </div>

              {/* Top Banner Text or Badge */}
              <div className="relative z-10 p-5 pt-6 flex items-start justify-between">
                <div className="flex flex-col">
                  {badgeText ? (
                    <span className="text-white text-base font-bold drop-shadow-md leading-tight">
                      {badgeText}
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full bg-white/25 backdrop-blur-md text-white text-[11px] font-bold tracking-wide uppercase shadow-sm">
                      {route.category}
                    </span>
                  )}
                </div>

                <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-sm">
                  <img src="/assets/RouteNameBadge.png" alt="Badge" className="w-5 h-5 object-contain" />
                </div>
              </div>

              {/* Middle Title */}
              <div className="relative z-10 px-5 text-left">
                <h3 className="text-white text-lg sm:text-xl font-black leading-tight drop-shadow-md">
                  {route.title}
                </h3>
                <p className="text-xs text-white/80 line-clamp-2 mt-1.5 font-medium leading-relaxed">
                  {route.description}
                </p>
              </div>

              {/* Bottom Details & CTA Bar */}
              <div className="relative z-10 p-5 pt-2 flex flex-col gap-3">
                {/* Metric Indicators */}
                <div className="flex items-center justify-between text-xs text-white/90">
                  <div className="flex items-center gap-1.5">
                    <span className="text-white/80 text-[11px] font-bold uppercase">
                      {DIFFICULTY_LABELS[route.difficulty]}:
                    </span>
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
                  </div>

                  <div className="flex items-center gap-2 font-bold text-white/95 text-[11px]">
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: route.culture }).map((_, cIdx) => (
                        <img
                          key={cIdx}
                          src="/assets/CultureSingle.png"
                          alt="Culture"
                          className="w-3 h-3 object-contain"
                        />
                      ))}
                    </div>
                    <span>•</span>
                    <span>{route.price}€</span>
                    <span>•</span>
                    <span>{route.durationMinutes} min</span>
                  </div>
                </div>

                {/* Primary Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectRoute(route);
                  }}
                  className="w-full h-12 rounded-full bg-[#8E97FD] hover:bg-[#7C82ED] text-white font-bold text-xs tracking-wider uppercase shadow-lg shadow-indigo-400/40 transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>{ctaText}</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Shuffle Controls & Pagination Dots */}
      <div className="w-full max-w-[320px] mt-6 flex items-center justify-between px-4">
        <button
          onClick={handlePrev}
          className="w-9 h-9 rounded-full bg-white text-[#3F414E] shadow-md hover:bg-neutral-50 flex items-center justify-center active:scale-95 transition-all cursor-pointer"
          aria-label="Previous card"
        >
          <ChevronLeft size={18} />
        </button>

        {/* Shuffle Button with animated icon */}
        <button
          onClick={handleShuffle}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/90 hover:bg-white text-[#6979F8] font-bold text-xs shadow-md border border-[#EBEFFE] active:scale-95 transition-all cursor-pointer"
          title="Shuffle Cards Deck"
        >
          <Layers size={15} />
          <span>Shuffle</span>
          <Sparkles size={13} className="text-amber-400" />
        </button>

        <button
          onClick={handleNext}
          className="w-9 h-9 rounded-full bg-white text-[#3F414E] shadow-md hover:bg-neutral-50 flex items-center justify-center active:scale-95 transition-all cursor-pointer"
          aria-label="Next card"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Pagination indicators */}
      <div className="flex items-center gap-1.5 mt-3">
        {currentList.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIndex(idx)}
            className={"h-1.5 rounded-full transition-all cursor-pointer " + (
              activeIndex % count === idx ? "w-6 bg-[#6979F8]" : "w-2 bg-[#A5A7C4]/40"
            )}
            aria-label={`Go to card ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
