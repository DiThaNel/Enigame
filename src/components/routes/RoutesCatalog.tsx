'use client';

import React, { useState, useRef } from 'react';
import { useEnigameStore } from '@/store/useEnigameStore';
import { ChevronLeft, ChevronRight, Star, Info } from 'lucide-react';

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
  } = useEnigameStore();

  // Cities List for the Frame 07 Carousel
  const cities = [
    {
      name: 'Bragança, Portugal',
      cityKey: 'Bragança',
      image: '/assets/RoutesImageCarousel.png',
      routeCount: 4,
    },
    {
      name: 'Porto, Portugal',
      cityKey: 'Porto',
      image: '/assets/HomeImage.png',
      routeCount: 3,
    },
    {
      name: 'Lisboa, Portugal',
      cityKey: 'Lisboa',
      image: '/assets/ExperiencesCarousel.png',
      routeCount: 5,
    },
    {
      name: 'Coimbra, Portugal',
      cityKey: 'Coimbra',
      image: '/assets/BragancaHome.png',
      routeCount: 3,
    },
    {
      name: 'Sintra, Portugal',
      cityKey: 'Sintra',
      image: '/assets/HomeImage.png',
      routeCount: 4,
    },
  ];

  // City Carousel State (Same card shuffle physics as Home)
  const [activeCityIndex, setActiveCityIndex] = useState(0);
  const [cityShuffleDir, setCityShuffleDir] = useState<'left' | 'right' | null>(null);
  const [cityDragOffset, setCityDragOffset] = useState(0);
  const [isCityDragging, setIsCityDragging] = useState(false);
  const startXRef = useRef(0);

  // Category filter in 07.2
  const [activeCategory, setActiveCategory] = useState<'Tech Route' | 'Tech/Explorer' | 'Explorer'>('Tech Route');
  const [giftCode, setGiftCode] = useState('');
  const [isGiftChecked, setIsGiftChecked] = useState(true);

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
        className="w-full min-h-[calc(100vh-140px)] pb-20 bg-[#EEF0FA] flex flex-col items-center justify-center px-4 relative overflow-hidden select-none"
        style={{
          backgroundImage: 'url(/assets/Lenguaje.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Pagination Dots placed ABOVE the card */}
        <div className="flex items-center gap-2 mb-2 z-20">
          {cities.map((_, idx) => {
            const isActive = activeCityIndex % cityCount === idx;
            return (
              <button
                key={idx}
                onClick={() => {
                  if (idx !== activeCityIndex % cityCount) {
                    setCityShuffleDir(idx > activeCityIndex % cityCount ? 'right' : 'left');
                    setTimeout(() => {
                      setActiveCityIndex(idx);
                      setCityShuffleDir(null);
                    }, 280);
                  }
                }}
                className={
                  'h-2 rounded-full transition-all duration-300 cursor-pointer ' +
                  (isActive ? 'w-6 bg-[#6979F8] shadow-sm' : 'w-2 bg-[#8E97FD]/40 hover:bg-[#8E97FD]/70')
                }
                aria-label={`Select city ${idx + 1}`}
              />
            );
          })}
        </div>

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
            let transition = isCityDragging && isFront ? 'none' : 'all 340ms cubic-bezier(0.34, 1.56, 0.64, 1)';

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

                {/* Select City Button at Bottom */}
                <div className="relative z-10 p-6 pb-7 flex flex-col items-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectCity(city.cityKey);
                    }}
                    className="w-full max-w-[230px] h-12 py-3 px-6 rounded-full bg-[#8E97FD] hover:bg-[#7C82ED] text-white font-extrabold text-xs tracking-wider uppercase shadow-lg shadow-indigo-400/30 transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center"
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
  // Matching Figma frame 07.2 with Category Tabs & Vertical Route Cards
  // ==========================================
  if (routesViewStep === 'city-routes') {
    return (
      <div className="w-full min-h-screen pb-24 bg-[#EEF0FA] flex flex-col relative overflow-y-auto no-scrollbar">
        {/* Top Cover Banner with City Photo & Back Arrow */}
        <div className="relative h-56 w-full overflow-hidden shrink-0 bg-[#1E1F3D]">
          <img
            src="/assets/HomeImage.png"
            alt={selectedCity}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-transparent" />

          {/* Top Header with Back < and Info icon */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
            <button
              onClick={() => setRoutesViewStep('select-city')}
              className="w-9 h-9 rounded-full bg-white/80 backdrop-blur-md text-[#1E1F3D] flex items-center justify-center hover:bg-white transition-all shadow-sm cursor-pointer"
              aria-label="Back to Select City"
            >
              <ChevronLeft size={22} />
            </button>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-black/40 backdrop-blur-md text-white text-xs font-semibold">
                {selectedCity}
              </span>
            </div>
          </div>
        </div>

        {/* Content Container with Rounded Top */}
        <div className="relative -mt-6 mx-3 bg-white rounded-t-[30px] rounded-b-[24px] p-4 shadow-lg border border-[#EBEFFE] flex-1 flex flex-col">
          {/* Category Filter Tabs: Tech Route, Tech/Explorer, Explorer */}
          <div className="flex items-center justify-around border-b border-[#F0F2FA] pb-3 mb-4">
            {(['Tech Route', 'Tech/Explorer', 'Explorer'] as const).map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={
                    'text-xs font-bold transition-all relative pb-1.5 cursor-pointer ' +
                    (isActive
                      ? 'text-[#6979F8] font-extrabold'
                      : 'text-[#8E90A6] hover:text-[#1E1F3D]')
                  }
                >
                  <span>{cat}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#6979F8]" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Vertical Feed of Route Cards matching Figma Frame 07.2 */}
          <div className="w-full flex flex-col gap-3.5">
            {routes.map((rt, idx) => (
              <div
                key={rt.id}
                onClick={() => viewRouteDetail(rt, 'routes')}
                className="relative rounded-[24px] overflow-hidden shadow-sm hover:shadow-md cursor-pointer group active:scale-[0.99] transition-all bg-[#1E1F3D] border border-black/5"
              >
                <div className="relative h-40 w-full overflow-hidden">
                  <img
                    src={idx % 2 === 0 ? '/assets/BragancaHome.png' : '/assets/HomeImage.png'}
                    alt={rt.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/15" />

                  {/* Route Title */}
                  <div className="absolute top-3.5 left-4 right-4 z-10">
                    <h3 className="text-white text-base font-extrabold leading-snug drop-shadow-md line-clamp-2">
                      {rt.title}
                    </h3>
                  </div>

                  {/* Bottom details: Medal Badge & Difficulty Stars */}
                  <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between z-10">
                    <div className="w-6 h-6 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                      <img src="/assets/RouteNameBadge.png" alt="Medal" className="w-4 h-4 object-contain" />
                    </div>

                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-white tracking-wider">
                      <span className="text-white/80">DIFFICULTY:</span>
                      <div className="flex items-center text-amber-400">
                        <Star size={12} fill="currentColor" />
                        <Star size={12} fill="currentColor" />
                        <Star size={12} fill="currentColor" />
                        {rt.difficulty === 'Hard' && <Star size={12} fill="currentColor" />}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // STEP 3: 07.3 - Routes (Route Selected)
  // Full Page Detail View matching Figma frame 07.3
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
    <div className="w-full min-h-screen pb-24 bg-[#EEF0FA] flex flex-col relative overflow-y-auto no-scrollbar">
      {/* Castle Cover Top Banner */}
      <div className="relative h-60 w-full overflow-hidden shrink-0 bg-[#1E1F3D]">
        <img
          src="/assets/HomeImage.png"
          alt="Castle Tower"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/25" />

        {/* Top Header with Back button */}
        <div className="absolute top-4 left-4 z-10">
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
      <div className="relative -mt-10 mx-3 bg-white rounded-[28px] p-5 shadow-xl border border-[#EBEFFE] flex-1 flex flex-col">
        {/* Header Title & Badge */}
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-extrabold text-[#1E1F3D] leading-snug">
            {activeRoute.title}
          </h1>
          <img src="/assets/RouteNameBadge.png" alt="Badge" className="w-7 h-7 object-contain shrink-0 ml-2" />
        </div>

        {/* Narrative Text */}
        <p className="text-xs text-[#6E7BFF] font-medium mt-2.5 leading-relaxed">
          {activeRoute.description ||
            "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book."}
        </p>

        {/* Map / Category Preview Snippet */}
        <div className="mt-3.5 rounded-2xl overflow-hidden border border-[#EEF0FA] relative">
          <img
            src="/assets/RouteNameCategory.png"
            alt="Map Preview"
            className="w-full h-auto object-cover"
          />
        </div>

        {/* 4 Metrics Row matching Figma 07.3 */}
        <div className="grid grid-cols-4 gap-2 mt-3.5 text-center items-center py-2 border-y border-[#F2F4FD]">
          <div className="flex flex-col items-center">
            <img src="/assets/RouteNameHour.png" alt="1 Hour" className="h-6 object-contain" />
            <span className="text-[10px] font-bold text-[#585A7E] mt-1">1 Hour</span>
          </div>
          <div className="flex flex-col items-center">
            <img src="/assets/RouteDificultyStars.png" alt="Difficulty" className="h-4 object-contain" />
            <span className="text-[10px] font-bold text-[#585A7E] mt-2">Difficulty</span>
          </div>
          <div className="flex flex-col items-center">
            <img src="/assets/RouteNameCulture.png" alt="Culture" className="h-6 object-contain" />
            <span className="text-[10px] font-bold text-[#585A7E] mt-1">Culture</span>
          </div>
          <div className="flex flex-col items-center">
            <img src="/assets/RouteNamePrice.png" alt="Price" className="h-6 object-contain" />
            <span className="text-[10px] font-bold text-[#585A7E] mt-1">30€</span>
          </div>
        </div>

        {/* Gifted Code Discount Box matching Figma */}
        <div className="mt-3.5 p-3.5 rounded-2xl border border-[#8E97FD]/40 bg-[#F7F8FE]">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isGiftChecked}
              onChange={(e) => setIsGiftChecked(e.target.checked)}
              className="w-4 h-4 rounded text-[#8E97FD] accent-[#8E97FD] cursor-pointer"
            />
            <span className="text-xs font-bold text-[#6E7BFF]">
              Use your gifted code for a 100% Discount on this route
            </span>
          </label>

          {isGiftChecked && (
            <input
              type="text"
              placeholder="ENTER PROMO CODE"
              value={giftCode}
              onChange={(e) => setGiftCode(e.target.value)}
              className="w-full h-9 mt-2.5 px-3 rounded-xl border border-[#8E97FD]/30 text-xs font-bold text-[#1E1F3D] focus:outline-none uppercase bg-white"
            />
          )}
        </div>

        {/* Checkout Button matching Figma Frame 07.3 */}
        <button
          onClick={handleCheckout}
          className="w-full h-12 mt-4 rounded-2xl bg-[#8E97FD] hover:bg-[#7C82ED] text-white font-extrabold text-xs tracking-wider uppercase shadow-md shadow-indigo-300/40 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Checkout</span>
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};
