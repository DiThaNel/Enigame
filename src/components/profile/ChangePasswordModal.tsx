'use client';

import React, { useState } from 'react';
import { useEnigameStore } from '@/store/useEnigameStore';
import { X, Lock, Eye, EyeOff, CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react';

export const ChangePasswordModal: React.FC = () => {
  const { isChangePasswordOpen, setChangePasswordOpen, setUserAccount } = useEnigameStore();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isChangePasswordOpen) return null;

  // Strength checks
  const hasMinLength = newPassword.length >= 8;
  const hasLetter = /[a-zA-Z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const isStrong = hasMinLength && hasLetter && hasNumber;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }

    setUserAccount({ password: newPassword });
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setChangePasswordOpen(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }, 1200);
  };

  const handleClose = () => {
    setError(null);
    setIsSuccess(false);
    setChangePasswordOpen(false);
  };

  return (
    <div className="px-5 py-5 absolute inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="w-full bg-white rounded-t-[32px] sm:rounded-[32px] overflow-hidden flex flex-col shadow-2xl animate-slideUp">
        {/* Header */}
        <div className="px-6 pt-5 pb-3 border-b border-[#EEF0FA] flex items-center justify-between">
          <button
            onClick={handleClose}
            className="w-9 h-9 rounded-full bg-[#F4F6FB] flex items-center justify-center text-[#7A7C99] hover:text-[#1E1F3D] cursor-pointer"
          >
            <X size={18} />
          </button>
          <h2 className="text-base font-extrabold text-[#1E1F3D]">Change Password</h2>
          <div className="w-9" />
        </div>

        {/* Content */}
        {isSuccess ? (
          <div className="p-8 flex flex-col items-center justify-center text-center gap-3">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center shadow-sm">
              <CheckCircle2 size={36} />
            </div>
            <h3 className="text-base font-bold text-[#1E1F3D]">Password Changed!</h3>
            <p className="text-xs text-[#585A7E]">
              Your password has been updated securely.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs flex items-center gap-2">
                <AlertCircle size={15} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Current Password */}
            <div>
              <label className="text-xs font-bold text-[#1E1F3D] block mb-1.5">Current Password</label>
              <div className="relative">
                <input
                  type={showCurrent ? 'text' : 'password'}
                  required
                  placeholder="Enter current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full h-11 pl-4 pr-10 rounded-2xl bg-[#F4F6FB] border border-[#EEF0FA] text-xs font-semibold text-[#1E1F3D] focus:outline-none focus:ring-2 focus:ring-[#8E97FD]/40"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A7C99] hover:text-[#1E1F3D] cursor-pointer"
                >
                  {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="text-xs font-bold text-[#1E1F3D] block mb-1.5">New Password</label>
              <div className="relative">
                <input
                  type={showNew ? 'text' : 'password'}
                  required
                  placeholder="At least 8 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full h-11 pl-4 pr-10 rounded-2xl bg-[#F4F6FB] border border-[#EEF0FA] text-xs font-semibold text-[#1E1F3D] focus:outline-none focus:ring-2 focus:ring-[#8E97FD]/40"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A7C99] hover:text-[#1E1F3D] cursor-pointer"
                >
                  {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* Password strength indicators */}
              {newPassword.length > 0 && (
                <div className="mt-2.5 flex flex-col gap-1.5">
                  <div className="flex gap-1 h-1 w-full bg-[#EAEFFE] rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${
                      isStrong ? 'w-full bg-emerald-500' : hasMinLength ? 'w-2/3 bg-amber-400' : 'w-1/3 bg-rose-400'
                    }`} />
                  </div>
                  <div className="flex items-center gap-3 text-[10px] text-[#7A7C99]">
                    <span className={hasMinLength ? 'text-emerald-600 font-bold' : ''}>• 8+ chars</span>
                    <span className={hasLetter ? 'text-emerald-600 font-bold' : ''}>• Letters</span>
                    <span className={hasNumber ? 'text-emerald-600 font-bold' : ''}>• Numbers</span>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm New Password */}
            <div>
              <label className="text-xs font-bold text-[#1E1F3D] block mb-1.5">Confirm New Password</label>
              <div className="relative">
                <input
                  type={showNew ? 'text' : 'password'}
                  required
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full h-11 pl-4 pr-10 rounded-2xl bg-[#F4F6FB] border border-[#EEF0FA] text-xs font-semibold text-[#1E1F3D] focus:outline-none focus:ring-2 focus:ring-[#8E97FD]/40"
                />
              </div>
              {confirmPassword && newPassword === confirmPassword && (
                <p className="text-[10px] text-emerald-600 font-bold mt-1 flex items-center gap-1">
                  <ShieldCheck size={12} /> Passwords match
                </p>
              )}
            </div>

            {/* Submit button */}
            <button
              type="submit"
              className="w-full h-12 rounded-2xl bg-gradient-to-r from-[#8E97FD] to-[#7381F0] text-white font-bold text-xs shadow-lg shadow-indigo-300/40 hover:opacity-95 active:scale-95 transition-all mt-2 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Lock size={15} />
              <span>Update Password</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
