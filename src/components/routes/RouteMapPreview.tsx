'use client';

import React from 'react';
import { Flag, Sparkles, MapPin, Navigation, Compass } from 'lucide-react';

interface RouteMapPreviewProps {
  title?: string;
  checkpointsCount?: number;
}

export const RouteMapPreview: React.FC<RouteMapPreviewProps> = ({
  title = 'Mystery Route',
  checkpointsCount = 6,
}) => {
  return (
    <div className="relative w-full h-60 rounded-2xl overflow-hidden border border-[#DCE4F5] bg-[#E8EDF5] shadow-inner select-none">
      {/* Stylized Vector SVG Map Background matching Meet-up Radar */}
      <svg className="w-full h-full absolute inset-0" viewBox="0 0 340 180" preserveAspectRatio="xMidYMid slice">
        {/* Background land */}
        <rect width="340" height="180" fill="#E9EEF7" />

        {/* River / Water curves */}
        <path
          d="M-20,40 Q90,80 160,35 T360,60 L360,0 L-20,0 Z"
          fill="#D6E5F8"
        />
        <path
          d="M260,110 Q290,140 350,130 L350,180 L230,180 Z"
          fill="#CCE0F8"
        />

        {/* Green Parks */}
        <path
          d="M130,85 Q190,70 210,120 T140,150 Z"
          fill="#D7EBD8"
        />
        <path
          d="M15,110 Q55,100 65,145 T10,160 Z"
          fill="#D7EBD8"
        />

        {/* White Street Grid Network */}
        <path
          d="M-10,95 L110,85 L200,140 L350,130"
          stroke="#FFFFFF"
          strokeWidth="8"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M100,10 L110,100 L120,175"
          stroke="#FFFFFF"
          strokeWidth="7"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M180,30 L190,125 L240,175"
          stroke="#FFFFFF"
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M20,50 L280,35 L330,70"
          stroke="#FFFFFF"
          strokeWidth="5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Active Route Trail Path (Lavender / Indigo Dashed) */}
        <path
          d="M50,130 Q85,80 125,95 T175,55 Q215,40 250,75 T295,50"
          stroke="#6979F8"
          strokeWidth="3.5"
          strokeDasharray="5 4"
          strokeLinecap="round"
          fill="none"
        />
      </svg>

      {/* Checkpoint Pin 1: Start (Flag) */}
      <div className="absolute top-[130px] left-[50px] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
        <div className="px-1.5 py-0.5 bg-[#FFB800] text-[#1E1F3D] font-black text-[8px] rounded shadow-sm mb-0.5 tracking-wider">
          START
        </div>
        <div className="w-6 h-6 rounded-full bg-[#FFB800] text-white flex items-center justify-center shadow-md ring-2 ring-white">
          <Flag size={11} fill="currentColor" />
        </div>
      </div>

      {/* Checkpoint Pin 2: Mystery Clue (Sparkles Pulse) */}
      <div className="absolute top-[55px] left-[175px] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
        <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#6C5CE7] to-[#8D93FF] text-white flex items-center justify-center shadow-md ring-2 ring-white animate-pulse">
          <Sparkles size={13} />
        </div>
        <div className="px-1.5 py-0.5 bg-white text-[#6C5CE7] font-bold text-[8px] rounded shadow-sm mt-0.5 border border-[#EEF0FA]">
          Clue 1
        </div>
      </div>

      {/* Checkpoint Pin 3: Landmark Tower */}
      <div className="absolute top-[75px] left-[250px] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
        <div className="w-5 h-5 rounded-full bg-[#8E97FD] text-white flex items-center justify-center shadow-md ring-2 ring-white">
          <MapPin size={11} />
        </div>
      </div>

      {/* Checkpoint Pin 4: Finish */}
      <div className="absolute top-[50px] left-[295px] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
        <div className="w-6 h-6 rounded-full bg-[#1E1F3D] text-white flex items-center justify-center shadow-md ring-2 ring-white">
          <Navigation size={10} fill="currentColor" />
        </div>
        <div className="px-1.5 py-0.5 bg-[#1E1F3D] text-white font-black text-[7px] rounded shadow-sm mt-0.5 tracking-wider">
          FINISH
        </div>
      </div>

      {/* Top Left Floating Pill: Live Route Status */}
      <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md shadow-sm border border-white/60">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </span>
        <span className="text-[9px] font-extrabold text-[#1E1F3D] tracking-wide">
          GPS Route • {checkpointsCount} Checkpoints
        </span>
      </div>

      {/* Bottom Right Floating Badge: Compass Icon */}
      <div className="absolute bottom-2.5 right-2.5 z-10 flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#1E1F3D]/70 backdrop-blur-md text-white text-[8px] font-semibold">
        <Compass size={10} className="text-[#FFB800]" />
        <span>Radar Map</span>
      </div>
    </div>
  );
};
