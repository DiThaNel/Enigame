'use client';

import React, { useState } from 'react';
import { useEnigameStore } from '@/store/useEnigameStore';
import { 
  ChevronLeft, 
  Edit3, 
  Camera, 
  Settings, 
  Key, 
  Mail, 
  Receipt, 
  LayoutGrid, 
  List, 
  Plus, 
  Award, 
  Compass, 
  CheckCircle2, 
  X,
  Share2
} from 'lucide-react';
import { EditProfilePage } from './EditProfilePage';

export const ProfileView: React.FC = () => {
  const { 
    currentUser,
    showToast,
    setLightboxPhoto, 
    profileViewStep,
    setProfileViewStep,
    setEditProfileOpen, 
    setSettingsOpen, 
    setChangePasswordOpen, 
    setChangeEmailOpen, 
    setPurchaseHistoryOpen,
    setActiveTab: setNavActiveTab,
    points,
    activities
  } = useEnigameStore();

  const [activeTab, setActiveTab] = useState<'instagram' | 'about' | 'trips'>('instagram');
  const [photoViewMode, setPhotoViewMode] = useState<'grid' | 'list'>('grid');
  const [tripAddedAlert, setTripAddedAlert] = useState(false);

  // Reliable Gallery Photos using local assets and verified travel images
  const [galleryPhotos, setGalleryPhotos] = useState<Array<{ id: string; url: string; caption: string }>>([
    {
      id: 'p1',
      url: '/assets/BragancaHome.png',
      caption: 'Citadel courtyard of Castelo de Bragança'
    },
    {
      id: 'p2',
      url: '/assets/HomeImage.png',
      caption: 'Historic cobblestone streets in northern Portugal'
    },
    {
      id: 'p3',
      url: '/assets/RoutesImageCarousel.png',
      caption: 'Mountain panorama and medieval fortress route'
    },
    {
      id: 'p4',
      url: '/assets/ExperiencesCarousel.png',
      caption: 'Local cultural heritage and secret cellar quests'
    },
    {
      id: 'p5',
      url: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=600&auto=format&fit=crop&q=80',
      caption: 'Ribeira riverfront sunset'
    },
    {
      id: 'p6',
      url: 'https://images.unsplash.com/photo-1513688275180-844a4972fa63?w=600&auto=format&fit=crop&q=80',
      caption: 'Portuguese azulejos garden courtyard'
    }
  ]);

  // If user is editing profile, render the dedicated EditProfilePage (after all hooks)
  if (profileViewStep === 'edit-profile') {
    return <EditProfilePage onBack={() => setProfileViewStep('profile')} />;
  }

  // Completed Trips matching Figma 06.3 - Meet-up (Profile/Trips) using user's flag assets
  const completedTrips = [
    { city: 'Lisbon, Portugal', flagImg: '/assets/PT.png' },
    { city: 'Berlin, Germany', flagImg: '/assets/GER.png' },
    { city: 'Paris, France', flagImg: '/assets/FR.png' },
    { city: 'Lisbon, Portugal', flagImg: '/assets/PT.png' },
    { city: 'London, UK', flagImg: '/assets/UK.png' },
    { city: 'Washintong D.C, USA', flagImg: '/assets/USA.png' },
    { city: 'Madrid, Spain', flagImg: '/assets/ES.png' },
    { city: 'Rome, Italy', flagImg: '/assets/IT.png' }
  ];

  const handleAddPhoto = () => {
    const fallbackOptions = [
      '/assets/BragancaHome.png',
      '/assets/HomeImage.png',
      '/assets/RoutesImageCarousel.png'
    ];
    const picked = fallbackOptions[Math.floor(Math.random() * fallbackOptions.length)];
    setGalleryPhotos([
      { id: 'p-' + Date.now(), url: picked, caption: 'New expedition highlight #Enigame' },
      ...galleryPhotos
    ]);
  };

  return (
    <div className="w-full min-h-screen pb-24 bg-[#F4F6FC] flex flex-col relative overflow-hidden">
      {/* Background Curved Wave & Dashed Trail matching Figma 09 - Personal Profile */}
      <div className="absolute top-0 left-0 right-0 h-48 bg-[#8E97FD] rounded-b-[44px] z-0 shadow-sm overflow-hidden">
        {/* Subtle decorative curved dashed lines */}
        <svg className="absolute inset-0 w-full h-full opacity-25 pointer-events-none" viewBox="0 0 375 180" fill="none">
          <path d="M-20 60 C80 20, 160 120, 260 50 C320 10, 360 80, 400 60" stroke="white" strokeWidth="2.5" strokeDasharray="6 6" />
          <path d="M30 140 C110 90, 220 160, 320 100 C360 80, 390 120, 420 110" stroke="white" strokeWidth="2" strokeDasharray="5 5" />
        </svg>
      </div>

      {/* Top Header matching Figma 09 */}
      <div className="relative z-10 px-5 pt-5 flex items-center justify-between text-white">
        <button
          onClick={() => setNavActiveTab('home')}
          className="w-9 h-9 flex items-center justify-center rounded-full bg-white/15 hover:bg-white/30 backdrop-blur-xs transition-colors cursor-pointer"
          title="Back to Home"
        >
          <ChevronLeft size={22} />
        </button>

        {/* Right Header Buttons: Settings Gear + Edit Profile Pill */}
        <div className="flex items-center gap-2">
          {/* Settings Gear Button */}
          <button
            onClick={() => setSettingsOpen(true)}
            className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all cursor-pointer shadow-xs"
            title="Account & Settings"
          >
            <Settings size={18} className="text-white" />
          </button>

          {/* Edit Profile Pill Button matching Figma 09.1 */}
          <button
            onClick={() => setProfileViewStep('edit-profile')}
            className="h-9 px-4 rounded-full bg-white text-[#1E1F3D] font-bold text-xs shadow-md flex items-center gap-1.5 hover:bg-white/90 active:scale-95 transition-all cursor-pointer"
          >
            <Edit3 size={14} className="text-[#1E1F3D]" />
            <span>Edit Profile</span>
          </button>
        </div>
      </div>

      {/* Main Profile Floating Card matching Figma Group 7 / 09 - Personal Profile */}
      <div className="mx-5 mt-4 bg-white rounded-[32px] p-6 shadow-[0_12px_36px_rgba(142,151,253,0.18)] border border-[#EAEFFE] flex flex-col items-center text-center relative animate-card-fade-up z-10">
        {/* Profile Avatar Frame with Portugal flag badge and equipped medal */}
        <div className="relative w-23 h-23 rounded-full">
          <img
            src={currentUser.avatar || "/assets/TianaAvatar.png"}
            alt={currentUser.name}
            className="w-full h-full rounded-full object-cover bg-white"
          />
          {/* Dynamic Equipped Medal top-right */}
          <div className="absolute -top-1.5 -right-1.5 w-7 h-7 flex items-center justify-center pointer-events-none drop-shadow">
            <img
              src={currentUser.rankMedal || "/assets/StarSingle.png"}
              alt="Medal"
              className="w-6 h-6 object-contain"
            />
          </div>
          {/* National flag badge matching Figma (Portugal) */}
          <div className="absolute bottom-0 right-0 w-7 h-7 rounded-full overflow-hidden border-2 border-white shadow-sm flex items-center justify-center bg-white pointer-events-none">
            <img src={currentUser.countryFlag || "/assets/PT.png"} alt="Portugal" className="w-full h-full object-cover" />
          </div>
        </div>

        {/* User Full Name */}
        <h1 className="text-lg font-black text-[#1E1F3D] mt-3 tracking-tight font-medium">
          {currentUser.name || 'Tiana Rosser'}
        </h1>

        {/* Equipped Rank Title */}
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className="text-xs font-bold text-[#8E97FD]">
            {currentUser.rankTitle || 'Master Cartographer'}
          </span>
        </div>

        {/* User Bio Quote in Signature Periwinkle Blue Font */}
        <p className="text-xs text-[#5D6BFF] italic font-semibold mt-2 px-3 max-w-[280px] leading-relaxed">
          &quot;{currentUser.bio || 'Must go faster. Must go faster... go, go, go, go! I was part of something special.'}&quot;
        </p>

        {/* Thin Divider */}
        <div className="w-full h-px bg-[#8e97fd] my-4" />

        {/* 3 Circular Attribute Badges matching Figma */}
        <div className="grid grid-cols-3 gap-2 w-full">
          {/* Location */}
          <div className="flex flex-col items-center gap-1.5">
            <div className="w-11 h-11 rounded-full bg-[#F2F4FD] flex items-center justify-center shadow-xs overflow-hidden p-2">
              <img src="/assets/PT.png" alt="Location" className="w-full h-full object-cover rounded-full" />
            </div>
            <span className="text-[11px] font-bold text-[#8E97FD]">Location</span>
            <span className="text-[10px] font-semibold text-[#7A7C99] truncate max-w-[80px]">
              {currentUser.city || 'Bragança, PT'}
            </span>
          </div>

          {/* Gender/Age */}
          <div className="flex flex-col items-center gap-1.5">
            <div className="w-11 h-11 rounded-full bg-[#F2F4FD] flex items-center justify-center shadow-xs">
              <img src="/assets/GenderIcon.png" alt="Gender" className="w-5 h-5 object-contain" />
            </div>
            <span className="text-[11px] font-bold text-[#8E97FD]">Gender/Age</span>
            <span className="text-[10px] font-semibold text-[#7A7C99]">
              {currentUser.gender || 'Female'}, {currentUser.ageGroup || '20s'}
            </span>
          </div>

          {/* Rank */}
          <div className="flex flex-col items-center gap-1.5">
            <div className="w-11 h-11 rounded-full bg-[#F2F4FD] flex items-center justify-center shadow-xs">
              <img src="/assets/MedalIcon.png" alt="Rank" className="w-5 h-5 object-contain" />
            </div>
            <span className="text-[11px] font-bold text-[#8E97FD]">Rank</span>
            <span className="text-[10px] font-semibold text-[#7A7C99] truncate max-w-[80px]">
              {currentUser.rankTitle || 'Master'}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Action Shortcuts Bar for Account Settings (Password, Email, Purchases) */}
      <div className="mx-5 mt-3.5 flex items-center justify-between gap-2 z-10">
        <button
          onClick={() => setChangePasswordOpen(true)}
          className="animate-card-stagger stagger-1 flex-1 py-2 px-2.5 rounded-2xl bg-white border border-[#EAEFFE] hover:border-[#8E97FD]/50 shadow-xs flex items-center justify-center gap-1.5 text-[#1E1F3D] hover:text-[#8E97FD] transition-all cursor-pointer"
        >
          <Key size={13} className="text-[#8E97FD]" />
          <span className="text-[11px] font-bold">Password</span>
        </button>

        <button
          onClick={() => setChangeEmailOpen(true)}
          className="animate-card-stagger stagger-2 flex-1 py-2 px-2.5 rounded-2xl bg-white border border-[#EAEFFE] hover:border-[#8E97FD]/50 shadow-xs flex items-center justify-center gap-1.5 text-[#1E1F3D] hover:text-[#8E97FD] transition-all cursor-pointer"
        >
          <Mail size={13} className="text-[#8E97FD]" />
          <span className="text-[11px] font-bold">Email</span>
        </button>

        <button
          onClick={() => setPurchaseHistoryOpen(true)}
          className="animate-card-stagger stagger-3 flex-1 py-2 px-2.5 rounded-2xl bg-white border border-[#EAEFFE] hover:border-[#8E97FD]/50 shadow-xs flex items-center justify-center gap-1.5 text-[#1E1F3D] hover:text-[#8E97FD] transition-all cursor-pointer"
        >
          <Receipt size={13} className="text-[#8E97FD]" />
          <span className="text-[11px] font-bold">Purchases</span>
        </button>

        <button
          onClick={() => setSettingsOpen(true)}
          className="animate-card-stagger stagger-4 w-9 h-9 rounded-2xl bg-white border border-[#EAEFFE] hover:border-[#8E97FD]/50 shadow-xs flex items-center justify-center text-[#7A7C99] hover:text-[#8E97FD] transition-all cursor-pointer shrink-0"
          title="All Settings"
        >
          <Settings size={15} />
        </button>
      </div>

      {/* Profile Section Tabs: Instagram, About, Trips centered matching Figma */}
      <div className="w-full mt-5 border-b border-[#EAEFFE] z-10">
        <div className="grid grid-cols-3 max-w-[340px] mx-auto text-center">
          {(['instagram', 'about', 'trips'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={"text-xs font-bold transition-all relative pb-3 cursor-pointer capitalize flex flex-col items-center justify-center " + (
                activeTab === tab
                  ? "text-[#8E97FD] font-black"
                  : "text-[#A5A7C4] hover:text-[#585A7E]"
              )}
            >
              <span>{tab}</span>
              {activeTab === tab && (
                <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-[#8E97FD] rounded-full animate-fadeIn" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Active Profile Section Tab with smooth fade-scale enter animation */}
      <div key={activeTab} className="w-full animate-tab-enter z-10">
        {/* Tab 1: Instagram Content Area matching Figma 09 - Personal Profile & 06.1 - Meet-up (Profile) */}
        {activeTab === 'instagram' && (
          <div className="px-5 pt-4 flex flex-col gap-3.5">
            {/* Header Row: Photos title & View mode toggle */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-[#1E1F3D] font-semibold">Photos</span>
              <div className="flex items-center gap-1.5 text-[#7A7C99]">
                <button
                  onClick={() => setPhotoViewMode('list')}
                  className={`p-1 rounded-md transition-colors cursor-pointer ${
                    photoViewMode === 'list' ? 'text-[#8E97FD] bg-[#EEF0FF]' : 'hover:text-[#1E1F3D]'
                  }`}
                  title="List View"
                >
                  <List size={17} />
                </button>
                <button
                  onClick={() => setPhotoViewMode('grid')}
                  className={`p-1 rounded-md transition-colors cursor-pointer ${
                    photoViewMode === 'grid' ? 'text-[#8E97FD] bg-[#EEF0FF]' : 'hover:text-[#1E1F3D]'
                  }`}
                  title="Grid View"
                >
                  <LayoutGrid size={17} />
                </button>
              </div>
            </div>

            {/* Photos Grid or List */}
            {photoViewMode === 'grid' ? (
              <div className="grid grid-cols-3 gap-2">
                {galleryPhotos.map((photo, idx) => (
                  <div
                    key={photo.id}
                    onClick={() => setLightboxPhoto(photo.url)}
                    style={{ animationDelay: `${(idx % 6) * 40}ms` }}
                    className="animate-card-stagger aspect-square rounded-2xl overflow-hidden shadow-xs hover:opacity-95 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer group relative bg-[#EEF0FA]"
                  >
                    <img 
                      src={photo.url} 
                      alt="Gallery" 
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = '/assets/BragancaHome.png';
                      }}
                      className="w-full h-full object-cover" 
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                      <Camera size={18} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2.5">
                {galleryPhotos.map((photo, idx) => (
                  <div
                    key={photo.id}
                    onClick={() => setLightboxPhoto(photo.url)}
                    style={{ animationDelay: `${(idx % 6) * 40}ms` }}
                    className="animate-card-stagger p-2.5 bg-white rounded-2xl border border-[#EEF0FA] flex items-center gap-3 shadow-xs cursor-pointer hover:border-[#8E97FD]/40 transition-all"
                  >
                    <img 
                      src={photo.url} 
                      alt="Thumbnail" 
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = '/assets/BragancaHome.png';
                      }}
                      className="w-14 h-14 rounded-xl object-cover shrink-0" 
                    />
                    <div className="flex-1">
                      <p className="text-xs font-bold text-[#1E1F3D] line-clamp-1">{photo.caption}</p>
                      <span className="text-[10px] text-[#8E97FD] font-semibold">Verified Expedition Photo</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Add a Photo Button matching Figma Frame 09 */}
            <div className="flex justify-center mt-2 animate-card-stagger stagger-3">
              <button
                onClick={handleAddPhoto}
                className="px-6 py-2.5 rounded-full bg-[#8E97FD] hover:bg-[#7C82ED] text-white font-bold text-xs shadow-md shadow-indigo-200 flex items-center gap-2 active:scale-95 transition-all cursor-pointer"
              >
                <Camera size={15} />
                <span>Add a photo</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: About matching Figma Frame 06.2 - Meet-up (Profile/about) */}
        {activeTab === 'about' && (
          <div className="px-5 pt-4 space-y-4">
            {/* Bio Card */}
            <div className="animate-card-stagger stagger-1 p-4 bg-white rounded-2xl border border-[#EEF0FA] shadow-xs">
              <span className="text-xs font-black text-[#1E1F3D] block mb-2 font-semibold">About Me</span>
              <p className="text-xs text-[#585A7E] leading-relaxed">
                {currentUser.about || currentUser.bio || 'Passionate cartographer and mystery enthusiast based in northern Portugal. Always hunting for forgotten medieval inscriptions, subterranean passages, and local legends hidden in plain sight.'}
              </p>
            </div>

            {/* Interests & Tags without icons */}
            <div className="animate-card-stagger stagger-2 p-4 bg-white rounded-2xl border border-[#EEF0FA] shadow-xs">
              <span className="text-xs font-black text-[#1E1F3D] block mb-2.5 font-semibold">Interests &amp; Specializations</span>
              <div className="flex flex-wrap gap-1.5">
                {(currentUser.interests && currentUser.interests.length > 0 
                  ? currentUser.interests 
                  : ['Castles', 'Cartography', 'Puzzles', 'Local Wine', 'Nature Trails', 'Photography', 'Backpacking', 'History']
                ).map((tag, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-full text-[11px] font-semibold bg-[#F4F6FB] text-[#4D5BC9] border border-[#E0E2EE]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Explorer Stats Summary */}
            <div className="animate-card-stagger stagger-3 p-4 bg-white rounded-2xl border border-[#EEF0FA] shadow-xs space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#7A7C99]">Explorer Level</span>
                <span className="font-bold text-[#8E97FD]">Level {currentUser.level || 18}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7A7C99]">Total Expeditions</span>
                <span className="font-bold text-[#1E1F3D]">
                  {20 + activities.filter(a => a.type === 'route_complete').length} Completed
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7A7C99]">Points Score</span>
                <span className="font-bold text-[#00B894]">{points.toLocaleString()} Pts</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Trips matching Figma 06.3 & 09.1 and user request */}
        {activeTab === 'trips' && (
          <div className="px-5 pt-4 space-y-4">
            {/* Achievements & Badges Header */}
            <div className="animate-card-stagger stagger-1 p-4 bg-white rounded-2xl border border-[#EEF0FA] shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Award size={18} className="text-[#FFB800]" />
                  <h3 className="text-xs font-black text-[#1E1F3D] font-semibold">Achievements &amp; Badges</h3>
                </div>
                <span className="text-[10px] font-bold text-[#8E97FD]">4 Unlocked</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {currentUser.badges?.map((badge, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-[#FFF9E6] border border-[#FFE8A3] text-[#B78103] font-bold text-[10px] flex items-center gap-1"
                  >
                    ⭐ {badge}
                  </span>
                ))}
              </div>
            </div>

            {/* Recent Completed Expedition */}
            <div className="animate-card-stagger stagger-2">
              <span className="text-xs font-black text-[#1E1F3D] block mb-2 font-semibold">Latest Expedition Record</span>
              <div className="p-3.5 bg-white rounded-2xl border border-[#EEF0FA] shadow-xs flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#EEF0FF] flex items-center justify-center text-[#8E97FD]">
                    <Compass size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-xs text-[#1E1F3D] ">Bragança Medieval Mystery</p>
                    <p className="text-[10px] text-[#A5A7C4]">Completed 2 days ago • 4 checkpoints</p>
                  </div>
                </div>
                <span className="text-xs font-black text-[#8E97FD] bg-[#F2F4FD] px-2.5 py-1 rounded-full font-semibold">+350 pts</span>
              </div>
            </div>

            {/* Visited Cities Grid matching Figma 06.3 - Meet-up (Profile/Trips) with user's assets */}
            <div className="animate-card-stagger stagger-3">
              <span className="font-semibold text-xs font-black text-[#1E1F3D] block mb-2.5">Visited European Destinations</span>
              <div className="grid grid-cols-2 gap-3">
                {completedTrips.map((trip, idx) => (
                  <div
                    key={idx}
                    style={{ animationDelay: `${(idx % 6) * 45 + 100}ms` }}
                    className="animate-card-stagger p-3 bg-[#6C7BFF] hover:bg-[#5D6DFF] text-white rounded-[20px] shadow-sm flex items-center gap-2.5 transition-all active:scale-95 cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 shadow-xs border border-white/25">
                      <img 
                        src={trip.flagImg} 
                        alt={trip.city} 
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = '/assets/PT.png';
                        }}
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <span className="text-xs font-bold truncate tracking-wide">{trip.city}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Add a Trip button matching Figma Frame 09.1 - Trips */}
            <div className="flex justify-center pt-2 animate-card-stagger stagger-4">
              <button
                onClick={() => setTripAddedAlert(true)}
                className="px-7 py-2.5 rounded-full bg-[#8E97FD] hover:bg-[#7C82ED] text-white font-bold text-xs shadow-md shadow-indigo-200 flex items-center gap-2 active:scale-95 transition-all cursor-pointer"
              >
                <Plus size={16} />
                <span>Add a trip</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Lightbox for Photos */}
      {tripAddedAlert && (
        <div className="absolute inset-0 z-60 bg-black/60 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 text-center max-w-[320px] shadow-2xl flex flex-col items-center gap-3 animate-scaleUp">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center">
              <CheckCircle2 size={28} />
            </div>
            <h4 className="font-extrabold text-[#1E1F3D] text-sm">New Trip Logged!</h4>
            <p className="text-xs text-[#585A7E]">
              Browse the Routes catalog to start an expedition and log a new European city.
            </p>
            <button
              onClick={() => {
                setTripAddedAlert(false);
                setNavActiveTab('routes');
              }}
              className="w-full py-2.5 rounded-xl bg-[#8E97FD] text-white text-xs font-bold cursor-pointer"
            >
              Go to Routes
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
