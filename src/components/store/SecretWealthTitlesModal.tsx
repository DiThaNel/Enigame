'use client';

import React, { useEffect } from 'react';
import { useEnigameStore } from '@/store/useEnigameStore';
import { HIDDEN_WEALTH_TITLES } from '@/types';
import { X, Lock, CheckCircle2, Crown, Coins } from 'lucide-react';

export const SecretWealthTitlesModal: React.FC = () => {
  const {
    wealthTitlesModalOpen,
    setWealthTitlesModalOpen,
    points,
    currentUser,
    updateProfile,
    showToast,
  } = useEnigameStore();

  // Scroll lock when modal is open
  useEffect(() => {
    if (wealthTitlesModalOpen) {
      const main = document.querySelector('main');
      if (main) {
        const prevOverflow = main.style.overflow;
        main.style.overflow = 'hidden';
        return () => {
          main.style.overflow = prevOverflow;
        };
      }
    }
  }, [wealthTitlesModalOpen]);

  if (!wealthTitlesModalOpen) return null;

  const handleEquip = (title: string, medalIcon: string) => {
    updateProfile({
      rankTitle: title,
      rankMedal: medalIcon,
    });
    showToast(`Equipped secret title: "${title}"!`, 'success');
  };

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/65 backdrop-blur-sm p-4 animate-fadeIn overscroll-contain select-none"
      onClick={() => setWealthTitlesModalOpen(false)}
    >
      <div
        className="w-full max-w-sm bg-white rounded-[32px] p-6 shadow-2xl flex flex-col max-h-[88vh] animate-scaleUp overflow-hidden border border-white/50"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Fixed Header */}
        <div className="flex items-center justify-between border-b border-[#EEF0FA] pb-3 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-500 shadow-2xs">
              <Crown size={18} />
            </div>
            <div>
              <h3 className="font-bold text-[#1E1F3D] text-sm leading-tight">
                Secret Wealth Titles
              </h3>
              <p className="text-[10px] text-[#8E90B0] font-medium">
                Dynamic titles based on currently held points
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setWealthTitlesModalOpen(false)}
            className="w-8 h-8 rounded-full bg-[#F4F6FB] flex items-center justify-center text-[#7A7C99] hover:text-[#1E1F3D] cursor-pointer active:scale-95 transition-all"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="text-xs text-[#585A7E] leading-relaxed space-y-3 text-left overflow-y-auto no-scrollbar py-3.5 overscroll-contain">
          {/* Current Spendable Wallet Balance Chip */}
          <div className="bg-gradient-to-br from-[#1E1F3D] to-[#2B2D5C] rounded-2xl p-3.5 text-white shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
                <Coins size={20} className="text-[#FFD269]" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-white/70 font-semibold uppercase tracking-wider">
                  Spendable Balance
                </span>
                <span className="text-base font-bold text-white tracking-wide">
                  {points.toLocaleString()} <span className="text-xs text-[#FFD269]">Pts</span>
                </span>
              </div>
            </div>
            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-white/15 text-white/90 border border-white/20">
              Active Wallet
            </span>
          </div>

          <p className="text-[11px] text-[#7A7C99] leading-snug px-0.5">
            These secret titles are <strong className="text-[#1E1F3D]">not unlocked by lifetime points</strong>. You must actively hold the required amount in your spendable wallet. If spent, the title locks until you hold that balance again!
          </p>

          {/* 4 Hidden Wealth Titles List */}
          <div className="flex flex-col gap-2.5 pt-1">
            {HIDDEN_WEALTH_TITLES.map((item) => {
              const isUnlocked = points >= item.requiredPoints;
              const isEquipped = currentUser.rankTitle === item.title;
              const progressPct = Math.min(100, Math.floor((points / item.requiredPoints) * 100));

              return (
                <div
                  key={item.id}
                  className={`p-3.5 rounded-2xl border transition-all ${
                    isUnlocked
                      ? isEquipped
                        ? 'bg-gradient-to-br from-[#FFFBEB] to-[#F5F3FF] border-[#FDE68A] shadow-sm ring-1 ring-[#F59E0B]/30'
                        : 'bg-white border-[#EAEFFE] hover:border-amber-300 shadow-2xs'
                      : 'bg-[#F9FAFE] border-[#EEF0FA] opacity-85'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center p-1.5 shrink-0 ${
                          isUnlocked
                            ? 'bg-gradient-to-br from-amber-100 to-amber-50 border border-amber-200 shadow-2xs'
                            : 'bg-gray-100 border border-gray-200'
                        }`}
                      >
                        <img
                          src={item.medalIcon}
                          alt={item.title}
                          className={`w-full h-full object-contain ${!isUnlocked ? 'grayscale opacity-60' : 'drop-shadow-xs'}`}
                        />
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h4 className="text-xs font-bold text-[#1E1F3D]">
                            {item.title}
                          </h4>
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full border ${
                              isUnlocked
                                ? 'bg-amber-50 text-amber-700 border-amber-200'
                                : 'bg-gray-100 text-gray-500 border-gray-200'
                            }`}
                          >
                            {item.badge}
                          </span>
                        </div>
                        <p className="text-[10px] text-[#8E90B0] mt-0.5 leading-snug">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    {/* Status Badge or Equip Button */}
                    <div className="shrink-0 flex items-center">
                      {isUnlocked ? (
                        isEquipped ? (
                          <span className="px-2.5 py-1 rounded-full bg-emerald-500 text-white text-[10px] font-bold flex items-center gap-1 shadow-2xs">
                            <CheckCircle2 size={11} /> Equipped
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleEquip(item.title, item.medalIcon)}
                            className="px-2.5 py-1 rounded-full bg-[#8E97FD] hover:bg-[#7C82ED] text-white text-[10px] font-bold shadow-xs cursor-pointer active:scale-95 transition-all"
                          >
                            Equip
                          </button>
                        )
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-400 text-[10px] font-bold flex items-center gap-1">
                          <Lock size={10} /> Locked
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Progress Bar for Locked Titles */}
                  {!isUnlocked && (
                    <div className="mt-2.5 pt-2 border-t border-[#EEF0FA]">
                      <div className="flex items-center justify-between text-[9px] font-bold text-[#8E90B0] mb-1">
                        <span>Holding Progress</span>
                        <span>{points.toLocaleString()} / {item.requiredPoints.toLocaleString()} Pts ({progressPct}%)</span>
                      </div>
                      <div className="w-full h-1.5 bg-[#EEF0FA] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-amber-400 to-[#8E97FD] rounded-full transition-all duration-500"
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Fixed Footer */}
        <div className="pt-3 border-t border-[#EEF0FA] shrink-0">
          <button
            type="button"
            onClick={() => setWealthTitlesModalOpen(false)}
            className="w-full h-11 rounded-2xl bg-[#8E97FD] hover:bg-[#7C82ED] text-white font-bold text-xs shadow-md transition-all cursor-pointer active:scale-[0.98]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
