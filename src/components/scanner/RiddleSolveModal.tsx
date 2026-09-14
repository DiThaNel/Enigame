'use client';

import React, { useState } from 'react';
import { useEnigameStore } from '@/store/useEnigameStore';
import { Sparkles, CheckCircle2, Trophy, HelpCircle, ArrowRight, X } from 'lucide-react';
import confetti from 'canvas-confetti';

export const RiddleSolveModal: React.FC = () => {
  const { activeRiddleCheckpoint, setActiveRiddleCheckpoint, completeCheckpoint } = useEnigameStore();
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!activeRiddleCheckpoint) return null;

  // Options for solving the riddle
  const options = [
    'The Romanesque Citadel Cistern & Five Arches',
    'The Celtic Boar Granite Pedestal',
    'The Keep Military Watchtower Arch',
    'The Castle Outer Ramparts'
  ];
  const correctAnswerIndex = 0;

  const handleSolve = () => {
    if (selectedAnswer === correctAnswerIndex || selectedAnswer !== null) {
      setIsSuccess(true);
      completeCheckpoint(activeRiddleCheckpoint.id);
      
      // Trigger festive confetti
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#7C82ED', '#FFB800', '#6C5CE7', '#10B981']
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-fadeIn">
      <div className="w-full max-w-[400px] bg-white rounded-[36px] overflow-hidden shadow-2xl p-6 text-center animate-slideUp relative">
        {!isSuccess && (
          <button
            onClick={() => setActiveRiddleCheckpoint(null)}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#F4F6FB] flex items-center justify-center text-[#7A7C99] hover:text-[#1E1F3D]"
          >
            <X size={18} />
          </button>
        )}

        {isSuccess ? (
          <div className="py-6 flex flex-col items-center animate-fadeIn">
            <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4 shadow-lg shadow-emerald-200/50">
              <CheckCircle2 size={44} />
            </div>
            
            <span className="text-xs font-bold text-[#7C82ED] uppercase tracking-wider">
              Enigma Solved!
            </span>
            <h2 className="text-2xl font-black text-[#1E1F3D] mt-1">Checkpoint Cleared!</h2>
            <p className="text-xs text-[#7A7C99] mt-2 px-4">
              You deciphered the secret of {activeRiddleCheckpoint.name}. Your logbook has been updated.
            </p>

            <div className="flex items-center gap-2 mt-5 px-5 py-2.5 bg-[#FFF8E7] text-[#B45309] rounded-2xl border border-[#FDE68A]">
              <Trophy size={18} className="text-[#FFB800]" />
              <span className="text-sm font-extrabold">+100 Adventure Points</span>
            </div>

            <button
              onClick={() => {
                setActiveRiddleCheckpoint(null);
                setIsSuccess(false);
              }}
              className="w-full h-12 rounded-2xl bg-gradient-to-r from-[#7C82ED] to-[#6C5CE7] text-white font-bold text-xs mt-6 shadow-md shadow-indigo-300/40 hover:opacity-95 active:scale-95 transition-all"
            >
              Continue Route
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-[#EEF0FF] text-[#7C82ED] flex items-center justify-center mb-3">
              <Sparkles size={28} />
            </div>

            <span className="text-[11px] font-bold text-[#7C82ED] uppercase tracking-wider">
              {activeRiddleCheckpoint.landmark}
            </span>
            <h2 className="text-lg font-black text-[#1E1F3D] mt-1 leading-snug">
              {activeRiddleCheckpoint.name}
            </h2>

            <div className="w-full bg-[#F4F6FB] p-4 rounded-2xl mt-4 border border-[#EEF0FA] text-left">
              <p className="text-xs font-semibold text-[#585A7E] italic leading-relaxed">
                "{activeRiddleCheckpoint.riddle}"
              </p>
            </div>

            {/* Hint Box */}
            {showHint ? (
              <div className="w-full mt-3 p-3 bg-amber-50 rounded-xl border border-amber-200 text-left text-[11px] text-amber-800">
                <strong>Clue:</strong> {activeRiddleCheckpoint.hint}
              </div>
            ) : (
              <button
                onClick={() => setShowHint(true)}
                className="flex items-center gap-1 text-[11px] font-semibold text-[#7C82ED] mt-2.5 hover:underline"
              >
                <HelpCircle size={14} />
                <span>Need a Hint?</span>
              </button>
            )}

            {/* Riddle Options */}
            <div className="w-full flex flex-col gap-2 mt-4 text-left">
              {options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedAnswer(i)}
                  className={`w-full p-3 rounded-2xl border text-xs font-semibold text-left transition-all active:scale-[0.99] ${
                    selectedAnswer === i
                      ? 'border-[#7C82ED] bg-[#EEF0FF] text-[#6C5CE7] font-bold ring-2 ring-[#7C82ED]/30'
                      : 'border-[#EEF0FA] bg-white text-[#1E1F3D] hover:bg-[#F4F6FB]'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>

            <button
              onClick={handleSolve}
              disabled={selectedAnswer === null}
              className={`w-full h-12 rounded-2xl font-bold text-xs mt-5 flex items-center justify-center gap-2 shadow-md transition-all ${
                selectedAnswer !== null
                  ? 'bg-gradient-to-r from-[#7C82ED] to-[#6C5CE7] text-white shadow-indigo-300/40 hover:opacity-95 active:scale-95'
                  : 'bg-[#EEF0FA] text-[#8E90B0] cursor-not-allowed'
              }`}
            >
              <span>Submit Answer</span>
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
