'use client';

import React, { useState } from 'react';
import { useEnigameStore } from '@/store/useEnigameStore';
import { ChevronLeft, History, ArrowUpRight, ArrowDownLeft, Compass, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';

export const ActivityView: React.FC = () => {
  const { setPointsSubView, activities, points } = useEnigameStore();
  const [filter, setFilter] = useState<'all' | 'earned' | 'redeemed'>('all');

  const filteredActivities = activities.filter((act) => {
    if (filter === 'earned') return act.pointsDelta > 0;
    if (filter === 'redeemed') return act.pointsDelta < 0 || act.type === 'redeem';
    return true;
  });

  // Calculate stats
  const totalEarned = activities.reduce((acc, curr) => curr.pointsDelta > 0 ? acc + curr.pointsDelta : acc, 0);
  const totalCompletedRoutes = activities.filter(a => a.type === 'route_complete').length || 1;

  return (
    <div className="w-full min-h-screen pb-24 bg-[#F4F6FB] flex flex-col animate-modal-screen select-none relative">
      {/* Curved Purple Header matching Figma 08 */}
      <div className="relative bg-[#8E97FD] rounded-b-[38px] pt-8 pb-6 px-6 text-white text-center shadow-md shrink-0 z-20">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => setPointsSubView('hub')}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-all cursor-pointer active:scale-95"
            title="Back to Points"
            aria-label="Back"
          >
            <ChevronLeft size={22} />
          </button>
          <div className="flex items-center gap-2">
            <History size={18} className="text-[#FFB800]" />
            <h1 className="text-base font-extrabold tracking-wide">Points/Expeditions Activity</h1>
          </div>
          <div className="w-9" />
        </div>

        <p className="text-xs text-white/80 font-medium max-w-xs mx-auto">
          Complete ledger of your mystery expeditions, deciphered puzzles, and reward redemptions.
        </p>

        {/* Filter Pills */}
        <div className="flex items-center justify-center gap-2 mt-4 bg-white/15 p-1 rounded-full max-w-[300px] mx-auto backdrop-blur-xs">
          {(['all', 'earned', 'redeemed'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-1 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer active:scale-95 ${
                filter === f
                  ? 'bg-white text-[#8E97FD] shadow-sm animate-pill-pop ring-2 ring-white/60'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              {f === 'all' && 'All Activity'}
              {f === 'earned' && 'Earned (+)'}
              {f === 'redeemed' && 'Redeemed (-)'}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Body */}
      <div className="px-5 pt-5 flex-1 flex flex-col gap-5">
        {/* Stat Summary Cards - Reusing Latest Expeditions Style */}
        <div className="grid grid-cols-3 gap-3 animate-card-stagger stagger-1">
          <div className="bg-white rounded-2xl p-3.5 border border-[#EAEFFE] shadow-xs flex flex-col items-center text-center">
            <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-1">
              <ArrowUpRight size={16} />
            </div>
            <span className="text-xs font-semibold text-[#1E1F3D]">+{totalEarned}</span>
            <span className="text-[10px] text-[#7A7C99] font-medium">Earned Pts</span>
          </div>

          <div className="bg-white rounded-2xl p-3.5 border border-[#EAEFFE] shadow-xs flex flex-col items-center text-center">
            <div className="w-8 h-8 rounded-full bg-[#EEF0FF] text-[#8E97FD] flex items-center justify-center mb-1">
              <Compass size={16} />
            </div>
            <span className="text-xs font-semibold text-[#1E1F3D]">{totalCompletedRoutes}</span>
            <span className="text-[10px] text-[#7A7C99] font-medium">Routes Done</span>
          </div>

          <div className="bg-white rounded-2xl p-3.5 border border-[#EAEFFE] shadow-xs flex flex-col items-center text-center">
            <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mb-1">
              <Sparkles size={16} />
            </div>
            <span className="text-xs font-semibold text-[#1E1F3D]">{points}</span>
            <span className="text-[10px] text-[#7A7C99] font-medium">Balance Pts</span>
          </div>
        </div>

        {/* Section Header */}
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#7A7C99]">
            Latest Records ({filteredActivities.length})
          </span>
          <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
            <ShieldCheck size={13} /> Verified by Enigame
          </span>
        </div>

        {/* List of Activity Records */}
        <div className="flex flex-col gap-3">
          {filteredActivities.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 border border-[#EAEFFE] text-center flex flex-col items-center gap-2">
              <Compass size={32} className="text-[#8E97FD] opacity-60" />
              <h3 className="text-xs font-bold text-[#1E1F3D]">No records found</h3>
              <p className="text-[11px] text-[#7A7C99]">Complete routes and scan monument QR codes to earn points.</p>
            </div>
          ) : (
            filteredActivities.map((item, idx) => {
              const isPositive = item.pointsDelta > 0;

              return (
                <div
                  key={item.id}
                  className={`animate-card-stagger stagger-${Math.min(idx + 1, 8)} bg-white rounded-2xl p-4 border border-[#EAEFFE] hover:border-[#8E97FD]/40 shadow-xs flex items-center justify-between gap-3 transition-all`}
                >
                  {/* Left: Type Icon */}
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
                      isPositive
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'bg-purple-50 text-purple-600'
                    }`}>
                      {item.type === 'route_complete' && <Compass size={22} />}
                      {item.type === 'qr_scan' && <CheckCircle2 size={22} />}
                      {item.type === 'bonus' && <Sparkles size={22} />}
                      {item.type === 'redeem' && <ArrowDownLeft size={22} />}
                    </div>

                    <div>
                      <h4 className="text-xs font-semibold text-[#1E1F3D] leading-snug">
                        {item.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-[#7A7C99]">
                          {item.timestamp}
                        </span>
                        <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded-md bg-[#F4F6FB] text-[#7A7C99] uppercase">
                          {item.type.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Points Delta Badge */}
                  <div className="text-right shrink-0">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full block ${
                      isPositive
                        ? 'bg-emerald-100/70 text-emerald-700'
                        : 'bg-purple-100/70 text-purple-700'
                    }`}>
                      {isPositive ? `+${item.pointsDelta}` : item.pointsDelta} Pts
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
