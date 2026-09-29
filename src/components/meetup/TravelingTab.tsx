'use client';

import React, { useState } from 'react';
import { useEnigameStore } from '@/store/useEnigameStore';
import { CompletedRoute, RouteCompanion, Explorer } from '@/types';
import { DYNAMIC_EXPLORERS } from '@/data/mockData';
import { RouteMapPreview } from '@/components/routes/RouteMapPreview';
import { 
  Calendar, 
  Clock, 
  Trophy, 
  Users, 
  CheckCircle2, 
  MapPin, 
  Compass, 
  ExternalLink, 
  Sparkles, 
  Share2, 
  Layers, 
  Map, 
  Image as ImageIcon, 
  ChevronRight, 
  X, 
  Award 
} from 'lucide-react';

export const TravelingTab: React.FC = () => {
  const { 
    completedRoutes, 
    routes, 
    setSelectedExplorer, 
    explorers, 
    currentUser, 
    showToast,
    setActiveTab
  } = useEnigameStore();

  const [selectedCompletedRoute, setSelectedCompletedRoute] = useState<CompletedRoute | null>(null);
  const [activeViewModeMap, setActiveViewModeMap] = useState<Record<string, 'map' | 'photo'>>({});

  // Summary statistics
  const totalRoutesCount = completedRoutes.length;
  const totalPointsAwarded = completedRoutes.reduce((acc, r) => acc + (r.rewardPoints || 0), 0);
  const uniqueCountries = Array.from(new Set(completedRoutes.map((r) => r.country))).filter(Boolean);

  const toggleCardView = (cardId: string) => {
    setActiveViewModeMap((prev) => ({
      ...prev,
      [cardId]: prev[cardId] === 'photo' ? 'map' : 'photo',
    }));
  };

  const handleCompanionClick = (p: RouteCompanion) => {
    // If it's the current user (Tiana), navigate to profile
    if (p.id === currentUser.id || p.name.toLowerCase().includes('tiana')) {
      setActiveTab('profile');
      showToast('Viewing your profile', 'info');
      return;
    }

    // Try finding in store explorers or DYNAMIC_EXPLORERS by ID or name
    let found = explorers.find((e) => e.id === p.id);
    if (!found) {
      found = explorers.find((e) => e.name.toLowerCase() === p.name.toLowerCase());
    }
    if (!found) {
      found = DYNAMIC_EXPLORERS.find((e) => e.id === p.id || e.name.toLowerCase() === p.name.toLowerCase());
    }

    // If still not found, construct a complete Explorer entity so every user is 100% clickable
    if (!found) {
      found = {
        id: p.id,
        name: p.name,
        nickname: p.nickname || p.name.split(' ')[0],
        avatar: p.avatar || '/assets/TianaAvatar.png',
        level: 22,
        rankTitle: 'Expedition Veteran',
        bio: `Experienced explorer and teammate in the ${p.city || 'European'} expedition.`,
        about: 'Passionate expedition team member exploring castles and European secrets.',
        city: p.city || 'Portugal',
        gender: 'Adventurer',
        ageGroup: '20s',
        badges: ['Expedition Veteran', 'Citadel Legend'],
        distanceMeters: 250,
        isOnline: true,
      };
    }

    setSelectedExplorer(found);
  };

  return (
    <div className="w-full px-4 pt-3 pb-28 animate-fadeIn select-none">
      {/* Top Banner & Stats Overview */}
      <div className="w-full bg-gradient-to-r from-[#6C7BFF] to-[#8E97FD] rounded-3xl p-4.5 text-white shadow-md shadow-indigo-200/50 mb-4.5 relative overflow-hidden">
        {/* Subtle decorative background circles */}
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
                  Expedition Logbook
                </span>
                <h2 className="text-base font-bold leading-tight">Travels History</h2>
              </div>
            </div>

            <div className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white font-bold text-[11px] flex items-center gap-1.5 border border-white/25">
              <span>{completedRoutes.length} Completed</span>
            </div>
          </div>

          <p className="text-[11px] text-indigo-100 font-medium mt-2 leading-relaxed">
            Record of all your completed journeys, companion teams, route maps, and points earned.
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-2 mt-3.5 pt-3 border-t border-white/20">
            <div className="flex flex-col">
              <span className="text-[10px] text-indigo-200 font-medium">Completed</span>
              <span className="text-base font-bold">{totalRoutesCount} Routes</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-indigo-200 font-medium">Points Won</span>
              <span className="text-base font-bold flex items-center gap-1 text-[#FFD666]">
                <Trophy size={13} />
                <span>+{totalPointsAwarded}</span>
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-indigo-200 font-medium">Countries</span>
              <span className="text-base font-bold">{uniqueCountries.length} Visited</span>
            </div>
          </div>
        </div>
      </div>

      {/* Empty State if no routes completed */}
      {completedRoutes.length === 0 ? (
        <div className="w-full bg-white rounded-3xl p-8 border border-[#EEF0FA] shadow-sm text-center flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-[#EEF0FF] text-[#7C82ED] flex items-center justify-center mb-3">
            <Compass size={32} />
          </div>
          <h3 className="text-base font-bold text-[#1E1F3D]">No Completed Routes Yet</h3>
          <p className="text-xs text-[#7A7C99] mt-1.5 max-w-xs leading-relaxed">
            When you complete mystery routes or citadel expeditions, they will appear here in your Travels history with the full route map, time taken, companions, and points won.
          </p>
          <button
            onClick={() => setActiveTab('routes')}
            className="mt-5 px-6 py-2.5 rounded-2xl bg-[#7C82ED] hover:bg-[#6C5CE7] text-white font-bold text-xs shadow-md shadow-indigo-200 active:scale-95 transition-all cursor-pointer"
          >
            Explore Available Routes
          </button>
        </div>
      ) : (
        /* Completed Routes Cards List */
        <div className="flex flex-col gap-4.5">
          {completedRoutes.map((cr, idx) => {
            const matchingRoute = routes.find((r) => r.id === cr.routeId);
            const viewMode = activeViewModeMap[cr.id] || 'map'; // Default to route map view

            return (
              <div
                key={cr.id}
                style={{ animationDelay: `${idx * 80}ms` }}
                className="animate-card-stagger bg-white rounded-3xl overflow-hidden border border-[#EEF0FA] shadow-sm hover:shadow-md transition-all flex flex-col"
              >
                {/* Visual Header: Switch between Route Map & Cover Photo */}
                <div className="relative w-full overflow-hidden bg-[#E8EDF5]">
                  {viewMode === 'map' ? (
                    <div className="relative w-full h-52">
                      <RouteMapPreview
                        route={matchingRoute || {
                          id: cr.routeId,
                          title: cr.routeTitle,
                          city: cr.city,
                          country: cr.country,
                          coverImage: cr.coverImage,
                          difficulty: 2,
                          culture: 2,
                          price: 30,
                          distanceKm: cr.distanceKm,
                          durationMinutes: 90,
                          rewardPoints: cr.rewardPoints,
                          category: 'adventure',
                          checkpoints: [],
                          description: cr.summary || '',
                        }}
                        title={cr.routeTitle}
                        checkpointsCount={cr.checkpointsCount}
                      />
                    </div>
                  ) : (
                    <div className="relative h-52 w-full">
                      <img
                        src={cr.coverImage}
                        alt={cr.routeTitle}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = '/assets/BragancaHome.png';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
                    </div>
                  )}

                  {/* Top Floating Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-30 pointer-events-none">
                    {/* Date Completed Badge (La Fecha) */}
                    <div className="bg-white/95 backdrop-blur-md text-[#1E1F3D] text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm border border-white/60">
                      <Calendar size={12} className="text-[#6C7BFF]" />
                      <span>{cr.completedAt}</span>
                    </div>

                    {/* Points Awarded Badge (Los Puntos Que Dio) */}
                    <div className="bg-[#FFB800] text-[#1E1F3D] text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1 border border-amber-300">
                      <Trophy size={12} />
                      <span>+{cr.rewardPoints} Pts</span>
                    </div>
                  </div>

                  {/* Toggle Map / Photo button on top right of the preview */}
                  <button
                    onClick={() => toggleCardView(cr.id)}
                    className="absolute bottom-3 right-3 z-30 px-2.5 py-1 rounded-xl bg-white/90 backdrop-blur-md text-[#1E1F3D] hover:bg-white text-[10px] font-bold flex items-center gap-1 shadow-sm border border-white/80 active:scale-95 transition-all cursor-pointer"
                  >
                    {viewMode === 'map' ? (
                      <>
                        <ImageIcon size={12} className="text-[#6C7BFF]" />
                        <span>Photo</span>
                      </>
                    ) : (
                      <>
                        <Map size={12} className="text-[#6C7BFF]" />
                        <span>Map</span>
                      </>
                    )}
                  </button>

                  {/* Country Flag & City Badge on bottom left */}
                  <div className="absolute bottom-3 left-3 z-30 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#1E1F3D]/85 backdrop-blur-md text-white text-[10px] font-bold shadow-sm">
                    <div className="w-4 h-4 rounded-full overflow-hidden shrink-0 border border-white/40">
                      <img
                        src={cr.countryFlag}
                        alt={cr.country}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = '/assets/PT.png';
                        }}
                      />
                    </div>
                    <span>{cr.city}, {cr.country}</span>
                  </div>
                </div>

                {/* Card Main Body */}
                <div className="p-4 flex flex-col gap-3">
                  {/* Title & Route verification */}
                  <div>
                    <div className="flex items-center gap-1.5 text-emerald-600 text-[10px] font-bold uppercase tracking-wider mb-0.5">
                      <CheckCircle2 size={13} className="text-emerald-500" />
                      <span>Route Completed</span>
                    </div>
                    <h3 className="text-sm font-bold text-[#1E1F3D] leading-snug">
                      {cr.routeTitle}
                    </h3>
                  </div>

                  {/* Pertinent Route Info Chips (Tiempo, Cantidad de Personas, Distancia) */}
                  <div className="grid grid-cols-3 gap-2 bg-[#F7F8FD] p-2.5 rounded-2xl border border-[#EEF0FA]">
                    {/* Tiempo que tomó terminarla */}
                    <div className="flex flex-col">
                      <span className="text-[9px] font-bold text-[#8E90B0] flex items-center gap-1">
                        <Clock size={10} className="text-[#6C7BFF]" />
                        <span>Time Taken</span>
                      </span>
                      <span className="text-xs font-bold text-[#1E1F3D] mt-0.5">
                        {cr.completionTime}
                      </span>
                    </div>

                    {/* Cantidad de personas */}
                    <div className="flex flex-col">
                      <span className="text-[9px] font-bold text-[#8E90B0] flex items-center gap-1">
                        <Users size={10} className="text-[#6C7BFF]" />
                        <span>Companions</span>
                      </span>
                      <span className="text-xs font-bold text-[#1E1F3D] mt-0.5">
                        {cr.participantsCount} Explorers
                      </span>
                    </div>

                    {/* Distance / Checkpoints */}
                    <div className="flex flex-col">
                      <span className="text-[9px] font-bold text-[#8E90B0] flex items-center gap-1">
                        <MapPin size={10} className="text-[#6C7BFF]" />
                        <span>Route Trail</span>
                      </span>
                      <span className="text-xs font-bold text-[#1E1F3D] mt-0.5">
                        {cr.distanceKm} km
                      </span>
                    </div>
                  </div>

                  {/* Con qué usuarios la hizo (Companions Row) */}
                  <div className="flex flex-col gap-1.5 pt-1">
                    <span className="text-[10px] font-bold text-[#8E90B0] uppercase tracking-wider">
                      Expedition Team ({cr.participants.length})
                    </span>

                    <div className="flex flex-wrap items-center gap-2">
                      {cr.participants.map((p, pIdx) => {
                        const isMe = p.id === currentUser.id;
                        return (
                          <button
                            key={pIdx}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCompanionClick(p);
                            }}
                            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-xs transition-all cursor-pointer hover:shadow-xs active:scale-95 ${
                              isMe
                                ? 'bg-[#EEF0FF] border-[#D6DCFA] text-[#6C7BFF] font-bold'
                                : 'bg-white border-[#EEF0FA] text-[#1E1F3D] font-medium hover:border-[#7C82ED]/60'
                            }`}
                          >
                            <img
                              src={p.avatar || '/assets/TianaAvatar.png'}
                              alt={p.name}
                              className="w-5 h-5 rounded-full object-cover shrink-0 ring-1 ring-white"
                              onError={(e) => {
                                (e.currentTarget as HTMLImageElement).src = '/assets/TianaAvatar.png';
                              }}
                            />
                            <span className="text-[11px] truncate max-w-[95px]">
                              {isMe ? 'You (Tiana)' : p.name.split(' ')[0]}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Footer Action Button */}
                  <div className="pt-2 border-t border-[#EEF0FA] flex items-center justify-between">
                    <span className="text-[10px] text-[#A5A7C4] font-medium">
                      Logged in European Destinations
                    </span>

                    <button
                      onClick={() => setSelectedCompletedRoute(cr)}
                      className="px-3.5 py-1.5 rounded-xl bg-[#F4F6FB] hover:bg-[#EEF0FF] text-[#6C7BFF] font-bold text-xs flex items-center gap-1 active:scale-95 transition-all cursor-pointer"
                    >
                      <span>View Log</span>
                      <ChevronRight size={13} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* DETAIL MODAL FOR A COMPLETED ROUTE */}
      {selectedCompletedRoute && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="w-full max-w-sm bg-white rounded-[32px] p-5 shadow-2xl animate-scaleUp max-h-[90vh] overflow-y-auto no-scrollbar relative flex flex-col gap-4">
            <button
              onClick={() => setSelectedCompletedRoute(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#F4F6FB] flex items-center justify-center text-[#7A7C99] hover:text-[#1E1F3D] cursor-pointer z-20"
            >
              <X size={16} />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                <Award size={22} />
              </div>
              <div className="min-w-0 pr-6">
                <span className="text-[10px] font-bold text-[#6C7BFF] uppercase tracking-wider block">
                  Expedition Certificate
                </span>
                <h3 className="text-sm font-bold text-[#1E1F3D] leading-tight truncate">
                  {selectedCompletedRoute.routeTitle}
                </h3>
              </div>
            </div>

            {/* Route Map Preview in Modal */}
            <div className="w-full h-44 rounded-2xl overflow-hidden border border-[#EEF0FA]">
              <RouteMapPreview
                route={routes.find((r) => r.id === selectedCompletedRoute.routeId)}
                title={selectedCompletedRoute.routeTitle}
                checkpointsCount={selectedCompletedRoute.checkpointsCount}
              />
            </div>

            {/* Detailed Recap Grid */}
            <div className="grid grid-cols-2 gap-2.5 text-left">
              <div className="p-3 bg-[#F7F8FD] rounded-2xl border border-[#EEF0FA]">
                <span className="text-[10px] font-bold text-[#8E90B0] block">Date Completed</span>
                <span className="text-xs font-bold text-[#1E1F3D] mt-0.5 block">
                  {selectedCompletedRoute.completedAt}
                </span>
              </div>
              <div className="p-3 bg-[#F7F8FD] rounded-2xl border border-[#EEF0FA]">
                <span className="text-[10px] font-bold text-[#8E90B0] block">Time Elapsed</span>
                <span className="text-xs font-bold text-[#1E1F3D] mt-0.5 block">
                  {selectedCompletedRoute.completionTime}
                </span>
              </div>
              <div className="p-3 bg-[#F7F8FD] rounded-2xl border border-[#EEF0FA]">
                <span className="text-[10px] font-bold text-[#8E90B0] block">Points Awarded</span>
                <span className="text-xs font-bold text-[#FFB800] mt-0.5 flex items-center gap-1">
                  <Trophy size={13} />
                  <span>+{selectedCompletedRoute.rewardPoints} Adventure Pts</span>
                </span>
              </div>
              <div className="p-3 bg-[#F7F8FD] rounded-2xl border border-[#EEF0FA]">
                <span className="text-[10px] font-bold text-[#8E90B0] block">Location</span>
                <div className="flex items-center gap-1 mt-0.5">
                  <img
                    src={selectedCompletedRoute.countryFlag}
                    alt={selectedCompletedRoute.country}
                    className="w-4 h-4 rounded-full object-cover shrink-0"
                  />
                  <span className="text-xs font-bold text-[#1E1F3D] truncate">
                    {selectedCompletedRoute.city}, {selectedCompletedRoute.country}
                  </span>
                </div>
              </div>
            </div>

            {/* Team participants list */}
            <div>
              <span className="text-xs font-bold text-[#1E1F3D] block mb-2">
                Participants ({selectedCompletedRoute.participants.length} Explorers)
              </span>
              <div className="flex flex-col gap-2">
                {selectedCompletedRoute.participants.map((p, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setSelectedCompletedRoute(null);
                      handleCompanionClick(p);
                    }}
                    className="flex items-center justify-between p-2.5 rounded-2xl bg-[#F7F8FD] hover:bg-[#EEF0FF] border border-[#EEF0FA] cursor-pointer transition-all active:scale-[0.98]"
                  >
                    <div className="flex items-center gap-2.5">
                      <img
                        src={p.avatar || '/assets/TianaAvatar.png'}
                        alt={p.name}
                        className="w-8 h-8 rounded-full object-cover ring-2 ring-white"
                      />
                      <div>
                        <span className="text-xs font-bold text-[#1E1F3D] block">
                          {p.name}
                        </span>
                        <span className="text-[10px] text-[#8E90B0]">
                          {p.id === currentUser.id ? 'You • Expedition Leader' : 'Tap to view profile'}
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-[#6C7BFF] bg-[#EEF0FF] px-2.5 py-1 rounded-full border border-[#D6DCFA]">
                      View Profile
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setSelectedCompletedRoute(null)}
              className="w-full py-2.5 rounded-2xl bg-[#7C82ED] text-white font-bold text-xs active:scale-95 transition-all cursor-pointer"
            >
              Close Logbook
            </button>
          </div>
        </div>
      )}

      {/* End of traveling tab */}
    </div>
  );
};
