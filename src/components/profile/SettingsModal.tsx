'use client';

import React, { useState } from 'react';
import { useEnigameStore } from '@/store/useEnigameStore';
import { 
  ChevronLeft, 
  User, 
  Mail, 
  Lock, 
  CheckCircle, 
  Receipt, 
  Edit3, 
  Info, 
  Shield, 
  FileText, 
  HelpCircle, 
  X, 
  ExternalLink 
} from 'lucide-react';

export const SettingsModal: React.FC = () => {
  const { 
    isSettingsOpen, 
    setSettingsOpen, 
    setProfileViewStep,
    setActiveTab,
    setEditProfileOpen, 
    setChangeEmailOpen, 
    setChangePasswordOpen, 
    setPurchaseHistoryOpen,
    userAccount
  } = useEnigameStore();

  const [companyModal, setCompanyModal] = useState<'about' | 'privacy' | 'terms' | 'support' | null>(null);
  const [verifyAlert, setVerifyAlert] = useState(false);

  if (!isSettingsOpen) return null;

  return (
    <div className="absolute inset-0 z-50 bg-white flex flex-col animate-fadeIn overflow-hidden">
      {/* Background Curved Wave Header matching Figma Frame 09.2 */}
      <div className="relative w-full bg-[#8E97FD] rounded-b-[36px] pt-8 pb-5 px-6 flex items-center justify-between text-white shadow-xs shrink-0">
        <button
          onClick={() => setSettingsOpen(false)}
          className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors cursor-pointer"
          title="Back"
        >
          <ChevronLeft size={22} />
        </button>
        <h1 className="text-base font-bold tracking-wide">Settings</h1>
        <div className="w-9" />
      </div>

      {/* Content Body matching Figma Frame 09.2 cleanly separated below header wave */}
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6 bg-white no-scrollbar">
        {/* Section 1: Profile Settings */}
        <div>
          <h2 className="text-sm font-extrabold text-[#8E97FD] mb-3">Profile Settings</h2>
          <div className="flex flex-col divide-y divide-[#EEF0FA] border-y border-[#EEF0FA]">
            {/* Edit Profile */}
            <button
              onClick={() => {
                setSettingsOpen(false);
                setProfileViewStep('edit-profile');
                setActiveTab('profile');
              }}
              className="py-3.5 flex items-center justify-between hover:bg-[#F9FAFE] -mx-2 px-2 rounded-xl transition-colors cursor-pointer text-left"
            >
              <div className="flex items-center gap-3.5 text-[#1E1F3D]">
                <User size={18} className="text-[#1E1F3D]" />
                <span className="text-sm font-semibold">Edit Profile</span>
              </div>
              <Edit3 size={16} className="text-[#A5A7C4]" />
            </button>

            {/* Email */}
            <button
              onClick={() => {
                setChangeEmailOpen(true);
              }}
              className="py-3.5 flex items-center justify-between hover:bg-[#F9FAFE] -mx-2 px-2 rounded-xl transition-colors cursor-pointer text-left"
            >
              <div className="flex items-center gap-3.5 text-[#1E1F3D]">
                <Mail size={18} className="text-[#1E1F3D]" />
                <div className="flex flex-col">
                  <span className="text-sm font-semibold">Email</span>
                  <span className="text-[11px] text-[#A5A7C4]">{userAccount.email || 'gabriel@gmail.com'}</span>
                </div>
              </div>
              <Edit3 size={16} className="text-[#A5A7C4]" />
            </button>

            {/* Password */}
            <button
              onClick={() => {
                setChangePasswordOpen(true);
              }}
              className="py-3.5 flex items-center justify-between hover:bg-[#F9FAFE] -mx-2 px-2 rounded-xl transition-colors cursor-pointer text-left"
            >
              <div className="flex items-center gap-3.5 text-[#1E1F3D]">
                <Lock size={18} className="text-[#1E1F3D]" />
                <div className="flex flex-col">
                  <span className="text-sm font-semibold">Password</span>
                  <span className="text-[11px] text-[#A5A7C4]">••••••••••••</span>
                </div>
              </div>
              <Edit3 size={16} className="text-[#A5A7C4]" />
            </button>

            {/* Verify */}
            <button
              onClick={() => setVerifyAlert(true)}
              className="py-3.5 flex items-center justify-between hover:bg-[#F9FAFE] -mx-2 px-2 rounded-xl transition-colors cursor-pointer text-left"
            >
              <div className="flex items-center gap-3.5 text-[#1E1F3D]">
                <CheckCircle size={18} className="text-emerald-500" />
                <div className="flex flex-col">
                  <span className="text-sm font-semibold">Verify</span>
                  <span className="text-[11px] text-emerald-600 font-semibold">Explorer Verified Identity</span>
                </div>
              </div>
              <Edit3 size={16} className="text-[#A5A7C4]" />
            </button>

            {/* Purchase History */}
            <button
              onClick={() => {
                setPurchaseHistoryOpen(true);
              }}
              className="py-3.5 flex items-center justify-between hover:bg-[#F9FAFE] -mx-2 px-2 rounded-xl transition-colors cursor-pointer text-left"
            >
              <div className="flex items-center gap-3.5 text-[#1E1F3D]">
                <Receipt size={18} className="text-[#1E1F3D]" />
                <span className="text-sm font-semibold">Purchase History</span>
              </div>
              <span className="text-xs font-bold text-[#8E97FD]">View &gt;</span>
            </button>
          </div>
        </div>

        {/* Section 2: Company */}
        <div>
          <h2 className="text-sm font-extrabold text-[#8E97FD] mb-3">Company</h2>
          <div className="flex flex-col divide-y divide-[#EEF0FA] border-y border-[#EEF0FA]">
            <button
              onClick={() => setCompanyModal('about')}
              className="py-3.5 flex items-center justify-between hover:bg-[#F9FAFE] -mx-2 px-2 rounded-xl transition-colors cursor-pointer text-left"
            >
              <span className="text-sm font-medium text-[#1E1F3D]">About Enigame</span>
              <Info size={16} className="text-[#A5A7C4]" />
            </button>

            <button
              onClick={() => setCompanyModal('privacy')}
              className="py-3.5 flex items-center justify-between hover:bg-[#F9FAFE] -mx-2 px-2 rounded-xl transition-colors cursor-pointer text-left"
            >
              <span className="text-sm font-medium text-[#1E1F3D]">Privacy policy</span>
              <Shield size={16} className="text-[#A5A7C4]" />
            </button>

            <button
              onClick={() => setCompanyModal('terms')}
              className="py-3.5 flex items-center justify-between hover:bg-[#F9FAFE] -mx-2 px-2 rounded-xl transition-colors cursor-pointer text-left"
            >
              <span className="text-sm font-medium text-[#1E1F3D]">Terms and conditions</span>
              <FileText size={16} className="text-[#A5A7C4]" />
            </button>

            <button
              onClick={() => setCompanyModal('support')}
              className="py-3.5 flex items-center justify-between hover:bg-[#F9FAFE] -mx-2 px-2 rounded-xl transition-colors cursor-pointer text-left"
            >
              <span className="text-sm font-medium text-[#1E1F3D]">Support</span>
              <HelpCircle size={16} className="text-[#A5A7C4]" />
            </button>
          </div>
        </div>
      </div>

      {/* Verification Status Dialog */}
      {verifyAlert && (
        <div className="absolute inset-0 z-60 flex items-center justify-center bg-black/60 p-4 animate-fadeIn">
          <div className="w-full max-w-[340px] bg-white rounded-3xl p-6 text-center shadow-2xl flex flex-col items-center gap-3 animate-scaleUp">
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center">
              <CheckCircle size={32} />
            </div>
            <h3 className="font-black text-[#1E1F3D] text-base">Account Verified</h3>
            <p className="text-xs text-[#585A7E] leading-relaxed">
              Your explorer badge and phone credentials are authenticated for international routes and meetups.
            </p>
            <button
              onClick={() => setVerifyAlert(false)}
              className="w-full py-2.5 rounded-xl bg-[#8E97FD] text-white text-xs font-bold mt-2 cursor-pointer"
            >
              Got It
            </button>
          </div>
        </div>
      )}

      {/* Company Modal Sheets */}
      {companyModal && (
        <div className="absolute inset-0 z-60 flex items-end justify-center bg-black/60 backdrop-blur-xs p-3 animate-fadeIn">
          <div className="w-full bg-white rounded-[32px] p-6 shadow-2xl flex flex-col gap-4 animate-slideUp max-h-[80%] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#EEF0FA] pb-3">
              <h3 className="font-semibold text-[#1E1F3D] text-sm capitalize">
                {companyModal === 'about' && 'About Enigame'}
                {companyModal === 'privacy' && 'Privacy Policy'}
                {companyModal === 'terms' && 'Terms & Conditions'}
                {companyModal === 'support' && 'Enigame Support'}
              </h3>
              <button
                onClick={() => setCompanyModal(null)}
                className="w-8 h-8 rounded-full bg-[#F4F6FB] flex items-center justify-center text-[#7A7C99] hover:text-[#1E1F3D] cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="text-xs text-[#585A7E] leading-relaxed space-y-3">
              {companyModal === 'about' && (
                <>
                  <p className="font-semibold text-[#1E1F3D]">The Interactive Exploration Platform</p>
                  <p>
                    Enigame connects modern adventurers with the mystery, history, and secret culture of historic cities across Europe. By solving riddles, unlocking checkpoints, and exploring physical landmarks, every journey becomes an unforgettable quest.
                  </p>
                  <p>Version 2.4.0 • Built with passion for European Explorers.</p>
                </>
              )}

              {companyModal === 'privacy' && (
                <>
                  <p className="font-semibold text-[#1E1F3D]">Your Data Privacy Matters</p>
                  <p>
                    We only use geolocation services to confirm your proximity to physical checkpoints and deliver contextually relevant route riddles. We never sell your personal data or tracking history to third parties.
                  </p>
                  <p>Compliant with EU GDPR regulations 2026.</p>
                </>
              )}

              {companyModal === 'terms' && (
                <>
                  <p className="font-semibold text-[#1E1F3D]">Safe Expedition Guidelines</p>
                  <p>
                    Explorers must respect all municipal guidelines, local monuments, and cultural heritage sites. Never trespass on private property while searching for clues or scanning QR codes.
                  </p>
                </>
              )}

              {companyModal === 'support' && (
                <>
                  <p className="font-semibold text-[#1E1F3D]">Need Assistance?</p>
                  <p>Our dedicated expedition team is available 24/7 to help resolve questions about passes, riddles, or account issues.</p>
                  <div className="p-3 bg-[#F4F6FB] rounded-xl flex items-center justify-between">
                    <span className="font-semibold text-[#1E1F3D]">support@enigame.pt</span>
                    <ExternalLink size={14} className="text-[#8E97FD]" />
                  </div>
                </>
              )}
            </div>

            <button
              onClick={() => setCompanyModal(null)}
              className="w-full h-11 rounded-2xl bg-[#8E97FD] text-white font-bold text-xs hover:bg-[#7B85F8] transition-all cursor-pointer mt-2"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
