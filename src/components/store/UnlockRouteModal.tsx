'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useEnigameStore } from '@/store/useEnigameStore';
import { Route, DIFFICULTY_LABELS } from '@/types';
import { X, Sparkles, Clock, Star, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

export const getRoutePointCost = (rt: Route): number => {
  if (rt.id === 'route-braganca-medieval') return 0; // Free starter
  if (rt.difficulty === 1) return 400;
  if (rt.difficulty === 2) return 550;
  if (rt.difficulty === 3) return 700;
  return 850;
};

interface UnlockRouteModalProps {
  route: Route | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export const UnlockRouteModal: React.FC<UnlockRouteModalProps> = ({
  route,
  onClose,
  onSuccess,
}) => {
  const { points, buyRouteWithPoints, showToast } = useEnigameStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (route) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [route]);

  if (!mounted || !route) return null;

  const cost = getRoutePointCost(route);
  const canAfford = points >= cost;
  const remaining = points - cost;

  const handleConfirm = () => {
    if (!canAfford) {
      showToast(`You need ${cost - points} more Explorer Points to unlock this route!`, 'error');
      return;
    }

    const success = buyRouteWithPoints(route.id, cost);
    if (success) {
      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#8E97FD', '#FFB800', '#6979F8', '#22C55E'],
        });
      } catch {
        // Safe fallback
      }
      showToast(`"${route.title}" Unlocked for ${cost} Points!`, 'success');
      onSuccess?.();
      onClose();
    }
  };

  const modalContent = (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/65 backdrop-blur-sm p-4 animate-fadeIn select-none"
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-[32px] p-6 w-full max-w-[340px] shadow-2xl text-center animate-scaleUp flex flex-col items-center gap-3 relative border border-[#EAEFFE]"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#F4F6FB] flex items-center justify-center text-[#7A7C99] hover:text-[#1E1F3D] cursor-pointer transition-colors active:scale-95"
          aria-label="Close"
        >
          <X size={16} />
        </button>

        {/* Clean Star / Sparkles Icon - Without background color and without shadow */}
        <div className="flex items-center justify-center mb-0.5">
          <Sparkles size={36} className="text-[#FFB800]" />
        </div>

        {/* Modal Title */}
        <div>
          <h3 className="text-base font-bold text-[#1E1F3D]">Unlock Route</h3>
          <p className="text-xs text-[#7A7C99] mt-0.5">
            Confirm your route exploration unlock
          </p>
        </div>

        {/* Route Summary Card */}
        <div className="w-full bg-[#F7F8FE] rounded-2xl p-3 border border-[#EAEFFE] text-left flex flex-col gap-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#FFB800]">
            {route.city} • {route.category}
          </span>
          <h4 className="text-xs font-bold text-[#1E1F3D] line-clamp-1">
            {route.title}
          </h4>
          <div className="flex items-center gap-3 text-[11px] text-[#7A7C99] pt-1 border-t border-[#EEF0FA]">
            <span className="flex items-center gap-1 font-medium">
              <Clock size={12} className="text-[#8E97FD]" />
              {route.durationMinutes} min
            </span>
            <span className="flex items-center gap-1 font-medium">
              <Star size={12} className="text-amber-400 fill-amber-400" />
              Diff {route.difficulty}/4 ({DIFFICULTY_LABELS[route.difficulty]})
            </span>
          </div>
        </div>

        {/* Points Breakdown Box */}
        <div className="w-full bg-[#F4F6FC] rounded-2xl p-3.5 border border-[#EAEFFE] flex flex-col gap-2">
          {/* Cost Row */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#7A7C99] font-medium">Price in Points:</span>
            <div className="flex items-center gap-1 font-bold">
              <img src="/assets/StatusCoins.png" alt="Coins" className="w-4 h-4 object-contain" />
              <span className="text-sm font-extrabold text-[#7C3AED]">
                {cost === 0 ? 'Free Starter' : `${cost.toLocaleString()} Points`}
              </span>
            </div>
          </div>

          <div className="w-full h-px bg-[#EAEFFE]" />

          {/* Current Balance */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#7A7C99] font-medium">Your Current Balance:</span>
            <span className="font-bold text-[#1E1F3D]">
              {points.toLocaleString()} Points
            </span>
          </div>

          {/* Balance After */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#7A7C99] font-medium">Balance After Unlock:</span>
            <span
              className={`font-bold ${
                canAfford ? 'text-emerald-600' : 'text-red-500'
              }`}
            >
              {canAfford ? `${remaining.toLocaleString()} Points` : `Need ${cost - points} more`}
            </span>
          </div>
        </div>

        {!canAfford && (
          <div className="w-full p-2.5 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-600 font-semibold text-left">
            <AlertCircle size={15} className="shrink-0" />
            <span>You do not have enough Explorer Points for this route yet.</span>
          </div>
        )}

        {/* Actions Buttons */}
        <div className="w-full flex flex-col gap-2 mt-1">
          <button
            onClick={handleConfirm}
            disabled={!canAfford}
            className={`w-full h-11 rounded-2xl font-bold text-xs tracking-wide shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 ${
              canAfford
                ? 'bg-gradient-to-r from-[#6979F8] to-[#8E97FD] hover:opacity-95 text-white shadow-indigo-300/40'
                : 'bg-[#EEF0FA] text-[#A5A7C4] cursor-not-allowed shadow-none'
            }`}
          >
            <Sparkles size={14} className={canAfford ? 'text-[#FFD269]' : 'text-[#A5A7C4]'} />
            <span>
              {cost === 0 ? 'Confirm Free Unlock' : `Confirm & Unlock (${cost} Pts)`}
            </span>
          </button>

          <button
            onClick={onClose}
            className="w-full h-10 rounded-2xl bg-[#F4F6FB] hover:bg-[#EEF0FA] text-[#7A7C99] hover:text-[#1E1F3D] font-bold text-xs transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
