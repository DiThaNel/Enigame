'use client';

import React from 'react';
import { Route } from '@/types';
import { Flag, Sparkles, MapPin, Navigation, Compass, Shield, Trees, Mountain, Anchor, Layers } from 'lucide-react';

interface RouteMapPreviewProps {
  route?: Route;
  title?: string;
  checkpointsCount?: number;
}

interface MapWaypoint {
  x: number;
  y: number;
  label: string;
  type: 'start' | 'clue' | 'landmark' | 'finish';
  hint?: string;
}

interface MapBlueprint {
  bgFill: string;
  themeLabel: string;
  ThemeIcon: React.ElementType;
  waterPaths?: string[];
  parkPaths?: string[];
  roadPaths?: string[];
  structures?: React.ReactNode;
  trailPath: string;
  trailColor: string;
  waypoints: MapWaypoint[];
}

export const RouteMapPreview: React.FC<RouteMapPreviewProps> = ({
  route,
  title = 'Mystery Route',
  checkpointsCount = 4,
}) => {
  const routeId = route?.id || '';
  const routeTitle = route?.title || title;
  const city = route?.city || 'Portugal';
  const distance = route?.distanceKm ? `${route.distanceKm} km` : '2.4 km';
  const rawCheckpoints = route?.checkpoints || [];

  // Determine blueprint based on route ID
  let blueprint: MapBlueprint;

  if (routeId.includes('braganca-medieval')) {
    blueprint = {
      bgFill: '#EAEFF8',
      themeLabel: 'Citadel Ramparts Radar',
      ThemeIcon: Shield,
      waterPaths: [
        'M-10,25 Q100,50 180,15 T350,30 L350,0 L-10,0 Z',
      ],
      parkPaths: [
        'M15,95 Q40,75 55,115 T15,140 Z',
        'M280,105 Q320,85 335,130 T275,160 Z',
      ],
      roadPaths: [
        'M-10,75 L80,65 L170,115 L350,105',
        'M90,10 L100,85 L115,175',
        'M185,25 L195,120 L235,175',
      ],
      structures: (
        <polygon
          points="65,45 195,35 270,75 235,145 95,140"
          stroke="#BFC8DF"
          strokeWidth="3.5"
          strokeDasharray="6 4"
          fill="#DFE6F5"
        />
      ),
      trailPath: 'M65,115 Q105,145 150,75 T220,110 Q255,120 280,65',
      trailColor: '#6979F8',
      waypoints: [
        { x: 65, y: 115, label: rawCheckpoints[0]?.name || 'Torre de Menagem', type: 'start' },
        { x: 150, y: 75, label: rawCheckpoints[1]?.name || 'Domus Municipalis', type: 'clue' },
        { x: 220, y: 110, label: rawCheckpoints[2]?.name || 'Pelourinho', type: 'landmark' },
        { x: 280, y: 65, label: rawCheckpoints[3]?.name || 'Porta da Vila', type: 'finish' },
      ],
    };
  } else if (routeId.includes('rio-fervenza')) {
    blueprint = {
      bgFill: '#EAF4EE',
      themeLabel: 'River Boardwalk Radar',
      ThemeIcon: Trees,
      waterPaths: [
        'M-20,70 Q90,120 180,65 T360,95 L360,135 Q260,110 170,145 T-20,125 Z',
      ],
      parkPaths: [
        'M10,20 Q80,10 120,55 T30,75 Z',
        'M180,120 Q260,105 310,165 T160,175 Z',
        'M230,20 Q310,15 340,65 T240,75 Z',
      ],
      roadPaths: [
        'M-10,40 L120,45 L220,25 L350,40',
        'M-10,155 L140,155 L250,150 L350,165',
      ],
      structures: (
        <path
          d="M100,85 L130,105 M190,80 L220,100"
          stroke="#B58E62"
          strokeWidth="4"
          strokeLinecap="round"
        />
      ),
      trailPath: 'M45,55 Q115,100 175,65 T285,105',
      trailColor: '#10B981',
      waypoints: [
        { x: 45, y: 55, label: rawCheckpoints[0]?.name || 'Moinho do Polis', type: 'start' },
        { x: 120, y: 95, label: 'Eco Boardwalk', type: 'clue' },
        { x: 200, y: 68, label: 'Watergate Ruins', type: 'landmark' },
        { x: 285, y: 105, label: 'Fervença Mills', type: 'finish' },
      ],
    };
  } else if (routeId.includes('montesinho-legends')) {
    blueprint = {
      bgFill: '#EFF1EA',
      themeLabel: 'Mountain Ridge Topo Radar',
      ThemeIcon: Mountain,
      waterPaths: [
        'M-10,160 Q80,145 130,175 L0,180 Z',
      ],
      parkPaths: [
        'M30,70 Q70,45 100,75 T40,95 Z',
        'M170,80 Q210,65 240,90 T180,110 Z',
      ],
      roadPaths: [
        'M0,145 Q110,95 210,125 T340,85',
        'M0,115 Q120,65 220,95 T340,55',
        'M0,85 Q130,35 230,65 T340,25',
      ],
      structures: (
        <g stroke="#9CA3AF" strokeWidth="1.5" fill="none">
          <polygon points="50,65 60,45 70,65" fill="#D2DEC8" />
          <polygon points="85,60 95,40 105,60" fill="#D2DEC8" />
          <polygon points="210,55 220,35 230,55" fill="#D2DEC8" />
          <polygon points="245,50 255,30 265,50" fill="#D2DEC8" />
        </g>
      ),
      trailPath: 'M40,135 L95,95 L165,120 L230,70 L290,45',
      trailColor: '#F59E0B',
      waypoints: [
        { x: 40, y: 135, label: 'Slate Village', type: 'start' },
        { x: 95, y: 95, label: 'Wolf Trap Pass', type: 'clue' },
        { x: 165, y: 120, label: 'Centuries Oak', type: 'landmark' },
        { x: 290, y: 45, label: 'Montesinho Peak', type: 'finish' },
      ],
    };
  } else if (routeId.includes('cidadela-explorer')) {
    blueprint = {
      bgFill: '#EAE6F8',
      themeLabel: 'Alchemist Subterranean Map',
      ThemeIcon: Sparkles,
      structures: (
        <g>
          <rect x="40" y="35" width="70" height="48" rx="8" stroke="#C5BFE6" strokeWidth="2.5" fill="#DDD8F5" />
          <rect x="150" y="65" width="75" height="55" rx="8" stroke="#C5BFE6" strokeWidth="2.5" fill="#DDD8F5" />
          <rect x="245" y="40" width="65" height="50" rx="8" stroke="#C5BFE6" strokeWidth="2.5" fill="#DDD8F5" />
          {/* Secret Tunnel Passages */}
          <line x1="110" y1="60" x2="150" y2="90" stroke="#8B5CF6" strokeWidth="3" strokeDasharray="4 3" />
          <line x1="225" y1="90" x2="245" y2="65" stroke="#8B5CF6" strokeWidth="3" strokeDasharray="4 3" />
        </g>
      ),
      trailPath: 'M75,60 L115,115 L188,92 L245,135 L278,65',
      trailColor: '#8B5CF6',
      waypoints: [
        { x: 75, y: 60, label: 'Vault Entry', type: 'start' },
        { x: 115, y: 115, label: 'Crypt Arch', type: 'clue' },
        { x: 188, y: 92, label: 'Alchemist Sigil', type: 'clue' },
        { x: 278, y: 65, label: 'Lost Bastion', type: 'finish' },
      ],
    };
  } else if (routeId.includes('porto')) {
    blueprint = {
      bgFill: '#EAF0F8',
      themeLabel: 'Douro Coastal Radar',
      ThemeIcon: Anchor,
      waterPaths: [
        'M-10,115 Q80,140 180,115 T350,135 L350,180 L-10,180 Z',
      ],
      structures: (
        <line x1="195" y1="110" x2="235" y2="175" stroke="#E17055" strokeWidth="4" strokeDasharray="4 2" />
      ),
      roadPaths: [
        'M-10,50 L110,65 L220,40 L350,55',
        'M60,10 L70,115 L80,175',
        'M140,20 L150,110',
      ],
      trailPath: 'M55,60 Q110,50 160,85 T220,125',
      trailColor: '#3B82F6',
      waypoints: [
        { x: 55, y: 60, label: 'Ribeira Alleys', type: 'start' },
        { x: 130, y: 65, label: 'Wine Vault', type: 'clue' },
        { x: 180, y: 95, label: 'Douro Overlook', type: 'landmark' },
        { x: 220, y: 125, label: 'Riverfront Dock', type: 'finish' },
      ],
    };
  } else if (routeId.includes('lisboa')) {
    blueprint = {
      bgFill: '#F6EFE9',
      themeLabel: 'Tagus Maritime Radar',
      ThemeIcon: Compass,
      waterPaths: [
        'M110,180 Q190,115 350,125 L350,180 Z',
      ],
      roadPaths: [
        'M-10,80 Q90,60 170,95 T350,75',
        'M60,10 L80,175',
        'M190,20 L210,115',
      ],
      trailPath: 'M45,130 Q80,75 140,85 T240,65 Q285,85 300,120',
      trailColor: '#EF4444',
      waypoints: [
        { x: 45, y: 130, label: 'Historic Quarter', type: 'start' },
        { x: 110, y: 80, label: 'Fado Tavern', type: 'clue' },
        { x: 210, y: 70, label: 'Miradouro Arch', type: 'landmark' },
        { x: 300, y: 120, label: 'Coast Bastion', type: 'finish' },
      ],
    };
  } else {
    // Procedural Fallback based on string hash of routeTitle
    const hash = routeTitle.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const trailY1 = 80 + (hash % 50);
    const trailY2 = 60 + ((hash * 3) % 60);

    blueprint = {
      bgFill: '#E9EEF7',
      themeLabel: 'Exploration Radar',
      ThemeIcon: Compass,
      waterPaths: [
        `M-20,${trailY1} Q90,${trailY2} 180,${trailY1} T360,${trailY2} L360,0 L-20,0 Z`,
      ],
      roadPaths: [
        'M-10,95 L110,85 L200,140 L350,130',
        'M100,10 L110,100 L120,175',
      ],
      trailPath: `M50,130 Q120,${trailY2} 180,95 T295,${trailY1}`,
      trailColor: '#8E97FD',
      waypoints: [
        { x: 50, y: 130, label: 'Start Point', type: 'start' },
        { x: 140, y: trailY2, label: 'Clue Marker', type: 'clue' },
        { x: 220, y: 95, label: 'Historic Site', type: 'landmark' },
        { x: 295, y: trailY1, label: 'Destination', type: 'finish' },
      ],
    };
  }

  const {
    bgFill,
    themeLabel,
    ThemeIcon,
    waterPaths = [],
    parkPaths = [],
    roadPaths = [],
    structures,
    trailPath,
    trailColor,
    waypoints,
  } = blueprint;

  return (
    <div className="relative w-full h-60 rounded-2xl overflow-hidden border border-[#DCE4F5] bg-[#E8EDF5] shadow-inner select-none transition-all duration-300">
      {/* Stylized Vector SVG Map Background tailored dynamically for this route */}
      <svg className="w-full h-full absolute inset-0" viewBox="0 0 340 180" preserveAspectRatio="xMidYMid slice">
        {/* Background land */}
        <rect width="340" height="180" fill={bgFill} />

        {/* Water bodies */}
        {waterPaths.map((p, idx) => (
          <path key={`water-${idx}`} d={p} fill="#D3E4F8" />
        ))}

        {/* Green nature / park areas */}
        {parkPaths.map((p, idx) => (
          <path key={`park-${idx}`} d={p} fill="#D7EBD8" />
        ))}

        {/* Road street networks */}
        {roadPaths.map((p, idx) => (
          <path
            key={`road-${idx}`}
            d={p}
            stroke="#FFFFFF"
            strokeWidth="7"
            strokeLinecap="round"
            fill="none"
          />
        ))}

        {/* Optional specialized buildings/fortress structures */}
        {structures}

        {/* Active Route Trail Path (Dashed glowing line) */}
        <path
          d={trailPath}
          stroke={trailColor}
          strokeWidth="3.5"
          strokeDasharray="5 4"
          strokeLinecap="round"
          fill="none"
        />
      </svg>

      {/* Dynamic Waypoint Pins tailored to route data */}
      {waypoints.map((wp, idx) => {
        if (wp.type === 'start') {
          return (
            <div
              key={idx}
              style={{ top: `${wp.y}px`, left: `${wp.x}px` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-20 pointer-events-none"
            >
              <div className="px-1.5 py-0.5 bg-[#FFB800] text-[#1E1F3D] font-black text-[7px] rounded shadow-sm mb-0.5 tracking-wider uppercase">
                START
              </div>
              <div className="w-6 h-6 rounded-full bg-[#FFB800] text-white flex items-center justify-center shadow-md ring-2 ring-white">
                <Flag size={11} fill="currentColor" />
              </div>
              <span className="text-[7.5px] font-bold text-[#1E1F3D] bg-white/90 px-1 py-0.5 rounded mt-0.5 shadow-sm whitespace-nowrap max-w-[80px] truncate">
                {wp.label}
              </span>
            </div>
          );
        }

        if (wp.type === 'clue') {
          return (
            <div
              key={idx}
              style={{ top: `${wp.y}px`, left: `${wp.x}px` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-20 pointer-events-none"
            >
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#6C5CE7] to-[#8D93FF] text-white flex items-center justify-center shadow-md ring-2 ring-white animate-pulse">
                <Sparkles size={11} />
              </div>
              <div className="px-1 py-0.5 bg-white text-[#6C5CE7] font-bold text-[7.5px] rounded shadow-sm mt-0.5 border border-[#EEF0FA] whitespace-nowrap max-w-[80px] truncate">
                {wp.label}
              </div>
            </div>
          );
        }

        if (wp.type === 'landmark') {
          return (
            <div
              key={idx}
              style={{ top: `${wp.y}px`, left: `${wp.x}px` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-20 pointer-events-none"
            >
              <div className="w-5 h-5 rounded-full bg-[#8E97FD] text-white flex items-center justify-center shadow-md ring-2 ring-white">
                <MapPin size={10} />
              </div>
              <span className="text-[7px] font-semibold text-[#585A7E] bg-white/80 px-1 py-0.5 rounded mt-0.5 shadow-sm whitespace-nowrap max-w-[70px] truncate">
                {wp.label}
              </span>
            </div>
          );
        }

        // Finish Pin
        return (
          <div
            key={idx}
            style={{ top: `${wp.y}px`, left: `${wp.x}px` }}
            className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-20 pointer-events-none"
          >
            <div className="w-6 h-6 rounded-full bg-[#1E1F3D] text-white flex items-center justify-center shadow-md ring-2 ring-white">
              <Navigation size={10} fill="currentColor" />
            </div>
            <div className="px-1.5 py-0.5 bg-[#1E1F3D] text-white font-black text-[7px] rounded shadow-sm mt-0.5 tracking-wider uppercase">
              FINISH
            </div>
            <span className="text-[7.5px] font-bold text-[#1E1F3D] bg-white/90 px-1 py-0.5 rounded mt-0.5 shadow-sm whitespace-nowrap max-w-[80px] truncate">
              {wp.label}
            </span>
          </div>
        );
      })}

      {/* Top Left Floating Pill: Live Route GPS Information */}
      <div className="absolute top-2.5 left-2.5 z-30 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md shadow-sm border border-white/60">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </span>
        <span className="text-[9px] font-extrabold text-[#1E1F3D] tracking-wide">
          {city} • {distance} • {waypoints.length} Checkpoints
        </span>
      </div>

      {/* Bottom Right Floating Badge: Terrain Theme Indicator */}
      <div className="absolute bottom-2.5 right-2.5 z-30 flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#1E1F3D]/80 backdrop-blur-md text-white text-[8px] font-semibold shadow-sm">
        <ThemeIcon size={10} className="text-[#FFB800]" />
        <span>{themeLabel}</span>
      </div>
    </div>
  );
};
