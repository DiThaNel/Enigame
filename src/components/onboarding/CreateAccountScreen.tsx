'use client';

import React, { useState } from 'react';
import { useEnigameStore } from '@/store/useEnigameStore';
import { ArrowLeft, Check, Eye, EyeOff } from 'lucide-react';

export const CreateAccountScreen: React.FC = () => {
  const { setAppStage, userAccount, setUserAccount } = useEnigameStore();

  const [name, setName] = useState(userAccount.name || 'Gabriel');
  const [email, setEmail] = useState(userAccount.email || 'Gabriel@gmail.com');
  const [password, setPassword] = useState('MySecretPass123!');
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(userAccount.agreedToPolicy !== undefined ? userAccount.agreedToPolicy : true);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setUserAccount({
      name: name.trim() || 'Gabriel',
      email: email.trim() || 'Gabriel@gmail.com',
      agreedToPolicy: agreed,
    });
    setAppStage('guide');
  };

  return (
    <div
      className="relative w-full h-full min-h-[680px] flex flex-col justify-between text-[#3F414E] select-none overflow-y-auto no-scrollbar bg-[#EEF0FA]"
      style={{
        backgroundImage: 'url(/assets/Lenguaje.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Top Header with Back button */}
      <div className="w-full pt-12 px-6 flex items-center justify-between z-10">
        <button
          onClick={() => setAppStage('language')}
          className="w-9 h-9 rounded-full bg-white/80 hover:bg-white text-[#3F414E] flex items-center justify-center shadow-sm transition-all cursor-pointer"
          aria-label="Back to Language"
        >
          <ArrowLeft size={18} />
        </button>
        <button
          onClick={() => setAppStage('guide')}
          className="text-xs font-semibold px-3 py-1 rounded-full bg-[#8E97FD] hover:bg-white/80 text-[#FFFFFF] hover:text-[#8E97FD] transition-all cursor-pointer"
        >
          Skip
        </button>
      </div>

      {/* Main Form Content matching Figma Frame 03 - Login */}
      <div className="w-full px-6 py-4 flex flex-col items-center z-10 max-w-sm mx-auto">
        <h1 className="text-2xl sm:text-[32px] font-regular text-[#3F414E] text-center tracking-tight mb-6">
          Create your account
        </h1>

        {/* Social Buttons */}
        <div className="w-full flex flex-col gap-3">
          {/* Facebook Button */}
          <button
            type="button"
            onClick={() => handleSubmit()}
            className="w-full h-14 py-3.5 px-5 rounded-full bg-[#6979F8] hover:bg-[#5868EB] text-white flex items-center justify-center gap-3 font-regular text-xs tracking-widest uppercase shadow-sm transition-all active:scale-[0.99] cursor-pointer"
          >
            <span className="w-6 h-6 rounded-full bg-white text-[#6979F8] flex items-center justify-center text-sm font-black ">
              f
            </span>
            <span>CONTINUE WITH FACEBOOK</span>
          </button>

          {/* Google Button */}
          <button
            type="button"
            onClick={() => handleSubmit()}
            className="w-full h-14 py-3.5 px-5 rounded-full bg-white hover:bg-neutral-50 text-[#3F414E] border border-[#EBEAEC] flex items-center justify-center gap-3 font-regular text-xs tracking-widest uppercase shadow-sm transition-all active:scale-[0.99] cursor-pointer "
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>CONTINUE WITH GOOGLE</span>
          </button>
        </div>

        {/* Divider */}
        <div className="w-full my-5 flex items-center justify-center">
          <span className="text-[#3F414E] text-[14px] font-medium tracking-widest uppercase">
            OR LOG IN WITH EMAIL
          </span>
        </div>

        {/* Input Fields */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3">
          {/* Name Field */}
          <div className="relative w-full">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              className="w-full h-14 px-5 pr-12 rounded-2xl bg-[#F2F3F7] text-[#3F414E] placeholder-[#A1A4B2] font-medium text-sm focus:outline-none focus:ring-2 focus:ring-[#8E97FD] transition-all"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#27AE60]/15 flex items-center justify-center text-[#27AE60]">
              <Check size={14} strokeWidth={3} />
            </div>
          </div>

          {/* Email Field */}
          <div className="relative w-full">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="w-full h-14 px-5 pr-12 rounded-2xl bg-[#F2F3F7] text-[#3F414E] placeholder-[#A1A4B2] font-medium text-sm focus:outline-none focus:ring-2 focus:ring-[#8E97FD] transition-all"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#27AE60]/15 flex items-center justify-center text-[#27AE60]">
              <Check size={14} strokeWidth={3} />
            </div>
          </div>

          {/* Password Field */}
          <div className="relative w-full">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full h-14 px-5 pr-12 rounded-2xl bg-[#F2F3F7] text-[#3F414E] placeholder-[#A1A4B2] font-medium text-sm focus:outline-none focus:ring-2 focus:ring-[#8E97FD] transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A1A4B2] hover:text-[#3F414E] transition-colors p-1 cursor-pointer"
              aria-label="Toggle password visibility"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Privacy Policy Checkbox matching Figma */}
          <div className="flex items-center justify-between pt-1 px-1">
            <span className="text-xs text-[#3F414E]">
              I have read the{' '}
              <button
                type="button"
                className="text-[#6979F8] font-semibold hover:underline cursor-pointer"
              >
                Privacy Policy
              </button>
            </span>
              <label className="flex items-center cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="sr-only"
                />
                <div
                  className={`w-5 h-5 rounded flex items-center justify-center transition-all border ${
                    agreed
                      ? 'bg-[#8E97FD] border-[#8E97FD]'
                      : 'bg-white border-[#A1A4B2]'
                  }`}
                >
                  {agreed && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
                </div>
              </label>
          </div>

          {/* Submit Button: Figma Frame 03 "Get Started" */}
          <button
            type="submit"
            className="w-full h-14 mt-4 rounded-full bg-[#8E97FD] hover:bg-[#7C82ED] text-white font-semibold text-md tracking-wide shadow-[0_12px_24px_rgba(142,151,253,0.35)] transition-all active:scale-[0.99] flex items-center justify-center cursor-pointer"
          >
            Get Started
          </button>
        </form>
      </div>

      {/* Footer Link */}
      <div className="pb-8 pt-2 font-semibold text-center text-xs text-[#3F414E] z-10">
        ALREADY HAVE AN ACCOUNT?{' '}
        <button
          onClick={() => handleSubmit()}
          className="text-[#6979F8] font-semibold hover:underline ml-1 cursor-pointer"
        >
          LOG IN
        </button>
      </div>
    </div>
  );
};
