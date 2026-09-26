'use client';

import React, { useEffect } from 'react';
import { useEnigameStore } from '@/store/useEnigameStore';
import { X, ShieldCheck, Shield, Info, HelpCircle, ExternalLink } from 'lucide-react';

export const CompanyInfoModal: React.FC = () => {
  const { companyModal, setCompanyModal } = useEnigameStore();

  // Freeze background scrolling when modal is open
  useEffect(() => {
    if (companyModal) {
      const main = document.querySelector('main');
      if (main) {
        const prevOverflow = main.style.overflow;
        main.style.overflow = 'hidden';
        return () => {
          main.style.overflow = prevOverflow;
        };
      }
    }
  }, [companyModal]);

  if (!companyModal) return null;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/65 backdrop-blur-sm p-4 animate-fadeIn overscroll-contain select-none"
      onClick={() => setCompanyModal(null)}
    >
      <div
        className="w-full max-w-sm bg-white rounded-[32px] p-6 shadow-2xl flex flex-col max-h-[85vh] animate-scaleUp overflow-hidden border border-white/50"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Fixed Header */}
        <div className="flex items-center justify-between border-b border-[#EEF0FA] pb-3 shrink-0">
          <div className="flex items-center gap-2">
            {companyModal === 'about' && <Info size={18} className="text-[#8E97FD]" />}
            {companyModal === 'privacy' && <Shield size={18} className="text-[#8E97FD]" />}
            {companyModal === 'terms' && <ShieldCheck size={18} className="text-[#8E97FD]" />}
            {companyModal === 'support' && <HelpCircle size={18} className="text-[#8E97FD]" />}
            <h3 className="font-bold text-[#1E1F3D] text-sm capitalize">
              {companyModal === 'about' && 'About Enigame'}
              {companyModal === 'privacy' && 'Privacy Policy'}
              {companyModal === 'terms' && 'Terms & Conditions'}
              {companyModal === 'support' && 'Enigame Support'}
            </h3>
          </div>
          <button
            type="button"
            onClick={() => setCompanyModal(null)}
            className="w-8 h-8 rounded-full bg-[#F4F6FB] flex items-center justify-center text-[#7A7C99] hover:text-[#1E1F3D] cursor-pointer active:scale-95 transition-all"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        {/* Scrollable Content Body with overscroll containment */}
        <div className="text-xs text-[#585A7E] leading-relaxed space-y-3.5 text-left overflow-y-auto no-scrollbar py-3.5 overscroll-contain">
          {companyModal === 'about' && (
            <>
              <p className="font-bold text-[#1E1F3D]">The Interactive Exploration Platform</p>
              <p>
                Enigame connects modern adventurers with the mystery, history, and secret culture of historic cities across Europe. By solving riddles, unlocking checkpoints, and exploring physical landmarks, every journey becomes an unforgettable quest.
              </p>
              <p className="text-[#8E90B0] font-medium">Version 2.4.0 • Built with passion for European Explorers.</p>
            </>
          )}

          {companyModal === 'privacy' && (
            <>
              <p className="font-bold text-[#1E1F3D]">Your Data Privacy Matters</p>
              <p>
                We only use geolocation services to confirm your proximity to physical checkpoints and deliver contextually relevant route riddles. We never sell your personal data or tracking history to third parties.
              </p>
              <p className="text-[#8E90B0] font-medium">Compliant with EU GDPR regulations 2026.</p>
            </>
          )}

          {companyModal === 'terms' && (
            <>
              <div>
                <p className="font-bold text-[#1E1F3D]">Safe Expedition Guidelines</p>
                <p className="mt-1">
                  Explorers must respect all municipal guidelines, local monuments, and cultural heritage sites. Never trespass on private property while searching for clues or scanning QR codes.
                </p>
              </div>

              <div>
                <p className="font-bold text-[#1E1F3D]">Payment &amp; Route Access Policy</p>
                <p className="mt-1">
                  All transactions in this application are processed securely with authorized test sandbox tokens. Unlocked routes grant unlimited, lifetime access to riddles, historical hints, and physical GPS/QR checkpoints.
                </p>
              </div>

              <div>
                <p className="font-bold text-[#1E1F3D]">Gift Passes &amp; Vouchers</p>
                <p className="mt-1">
                  Gift codes never expire and can be redeemed by friends in the Coupons tab or directly during route checkout with a 100% discount.
                </p>
              </div>

              <div>
                <p className="font-bold text-[#1E1F3D]">Points Discount Terms</p>
                <p className="mt-1">
                  Points redeemed for discounts are deducted from your spendable balance without affecting your lifetime rank points or leaderboard position.
                </p>
              </div>

              <div>
                <p className="font-bold text-[#1E1F3D]">Cancellation &amp; Refunds</p>
                <p className="mt-1">
                  Once an expedition route has been activated or clues revealed, digital access cannot be refunded. Gift codes that have not yet been redeemed may be refunded or reissued by contacting expedition support.
                </p>
              </div>
            </>
          )}

          {companyModal === 'support' && (
            <>
              <p className="font-bold text-[#1E1F3D]">Need Assistance?</p>
              <p>Our dedicated expedition team is available 24/7 to help resolve questions about passes, riddles, or account issues.</p>
              <div className="p-3 bg-[#F4F6FB] rounded-xl flex items-center justify-between border border-[#EEF0FA]">
                <span className="font-bold text-[#1E1F3D]">support@enigame.pt</span>
                <ExternalLink size={14} className="text-[#8E97FD]" />
              </div>
            </>
          )}
        </div>

        {/* Fixed Footer */}
        <div className="pt-3 border-t border-[#EEF0FA] shrink-0">
          <button
            type="button"
            onClick={() => setCompanyModal(null)}
            className="w-full h-11 rounded-2xl bg-[#8E97FD] hover:bg-[#7C82ED] text-white font-bold text-xs shadow-md transition-all cursor-pointer active:scale-[0.98]"
          >
            {companyModal === 'terms' ? 'I Understand & Agree' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};