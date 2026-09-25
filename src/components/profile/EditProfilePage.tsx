'use client';

import React, { useState } from 'react';
import { useEnigameStore } from '@/store/useEnigameStore';
import { 
  ChevronLeft, 
  ChevronDown,
  Camera, 
  MapPin, 
  Quote, 
  Check, 
  Plus 
} from 'lucide-react';

const AVAILABLE_INTEREST_OPTIONS = [
  'Castles', 
  'Cartography', 
  'Puzzles', 
  'Local Wine', 
  'Nature Trails', 
  'Photography', 
  'Backpacking', 
  'History',
  'Archaeology',
  'Urban Legends',
  'Gastronomy',
  'Climbing'
];

export interface RankTitleOption {
  id: string;
  title: string;
  rankBadge: string;
  medalIcon: string;
  description: string;
}

export const RANK_TITLE_OPTIONS: RankTitleOption[] = [
  {
    id: 'rt-1',
    title: 'Grand Alchemist',
    rankBadge: 'Rank #1',
    medalIcon: '/assets/TopPointsMedal.png',
    description: 'Master of citadel secrets & ancient manuscripts',
  },
  {
    id: 'rt-2',
    title: 'Citadel Master',
    rankBadge: 'Rank #2',
    medalIcon: '/assets/SilverPointsMedal.png',
    description: 'Cryptographer & fortress conqueror',
  },
  {
    id: 'rt-3',
    title: 'Shadow Chaser',
    rankBadge: 'Rank #3',
    medalIcon: '/assets/BronzePointsMedal.png',
    description: 'Explorer of underground vaults & keeps',
  },
  {
    id: 'rt-4',
    title: 'Fortress Scout',
    rankBadge: 'Rank #4',
    medalIcon: '/assets/PointsMedal.png',
    description: 'Precision navigator of city perimeters',
  },
  {
    id: 'rt-5',
    title: 'Tower Sentinel',
    rankBadge: 'Rank #5',
    medalIcon: '/assets/PointsMedal.png',
    description: 'Guardian of royal keeps & medieval gates',
  },
  {
    id: 'rt-6',
    title: 'Riddle Scholar',
    rankBadge: 'Rank #6',
    medalIcon: '/assets/PointsMedal.png',
    description: 'Translator of ancient Romanesque stones',
  },
  {
    id: 'rt-7',
    title: 'Master Cartographer',
    rankBadge: 'Rank #8',
    medalIcon: '/assets/StarSingle.png',
    description: 'Creator of route guides & mystery trails',
  },
  {
    id: 'rt-8',
    title: 'Senior Enigmatist',
    rankBadge: 'Specialist',
    medalIcon: '/assets/StarSingle.png',
    description: 'Expert solver of hidden checkpoint riddles',
  },
  {
    id: 'rt-9',
    title: 'Pathfinder',
    rankBadge: 'Explorer',
    medalIcon: '/assets/StarSingle.png',
    description: 'First to chart unexplored medieval alleys',
  },
  {
    id: 'rt-10',
    title: 'Citadel Legend',
    rankBadge: 'Legend',
    medalIcon: '/assets/StarSingle.png',
    description: 'Conquered every route checkpoint in Bragança',
  },
];

interface EditProfilePageProps {
  onBack?: () => void;
}

