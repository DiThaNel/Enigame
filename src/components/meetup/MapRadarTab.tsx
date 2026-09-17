'use client';

import React, { useState } from 'react';
import { useEnigameStore } from '@/store/useEnigameStore';
import { Compass, Navigation2, QrCode, Users, Flag, Sparkles, LocateFixed, Check } from 'lucide-react';

export const MapRadarTab: React.FC = () => {
  const { explorers, setScannerOpen, setSelectedExplorer, routes, activeRouteId } = useEnigameStore();
  const [isTeamedUp, setIsTeamedUp] = useState(false);

  const activeRoute = routes.find(r => r.id === activeRouteId) || routes[0];

  return (
    <div className="relative w-full h-[calc(100vh-10rem)] max-h-[640px] overflow-hidden bg-[#E9EDF6] animate-fadeIn">
      {/* Stylized Vector SVG Map Background */}
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

          {/* Active Trail Path (Lavender) */}
          <path
            d="M90,380 Q130,280 170,300 T215,160 Q270,140 285,90"
            stroke="#7C82ED"
            strokeWidth="4"
            strokeDasharray="6 4"
            fill="none"
          />
        </svg>
      </div>

      {/* Interactive Map Pins */}
      {/* Checkpoint 1: Golden Flag */}
      <div className="absolute top-[85px] left-[270px] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer group">
        <div className="px-2 py-0.5 bg-[#FFB800] text-[#1E1F3D] font-extrabold text-[9px] rounded-md shadow-sm mb-1">
          Castle 2/6
        </div>
        <div className="w-8 h-8 rounded-full bg-[#FFB800] text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform ring-4 ring-white">
          <Flag size={15} fill="currentColor" />
        </div>
      </div>

      {/* Checkpoint 2: Mystery Puzzle Marker */}
      <div className="absolute top-[230px] left-[165px] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer group">
        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#6C5CE7] to-[#8D93FF] text-white flex items-center justify-center shadow-lg pulse-ring group-hover:scale-110 transition-transform ring-4 ring-white">
          <Sparkles size={16} />
        </div>
        <div className="px-2 py-0.5 bg-white text-[#6C5CE7] font-bold text-[9px] rounded-md shadow-sm mt-1 border border-[#EEF0FA]">
          Mystery Clue
        </div>
      </div>

      {/* Nearby Explorer Pin 1: Sara (120m) */}
      <div 
        onClick={() => setSelectedExplorer(explorers[1])}
        className="absolute top-[140px] left-[210px] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer group"
      >
        <div className="flex items-center gap-1 px-2 py-0.5 bg-white rounded-full shadow-md border border-[#EEF0FA] mb-1">
          <span className="text-[9px] font-bold text-[#1E1F3D]">Sara</span>
          <span className="text-[8px] font-semibold text-[#7C82ED]">120m</span>
        </div>
        <div className="relative">
          <img
            src="/assets/TianaAvatar.png"
            alt="Sara"
            className="w-10 h-10 rounded-full object-cover ring-3 ring-[#7C82ED] shadow-md group-hover:scale-110 transition-transform"
          />
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white" />
        </div>
      </div>

      {/* Nearby Explorer Pin 2: Lucas (350m) */}
      <div 
        onClick={() => setSelectedExplorer(explorers[0])}
        className="absolute top-[370px] left-[85px] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer group"
      >
        <div className="flex items-center gap-1 px-2 py-0.5 bg-white rounded-full shadow-md border border-[#EEF0FA] mb-1">
          <span className="text-[9px] font-bold text-[#1E1F3D]">Lucas</span>
          <span className="text-[8px] font-semibold text-[#7C82ED]">350m</span>
        </div>
        <div className="relative">
          <img
            src="/assets/TianaAvatar.png"
            alt="Lucas"
            className="w-10 h-10 rounded-full object-cover ring-3 ring-[#7C82ED] shadow-md group-hover:scale-110 transition-transform"
          />
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white" />
        </div>
      </div>

      {/* Floating Map Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2.5 z-20">
        <button 
          aria-label="Compass"
          className="w-10 h-10 rounded-2xl bg-white shadow-md border border-[#EEF0FA] text-[#7C82ED] flex items-center justify-center hover:bg-[#EEF0FF] transition-colors"
        >
          <Compass size={20} />
        </button>
        <button 
          aria-label="Center Location"
          className="w-10 h-10 rounded-2xl bg-white shadow-md border border-[#EEF0FA] text-[#7C82ED] flex items-center justify-center hover:bg-[#EEF0FF] transition-colors"
        >
          <LocateFixed size={20} />
        </button>
      </div>

      {/* Floating Bottom Sheet HUD */}
      <div className="absolute bottom-3 left-4 right-4 z-20">
        <div className="bg-white/95 backdrop-blur-md rounded-3xl p-4 shadow-xl border border-[#EEF0FA] animate-slideUp">
          <div className="w-10 h-1 bg-[#DCE0F9] rounded-full mx-auto mb-2.5" />
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-extrabold text-[#1E1F3D] leading-tight">
                {activeRoute.title}
              </h3>
              <span className="text-[11px] font-medium text-[#7A7C99]">
                {explorers.length} Adventurers active nearby
              </span>
            </div>

            <div className="flex -space-x-2">
              {explorers.slice(0, 3).map((e, idx) => (
                <img
                  key={idx}
                  src="/assets/TianaAvatar.png"
                  alt={e.name}
                  className="w-7 h-7 rounded-full ring-2 ring-white object-cover"
                />
              ))}
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-3">
            <div className="flex items-center justify-between text-[10px] font-bold mb-1">
              <span className="text-[#7C82ED]">Checkpoint 2/4</span>
              <span className="text-[#7A7C99]">2 remaining</span>
            </div>
            <div className="w-full h-2 bg-[#EEF0FF] rounded-full overflow-hidden">
              <div className="w-1/2 h-full bg-gradient-to-r from-[#7C82ED] to-[#6C5CE7] rounded-full" />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2.5 mt-3.5">
            <button
              onClick={() => setScannerOpen(true)}
              className="flex-1 h-11 rounded-2xl bg-gradient-to-r from-[#7C82ED] to-[#6C5CE7] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-indigo-300/40 hover:opacity-95 active:scale-95 transition-all"
            >
              <QrCode size={16} />
              <span>Scan QR Clue</span>
            </button>

            <button
              onClick={() => setIsTeamedUp(!isTeamedUp)}
              className={`px-4 h-11 rounded-2xl border font-bold text-xs flex items-center gap-1.5 transition-all ${
                isTeamedUp
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                  : 'bg-white border-[#EEF0FA] text-[#585A7E] hover:bg-[#F4F6FB]'
              }`}
            >
              {isTeamedUp ? (
                <>
                  <Check size={16} className="text-emerald-600" />
                  <span>Teamed Up</span>
                </>
              ) : (
                <>
                  <Users size={16} className="text-[#7C82ED]" />
                  <span>Team Up</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
