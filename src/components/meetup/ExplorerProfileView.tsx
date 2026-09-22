'use client';

import React, { useState } from 'react';
import { Explorer } from '@/types';
import { useEnigameStore } from '@/store/useEnigameStore';
import { 
  ChevronLeft, 
  MessageSquare, 
  Hand, 
  Share2, 
  LayoutGrid, 
  List, 
  Award, 
  Compass, 
  X, 
  Send
} from 'lucide-react';

interface ExplorerProfileViewProps {
  explorer: Explorer;
  onBack: () => void;
}

export const ExplorerProfileView: React.FC<ExplorerProfileViewProps> = ({ explorer, onBack }) => {
  const { showToast, setLightboxPhoto } = useEnigameStore();

  const [activeTab, setActiveTab] = useState<'instagram' | 'about' | 'trips'>('instagram');
  const [photoViewMode, setPhotoViewMode] = useState<'grid' | 'list'>('grid');

  // Message modal / drawer state
  const [isMessageOpen, setIsMessageOpen] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [hasWaved, setHasWaved] = useState(false);

  // Explorer's gallery photos
  const [galleryPhotos] = useState<Array<{ id: string; url: string; caption: string }>>([
    {
      id: 'ep1',
      url: '/assets/BragancaHome.png',
      caption: 'Citadel courtyard of Castelo de Bragança'
    },
    {
      id: 'ep2',
      url: '/assets/HomeImage.png',
      caption: 'Historic cobblestone streets in northern Portugal'
    },
    {
      id: 'ep3',
      url: '/assets/RoutesImageCarousel.png',
      caption: 'Mountain panorama and medieval fortress route'
    },
    {
      id: 'ep4',
      url: '/assets/ExperiencesCarousel.png',
      caption: 'Local cultural heritage and secret cellar quests'
    },
    {
      id: 'ep5',
      url: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=600&auto=format&fit=crop&q=80',
      caption: 'Ribeira riverfront sunset'
    },
    {
      id: 'ep6',
      url: 'https://images.unsplash.com/photo-1513688275180-844a4972fa63?w=600&auto=format&fit=crop&q=80',
      caption: 'Portuguese azulejos garden courtyard'
    }
  ]);

  // Completed Trips matching Figma 06.3 - Meet-up (Profile/Trips)
  const completedTrips = [
    { city: 'Lisbon, Portugal', flagImg: '/assets/PT.png' },
    { city: 'Berlin, Germany', flagImg: '/assets/GER.png' },
    { city: 'Paris, France', flagImg: '/assets/FR.png' },
    { city: 'Porto, Portugal', flagImg: '/assets/PT.png' },
    { city: 'London, UK', flagImg: '/assets/UK.png' },
    { city: 'Madrid, Spain', flagImg: '/assets/ES.png' },
    { city: 'Rome, Italy', flagImg: '/assets/IT.png' },
    { city: 'Bragança, Portugal', flagImg: '/assets/PT.png' }
  ];

  const handleWave = () => {
    setHasWaved(true);
    showToast(`👋 You waved at ${explorer.name}!`, 'success');
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!messageText.trim()) return;

    showToast(`✉️ Message sent to ${explorer.name}: "${messageText.trim()}"`, 'success');
    setMessageText('');
    setIsMessageOpen(false);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${explorer.name} - Enigame Explorer`,
        text: `Check out ${explorer.name}'s profile on Enigame!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      showToast(`🔗 Profile link for ${explorer.name} copied to clipboard`, 'info');
    }
  };

  return (
    <div className="w-full min-h-screen pb-24 bg-[#F4F6FC] flex flex-col relative overflow-hidden animate-fadeIn">
      {/* Background Curved Wave & Dashed Trail matching Figma 09 - Personal Profile / 06.1 */}
      <div className="absolute top-0 left-0 right-0 h-48 bg-[#8E97FD] rounded-b-[44px] z-0 shadow-sm overflow-hidden">
        <svg className="absolute inset-0 w-full h-full opacity-25 pointer-events-none" viewBox="0 0 375 180" fill="none">
          <path d="M-20 60 C80 20, 160 120, 260 50 C320 10, 360 80, 400 60" stroke="white" strokeWidth="2.5" strokeDasharray="6 6" />
          <path d="M30 140 C110 90, 220 160, 320 100 C360 80, 390 120, 420 110" stroke="white" strokeWidth="2" strokeDasharray="5 5" />
        </svg>
      </div>

      {/* Top Header matching Figma 06.1 - Meet-up (Profile) */}
      <div className="relative z-10 px-5 pt-5 flex items-center justify-between text-white">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="w-9 h-9 flex items-center justify-center rounded-full bg-white/15 hover:bg-white/30 backdrop-blur-xs transition-colors cursor-pointer"
          title="Back to Explorers"
        >
          <ChevronLeft size={22} />
        </button>

        {/* Right Header Buttons: Message Pill Button + Wave Button matching Figma 06.1 */}
        <div className="flex items-center gap-2">
          {/* Message Pill Button */}
          <button
            onClick={() => setIsMessageOpen(true)}
            className="h-9 px-4 rounded-full bg-white text-[#1E1F3D] font-bold text-xs shadow-md flex items-center gap-1.5 hover:bg-white/90 active:scale-95 transition-all cursor-pointer"
          >
            <MessageSquare size={14} className="text-[#8E97FD]" />
            <span>Message</span>
          </button>

          {/* Wave Quick Button */}
          <button
            onClick={handleWave}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-xs ${
              hasWaved 
                ? 'bg-amber-400 text-white' 
                : 'bg-white/20 hover:bg-white/30 text-white active:scale-95'
            }`}
            title="Wave"
          >
            <Hand size={18} className={hasWaved ? 'animate-bounce' : ''} />
          </button>
        </div>
      </div>

      {/* Main Profile Floating Card matching Figma Group 7 / 09 / 06.1 */}
      <div className="mx-5 mt-4 bg-white rounded-[32px] p-6 shadow-[0_12px_36px_rgba(142,151,253,0.18)] border border-[#EAEFFE] flex flex-col items-center text-center relative animate-card-fade-up z-10">
        {/* Profile Avatar Frame with Portugal flag badge */}
        <div className="relative w-23 h-23 rounded-full">
          <img
            src={explorer.avatar}
            alt={explorer.name}
            className="w-full h-full rounded-full object-cover bg-white"
          />
          {/* National flag badge matching Figma (Portugal) */}
          <div className="absolute bottom-0 right-0 w-7 h-7 rounded-full overflow-hidden border-2 border-white shadow-sm flex items-center justify-center bg-white">
            <img src="/assets/PT.png" alt="Portugal" className="w-full h-full object-cover" />
          </div>
        </div>

        {/* User Full Name */}
        <h1 className="text-lg font-black text-[#1E1F3D] mt-3 tracking-tight font-medium">
          {explorer.name}
        </h1>

        {/* Explorer Rank Title */}
        <span className="text-xs font-bold text-[#8E97FD] mt-0.5">
          {explorer.rankTitle || 'Pathfinder'}
        </span>

        {/* User Bio Quote in Signature Periwinkle Blue Font */}
        <p className="text-xs text-[#5D6BFF] italic font-semibold mt-2 px-3 max-w-[280px] leading-relaxed">
          &quot;{explorer.bio || 'Must go faster. Must go faster... go, go, go, go! I was part of something special.'}&quot;
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
              {explorer.city || 'Bragança, PT'}
            </span>
          </div>

          {/* Gender/Age */}
          <div className="flex flex-col items-center gap-1.5">
            <div className="w-11 h-11 rounded-full bg-[#F2F4FD] flex items-center justify-center shadow-xs">
              <img src="/assets/GenderIcon.png" alt="Gender" className="w-5 h-5 object-contain" />
            </div>
            <span className="text-[11px] font-bold text-[#8E97FD]">Gender/Age</span>
            <span className="text-[10px] font-semibold text-[#7A7C99]">
              {explorer.gender || 'Female'}, {explorer.ageGroup || '20s'}
            </span>
          </div>

          {/* Rank */}
          <div className="flex flex-col items-center gap-1.5">
            <div className="w-11 h-11 rounded-full bg-[#F2F4FD] flex items-center justify-center shadow-xs">
              <img src="/assets/MedalIcon.png" alt="Rank" className="w-5 h-5 object-contain" />
            </div>
            <span className="text-[11px] font-bold text-[#8E97FD]">Rank</span>
            <span className="text-[10px] font-semibold text-[#7A7C99] truncate max-w-[80px]">
              {explorer.rankTitle || 'Level ' + explorer.level}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Action Shortcuts Bar: Send Message, Wave, Share */}
      <div className="mx-5 mt-3.5 flex items-center justify-between gap-2.5 z-10">
        <button
          onClick={() => setIsMessageOpen(true)}
          className="animate-card-stagger stagger-1 flex-1 py-2.5 px-3 rounded-2xl bg-[#8E97FD] hover:bg-[#7C82ED] text-white shadow-md shadow-indigo-200 flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
        >
          <MessageSquare size={15} />
          <span className="text-xs font-bold">Send Message</span>
        </button>

        <button
          onClick={handleWave}
          className={`animate-card-stagger stagger-2 py-2.5 px-4 rounded-2xl border transition-all flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer ${
            hasWaved
              ? 'bg-amber-50 border-amber-300 text-amber-700 font-bold'
              : 'bg-white border-[#EAEFFE] hover:border-[#8E97FD]/50 text-[#1E1F3D] hover:text-[#8E97FD] shadow-xs'
          }`}
        >
          <Hand size={15} className={hasWaved ? 'text-amber-500' : 'text-[#8E97FD]'} />
          <span className="text-xs font-bold">{hasWaved ? 'Waved!' : 'Wave'}</span>
        </button>

        <button
          onClick={handleShare}
          className="animate-card-stagger stagger-3 w-10 h-10 rounded-2xl bg-white border border-[#EAEFFE] hover:border-[#8E97FD]/50 shadow-xs flex items-center justify-center text-[#7A7C99] hover:text-[#8E97FD] transition-all cursor-pointer shrink-0"
          title="Share profile"
        >
          <Share2 size={16} />
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

      {/* Active Profile Section Tab */}
      <div key={activeTab} className="w-full animate-tab-enter z-10">
        {/* Tab 1: Instagram Content Area */}
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
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {galleryPhotos.map((photo, idx) => (
                  <div
                    key={photo.id}
                    onClick={() => setLightboxPhoto(photo.url)}
                    style={{ animationDelay: `${(idx % 6) * 50}ms` }}
                    className="animate-card-stagger bg-white rounded-2xl overflow-hidden border border-[#EEF0FA] shadow-xs cursor-pointer group"
                  >
                    <img 
                      src={photo.url} 
                      alt="Gallery Item" 
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = '/assets/BragancaHome.png';
                      }}
                      className="w-full h-44 object-cover" 
                    />
                    <div className="p-3 flex items-center justify-between">
                      <p className="text-xs text-[#1E1F3D] font-medium">{photo.caption}</p>
                      <span className="text-[10px] text-[#8E97FD] font-semibold">View</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: About me */}
        {activeTab === 'about' && (
          <div className="px-5 pt-4 space-y-4">
            {/* Bio Card */}
            <div className="animate-card-stagger stagger-1 p-4 bg-white rounded-2xl border border-[#EEF0FA] shadow-xs">
              <span className="text-xs font-black text-[#1E1F3D] block mb-2 font-semibold">About {explorer.name}</span>
              <p className="text-xs text-[#585A7E] leading-relaxed">
                {explorer.bio} Explorer focused on historical paths, ancient citadel mysteries, and deciphering urban riddles. Always looking for new companions to embark on challenging European expeditions!
              </p>
            </div>

            {/* Interests & Tags without icons */}
            <div className="animate-card-stagger stagger-2 p-4 bg-white rounded-2xl border border-[#EEF0FA] shadow-xs">
              <span className="text-xs font-black text-[#1E1F3D] block mb-2.5 font-semibold">Interests &amp; Specializations</span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'Castles', 
                  'Cartography', 
                  'Puzzles', 
                  'Local Wine', 
                  'Nature Trails', 
                  'Photography'
                ].map((tag, i) => (
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
                <span className="font-bold text-[#8E97FD]">Level {explorer.level || 18}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7A7C99]">Total Expeditions</span>
                <span className="font-bold text-[#1E1F3D]">
                  {14 + (explorer.level * 2)} Completed
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7A7C99]">Points Score</span>
                <span className="font-bold text-[#00B894]">{(explorer.level * 420).toLocaleString()} Pts</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Trips matching Figma 06.3 */}
        {activeTab === 'trips' && (
          <div className="px-5 pt-4 space-y-4">
            {/* Achievements & Badges Header */}
            <div className="animate-card-stagger stagger-1 p-4 bg-white rounded-2xl border border-[#EEF0FA] shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Award size={18} className="text-[#FFB800]" />
                  <h3 className="text-xs font-black text-[#1E1F3D] font-semibold">Achievements &amp; Badges</h3>
                </div>
                <span className="text-[10px] font-bold text-[#8E97FD]">{explorer.badges?.length || 2} Unlocked</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {(explorer.badges || ['Top Explorer', 'Citadel Legend']).map((badge, idx) => (
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
                    <p className="font-semibold text-xs text-[#1E1F3D]">Bragança Citadel Discovery</p>
                    <p className="text-[10px] text-[#A5A7C4]">Completed recently • 4 checkpoints</p>
                  </div>
                </div>
                <span className="text-xs font-black text-[#8E97FD] bg-[#F2F4FD] px-2.5 py-1 rounded-full font-semibold">+350 pts</span>
              </div>
            </div>

            {/* Visited Cities Grid matching Figma 06.3 */}
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
          </div>
        )}
      </div>

      {/* Interactive Send Message Modal */}
      {isMessageOpen && (
        <div 
          onClick={() => setIsMessageOpen(false)}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-fadeIn"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[420px] bg-white rounded-t-[32px] sm:rounded-[32px] p-5 shadow-2xl animate-slideUp"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#EEF0FA]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full overflow-hidden">
                  <img src={explorer.avatar} alt={explorer.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#1E1F3D]">Send message to {explorer.name}</h4>
                  <span className="text-[10px] text-[#8E97FD] font-semibold">{explorer.rankTitle}</span>
                </div>
              </div>
              <button
                onClick={() => setIsMessageOpen(false)}
                className="w-8 h-8 rounded-full bg-[#F4F6FB] flex items-center justify-center text-[#585A7E] hover:bg-[#EEF0FA] transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSendMessage} className="mt-4 flex flex-col gap-3">
              <textarea
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder={`Write a message for ${explorer.name}...`}
                rows={3}
                className="w-full p-3 rounded-2xl bg-[#F4F6FB] border border-[#EAEFFE] text-xs text-[#1E1F3D] placeholder-[#A5A7C4] focus:outline-none focus:border-[#8E97FD] focus:bg-white transition-all resize-none"
                autoFocus
              />

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setMessageText('Hey! Want to do a route together?')}
                    className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-[#EEF0FF] text-[#8E97FD] hover:bg-[#E0E4FE] transition-colors cursor-pointer"
                  >
                    Want to do a route?
                  </button>
                  <button
                    type="button"
                    onClick={() => setMessageText('Hey! Great explorer score.')}
                    className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-[#EEF0FF] text-[#8E97FD] hover:bg-[#E0E4FE] transition-colors cursor-pointer"
                  >
                    Congrats!
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={!messageText.trim()}
                  className="px-4 py-2 rounded-xl bg-[#8E97FD] hover:bg-[#7C82ED] disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-200 transition-all cursor-pointer active:scale-95"
                >
                  <span>Send</span>
                  <Send size={13} />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

          </div>
  );
};
