'use client';

import React, { useState } from 'react';
import { useEnigameStore } from '@/store/useEnigameStore';
import { X, Flashlight, QrCode, KeyRound, HelpCircle, CheckCircle } from 'lucide-react';
import { RiddleSolveModal } from './RiddleSolveModal';

export const QRScannerView: React.FC = () => {
  const { isScannerOpen, setScannerOpen, routes, activeRouteId, setActiveRiddleCheckpoint } = useEnigameStore();
  const [isTorchOn, setIsTorchOn] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [showManualInput, setShowManualInput] = useState(false);

  if (!isScannerOpen) return null;

  const activeRoute = routes.find(r => r.id === activeRouteId) || routes[0];
  const targetCheckpoint = activeRoute?.checkpoints?.find(c => !c.isCompleted) || activeRoute?.checkpoints?.[0] || { id: 'cp-1', name: 'Torre de Menagem', qrToken: 'ENIGAME-BRAGANCA-CP1' };

  const handleSimulateScan = (codeToScan?: string) => {
    const code = codeToScan || targetCheckpoint?.qrToken || 'ENIGAME-BRAGANCA-CP1';
    const matchedCp = activeRoute.checkpoints.find(c => c.qrToken === code) || targetCheckpoint;
    
    setScannerOpen(false);
    setActiveRiddleCheckpoint(matchedCp);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col justify-between text-white animate-fadeIn overflow-hidden">
      <RiddleSolveModal />

      {/* Simulated Camera Viewfinder Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          src="https://images.unsplash.com/photo-1599827552599-eadf5e0a6d09?w=1000&auto=format&fit=crop&q=80"
          alt="Monument Camera Feed"
          className="w-full h-full object-cover scale-105 filter brightness-75 contrast-125"
        />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />
      </div>

      {/* Top Header HUD */}
      <div className="relative z-20 px-6 pt-12 flex items-center justify-between">
        <button
          onClick={() => setScannerOpen(false)}
          className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center hover:bg-black/60 transition-colors"
          aria-label="Close Scanner"
        >
          <X size={20} />
        </button>

        {/* Objective Badge */}
        <div className="px-3.5 py-1.5 rounded-full bg-[#7C82ED]/80 backdrop-blur-md text-xs font-bold shadow-lg border border-white/20">
          Target: {targetCheckpoint?.name || 'Torre de Menagem'}
        </div>

        {/* Torch Toggle */}
        <button
          onClick={() => setIsTorchOn(!isTorchOn)}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
            isTorchOn ? 'bg-amber-400 text-black shadow-lg shadow-amber-300/50' : 'bg-black/40 backdrop-blur-md text-white'
          }`}
          aria-label="Flashlight"
        >
          <Flashlight size={20} />
        </button>
      </div>

      {/* Center Reticle (Lavender Scanning Reticle) */}
      <div className="relative z-10 flex flex-col items-center justify-center my-auto">
        <div className="relative w-64 h-64 rounded-3xl overflow-hidden shadow-2xl">
          {/* 4 Glowing Lavender Corners */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-[#7C82ED] rounded-tl-2xl shadow-[0_0_12px_#7C82ED]" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-[#7C82ED] rounded-tr-2xl shadow-[0_0_12px_#7C82ED]" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-[#7C82ED] rounded-bl-2xl shadow-[0_0_12px_#7C82ED]" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-[#7C82ED] rounded-br-2xl shadow-[0_0_12px_#7C82ED]" />

          {/* Animated Laser Scanning Beam */}
          <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#7C82ED] to-transparent shadow-[0_0_8px_#7C82ED] animate-scan" />

          {/* Center Target Marker */}
          <div className="absolute inset-0 flex items-center justify-center opacity-30">
            <QrCode size={48} className="text-[#7C82ED]" />
          </div>
        </div>

        {/* Quick Simulation Trigger Pill */}
        <button
          onClick={() => handleSimulateScan()}
          className="mt-6 px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-2xl text-xs font-bold border border-white/30 flex items-center gap-2 shadow-lg active:scale-95 transition-all"
        >
          <CheckCircle size={15} className="text-emerald-400" />
          <span>Simulate QR Tag Recognition</span>
        </button>
      </div>

      {/* Bottom Floating Glass Card */}
      <div className="relative z-20 px-6 pb-10">
        <div className="bg-black/60 backdrop-blur-xl border border-white/15 rounded-3xl p-5 shadow-2xl">
          <h3 className="text-base font-extrabold text-white">Scan Clue Marker</h3>
          <p className="text-xs text-white/80 mt-1 leading-relaxed">
            Align the Enigame QR code plaque on this monument to unlock the next riddle.
          </p>

          {showManualInput ? (
            <div className="mt-3.5 flex items-center gap-2">
              <input
                type="text"
                placeholder="e.g. ENIGAME-BRAG-02"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                className="flex-1 h-10 px-3.5 bg-white/10 rounded-xl text-xs text-white placeholder-white/50 border border-white/20 focus:outline-none"
              />
              <button
                onClick={() => handleSimulateScan(manualCode)}
                className="px-4 h-10 bg-[#7C82ED] text-white text-xs font-bold rounded-xl"
              >
                Verify
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between mt-4">
              <button
                onClick={() => setShowManualInput(true)}
                className="text-xs font-semibold text-[#8D93FF] flex items-center gap-1.5 hover:underline"
              >
                <KeyRound size={14} />
                <span>Enter code manually</span>
              </button>

              <button
                onClick={() => handleSimulateScan()}
                className="text-xs font-semibold text-amber-300 flex items-center gap-1.5 hover:underline"
              >
                <HelpCircle size={14} />
                <span>Need a Hint?</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
