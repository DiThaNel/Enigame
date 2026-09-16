'use client';

import React from 'react';
import { useEnigameStore } from '@/store/useEnigameStore';
import { Plus, Calendar, Clock, Navigation, Trophy, Users, Check } from 'lucide-react';

export const TravelingTab: React.FC = () => {
  const { expeditions, joinExpedition, setHostExpeditionOpen, currentUser } = useEnigameStore();

  return (
    <div className="w-full px-5 pt-3 pb-24 animate-fadeIn">
      {/* Host CTA */}
      <button
        onClick={() => setHostExpeditionOpen(true)}
        className="animate-card-stagger w-full h-12 rounded-2xl bg-gradient-to-r from-[#7C82ED] to-[#6C5CE7] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-indigo-300/30 hover:opacity-95 active:scale-[0.98] transition-all mb-4 cursor-pointer"
      >
        <Plus size={18} />
        <span>Host an Expedition</span>
      </button>

      {/* Expeditions List */}
      <div className="flex flex-col gap-4">
        {expeditions.map((exp, idx) => {
          const isJoined = exp.participants.some(p => p.id === currentUser.id);

          return (
            <div
              key={exp.id}
              style={{ animationDelay: `${(idx + 1) * 70}ms` }}
              className="animate-card-stagger bg-white rounded-3xl overflow-hidden border border-[#EEF0FA] shadow-sm hover:shadow-md transition-all"
            >
              <div className="relative h-44 w-full">
                <img
                  src={exp.coverImage}
                  alt={exp.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-[#1E1F3D] text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                  <Calendar size={13} className="text-[#7C82ED]" />
                  <span>{exp.date}, {exp.time}</span>
                </div>

                <span className="absolute top-3 right-3 bg-[#FFB800] text-[#1E1F3D] text-[10px] font-black px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1">
                  <Trophy size={11} /> +{exp.rewardPoints} Pts
                </span>

                <div className="absolute bottom-3 left-4 right-4 text-white">
                  <span className="text-[10px] font-semibold text-indigo-200 uppercase tracking-wider">
                    {exp.difficulty} • {exp.distanceKm} km
                  </span>
                  <h3 className="text-base font-bold leading-tight mt-0.5">{exp.title}</h3>
                </div>
              </div>

              <div className="p-4 flex items-center justify-between">
                {/* Participants Avatars */}
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2.5 overflow-hidden">
                    {exp.participants.slice(0, 4).map((p, i) => (
                      <img
                        key={i}
                        src={p.avatar}
                        alt={p.name}
                        className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover"
                      />
                    ))}
                  </div>
                  <span className="text-xs font-semibold text-[#585A7E]">
                    {exp.participants.length}/{exp.maxParticipants} joined
                  </span>
                </div>

                <button
                  onClick={() => joinExpedition(exp.id)}
                  disabled={isJoined}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    isJoined
                      ? 'bg-emerald-100 text-emerald-700 flex items-center gap-1 cursor-default'
                      : 'bg-[#7C82ED] text-white hover:bg-[#6C5CE7] shadow-sm shadow-indigo-300/40 active:scale-95'
                  }`}
                >
                  {isJoined ? (
                    <>
                      <Check size={14} /> Joined
                    </>
                  ) : (
                    'Join Route'
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
