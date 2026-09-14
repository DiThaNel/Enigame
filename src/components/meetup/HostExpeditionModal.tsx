'use client';

import React, { useState } from 'react';
import { useEnigameStore } from '@/store/useEnigameStore';
import { X, Plus, Calendar, Clock, Sparkles } from 'lucide-react';
import { Difficulty } from '@/types';

export const HostExpeditionModal: React.FC = () => {
  const { isHostExpeditionOpen, setHostExpeditionOpen, createExpedition, routes } = useEnigameStore();
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('Tomorrow');
  const [time, setTime] = useState('17:00');
  const [maxParticipants, setMaxParticipants] = useState(6);
  const [difficulty, setDifficulty] = useState<Difficulty>('Medium');

  if (!isHostExpeditionOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    createExpedition({
      title,
      routeId: routes[0].id,
      coverImage: routes[0].coverImage,
      date,
      time,
      difficulty,
      distanceKm: 2.8,
      rewardPoints: 300,
      maxParticipants,
    });
    setHostExpeditionOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-[430px] bg-white rounded-t-[36px] sm:rounded-[36px] p-6 shadow-2xl animate-slideUp">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-extrabold text-[#1E1F3D]">Host an Expedition</h3>
            <p className="text-xs text-[#7A7C99]">Plan an outdoor mystery route for adventurers</p>
          </div>
          <button
            onClick={() => setHostExpeditionOpen(false)}
            className="w-8 h-8 rounded-full bg-[#F4F6FB] flex items-center justify-center text-[#7A7C99] hover:text-[#1E1F3D]"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-bold text-[#1E1F3D] block mb-1">Expedition Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Bragança Secret Citadel Walk"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl border border-[#EEF0FA] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#7C82ED]/40"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-[#1E1F3D] block mb-1">Date</label>
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl border border-[#EEF0FA] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#7C82ED]/40"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-[#1E1F3D] block mb-1">Meeting Time</label>
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl border border-[#EEF0FA] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#7C82ED]/40"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-[#1E1F3D] block mb-1">Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                className="w-full h-11 px-3 rounded-xl border border-[#EEF0FA] text-xs font-semibold bg-white focus:outline-none focus:ring-2 focus:ring-[#7C82ED]/40 cursor-pointer"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-[#1E1F3D] block mb-1">Max Adventurers</label>
              <input
                type="number"
                min={2}
                max={12}
                value={maxParticipants}
                onChange={(e) => setMaxParticipants(Number(e.target.value))}
                className="w-full h-11 px-3.5 rounded-xl border border-[#EEF0FA] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#7C82ED]/40"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full h-12 rounded-2xl bg-gradient-to-r from-[#7C82ED] to-[#6C5CE7] text-white font-bold text-xs mt-2 shadow-lg shadow-indigo-300/40 hover:opacity-95 active:scale-95 transition-all"
          >
            Publish Expedition (+50 Host XP)
          </button>
        </form>
      </div>
    </div>
  );
};
