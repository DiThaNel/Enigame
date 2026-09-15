'use client';

import React from 'react';
import { useEnigameStore, MainTab } from '@/store/useEnigameStore';

export const BottomNavBar: React.FC = () => {
  const { activeTab, setActiveTab, setRoutesViewStep, setProfileViewStep } = useEnigameStore();

  const tabs: { id: MainTab; label: string; iconSrc: string }[] = [
    { id: 'routes', label: 'Routes', iconSrc: '/assets/Routemenuicon.png' },
    { id: 'meetup', label: 'Meet-up', iconSrc: '/assets/Meetupicon.png' },
    { id: 'home', label: 'Home', iconSrc: '/assets/Homeicon.png' },
    { id: 'points', label: 'Points', iconSrc: '/assets/Pointsicon.png' },
    { id: 'profile', label: 'Profile', iconSrc: '/assets/Usericon.png' },
  ];

  const handleTabClick = (tabId: MainTab) => {
    if (tabId === 'routes') {
      setRoutesViewStep('select-city');
    }
    if (tabId === 'profile') {
      setProfileViewStep('profile');
    }
    setActiveTab(tabId);
  };

  return (
    <nav 
      aria-label="Main Navigation"
      className="w-full bg-white/95 backdrop-blur-md border-t border-[#EEF0FA] px-2 py-2 flex items-center justify-around z-30 shadow-[0_-8px_24px_rgba(30,31,61,0.06)] select-none"
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const isHome = tab.id === 'home';

        if (isHome) {
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick('home')}
              className="relative -top-4 flex flex-col items-center group transition-transform active:scale-95 cursor-pointer"
              aria-label="Home"
            >
              <div className={"w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 " + (
                isActive 
                  ? "bg-[#8E97FD] text-white ring-4 ring-[#EEF0FF] shadow-indigo-300/50 scale-105" 
                  : "bg-white text-[#7A7C99] border-2 border-[#E8EBF5] shadow-md hover:border-[#8E97FD]"
              )}>
                <img 
                  src={tab.iconSrc} 
                  alt="Home" 
                  className={"w-7 h-7 object-contain transition-transform duration-300 group-hover:scale-110 " + (
                    isActive ? "brightness-0 invert" : "opacity-80"
                  )} 
                />
              </div>
              <span className={"text-[11px] font-semibold mt-1 transition-colors duration-200 " + (
                isActive ? "text-[#8E97FD] font-bold" : "text-[#8E90B0]"
              )}>
                {tab.label}
              </span>
            </button>
          );
        }

        return (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className="flex flex-col items-center py-1 px-2.5 transition-all duration-200 active:scale-95 cursor-pointer group"
            aria-label={tab.label}
          >
            {/* Filled icon container when active matching Home's filled aesthetic */}
            <div className={"w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 " + (
              isActive
                ? "bg-[#8E97FD] shadow-md shadow-indigo-300/40 scale-105"
                : "bg-transparent group-hover:bg-[#F2F4FD]"
            )}>
              <img 
                src={tab.iconSrc} 
                alt={tab.label} 
                className={"w-5 h-5 object-contain transition-all duration-300 " + (
                  isActive 
                    ? "brightness-0 invert scale-110" 
                    : "opacity-60 grayscale group-hover:opacity-90 group-hover:grayscale-0"
                )} 
              />
            </div>
            <span className={"text-[10px] font-semibold mt-1 transition-colors duration-200 " + (
              isActive ? "text-[#8E97FD] font-bold" : "text-[#8E90B0]"
            )}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
