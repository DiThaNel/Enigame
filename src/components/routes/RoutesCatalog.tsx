'use client';

import React, { useState, useRef } from 'react';
import { useEnigameStore } from '@/store/useEnigameStore';
import { RouteMapPreview } from './RouteMapPreview';
import { ChevronLeft, ChevronRight, Star, Info, Check, Clock } from 'lucide-react';
import { DIFFICULTY_LABELS, RouteDifficulty } from '@/types';

export const formatRouteDuration = (minutes: number): string => {
  if (minutes === 60) return '1 Hour';
  if (minutes % 60 === 0) return `${minutes / 60} Hours`;
  if (minutes > 60) {
    const hours = Math.floor(minutes / 60);
    const rem = minutes % 60;
    return rem > 0 ? `${hours}h ${rem}m` : `${hours} Hours`;
  }
  return `${minutes} min`;
};

const DIFFICULTY_OPTIONS: Array<{ key: 'All' | RouteDifficulty; label: string; stars?: number }> = [
  { key: 'All', label: 'All' },
  { key: 1, label: 'Easy', stars: 1 },
  { key: 2, label: 'Medium', stars: 2 },
  { key: 3, label: 'Hard', stars: 3 },
  { key: 4, label: 'Explorer', stars: 4 },
];

export const RoutesCatalog: React.FC = () => {
  const {
    routesViewStep,
    setRoutesViewStep,
    selectedCity,
    setSelectedCity,
    selectedRoute,
    routesReturnTab,
    viewRouteDetail,
    setActiveTab,
    setActiveRouteId,
    setScannerOpen,
    routes,
    routesSearchQuery,
    setRoutesSearchQuery,
  } = useEnigameStore();

  // Cities List for the Frame 07 Carousel with dynamic routeCount
  const baseCities = [
    {
      name: 'Bragança, Portugal',
      cityKey: 'Bragança',
      image: '/assets/RoutesImageCarousel.png',
    },
    {
      name: 'Porto, Portugal',
      cityKey: 'Porto',
      image: '/assets/HomeImage.png',
    },
    {
      name: 'Lisboa, Portugal',
      cityKey: 'Lisboa',
      image: '/assets/ExperiencesCarousel.png',
    },
    {
      name: 'Coimbra, Portugal',
      cityKey: 'Coimbra',
      image: '/assets/BragancaHome.png',
    },
    {
      name: 'Sintra, Portugal',
      cityKey: 'Sintra',
      image: '/assets/HomeImage.png',
    },
  ];

  const cities = baseCities.map(c => ({
    ...c,
    routeCount: routes.filter(r => r.city.toLowerCase().includes(c.cityKey.toLowerCase())).length || 1,
  }));

  // City Carousel State (Same card shuffle physics as Home)
  const [activeCityIndex, setActiveCityIndex] = useState(0);
  const [cityShuffleDir, setCityShuffleDir] = useState<'left' | 'right' | null>(null);
  const [cityDragOffset, setCityDragOffset] = useState(0);
  const [isCityDragging, setIsCityDragging] = useState(false);
  const startXRef = useRef(0);

  const [selectedDifficulty, setSelectedDifficulty] = useState<'All' | RouteDifficulty>('All');
  const [giftCode, setGiftCode] = useState('');
  const [isGiftChecked, setIsGiftChecked] = useState(true);

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

  const cityCount = cities.length;
  const currentCity = cities[activeCityIndex % cityCount] || cities[0];

  const handleNextCity = () => {
    if (cityShuffleDir) return;
    setCityShuffleDir('right');
    setTimeout(() => {
      setActiveCityIndex((prev) => (prev + 1) % cityCount);
      setCityShuffleDir(null);
    }, 320);
  };

  const handlePrevCity = () => {
    if (cityShuffleDir) return;
    setCityShuffleDir('left');
    setTimeout(() => {
      setActiveCityIndex((prev) => (prev - 1 + cityCount) % cityCount);
      setCityShuffleDir(null);
    }, 320);
  };

  const handleSelectCity = (cityKey: string) => {
    setSelectedCity(cityKey);
    setRoutesViewStep('city-routes');
  };

  // Drag / Swipe handlers for City Carousel
  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    startXRef.current = clientX;
    setIsCityDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isCityDragging) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const delta = clientX - startXRef.current;
    setCityDragOffset(Math.max(-150, Math.min(150, delta)));
  };

  const handleTouchEnd = () => {
    if (!isCityDragging) return;
    setIsCityDragging(false);

    if (cityDragOffset > 55) {
      setCityDragOffset(0);
      handleNextCity();
    } else if (cityDragOffset < -55) {
      setCityDragOffset(0);
      handlePrevCity();
    } else {
      setCityDragOffset(0);
    }
  };

  // ==========================================
  // STEP 1: 07 - Routes (Select City)
  // Exactly matching Figma frame 07 with the same card shuffle carousel of CITIES
  // ==========================================
  if (routesViewStep === 'select-city') {
    return (
      <div
        className="w-full min-h-[calc(100vh-140px)] bg-[#EEF0FA] flex flex-col items-center justify-center px-4 relative overflow-hidden select-none animate-route-enter"
        style={{
          backgroundImage: 'url(/assets/Lenguaje.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* 3D Card Shuffle Deck Container for Cities */}
        <div
          className="relative w-full max-w-[315px] h-[600px] mt-4 flex items-center justify-center cursor-grab active:cursor-grabbing"
          onMouseDown={handleTouchStart}
          onMouseMove={handleTouchMove}
          onMouseUp={handleTouchEnd}
          onMouseLeave={handleTouchEnd}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {[2, 1, 0].map((stackPosition) => {
            const cityIdx = (activeCityIndex + stackPosition) % cityCount;
            const city = cities[cityIdx];
            if (!city) return null;

            const isFront = stackPosition === 0;
            const isSecond = stackPosition === 1;
            const isThird = stackPosition === 2;

            let transform = '';
            let zIndex = 10;
            let opacity = 0.7;
            let transition = isCityDragging && isFront ? 'none' : 'all 380ms cubic-bezier(0.22, 1, 0.36, 1)';

            if (isFront) {
              zIndex = 30;
              opacity = 1;
              if (cityShuffleDir === 'right') {
                transform = 'translateX(130%) rotate(18deg) scale(0.9)';
                opacity = 0;
              } else if (cityShuffleDir === 'left') {
                transform = 'translateX(-130%) rotate(-18deg) scale(0.9)';
                opacity = 0;
              } else if (isCityDragging) {
                const rotate = cityDragOffset * 0.08;
                transform = `translateX(${cityDragOffset}px) rotate(${rotate}deg)`;
              } else {
                transform = 'translateY(0px) rotate(0deg) scale(1)';
              }
            } else if (isSecond) {
              zIndex = 20;
              opacity = 0.88;
              if (cityShuffleDir) {
                transform = 'translateY(0px) rotate(0deg) scale(1)';
                opacity = 1;
              } else {
                transform = 'translateY(-14px) rotate(2.5deg) scale(0.95)';
              }
            } else if (isThird) {
              zIndex = 10;
              opacity = 0.7;
              if (cityShuffleDir) {
                transform = 'translateY(-14px) rotate(2.5deg) scale(0.95)';
                opacity = 0.88;
              } else {
                transform = 'translateY(-26px) rotate(-2.5deg) scale(0.90)';
              }
            }

            return (
              <div
                key={`${city.cityKey}-${stackPosition}`}
                style={{ transform, zIndex, opacity, transition }}
                onClick={() => {
                  if (isFront && !isCityDragging && Math.abs(cityDragOffset) < 5) {
                    handleSelectCity(city.cityKey);
                  }
                }}
                className="absolute inset-0 rounded-[34px] overflow-hidden shadow-[0_20px_45px_rgba(30,31,61,0.28)] bg-[#1E1F3D] cursor-pointer border border-white/20 flex flex-col justify-between select-none"
              >
                {/* Background City Photograph */}
                <div className="absolute inset-0 z-0">
                  <img
                    src={city.image}
                    alt={city.name}
                    className="w-full h-full object-cover pointer-events-none"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/25" />
                </div>

                {/* City Name at Center / Top */}
                <div className="relative z-10 p-6 pt-9 text-center">
                  <h2 className="text-2xl sm:text-3xl font-black text-white tracking-wide leading-tight drop-shadow-md">
                    {city.name}
                  </h2>
                  <p className="text-white/80 text-xs font-semibold mt-1.5 tracking-wider uppercase">
                    {city.routeCount} Available Routes
                  </p>
                </div>

                {/* Select City Button and Dots at Bottom */}
                <div className="relative z-10 p-6 pb-7 flex flex-col items-center gap-3">
                  {/* Pagination Dots placed INSIDE the card, ABOVE the select city button */}
                  <div className="flex items-center gap-2 mb-0.5 z-20">
                    {cities.map((_, dotIdx) => {
                      const isActive = activeCityIndex % cityCount === dotIdx;
                      return (
                        <button
                          key={dotIdx}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (dotIdx !== activeCityIndex % cityCount) {
                              setCityShuffleDir(dotIdx > activeCityIndex % cityCount ? 'right' : 'left');
                              setTimeout(() => {
                                setActiveCityIndex(dotIdx);
                                setCityShuffleDir(null);
                              }, 280);
                            }
                          }}
                          className={
                            'h-2 rounded-full transition-all duration-300 cursor-pointer ' +
                            (isActive ? 'w-6 bg-[#8E97FD] shadow-sm' : 'w-2 bg-white/40 hover:bg-white/70')
                          }
                          aria-label={`Select city ${dotIdx + 1}`}
                        />
                      );
                    })}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectCity(city.cityKey);
                    }}
                    className="w-full max-w-[230px] h-12 py-3 px-6 rounded-full bg-[#8E97FD] hover:bg-[#7C82ED] text-white font-bold text-sm tracking-wider shadow-lg shadow-indigo-400/30 transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center"
                  >
                    Select City
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ==========================================
  // STEP 2: 07.2 - Routes (City Selected)
  // Top image with circular bottom curve & category tabs removed
  // ==========================================
  if (routesViewStep === 'city-routes') {
    const cityRoutes = routes.filter((rt) => {
      const matchesCity =
        rt.city.toLowerCase().includes(selectedCity.toLowerCase()) ||
        selectedCity.toLowerCase().includes(rt.city.toLowerCase());
      if (!matchesCity) return false;
      if (!routesSearchQuery.trim()) return true;
      const q = routesSearchQuery.toLowerCase().trim();
      return (
        rt.title.toLowerCase().includes(q) ||
        (rt.description && rt.description.toLowerCase().includes(q))
      );
    });
    const baseRoutes = cityRoutes.length > 0 ? cityRoutes : routes;

    const filteredRoutes = baseRoutes.filter((rt) => {
      if (selectedDifficulty === 'All') return true;
      return rt.difficulty === selectedDifficulty;
    });

    return (
      <div className="w-full min-h-screen pb-24 bg-[#EEF0FA] flex flex-col relative overflow-y-auto no-scrollbar animate-route-enter">
        {/* Top Cover Banner with City Photo & Circular Bottom Radius */}
        <div className="relative h-64 w-full overflow-hidden shrink-0 bg-[#1E1F3D] rounded-b-[44px] shadow-md z-10">
          <img
            src={
              selectedCity.includes('Porto')
                ? '/assets/HomeImage.png'
                : selectedCity.includes('Lisboa')
                ? '/assets/ExperiencesCarousel.png'
                : '/assets/BragancaHome.png'
            }
            alt={selectedCity}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/40" />

          {/* Top Header with Back < and City Badge */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20">
            <button
              onClick={() => setRoutesViewStep('select-city')}
              className="w-9 h-9 rounded-full bg-white/80 backdrop-blur-md text-[#1E1F3D] flex items-center justify-center hover:bg-white transition-all shadow-sm cursor-pointer active:scale-95"
              aria-label="Back to Select City"
            >
              <ChevronLeft size={22} />
            </button>

            <span className="px-3.5 py-1 rounded-full bg-black/40 backdrop-blur-md text-white text-xs font-semibold">
              {selectedCity}
            </span>
          </div>

          {/* City Headline in Banner */}
          <div className="absolute bottom-5 left-6 right-6 z-10">
            <h2 className="text-white text-xl sm:text-2xl font-black drop-shadow-md">
              {selectedCity}
            </h2>
            <p className="text-white/80 text-xs font-medium mt-0.5">
              Select an adventure to begin exploring
            </p>
          </div>
        </div>

        {/* Vertical Feed of Route Cards directly below the circular banner with Difficulty Filter */}
        <div className="w-full px-4 pt-4 flex-1 flex flex-col">
          {/* Header Row */}
          <div className="flex items-center justify-between mb-2.5 px-1">
            <h3 className="text-xs font-bold text-[#1E1F3D] uppercase tracking-wider">
              Available Routes ({filteredRoutes.length})
            </h3>
            {routesSearchQuery && (
              <button
                onClick={() => setRoutesSearchQuery('')}
                className="text-[11px] font-bold text-[#6979F8] hover:underline cursor-pointer flex items-center gap-1 active:scale-95"
              >
                Clear search &quot;{routesSearchQuery}&quot;
              </button>
            )}
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
            className="w-full overflow-x-auto no-scrollbar pb-3 mb-2 px-1 flex items-center gap-2 touch-pan-x scroll-smooth select-none cursor-grab active:cursor-grabbing animate-card-stagger"
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
            {/* Trailing spacer so Explorer is never flush against the screen edge */}
            <div className="w-12 shrink-0 h-2" />
          </div>

          {/* Route Cards with smooth staggered cascading entrance */}
          <div className="w-full flex flex-col gap-3.5">
            {filteredRoutes.length === 0 ? (
              <div className="w-full py-8 text-center bg-white rounded-2xl border border-[#E4E7F4] p-4 flex flex-col items-center gap-2 animate-card-stagger">
                <p className="text-xs text-[#8E90B0]">
                  No routes found for{' '}
                  <span className="font-bold text-[#1E1F3D]">
                    {selectedDifficulty === 'All' ? 'this filter' : DIFFICULTY_LABELS[selectedDifficulty as RouteDifficulty]}
                  </span>{' '}
                  difficulty.
                </p>
                <button
                  onClick={() => setSelectedDifficulty('All')}
                  className="text-xs font-bold text-[#6979F8] hover:underline cursor-pointer"
                >
                  Show all routes
                </button>
              </div>
            ) : (
              filteredRoutes.map((rt, idx) => (
              <div
                key={rt.id}
                onClick={() => viewRouteDetail(rt, 'routes')}
                style={{ animationDelay: `${(idx + 1) * 75}ms` }}
                className="animate-card-stagger relative rounded-[24px] overflow-hidden shadow-sm hover:shadow-md cursor-pointer group active:scale-[0.99] transition-all bg-[#1E1F3D] border border-[#6979F8]"
              >
                <div className="relative h-60 w-full overflow-hidden">
                  <img
                    src={rt.coverImage || (idx % 2 === 0 ? '/assets/BragancaHome.png' : '/assets/HomeImage.png')}
                    alt={rt.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/15" />

                  {/* Route Title & Dynamic Price Badge */}
                  <div className="absolute top-3.5 left-4 right-4 z-10 flex items-start justify-between gap-2">
                    <h4 className="text-white text-xl font-medium leading-snug drop-shadow-md line-clamp-2">
                      {rt.title}
                    </h4>
                    <span className="px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md text-white font-bold text-xs shadow-md border border-white/20 shrink-0">
                      {rt.price}€
                    </span>
                  </div>

                  {/* Bottom details: Medal Badge, Duration & Culture, Difficulty Stars */}
                  <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between z-10">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
                        <img src="/assets/RouteNameBadge.png" alt="Medal" className="w-6 h-6 object-contain" />
                      </div>
                      <div className="flex flex-col text-white/90">
                        <span className="text-[11px] font-bold flex items-center gap-1">
                          <Clock size={11} className="text-[#8E97FD]" />
                          {formatRouteDuration(rt.durationMinutes)}
                        </span>
                        <div className="flex items-center gap-1 mt-0.5">
                          <div className="flex items-center gap-0.5">
                            {Array.from({ length: rt.culture }).map((_, cIdx) => (
                              <img
                                key={cIdx}
                                src="/assets/CultureSingle.png"
                                alt="Culture"
                                className="w-3.5 h-3.5 object-contain"
                              />
                            ))}
                          </div>
                          <span className="text-[10px] text-white/80 font-medium">Culture</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1 text-[10px] font-medium text-white tracking-wider">
                      <span className="text-white/80 font-bold text-[9px] uppercase">
                        DIFFICULTY: {DIFFICULTY_LABELS[rt.difficulty]}
                      </span>
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: rt.difficulty }).map((_, sIdx) => (
                          <img
                            key={sIdx}
                            src="/assets/StarSingle.png"
                            alt="★"
                            className="w-3.5 h-3.5 object-contain"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // STEP 3: 07.3 - Routes (Route Selected)
  // Full Page Detail View: Circular bottom top banner + Vector Route Map Preview
  // ==========================================
  const activeRoute = selectedRoute || routes[0];

  const handleBackFromDetail = () => {
    if (routesReturnTab === 'home') {
      setActiveTab('home');
      setRoutesViewStep('select-city');
    } else {
      setRoutesViewStep('city-routes');
    }
  };

  const handleCheckout = () => {
    setActiveRouteId(activeRoute.id);
    setScannerOpen(true);
  };

  return (
    <div className="w-full min-h-screen pb-24 bg-[#EEF0FA] flex flex-col relative overflow-y-auto no-scrollbar animate-route-enter">
      {/* Castle Cover Top Banner with Circular Bottom Radius */}
      <div className="relative h-64 w-full overflow-hidden shrink-0 bg-[#1E1F3D] rounded-b-[44px] shadow-md z-10">
        <img
          src="/assets/HomeImage.png"
          alt="Castle Tower"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/10 to-black/40" />

        {/* Top Header with Back button */}
        <div className="absolute top-4 left-4 z-20">
          <button
            onClick={handleBackFromDetail}
            className="w-9 h-9 rounded-full bg-white/80 backdrop-blur-md text-[#1E1F3D] flex items-center justify-center hover:bg-white transition-all shadow-sm cursor-pointer"
            aria-label="Back"
          >
            <ChevronLeft size={22} />
          </button>
        </div>
      </div>

      {/* Main Full Page Card matching Figma Frame 07.3 */}
      <div className="relative -mt-24 mx-3 bg-white rounded-[28px] p-5 shadow-xl border border-[#EBEFFE] flex-1 flex flex-col z-20">
        {/* Header Title & Badge */}
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold text-[#1E1F3D] leading-snug">
            {activeRoute.title}
          </h1>
          <img src="/assets/RouteNameBadge.png" alt="Badge" className="w-7 h-7 object-contain shrink-0 ml-2" />
        </div>

        {/* Narrative Text */}
        <p className="text-sm text-[#6E7BFF] font-medium mt-2.5 leading-relaxed">
          {activeRoute.description ||
            "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book."}
        </p>

        {/* Route Map Preview (dynamic vector map tailored to activeRoute) */}
        <div className="mt-3.5 animate-card-stagger" style={{ animationDelay: '100ms' }}>
          <RouteMapPreview route={activeRoute} />
        </div>

        {/* 4 Metrics Row matching Figma 07.3 */}
        <div
          className="grid grid-cols-4 gap-2 mt-3.5 text-center items-center py-2 border-y border-[#F2F4FD] animate-card-stagger"
          style={{ animationDelay: '180ms' }}
        >
          <div className="flex flex-col items-center">
            <img src="/assets/RouteNameHour.png" alt="Duration" className="h-6 object-contain" />
            <span className="text-[10px] font-bold text-[#585A7E] mt-1">
              {formatRouteDuration(activeRoute.durationMinutes)}
            </span>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center gap-1 h-6">
              {Array.from({ length: activeRoute.difficulty }).map((_, starIdx) => (
                <img
                  key={starIdx}
                  src="/assets/StarSingle.png"
                  alt="Star"
                  className="w-4 h-4 object-contain"
                />
              ))}
            </div>
            <span className="text-[10px] font-bold text-[#585A7E] mt-1">
              {DIFFICULTY_LABELS[activeRoute.difficulty]}
            </span>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center gap-1 h-6">
              {Array.from({ length: activeRoute.culture }).map((_, cIdx) => (
                <img
                  key={cIdx}
                  src="/assets/CultureSingle.png"
                  alt="Culture"
                  className="w-4 h-4 object-contain"
                />
              ))}
            </div>
            <span className="text-[10px] font-bold text-[#585A7E] mt-1">
              Culture
            </span>
          </div>
          <div className="flex flex-col items-center">
            <img src="/assets/RouteNamePrice.png" alt="Price" className="h-6 object-contain" />
            <span className="text-[10px] font-bold text-[#585A7E] mt-1">
              {activeRoute.price}€
            </span>
          </div>
        </div>

        {/* Gifted Code Discount Box matching Figma */}
        <div
          className="mt-3.5 p-3.5 rounded-2xl border border-[#8E97FD]/40 bg-[#F7F8FE] animate-card-stagger"
          style={{ animationDelay: '250ms' }}
        >
          <label className="flex items-center gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={isGiftChecked}
              onChange={(e) => setIsGiftChecked(e.target.checked)}
              className="sr-only"
            />
            <div
              className={`w-5 h-5 rounded flex items-center justify-center shrink-0 transition-all border ${
                isGiftChecked
                  ? 'bg-[#8E97FD] border-[#8E97FD]'
                  : 'bg-white border-[#A1A4B2]'
              }`}
            >
              {isGiftChecked && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
            </div>
            <span className="text-md font-medium text-[#6E7BFF]">
              Use your gifted code for a 100% Discount on this route
            </span>
          </label>


          {isGiftChecked && (
            <input
              type="text"
              placeholder="Promo Code"
              value={giftCode}
              onChange={(e) => setGiftCode(e.target.value)}
              className="w-full h-9 mt-2.5 px-3 rounded-xl border border-[#8E97FD]/30 text-xs font-bold text-[#1E1F3D] focus:outline-none bg-white"
            />
          )}
        </div>

        {/* Checkout Button matching Figma Frame 07.3 */}
        <button
          onClick={handleCheckout}
          style={{ animationDelay: '300ms' }}
          className="w-full h-12 mt-4 rounded-2xl bg-[#8E97FD] hover:bg-[#7C82ED] text-white font-semibold text-md tracking-wide shadow-md shadow-indigo-300/40 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer animate-card-stagger"
        >
          <span>Checkout</span>
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};
