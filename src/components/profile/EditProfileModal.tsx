'use client';

const InstagramIcon = ({ size = 18, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

import React, { useState } from 'react';
import { useEnigameStore } from '@/store/useEnigameStore';
import { X, Camera, MapPin, Quote, Award, Check } from 'lucide-react';

export const EditProfileModal: React.FC = () => {
  const { isEditProfileOpen, setEditProfileOpen, currentUser, updateProfile } = useEnigameStore();

  const [nickname, setNickname] = useState(currentUser.nickname);
  const [bio, setBio] = useState(currentUser.bio);
  const [city, setCity] = useState(currentUser.city);
  const [gender, setGender] = useState(currentUser.gender);
  const [ageGroup, setAgeGroup] = useState(currentUser.ageGroup);
  const [rankTitle, setRankTitle] = useState(currentUser.rankTitle);
  const [selectedAvatar, setSelectedAvatar] = useState(currentUser.avatar);

  if (!isEditProfileOpen) return null;

  const avatarOptions = [
    currentUser.avatar,
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
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
    setEditProfileOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/65 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-[430px] max-h-[92vh] bg-white rounded-t-[36px] sm:rounded-[36px] overflow-hidden flex flex-col shadow-2xl animate-slideUp">
        {/* Header */}
        <div className="px-6 pt-5 pb-3 border-b border-[#EEF0FA] flex items-center justify-between">
          <button
            onClick={() => setEditProfileOpen(false)}
            className="w-9 h-9 rounded-full bg-[#F4F6FB] flex items-center justify-center text-[#7A7C99] hover:text-[#1E1F3D]"
          >
            <X size={18} />
          </button>
          <h2 className="text-base font-extrabold text-[#1E1F3D]">Edit Profile</h2>
          <button
            onClick={handleSave}
            className="text-xs font-bold text-[#7C82ED] hover:text-[#6C5CE7] px-2 py-1"
          >
            Done
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 overflow-y-auto max-h-[calc(92vh-10rem)] flex flex-col gap-5">
          {/* Avatar Section */}
          <div className="flex flex-col items-center">
            <div className="relative mb-3">
              <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-[#7C82ED] to-[#8D93FF] shadow-lg shadow-indigo-200">
                <img
                  src={selectedAvatar}
                  alt={nickname}
                  className="w-full h-full rounded-full object-cover bg-white"
                />
              </div>
              <label 
                className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#7C82ED] text-white flex items-center justify-center shadow-md cursor-pointer hover:bg-[#6C5CE7] transition-colors"
                title="Change Avatar"
              >
                <Camera size={15} />
              </label>
            </div>

            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold text-[#7A7C99]">Preset Avatars:</span>
              <div className="flex items-center gap-1.5">
                {avatarOptions.map((av, idx) => (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => setSelectedAvatar(av)}
                    className={`w-6 h-6 rounded-full overflow-hidden border ${
                      selectedAvatar === av ? 'ring-2 ring-[#7C82ED] border-white' : 'border-[#DCE0F9]'
                    }`}
                  >
                    <img src={av} alt="Option" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
            <span className="text-[11px] font-bold text-[#6C5CE7] bg-[#EEF0FF] px-3 py-0.5 rounded-full mt-1">
              Level {currentUser.level} Adventurer Frame
            </span>
          </div>

          {/* Explorer Nickname */}
          <div>
            <label className="text-xs font-bold text-[#1E1F3D] block mb-1">Explorer Nickname</label>
            <input
              type="text"
              required
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full h-11 px-4 rounded-2xl bg-[#F4F6FB] border border-[#EEF0FA] text-xs font-semibold text-[#1E1F3D] focus:outline-none focus:ring-2 focus:ring-[#7C82ED]/40"
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
                className="w-full p-3.5 pr-8 rounded-2xl bg-[#F4F6FB] border border-[#EEF0FA] text-xs font-medium text-[#585A7E] focus:outline-none focus:ring-2 focus:ring-[#7C82ED]/40 resize-none leading-relaxed"
              />
              <Quote className="absolute right-3 top-3 text-[#7C82ED]/40" size={16} />
            </div>
          </div>

          {/* Home City */}
          <div>
            <label className="text-xs font-bold text-[#1E1F3D] block mb-1">Home Base City</label>
            <div className="relative">
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full h-11 pl-10 pr-4 rounded-2xl bg-[#F4F6FB] border border-[#EEF0FA] text-xs font-semibold text-[#1E1F3D] focus:outline-none focus:ring-2 focus:ring-[#7C82ED]/40"
              />
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7C82ED]" size={16} />
            </div>
          </div>

          {/* Age & Gender Pickers */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-[#1E1F3D] block mb-1">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full h-11 px-3 rounded-2xl bg-[#F4F6FB] border border-[#EEF0FA] text-xs font-semibold text-[#1E1F3D] focus:outline-none focus:ring-2 focus:ring-[#7C82ED]/40 cursor-pointer"
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
                className="w-full h-11 px-3 rounded-2xl bg-[#F4F6FB] border border-[#EEF0FA] text-xs font-semibold text-[#1E1F3D] focus:outline-none focus:ring-2 focus:ring-[#7C82ED]/40 cursor-pointer"
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
                className="w-full h-11 pl-10 pr-4 rounded-2xl bg-[#F4F6FB] border border-[#EEF0FA] text-xs font-semibold text-[#1E1F3D] focus:outline-none focus:ring-2 focus:ring-[#7C82ED]/40 cursor-pointer"
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
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#FF5757] via-[#C13584] to-[#833AB4] text-white flex items-center justify-center">
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

          {/* Submit */}
          <button
            type="submit"
            className="w-full h-12 rounded-2xl bg-gradient-to-r from-[#7C82ED] to-[#6C5CE7] text-white font-bold text-xs mt-2 shadow-lg shadow-indigo-300/40 hover:opacity-95 active:scale-95 transition-all"
          >
            Save Profile
          </button>
        </form>
      </div>
    </div>
  );
};