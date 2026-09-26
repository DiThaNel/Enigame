'use client';

import React, { useState } from 'react';
import { useEnigameStore } from '@/store/useEnigameStore';
import {
  Check,
  ChevronRight,
  Gift,
  Copy,
  CheckCircle2,
  Calendar,
  CreditCard,
  MapPin,
  Sparkles,
  ReceiptText
} from 'lucide-react';

export const PurchaseSuccessView: React.FC = () => {
  const {
    lastPayment,
    setRoutesViewStep,
    setPurchaseHistoryOpen,
    setActiveTab,
    showToast,
  } = useEnigameStore();

  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [allCopied, setAllCopied] = useState(false);

  const orderNumber = lastPayment?.orderNumber || '№64913158';
  const routeTitle = lastPayment?.routeTitle || 'The Skeletons of Bragança: Uncovering a Mystery';
  const city = lastPayment?.city || 'Bragança';
  const totalAmount = lastPayment?.totalAmount !== undefined ? lastPayment.totalAmount : 30;
  const isGift = !!lastPayment?.isGift;
  const giftCodes = lastPayment?.giftCodes || (isGift ? ['IW-BRAG-841831'] : []);
  const cardLast4 = lastPayment?.cardLast4 || '3947';
  const timestamp = lastPayment?.timestamp || new Date().toLocaleString();

  const handleCopyCode = (code: string, idx: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(idx);
    showToast(`Code ${code} copied!`, 'success');
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleCopyAllCodes = () => {
    navigator.clipboard.writeText(giftCodes.join('\n'));
    setAllCopied(true);
    showToast('All gift codes copied to clipboard!', 'success');
    setTimeout(() => setAllCopied(false), 2500);
  };

  const handleContinueExploring = () => {
    setRoutesViewStep('city-routes');
    setActiveTab('routes');
  };

  const handleOpenDetails = () => {
    setPurchaseHistoryOpen(true);
  };

  return (
    <div
      className="w-full min-h-screen pb-24 bg-[#EEF0FA] flex flex-col items-center px-4 pt-5 select-none relative overflow-y-auto no-scrollbar animate-route-enter"
      style={{
        backgroundImage: 'url(/assets/Lenguaje.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'top center',
      }}
    >
      {/* Top Content: Illustration & Status */}
      <div className="w-full flex flex-col items-center text-center relative z-10">
        {/* Figma Illustration 07.6 */}
        <div className="relative w-36 h-36 mb-1 flex items-center justify-center">
          <img
            src="/assets/PurchaseSuccess.png"
            alt="Purchase Success"
            className="w-full h-full object-contain drop-shadow-md animate-popIn"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = '/assets/Approved.png';
            }}
          />

          {/* Green Status Badge */}
          <div className="absolute -bottom-1 w-8 h-8 rounded-full bg-[#22C55E] border-2 border-white shadow-md flex items-center justify-center text-white animate-pill-pop">
            <Check size={18} strokeWidth={3} />
          </div>
        </div>

        {/* Headings matching Figma 07.6 */}
        <h1 className="text-2xl font-bold text-[#1E1F3D] tracking-tight mt-1.5 drop-shadow-xs">
          Congrats!
        </h1>
        <p className="text-xs text-[#585A7E] font-medium mt-0.5 max-w-[280px]">
          Your purchase was placed successfully!
        </p>

        {/* Order Details Card (positioned right above buttons without huge gap) */}
        <div className="w-full bg-white/95 backdrop-blur-md rounded-[28px] p-4.5 border border-white/60 shadow-lg shadow-indigo-950/5 mt-3.5 text-left flex flex-col gap-3 animate-card-stagger">
          {/* Header Row: Order Number & Timestamp */}
          <div className="flex items-center justify-between pb-2.5 border-b border-[#EEF0FA]">
            <div>
              <span className="text-[10px] font-bold text-[#8E90B0] uppercase tracking-wider block">
                Order Number
              </span>
              <span className="text-xs font-mono font-bold text-[#1E1F3D]">
                {orderNumber}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold text-[#8E90B0] uppercase tracking-wider block">
                Date &amp; Time
              </span>
              <span className="text-[11px] font-medium text-[#585A7E]">
                {timestamp}
              </span>
            </div>
          </div>

          {/* Route details */}
          <div className="flex items-start gap-2.5">
            <div className="w-11 h-11 rounded-xl bg-[#8E97FD]/15 flex items-center justify-center shrink-0 text-[#6979F8]">
              <MapPin size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xs font-bold text-[#1E1F3D] leading-snug">
                {routeTitle}
              </h2>
              <p className="text-[11px] text-[#8E90B0] mt-0.5">
                {city}, Portugal
              </p>
            </div>
          </div>

          {/* Payment & Amount line */}
          <div className="flex items-center justify-between pt-2 border-t border-[#EEF0FA] text-xs">
            <div className="flex items-center gap-1.5 text-[#585A7E]">
              <CreditCard size={14} className="text-[#8E90B0]" />
              <span className="font-medium">MasterCard •••• {cardLast4}</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-[11px] text-[#8E90B0]">Total Paid:</span>
              <span className="text-sm font-black text-[#1E1F3D]">{totalAmount}€</span>
            </div>
          </div>

          {/* IF GIFTED: GIFT VOUCHER CODES SECTION */}
          {isGift && giftCodes.length > 0 && (
            <div className="pt-2.5 border-t border-[#EEF0FA] flex flex-col gap-2 animate-fadeIn">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#1E1F3D] flex items-center gap-1.5">
                  <Gift size={14} className="text-[#FFB800]" />
                  <span>Gift Voucher Codes ({giftCodes.length})</span>
                </span>
                {giftCodes.length > 1 && (
                  <button
                    onClick={handleCopyAllCodes}
                    className="text-[11px] font-bold text-[#6979F8] hover:underline cursor-pointer"
                  >
                    {allCopied ? 'All Copied!' : 'Copy All'}
                  </button>
                )}
              </div>

              {/* Gift code pills */}
              <div className="flex flex-col gap-2">
                {giftCodes.map((code, idx) => (
                  <div
                    key={code}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-[#F7F8FE] border border-dashed border-[#8E97FD]/60"
                  >
                    <div className="flex flex-col">
                      <span className="text-[10px] text-[#8E90B0] font-semibold">
                        Voucher #{idx + 1}
                      </span>
                      <span className="text-xs font-mono font-bold text-[#1E1F3D] tracking-wider">
                        {code}
                      </span>
                    </div>

                    <button
                      onClick={() => handleCopyCode(code, idx)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                        copiedIndex === idx
                          ? 'bg-[#22C55E] text-white'
                          : 'bg-white border border-[#EAEFFE] text-[#6979F8] hover:bg-[#8E97FD]/10'
                      }`}
                    >
                      {copiedIndex === idx ? (
                        <>
                          <Check size={12} strokeWidth={3} />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy size={12} />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>

              <p className="text-[10px] text-[#8C6D00] bg-[#FFF9E6] p-2 rounded-xl border border-[#FFE799] leading-snug">
                💡 <span className="font-bold">How to redeem:</span> Your friends can paste this code into the <span className="font-bold">Coupons</span> tab or the <span className="font-bold">Route Checkout</span> promo box to activate the route with 100% discount.
              </p>
            </div>
          )}

          {/* IF FOR ME: Route Unlocked Badge */}
          {!isGift && (
            <div className="p-2.5 rounded-xl bg-[#E8F8F0] border border-[#B9E9CD] flex items-center gap-2">
              <CheckCircle2 size={15} className="text-[#22C55E] shrink-0" />
              <span className="text-xs font-bold text-[#166534]">
                Route unlocked! Full access granted to all checkpoints.
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons directly under the card without awkward gap */}
        <div
          className="w-full flex flex-col items-center gap-2.5 mt-3.5 pb-3 animate-card-stagger"
          style={{ animationDelay: '120ms' }}
        >
          {/* Primary Action Button */}
          <button
            onClick={handleContinueExploring}
            className="w-full h-12 rounded-2xl bg-[#8E97FD] hover:bg-[#7C82ED] text-white font-bold text-sm tracking-wide shadow-md shadow-indigo-400/30 active:scale-[0.98] transition-all flex items-center justify-center cursor-pointer"
          >
            Continue Exploring
          </button>

          {/* Classic Blue Details Button requested by user ("al estilo de siempre azul") */}
          <button
            onClick={handleOpenDetails}
            className="w-full h-11 rounded-2xl bg-[#7C82ED] hover:bg-[#6A70E8] text-white font-bold text-sm tracking-wide shadow-sm active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <ReceiptText size={15} />
            <span>Details</span>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
