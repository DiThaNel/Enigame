'use client';

import React, { useState } from 'react';
import { useEnigameStore } from '@/store/useEnigameStore';
import { X, Mail, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';

export const ChangeEmailModal: React.FC = () => {
  const { isChangeEmailOpen, setChangeEmailOpen, userAccount, setUserAccount } = useEnigameStore();

  const [currentEmail] = useState(userAccount.email || 'gabriel@gmail.com');
  const [newEmail, setNewEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isChangeEmailOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail.trim())) {
      setError('Please enter a valid email address.');
      return;
    }

    if (newEmail.trim().toLowerCase() === currentEmail.trim().toLowerCase()) {
      setError('New email must be different from current email.');
      return;
    }

    if (newEmail.trim().toLowerCase() !== confirmEmail.trim().toLowerCase()) {
      setError('Email addresses do not match.');
      return;
    }

    // Save
    setUserAccount({ email: newEmail.trim() });
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setChangeEmailOpen(false);
      setNewEmail('');
      setConfirmEmail('');
      setPassword('');
    }, 1200);
  };

  const handleClose = () => {
    setError(null);
    setIsSuccess(false);
    setChangeEmailOpen(false);
  };

  return (
    <div className="absolute inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="w-full bg-white rounded-t-[32px] sm:rounded-[32px] overflow-hidden flex flex-col shadow-2xl animate-slideUp">
        {/* Header */}
        <div className="px-6 pt-5 pb-3 border-b border-[#EEF0FA] flex items-center justify-between">
          <button
            onClick={handleClose}
            className="w-9 h-9 rounded-full bg-[#F4F6FB] flex items-center justify-center text-[#7A7C99] hover:text-[#1E1F3D] cursor-pointer"
          >
            <X size={18} />
          </button>
          <h2 className="text-base font-extrabold text-[#1E1F3D]">Change Email</h2>
          <div className="w-9" />
        </div>

        {/* Content */}
        {isSuccess ? (
          <div className="p-8 flex flex-col items-center justify-center text-center gap-3">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center shadow-sm">
              <CheckCircle2 size={36} />
            </div>
            <h3 className="text-base font-bold text-[#1E1F3D]">Email Updated!</h3>
            <p className="text-xs text-[#585A7E]">
              Your account email has been updated to <br />
              <span className="font-bold text-[#8E97FD]">{newEmail}</span>
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
            {/* Current Email Display */}
            <div className="p-3.5 bg-[#F4F6FB] rounded-2xl border border-[#EEF0FA] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-[#7A7C99] uppercase tracking-wider block">Current Email</span>
                <span className="text-xs font-bold text-[#1E1F3D] break-all">{userAccount.email || 'gabriel@gmail.com'}</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#8E97FD] shadow-xs">
                <Mail size={16} />
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs flex items-center gap-2">
                <AlertCircle size={15} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* New Email */}
            <div>
              <label className="text-xs font-bold text-[#1E1F3D] block mb-1.5">New Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full h-11 px-4 rounded-2xl bg-[#F4F6FB] border border-[#EEF0FA] text-xs font-semibold text-[#1E1F3D] focus:outline-none focus:ring-2 focus:ring-[#8E97FD]/40"
                />
              </div>
            </div>

            {/* Confirm New Email */}
            <div>
              <label className="text-xs font-bold text-[#1E1F3D] block mb-1.5">Confirm New Email</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="Re-enter new email"
                  value={confirmEmail}
                  onChange={(e) => setConfirmEmail(e.target.value)}
                  className="w-full h-11 px-4 rounded-2xl bg-[#F4F6FB] border border-[#EEF0FA] text-xs font-semibold text-[#1E1F3D] focus:outline-none focus:ring-2 focus:ring-[#8E97FD]/40"
                />
              </div>
            </div>

            {/* Password verification */}
            <div>
              <label className="text-xs font-bold text-[#1E1F3D] block mb-1.5">Current Account Password</label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="Enter current password to verify"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-11 px-4 rounded-2xl bg-[#F4F6FB] border border-[#EEF0FA] text-xs font-semibold text-[#1E1F3D] focus:outline-none focus:ring-2 focus:ring-[#8E97FD]/40"
                />
              </div>
              <p className="text-[10px] text-[#A5A7C4] mt-1">
                We will send a verification link to your new address.
              </p>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              className="w-full h-12 rounded-2xl bg-gradient-to-r from-[#8E97FD] to-[#7381F0] text-white font-bold text-xs shadow-lg shadow-indigo-300/40 hover:opacity-95 active:scale-95 transition-all mt-2 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Save New Email</span>
              <ArrowRight size={15} />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