export const EditProfilePage: React.FC<EditProfilePageProps> = ({ onBack }) => {
  const { currentUser, updateProfile, setProfileViewStep, setEditProfileOpen, showToast } = useEnigameStore();

  const [name, setName] = useState(currentUser.name || 'Tiana Rosser');
  const [nickname, setNickname] = useState(currentUser.nickname || 'Tiana Rosser');
  const [city, setCity] = useState(currentUser.city || 'Bragança, Portugal');
  const [gender, setGender] = useState(currentUser.gender || 'Female');
  const [ageGroup, setAgeGroup] = useState(currentUser.ageGroup || '20s');
  const [rankTitle, setRankTitle] = useState(currentUser.rankTitle || 'Master Cartographer');
  const [isRankDropdownOpen, setIsRankDropdownOpen] = useState(false);
  const [bio, setBio] = useState(currentUser.bio || '');
  const [about, setAbout] = useState(currentUser.about || 'Passionate cartographer and mystery enthusiast based in northern Portugal. Always hunting for forgotten medieval inscriptions, subterranean passages, and local legends hidden in plain sight.');
  const [interests, setInterests] = useState<string[]>(
    currentUser.interests && currentUser.interests.length > 0
      ? currentUser.interests
      : ['Castles', 'Cartography', 'Puzzles', 'Local Wine', 'Nature Trails', 'Photography', 'Backpacking', 'History']
  );
  const [customInterest, setCustomInterest] = useState('');

  const selectedOption = RANK_TITLE_OPTIONS.find(o => o.title === rankTitle) || RANK_TITLE_OPTIONS[6];

  const toggleInterest = (tag: string) => {
    if (interests.includes(tag)) {
      setInterests(interests.filter(t => t !== tag));
    } else {
      setInterests([...interests, tag]);
    }
  };

  const handleAddCustomInterest = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = customInterest.trim();
    if (!trimmed) return;
    if (!interests.includes(trimmed)) {
      setInterests([...interests, trimmed]);
    }
    setCustomInterest('');
  };

  const handleImageUpload = () => {
    showToast('Explorer Avatar set to Tianna!', 'info');
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      setProfileViewStep('profile');
      setEditProfileOpen(false);
    }
  };

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const matched = RANK_TITLE_OPTIONS.find(o => o.title === rankTitle);
    updateProfile({
      name,
      nickname,
      bio,
      about,
      interests,
      city,
      gender,
      ageGroup,
      rankTitle,
      rankMedal: matched ? matched.medalIcon : currentUser.rankMedal,
      avatar: '/assets/TianaAvatar.png',
    });
    showToast('Profile updated successfully!', 'success');
    setTimeout(() => {
      handleBack();
    }, 400);
  };

  return (
    <div className="w-full min-h-full bg-[#F4F6FB] flex flex-col animate-modal-screen relative select-none">
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
          className="h-9 px-4 rounded-full bg-white text-[#1E1F3D] font-bold text-xs shadow-md flex items-center gap-1.5 hover:bg-white/90 active:scale-95 transition-all cursor-pointer"
        >
          <Check size={14} className="text-[#8E97FD]" />
          <span>Save</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="flex-1 overflow-y-auto px-5 pt-5 pb-8 space-y-5 no-scrollbar">
        {/* Avatar Frame Preview matching Figma */}
        <div className="animate-card-stagger stagger-1 flex flex-col items-center">
          <div className="relative mb-2">
            <div className="w-24 h-24 rounded-full p-1 relative">
              <img
                src="/assets/TianaAvatar.png"
                alt={nickname}
                className="w-full h-full rounded-full object-cover bg-white"
              />
              {/* Dynamic Medal Badge Preview based on chosen title */}
              <div className="absolute -top-1 -right-1 w-7 h-7 flex items-center justify-center pointer-events-none drop-shadow">
                <img
                  src={selectedOption.medalIcon}
                  alt={selectedOption.title}
                  className="w-6 h-6 object-contain"
                />
              </div>
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
          <span className="text-[11px] font-bold text-[#8E97FD]">Tap camera to change photo</span>
        </div>

        {/* Input Fields Card */}
        <div className="animate-card-stagger stagger-2 bg-white rounded-[28px] p-5 shadow-sm border border-[#EAEFFE] space-y-4">
          {/* Explorer Nickname */}
          <div>
            <label className="text-xs font-bold text-[#1E1F3D] block mb-1">Explorer Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setNickname(e.target.value);
              }}
              placeholder="e.g. Tiana Rosser"
              className="w-full h-11 px-4 rounded-2xl bg-[#F4F6FB] border border-[#EEF0FA] text-xs font-semibold text-[#1E1F3D] focus:outline-none focus:ring-2 focus:ring-[#8E97FD]/40 transition-all"
            />
          </div>

          {/* Adventure Bio / Motto */}
          <div>
            <label className="text-xs font-bold text-[#1E1F3D] block mb-1">Adventure Bio / Motto (Quote)</label>
            <div className="relative">
              <textarea
                rows={2}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Share your explorer quote or motto..."
                className="w-full p-3.5 pr-8 rounded-2xl bg-[#F4F6FB] border border-[#EEF0FA] text-xs font-medium text-[#585A7E] focus:outline-none focus:ring-2 focus:ring-[#8E97FD]/40 resize-none leading-relaxed transition-all"
              />
              <Quote className="absolute right-3 top-3 text-[#8E97FD]/40" size={16} />
            </div>
          </div>

          {/* About Me (Extended Bio for About Tab) */}
          <div>
            <label className="text-xs font-bold text-[#1E1F3D] block mb-1">About Me (Extended Bio)</label>
            <textarea
              rows={3}
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              placeholder="Tell fellow explorers about your adventure background..."
              className="w-full p-3.5 rounded-2xl bg-[#F4F6FB] border border-[#EEF0FA] text-xs font-medium text-[#585A7E] focus:outline-none focus:ring-2 focus:ring-[#8E97FD]/40 resize-none leading-relaxed transition-all"
            />
          </div>

          {/* Interests & Specializations */}
          <div>
            <label className="text-xs font-bold text-[#1E1F3D] block mb-2">Interests &amp; Specializations</label>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {AVAILABLE_INTEREST_OPTIONS.map((opt) => {
                const isSelected = interests.includes(opt);
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => toggleInterest(opt)}
                    className={`px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all cursor-pointer active:scale-95 ${
                      isSelected
                        ? 'bg-[#8E97FD] text-white shadow-xs'
                        : 'bg-[#F4F6FB] text-[#585A7E] hover:bg-[#EEF0FA] border border-[#E0E2EE]'
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            {/* Custom Interest Input */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={customInterest}
                onChange={(e) => setCustomInterest(e.target.value)}
                placeholder="Add custom interest..."
                className="flex-1 h-9 px-3.5 rounded-xl bg-[#F4F6FB] border border-[#EEF0FA] text-xs text-[#1E1F3D] focus:outline-none focus:ring-2 focus:ring-[#8E97FD]/40"
              />
              <button
                type="button"
                onClick={handleAddCustomInterest}
                disabled={!customInterest.trim()}
                className="h-9 px-3 rounded-xl bg-[#8E97FD] text-white text-xs font-bold disabled:opacity-50 flex items-center gap-1 cursor-pointer"
              >
                <Plus size={14} />
                <span>Add</span>
              </button>
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

          {/* Equipped Rank Title with Medals next to options */}
          <div className="relative">
            <label className="text-xs font-bold text-[#1E1F3D] block mb-1">
              Equipped Rank Title
            </label>

            {/* Dropdown Trigger showing current title and its medal */}
            <button
              type="button"
              onClick={() => setIsRankDropdownOpen(!isRankDropdownOpen)}
              className={`w-full h-12 px-3.5 rounded-2xl bg-[#F4F6FB] border transition-all flex items-center justify-between cursor-pointer active:scale-[0.99] ${
                isRankDropdownOpen
                  ? 'border-[#8E97FD] ring-2 ring-[#8E97FD]/30 bg-white'
                  : 'border-[#EEF0FA] hover:border-[#8E97FD]/40'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-6 h-6 flex items-center justify-center shrink-0">
                  <img
                    src={selectedOption.medalIcon}
                    alt={selectedOption.title}
                    className="w-5 h-5 object-contain drop-shadow-xs"
                  />
                </div>
                <div className="flex flex-col text-left min-w-0">
                  <span className="text-xs font-bold text-[#1E1F3D] truncate">
                    {selectedOption.title}
                  </span>
                  <span className="text-[10px] text-[#8E97FD] font-semibold leading-none">
                    {selectedOption.rankBadge}
                  </span>
                </div>
              </div>

              <ChevronDown
                size={16}
                className={`text-[#7A7C99] transition-transform duration-200 shrink-0 ml-2 ${
                  isRankDropdownOpen ? 'rotate-180 text-[#8E97FD]' : ''
                }`}
              />
            </button>

            {/* Custom Dropdown Menu with Medals next to each option */}
            {isRankDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setIsRankDropdownOpen(false)}
                />

                <div className="absolute bottom-full left-0 right-0 mb-1.5 bg-white rounded-2xl border border-[#EEF0FA] shadow-[0_12px_32px_rgba(30,31,61,0.14)] p-1.5 z-40 max-h-60 overflow-y-auto space-y-1 animate-fadeIn no-scrollbar">
                  <div className="px-2.5 py-1 text-[10px] font-bold text-[#8E90B0] uppercase tracking-wider border-b border-[#EEF0FA] mb-1">
                    Select Rank Title &amp; Medal
                  </div>

                  {RANK_TITLE_OPTIONS.map((opt) => {
                    const isSelected = opt.title === rankTitle;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => {
                          setRankTitle(opt.title);
                          setIsRankDropdownOpen(false);
                        }}
                        className={`w-full p-2.5 rounded-xl flex items-center justify-between text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#EEF0FF] text-[#1E1F3D] font-bold shadow-xs ring-1 ring-[#8E97FD]/30'
                            : 'hover:bg-[#F4F6FB] text-[#585A7E]'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          {/* Medal image right next to title */}
                          <div className="w-6 h-6 flex items-center justify-center shrink-0">
                            <img
                              src={opt.medalIcon}
                              alt={opt.title}
                              className="w-5 h-5 object-contain drop-shadow-xs"
                            />
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className={`text-xs ${isSelected ? 'font-black text-[#1E1F3D]' : 'font-semibold'}`}>
                                {opt.title}
                              </span>
                              <span className="text-[9px] px-1.5 py-0.2 rounded-full font-bold bg-[#F4F6FB] text-[#8E97FD] border border-[#EEF0FA]">
                                {opt.rankBadge}
                              </span>
                            </div>
                            <p className="text-[10px] text-[#8E90B0] truncate max-w-[210px]">
                              {opt.description}
                            </p>
                          </div>
                        </div>

                        {isSelected && (
                          <Check size={14} className="text-[#8E97FD] shrink-0 ml-2" strokeWidth={3} />
                        )}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Action Button styled with Enigame signature look */}
        <div className="pt-2 pb-8 animate-card-stagger stagger-3">
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
