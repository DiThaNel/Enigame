'use client';

import React, { useState } from 'react';
import { useEnigameStore } from '@/store/useEnigameStore';
import { ChevronLeft, Edit3, Camera, Compass } from 'lucide-react';

export const ProfileView: React.FC = () => {
  const { currentUser, setEditProfileOpen, resetOnboarding } = useEnigameStore();
  const [activeTab, setActiveTab] = useState<'instagram' | 'about' | 'trips'>('instagram');

  return (
    <div className="w-full min-h-screen pb-24 bg-[#F4F6FC] flex flex-col relative overflow-hidden">
      {/* Background Curved Wave & Trail */}
      <div className="absolute top-0 left-0 right-0 h-44 bg-[#989EEC] rounded-b-[40px] -z-10" />

      {/* Top Header */}
      <div className="px-6 pt-5 flex items-center justify-between text-white">
        <button
          onClick={() => resetOnboarding()}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors cursor-pointer"
          title="Restart Onboarding"
        >
          <ChevronLeft size={24} />
        </button>

        {/* Options & Edit Profile Pill Button matching Figma */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => resetOnboarding()}
            className="px-3 py-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white font-semibold text-xs flex items-center gap-1 transition-all cursor-pointer"
            title="Replay Onboarding Flow"
          >
            <Compass size={13} />
            <span className="hidden sm:inline">Guide</span>
          </button>
          
          <button
            onClick={() => setEditProfileOpen(true)}
            className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors cursor-pointer"
            aria-label="Settings"
          >
            <img src="/assets/GearOptionsIcon.png" alt="Settings" className="w-4 h-4 object-contain brightness-0 invert" />
          </button>
          
          <button
            onClick={() => setEditProfileOpen(true)}
            className="px-4 py-1.5 rounded-full bg-white text-[#1E1F3D] font-bold text-xs shadow-md flex items-center gap-1.5 hover:bg-white/90 active:scale-95 transition-all cursor-pointer"
          >
            <Edit3 size={14} className="text-[#1E1F3D]" />
            <span>Edit Profile</span>
          </button>
        </div>
      </div>

      {/* Main Profile Card matching Figma Group 7 */}
      <div className="mx-6 mt-4 bg-white rounded-[32px] p-6 shadow-[0_10px_35px_rgba(142,151,253,0.15)] border border-[#EAEFFE] flex flex-col items-center text-center">
        {/* Profile Avatar Frame with Portugal flag */}
        <div className="relative w-22 h-22 rounded-full p-1 border-2 border-[#8E97FD] shadow-sm">
          <img
            src="/assets/TianaAvatar.png"
            alt={currentUser.name}
            className="w-full h-full rounded-full object-cover"
          />
          <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full overflow-hidden border-2 border-white shadow-sm flex items-center justify-center bg-white">
            <img src="/assets/PortugalMiniIcon.png" alt="PT" className="w-full h-full object-cover" />
          </div>
        </div>

        {/* User Full Name */}
        <h1 className="text-lg font-black text-[#1E1F3D] mt-3">{currentUser.name}</h1>

        {/* User Bio/Motto Quote in Blue Font */}
        <p className="text-xs text-[#6E7BFF] italic font-semibold mt-2 px-2 max-w-[270px]">
          &quot;{currentUser.bio}&quot;
        </p>

        {/* 3 Circular Attribute Badges matching Figma */}
        <div className="flex items-center justify-center gap-8 mt-5 w-full">
          {/* Location */}
          <div className="flex flex-col items-center gap-1">
            <div className="w-10 h-10 rounded-full bg-[#EEF0FA] flex items-center justify-center">
              <img src="/assets/Bandera Portugal.png" alt="Location" className="w-5 h-5 object-contain rounded-full" />
            </div>
            <span className="text-[10px] font-bold text-[#585A7E]">Location</span>
          </div>

          {/* Gender/Age */}
          <div className="flex flex-col items-center gap-1">
            <div className="w-10 h-10 rounded-full bg-[#EEF0FA] flex items-center justify-center">
              <img src="/assets/GenderIcon.png" alt="Gender" className="w-5 h-5 object-contain" />
            </div>
            <span className="text-[10px] font-bold text-[#585A7E]">Gender/Age</span>
          </div>

          {/* Rank */}
          <div className="flex flex-col items-center gap-1">
            <div className="w-10 h-10 rounded-full bg-[#EEF0FA] flex items-center justify-center">
              <img src="/assets/MedalIcon.png" alt="Rank" className="w-5 h-5 object-contain" />
            </div>
            <span className="text-[10px] font-bold text-[#585A7E]">Rank</span>
          </div>
        </div>
      </div>

      {/* Profile Section Tabs: Instagram, About, Trips */}
      <div className="px-8 mt-6 flex items-center justify-around border-b border-[#EAEFFE] pb-2">
        {(['instagram', 'about', 'trips'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={"text-xs capitalize font-bold transition-all relative pb-2 cursor-pointer " + (
              activeTab === tab
                ? "text-[#8E97FD] font-black border-b-2 border-[#8E97FD]"
                : "text-[#A5A7C4] hover:text-[#585A7E]"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Instagram Content Area matching 09 - Personal Profile */}
      {activeTab === 'instagram' && (
        <div className="flex-1 px-6 pt-6 flex flex-col items-center justify-center min-h-[160px] gap-3">
          <button className="px-6 py-2.5 rounded-full bg-[#8E97FD] hover:bg-[#7C82ED] text-white font-bold text-xs shadow-md flex items-center gap-2 active:scale-95 transition-all cursor-pointer">
            <Camera size={16} />
            <span>Add Instagram</span>
          </button>

          <button
            onClick={() => resetOnboarding()}
            className="text-xs text-[#8E97FD] font-semibold underline hover:text-[#7C82ED] mt-2 cursor-pointer"
          >
            Replay Onboarding Guide
          </button>
        </div>
      )}

      {/* About Tab */}
      {activeTab === 'about' && (
        <div className="px-6 pt-4 text-xs text-[#585A7E] leading-relaxed space-y-2">
          <p className="font-semibold text-[#1E1F3D]">Explorer Details</p>
          <p>Home City: {currentUser.city}</p>
          <p>Explorer Level: {currentUser.level}</p>
          <p>Rank Title: {currentUser.rankTitle}</p>
          <button
            onClick={() => resetOnboarding()}
            className="text-xs text-[#8E97FD] font-semibold underline hover:text-[#7C82ED] block mt-2 cursor-pointer"
          >
            Replay Onboarding Guide
          </button>
        </div>
      )}

      {/* Trips Tab */}
      {activeTab === 'trips' && (
        <div className="px-6 pt-4 text-xs text-[#585A7E]">
          <p className="font-semibold text-[#1E1F3D] mb-2">Completed Expeditions</p>
          <div className="p-3 bg-white rounded-2xl border border-[#EEF0FA] flex items-center justify-between">
            <div>
              <p className="font-bold text-[#1E1F3D]">Bragança Medieval Mystery</p>
              <p className="text-[10px] text-[#A5A7C4]">Completed 2 days ago</p>
            </div>
            <span className="text-xs font-black text-[#8E97FD]">+350 pts</span>
          </div>
        </div>
      )}
    </div>
  );
};
