'use client';

import React from 'react';
import { useEnigameStore } from '@/store/useEnigameStore';
import {
  X,
  RotateCcw,
  AlertTriangle,
  CreditCard,
  ShieldAlert,
  ArrowLeft
} from 'lucide-react';

export const PurchaseFailureView: React.FC = () => {
  const {
    lastPayment,
    setRoutesViewStep,
    setActiveTab,
  } = useEnigameStore();

  const failureReason =
    lastPayment?.failureReason ||
    'Something went wrong with your payment method, please review and take another try.';
  const cardLast4 = lastPayment?.cardLast4 || '3947';
  const totalAmount = lastPayment?.totalAmount !== undefined ? lastPayment.totalAmount : 30;

  const handleReviewPayment = () => {
    // Return to 07.4 Payment Method so user can fix card and retry
    setRoutesViewStep('payment-method');
  };

  const handleCancel = () => {
    setRoutesViewStep('route-detail');
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
        {/* Figma Illustration 07.7 */}
        <div className="relative w-36 h-36 mb-1 flex items-center justify-center">
          <img
            src="/assets/PurchaseFailure.png"
            alt="Payment Failed"
            className="w-full h-full object-contain drop-shadow-md animate-popIn"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = '/assets/Denied.png';
            }}
          />

          {/* Red Status Cross Badge */}
          <div className="absolute -bottom-1 w-8 h-8 rounded-full bg-[#EF4444] border-2 border-white shadow-md flex items-center justify-center text-white animate-pill-pop">
            <X size={18} strokeWidth={3} />
          </div>
        </div>

        {/* Headings matching Figma 07.7 */}
        <h1 className="text-2xl font-bold text-[#1E1F3D] tracking-tight mt-1.5 drop-shadow-xs">
          Payment Failed!
        </h1>
        <p className="text-xs text-[#585A7E] font-medium mt-0.5 max-w-[280px]">
          Something went wrong with your payment method, please review and take another try.
        </p>

        {/* Failure Details Card (positioned right above buttons without huge gap) */}
        <div className="w-full bg-white/95 backdrop-blur-md rounded-[28px] p-4.5 border border-red-100 shadow-lg shadow-red-950/5 mt-3.5 text-left flex flex-col gap-3 animate-card-stagger">
          {/* Failure Alert Box */}
          <div className="p-3.5 rounded-2xl bg-red-50/90 border border-red-200/60 flex items-start gap-3">
            <AlertTriangle size={18} className="text-[#EF4444] shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-xs font-bold text-[#991B1B]">
                Card Declined by Bank
              </h3>
              <p className="text-[11px] text-[#B91C1C] mt-1 leading-relaxed">
                {failureReason}
              </p>
            </div>
          </div>

          {/* Transaction Metadata */}
          <div className="pt-2 border-t border-[#EEF0FA] flex flex-col gap-2 text-xs">
            <div className="flex items-center justify-between text-[#585A7E]">
              <span className="text-[11px] text-[#8E90B0]">Attempted Method:</span>
              <div className="flex items-center gap-1.5 font-bold text-[#1E1F3D]">
                <CreditCard size={13} className="text-[#8E90B0]" />
                <span>MasterCard •••• {cardLast4}</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[#585A7E]">
              <span className="text-[11px] text-[#8E90B0]">Amount Pending:</span>
              <span className="font-bold text-[#1E1F3D]">{totalAmount}€</span>
            </div>
          </div>

          {/* Security Reassurance note */}
          <div className="p-2.5 rounded-xl bg-[#F8F9FE] border border-[#EAEFFE] flex items-center gap-2 text-[10px] text-[#8E90B0]">
            <ShieldAlert size={14} className="text-[#6979F8] shrink-0" />
            <span>
              No funds were charged. Your route selection and discounts remain saved.
            </span>
          </div>
        </div>

        {/* Action Buttons directly under the card without awkward gap */}
        <div
          className="w-full flex flex-col items-center gap-2.5 mt-3.5 pb-3 animate-card-stagger"
          style={{ animationDelay: '120ms' }}
        >
          <button
            onClick={handleReviewPayment}
            className="w-full h-12 rounded-2xl bg-[#8E97FD] hover:bg-[#7C82ED] text-white font-bold text-sm tracking-wide shadow-md shadow-indigo-400/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw size={16} />
            <span>Review Payment</span>
          </button>

          <button
            onClick={handleCancel}
            className="w-full h-11 rounded-2xl bg-white/90 hover:bg-white text-[#585A7E] border border-[#EAEFFE] font-bold text-xs tracking-wide shadow-xs active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft size={13} />
            <span>Cancel &amp; Return to Routes</span>
          </button>
        </div>
      </div>
    </div>
  );
};
