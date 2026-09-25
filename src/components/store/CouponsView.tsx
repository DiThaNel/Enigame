'use client';

import React, { useState } from 'react';
import { useEnigameStore } from '@/store/useEnigameStore';
import { Coupon } from '@/types';
import { ChevronLeft, Ticket, Copy, Check, QrCode, Sparkles, X, Gift, CheckCircle2, AlertCircle } from 'lucide-react';

export const CouponsView: React.FC = () => {
  const { setPointsSubView, coupons, redeemPromoCode, useCoupon, showToast } = useEnigameStore();
  const [inputCode, setInputCode] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedVoucher, setSelectedVoucher] = useState<Coupon | null>(null);

  const activeCoupons = coupons.filter(c => !c.isUsed);
  const usedCoupons = coupons.filter(c => c.isUsed);

  const handleRedeem = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputCode.trim()) return;

    const result = redeemPromoCode(inputCode);
    if (result.success) {
      showToast(result.message, 'success');
      setInputCode('');
    } else {
      showToast(result.message, 'error');
    }
  };

  const handleQuickFill = (code: string) => {
    setInputCode(code);
  };

  const handleCopy = (coupon: Coupon) => {
    navigator.clipboard.writeText(coupon.code);
    setCopiedId(coupon.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleMarkUsed = (couponId: string) => {
    useCoupon(couponId);
    setSelectedVoucher(null);
    showToast('Coupon marked as redeemed!', 'success');
  };

  return (
    <div className="w-full min-h-screen pb-28 bg-[#F4F6FB] flex flex-col animate-modal-screen select-none relative">
      {/* Curved Purple Header */}
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
            <Ticket size={18} className="text-[#FFB800]" />
            <h1 className="text-base font-bold tracking-wide">Coupons & Passes</h1>
          </div>
          <div className="w-9" />
        </div>

        <p className="text-xs text-white/80 font-medium max-w-xs mx-auto">
          Enter promo codes to unlock exclusive local vouchers, meal discounts, and museum passes.
        </p>
      </div>

      {/* Main Content Area */}
      <div className="px-5 pt-5 flex-1 flex flex-col gap-5">
        {/* Redeem Code Card */}
        <div className="animate-card-stagger stagger-1 bg-white rounded-[28px] p-5 shadow-xs border border-[#EAEFFE] flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#EEF0FF] text-[#8E97FD] flex items-center justify-center">
              <Gift size={16} />
            </div>
            <h3 className="text-xs font-bold text-[#1E1F3D]">Redeem Promo Code</h3>
          </div>

          <form onSubmit={handleRedeem} className="flex items-center gap-2">
            <input
              type="text"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value.toUpperCase())}
              placeholder="e.g. ENIGAME2026"
              className="flex-1 h-11 px-4 rounded-xl bg-[#F4F6FB] border border-[#EEF0FA] text-xs font-bold text-[#1E1F3D] tracking-wider uppercase placeholder:text-[#A0A2BF] focus:outline-none focus:border-[#8E97FD]"
            />
            <button
              type="submit"
              disabled={!inputCode.trim()}
              className="h-11 px-5 rounded-xl bg-[#8E97FD] hover:bg-[#7C82ED] disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-indigo-200 transition-all cursor-pointer active:scale-95 shrink-0"
            >
              Apply
            </button>
          </form>

          {/* Quick-tap suggestion chips */}
          <div className="flex items-center gap-1.5 flex-wrap pt-1">
            <span className="text-[10px] text-[#7A7C99] font-medium">Try:</span>
            {['ENIGAME2026', 'BRAGANCA50', 'EXPLORER10', 'CASTLE15'].map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => handleQuickFill(code)}
                className="px-2.5 py-1 rounded-lg bg-[#EEF0FF] hover:bg-[#E0E4FE] text-[#6979F8] text-[10px] font-bold tracking-wide transition-all cursor-pointer active:scale-95 hover:scale-105"
              >
                {code}
              </button>
            ))}
          </div>
        </div>

        {/* Section Header */}
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold uppercase tracking-wider text-[#7A7C99]">
            Active Vouchers ({activeCoupons.length})
          </span>
          <span className="text-[11px] font-semibold text-[#8E97FD] flex items-center gap-1">
            <Sparkles size={12} className="text-[#FFB800]" /> Ready to Use
          </span>
        </div>

        {/* Coupons List */}
        <div className="flex flex-col gap-3.5">
          {activeCoupons.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 border border-[#EAEFFE] text-center flex flex-col items-center gap-2">
              <Ticket size={32} className="text-[#8E97FD] opacity-60" />
              <h3 className="text-xs font-bold text-[#1E1F3D]">No active vouchers</h3>
              <p className="text-[11px] text-[#7A7C99]">Enter a promo code above to add coupons to your wallet.</p>
            </div>
          ) : (
            activeCoupons.map((cpn, idx) => (
              <div
                key={cpn.id}
                className={`animate-card-stagger stagger-${Math.min(idx + 2, 8)} relative bg-white rounded-2xl border border-[#EAEFFE] hover:border-[#8E97FD]/40 shadow-xs hover:shadow-md transition-all flex flex-col overflow-hidden`}
              >
                {/* Left and right ticket punchout notches */}
                <div className="absolute top-1/2 -left-2.5 -translate-y-1/2 w-5 h-5 rounded-full bg-[#F4F6FB] border border-[#EAEFFE] z-10" />
                <div className="absolute top-1/2 -right-2.5 -translate-y-1/2 w-5 h-5 rounded-full bg-[#F4F6FB] border border-[#EAEFFE] z-10" />

                {/* Top Ticket Header */}
                <div className="px-5 pt-4 pb-3 flex items-start justify-between gap-3 border-b border-dashed border-[#EAEFFE]">
                  <div className="flex-1">
                    <span className="text-[10px] font-bold text-[#8E97FD] uppercase tracking-wider">
                      {cpn.partnerName}
                    </span>
                    <h3 className="text-sm font-bold text-[#1E1F3D] mt-0.5">
                      {cpn.title}
                    </h3>
                    <p className="text-[11px] text-[#585A7E] mt-1 leading-relaxed">
                      {cpn.description}
                    </p>
                  </div>

                  {/* Discount Badge */}
                  <span className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#8E97FD] to-[#7C82ED] text-white text-[11px] font-black shrink-0 shadow-sm">
                    {cpn.discountBadge}
                  </span>
                </div>

                {/* Bottom Ticket Footer */}
                <div className="px-5 py-3 bg-[#FAFBFD] flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-[#7A7C99]">CODE:</span>
                    <span className="font-mono text-xs font-black text-[#1E1F3D] bg-white px-2 py-0.5 rounded border border-[#EAEFFE]">
                      {cpn.code}
                    </span>
                    <button
                      onClick={() => handleCopy(cpn)}
                      className="p-1 rounded-md text-[#7A7C99] hover:text-[#8E97FD] transition-colors cursor-pointer"
                      title="Copy code"
                    >
                      {copiedId === cpn.id ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                    </button>
                  </div>

                  {/* Action Button: Use Coupon */}
                  <button
                    onClick={() => setSelectedVoucher(cpn)}
                    className="px-3.5 py-1.5 rounded-xl bg-[#1E1F3D] hover:bg-[#2B2D54] text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 shadow-sm"
                  >
                    <QrCode size={13} /> Use Voucher
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Used Coupons Section (if any) */}
        {usedCoupons.length > 0 && (
          <div className="mt-4 flex flex-col gap-2 opacity-75">
            <span className="text-xs font-bold uppercase tracking-wider text-[#7A7C99] px-1">
              Redeemed History ({usedCoupons.length})
            </span>
            {usedCoupons.map((cpn) => (
              <div
                key={cpn.id}
                className="bg-white/70 rounded-2xl p-4 border border-[#EAEFFE] flex items-center justify-between gap-3 text-[#7A7C99]"
              >
                <div>
                  <h4 className="text-xs font-bold line-through text-[#7A7C99]">{cpn.title}</h4>
                  <span className="text-[10px]">{cpn.partnerName} • Used</span>
                </div>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-[#EEF0FA] text-[#7A7C99]">
                  REDEEMED ✓
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* QR Code Voucher Modal Overlay */}
      {selectedVoucher && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/65 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-[32px] p-6 w-full max-w-[340px] shadow-2xl text-center animate-scaleUp flex flex-col items-center gap-3 relative">
            <button
              onClick={() => setSelectedVoucher(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#F4F6FB] flex items-center justify-center text-[#7A7C99] hover:text-[#1E1F3D] cursor-pointer"
            >
              <X size={16} />
            </button>

            <span className="px-3 py-1 rounded-full bg-[#EEF0FF] text-[#8E97FD] font-semibold text-xs">
              {selectedVoucher.discountBadge}
            </span>

            <h3 className="text-base font-bold text-[#1E1F3D]">
              {selectedVoucher.title}
            </h3>
            <p className="text-xs text-[#7A7C99]">
              Present this QR code or coupon code at <br />
              <strong className="text-[#1E1F3D]">{selectedVoucher.partnerName}</strong>
            </p>

            {/* Visual Simulated QR Code Box */}
            <div className="w-44 h-44 bg-white p-3 rounded-2xl border-2 border-dashed border-[#8E97FD] flex flex-col items-center justify-center my-2 shadow-inner">
              <svg className="w-36 h-36" viewBox="0 0 100 100" fill="currentColor">
                {/* 4 Corner locator squares */}
                <rect x="5" y="5" width="26" height="26" rx="4" fill="#1E1F3D" />
                <rect x="10" y="10" width="16" height="16" fill="white" />
                <rect x="13" y="13" width="10" height="10" fill="#8E97FD" />

                <rect x="69" y="5" width="26" height="26" rx="4" fill="#1E1F3D" />
                <rect x="74" y="10" width="16" height="16" fill="white" />
                <rect x="77" y="13" width="10" height="10" fill="#8E97FD" />

                <rect x="5" y="69" width="26" height="26" rx="4" fill="#1E1F3D" />
                <rect x="10" y="74" width="16" height="16" fill="white" />
                <rect x="13" y="77" width="10" height="10" fill="#8E97FD" />

                {/* Simulated Matrix Bits */}
                <rect x="36" y="8" width="6" height="6" fill="#1E1F3D" />
                <rect x="46" y="8" width="6" height="6" fill="#1E1F3D" />
                <rect x="56" y="8" width="6" height="6" fill="#1E1F3D" />
                <rect x="36" y="20" width="6" height="6" fill="#1E1F3D" />
                <rect x="46" y="26" width="6" height="6" fill="#8E97FD" />
                <rect x="56" y="20" width="6" height="6" fill="#1E1F3D" />

                <rect x="36" y="36" width="26" height="26" rx="4" fill="#1E1F3D" />
                <rect x="41" y="41" width="16" height="16" fill="#8E97FD" />

                <rect x="8" y="42" width="6" height="6" fill="#1E1F3D" />
                <rect x="20" y="42" width="6" height="6" fill="#1E1F3D" />
                <rect x="72" y="42" width="6" height="6" fill="#1E1F3D" />
                <rect x="84" y="42" width="6" height="6" fill="#1E1F3D" />

                <rect x="36" y="68" width="6" height="6" fill="#1E1F3D" />
                <rect x="48" y="76" width="6" height="6" fill="#1E1F3D" />
                <rect x="60" y="68" width="6" height="6" fill="#1E1F3D" />
                <rect x="72" y="76" width="6" height="6" fill="#8E97FD" />
                <rect x="84" y="84" width="6" height="6" fill="#1E1F3D" />
              </svg>
            </div>

            {/* Code string */}
            <span className="font-mono text-xs font-black text-[#1E1F3D] tracking-wider bg-[#F4F6FB] px-3 py-1 rounded-md">
              {selectedVoucher.code}
            </span>

            {/* Action button */}
            <button
              onClick={() => handleMarkUsed(selectedVoucher.id)}
              className="w-full h-11 rounded-xl bg-[#8E97FD] hover:bg-[#7C82ED] text-white font-bold text-xs shadow-md mt-2 cursor-pointer active:scale-95 transition-all"
            >
              Mark as Used
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
