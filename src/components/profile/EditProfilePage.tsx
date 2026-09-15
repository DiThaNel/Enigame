'use client';

import React, { useState } from 'react';
import { useEnigameStore } from '@/store/useEnigameStore';
import { ChevronLeft, Camera, MapPin, Quote, Award, Check, CheckCircle2 } from 'lucide-react';

const InstagramIcon = ({ size = 18, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width={20} height={20} x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

interface EditProfilePageProps {
  onBack?: () => void;
}

export const EditProfilePage: React.FC<EditProfilePageProps> = ({ onBack }) => {
  const { currentUser, updateProfile, setProfileViewStep, setEditProfileOpen } = useEnigameStore();

  const [nickname, setNickname] = useState(currentUser.nickname || currentUser.name || 'Tiana Rosser');
  const [bio, setBio] = useState(currentUser.bio || 'Must go faster. Must go faster... go, go, go, go! I was part of something special.');
  const [city, setCity] = useState(currentUser.city || 'Bragança, Portugal');
  const [gender, setGender] = useState(currentUser.gender || 'Female');
  const [ageGroup, setAgeGroup] = useState(currentUser.ageGroup || '20s');
  const [rankTitle, setRankTitle] = useState(currentUser.rankTitle || 'Master Cartographer');
  const [selectedAvatar, setSelectedAvatar] = useState(currentUser.avatar || '/assets/TianaAvatar.png');
  const [showSavedToast, setShowSavedToast] = useState(false);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      setProfileViewStep('profile');
      setEditProfileOpen(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setSelectedAvatar(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    updateProfile({
      nickname,
      name: nickname,
      bio,
      city,
      gender,
      ageGroup,
      rankTitle,
      avatar: selectedAvatar,
    });
    setShowSavedToast(true);
    setTimeout(() => {
      handleBack();
    }, 600);
  };

  return (
    <div className="w-full min-h-full bg-[#F4F6FB] flex flex-col animate-fadeIn relative select-none">
      {/* Background Curved Wave Header matching Figma 09.2 / 09 */}
      <div className="relative w-full bg-[#8E97FD] rounded-b-[36px] pt-8 pb-5 px-6 flex items-center justify-between text-white shadow-xs shrink-0 z-20">
        <button
          onClick={handleBack}
          className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all cursor-pointer active:scale-95"
          title="Back to Profile"
          aria-label="Back"
        >
          <ChevronLeft size={22} />
        </button>
        <h1 className="text-base font-bold tracking-wide">Edit Profile</h1>
        <button
          onClick={() => handleSave()}
          className="text-xs font-extrabold text-white bg-white/20 hover:bg-white/30 px-3.5 py-1.5 rounded-full transition-all cursor-pointer active:scale-95"
        >
          Done
        </button>
      </div>

      {/* Success Toast */}
      {showSavedToast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-[#1E1F3D] text-white px-4 py-2.5 rounded-full shadow-xl flex items-center gap-2 text-xs font-bold animate-fadeIn">
          <CheckCircle2 size={16} className="text-emerald-400" />
          <span>Profile updated successfully!</span>
        </div>
      )}

      {/* Form Content - Scrollable Page Body */}
      <form onSubmit={handleSave} className="flex-1 overflow-y-auto px-5 py-5 space-y-4 no-scrollbar pb-10">
        {/* Avatar Section */}
        <div className="bg-white rounded-[28px] p-5 shadow-sm border border-[#EAEFFE] flex flex-col items-center">
          <div className="relative mb-2">
            <div className="w-24 h-24 rounded-full p-1">
              <img
                src={selectedAvatar || '/assets/TianaAvatar.png'}
                alt={nickname}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/assets/TianaAvatar.png';
                }}
                className="w-full h-full rounded-full object-cover bg-white"
              />
            </div>
            <label 
              className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#8E97FD] text-white flex items-center justify-center shadow-md cursor-pointer hover:bg-[#7B85F8] transition-all ring-2 ring-white active:scale-95"
              title="Upload Photo"
            >
              <Camera size={15} />
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageUpload} 
                className="hidden" 
              />
            </label>
          </div>

          <span className="text-[11px] font-bold text-[#8E97FD] bg-[#EEF0FF] px-3.5 py-1 rounded-full mt-1">
            Level {currentUser.level || 12} Adventurer Frame
          </span>
        </div>

        {/* Input Details Card */}
        <div className="bg-white rounded-[28px] p-5 shadow-sm border border-[#EAEFFE] space-y-4">
          {/* Explorer Nickname */}
          <div>
            <label className="text-xs font-bold text-[#1E1F3D] block mb-1">Explorer Nickname</label>
            <input
              type="text"
              required
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="e.g. Tiana Rosser"
              className="w-full h-11 px-4 rounded-2xl bg-[#F4F6FB] border border-[#EEF0FA] text-xs font-semibold text-[#1E1F3D] focus:outline-none focus:ring-2 focus:ring-[#8E97FD]/40 transition-all"
            />
          </div>

          {/* Adventure Bio */}
          <div>
            <label className="text-xs font-bold text-[#1E1F3D] block mb-1">Adventure Bio / Motto</label>
            <div className="relative">
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Share your explorer quote or motto..."
                className="w-full p-3.5 pr-8 rounded-2xl bg-[#F4F6FB] border border-[#EEF0FA] text-xs font-medium text-[#585A7E] focus:outline-none focus:ring-2 focus:ring-[#8E97FD]/40 resize-none leading-relaxed transition-all"
              />
              <Quote className="absolute right-3 top-3 text-[#8E97FD]/40" size={16} />
            </div>
          </div>

          {/* Home Base City */}
          <div>
            <label className="text-xs font-bold text-[#1E1F3D] block mb-1">Home Base City</label>
            <div className="relative">
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="City, Country"
                className="w-full h-11 pl-10 pr-4 rounded-2xl bg-[#F4F6FB] border border-[#EEF0FA] text-xs font-semibold text-[#1E1F3D] focus:outline-none focus:ring-2 focus:ring-[#8E97FD]/40 transition-all"
              />
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8E97FD]" size={16} />
            </div>
          </div>

          {/* Age & Gender Pickers */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-[#1E1F3D] block mb-1">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full h-11 px-3 rounded-2xl bg-[#F4F6FB] border border-[#EEF0FA] text-xs font-semibold text-[#1E1F3D] focus:outline-none focus:ring-2 focus:ring-[#8E97FD]/40 cursor-pointer"
              >
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Explorer">Non-binary / Explorer</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-[#1E1F3D] block mb-1">Age Group</label>
              <select
                value={ageGroup}
                onChange={(e) => setAgeGroup(e.target.value)}
                className="w-full h-11 px-3 rounded-2xl bg-[#F4F6FB] border border-[#EEF0FA] text-xs font-semibold text-[#1E1F3D] focus:outline-none focus:ring-2 focus:ring-[#8E97FD]/40 cursor-pointer"
              >
                <option value="Teens">Teens (&lt;20)</option>
                <option value="20s">20s</option>
                <option value="30s">30s</option>
                <option value="40+">40+</option>
              </select>
            </div>
          </div>

          {/* Equipped Badge */}
          <div>
            <label className="text-xs font-bold text-[#1E1F3D] block mb-1">Equipped Rank Title</label>
            <div className="relative">
              <select
                value={rankTitle}
                onChange={(e) => setRankTitle(e.target.value)}
                className="w-full h-11 pl-10 pr-4 rounded-2xl bg-[#F4F6FB] border border-[#EEF0FA] text-xs font-semibold text-[#1E1F3D] focus:outline-none focus:ring-2 focus:ring-[#8E97FD]/40 cursor-pointer"
              >
                <option value="Master Cartographer">Master Cartographer</option>
                <option value="Senior Enigmatist">Senior Enigmatist</option>
                <option value="Pathfinder">Pathfinder</option>
                <option value="Citadel Legend">Citadel Legend</option>
              </select>
              <Award className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#FFB800]" size={16} />
            </div>
          </div>

          {/* Social Links */}
          <div>
            <label className="text-xs font-bold text-[#1E1F3D] block mb-1">Social Connection</label>
            <div className="flex items-center justify-between p-3 rounded-2xl bg-[#F4F6FB] border border-[#EEF0FA]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#FF5757] via-[#C13584] to-[#833AB4] text-white flex items-center justify-center shadow-xs">
                  <InstagramIcon size={17} />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#1E1F3D] block">Instagram</span>
                  <span className="text-[10px] text-[#7A7C99]">@tiana_adventures</span>
                </div>
              </div>
              <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-lg flex items-center gap-1">
                <Check size={12} /> Connected
              </span>
            </div>
          </div>
        </div>

        {/* Action Button styled with Enigame signature look */}
        <div className="pt-2 pb-8">
          <button
            type="submit"
            className="w-full h-14 rounded-full bg-[#8E97FD] hover:bg-[#7C82ED] text-white font-bold text-sm tracking-wide shadow-[0_12px_24px_rgba(142,151,253,0.35)] transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
          >
            <Check size={18} strokeWidth={2.5} />
            <span>Save Changes</span>
          </button>
        </div>
      </form>
    </div>
  );
};
