'use client';

import React from 'react';
import { useEnigameStore, MainTab } from '@/store/useEnigameStore';

export const BottomNavBar: React.FC = () => {
  const { activeTab, setActiveTab, setRoutesViewStep } = useEnigameStore();

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
    setActiveTab(tabId);
  };

  return (
    <nav 
      aria-label="Main Navigation"
      className="w-full bg-white/95 backdrop-blur-md border-t border-[#EEF0FA] px-2 py-2 flex items-center justify-around z-30 shadow-[0_-8px_24px_rgba(30,31,61,0.06)]"
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const isHome = tab.id === 'home';

        if (isHome) {
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick('home')}
              className="relative -top-5 flex flex-col items-center group transition-transform active:scale-95"
              aria-label="Home"
            >
              <div className={"w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 " + (
                isActive 
                  ? "bg-[#8E97FD] text-white ring-4 ring-[#EEF0FF] shadow-indigo-300/50" 
                  : "bg-white text-[#7A7C99] border-2 border-[#E8EBF5] shadow-md hover:border-[#8E97FD]"
              )}>
                <img 
                  src={tab.iconSrc} 
                  alt="Home" 
                  className={"w-7 h-7 object-contain transition-transform group-hover:scale-110 " + (isActive ? "brightness-0 invert" : "opacity-80")} 
                />
              </div>
              <span className={"text-[11px] font-semibold mt-1 transition-colors " + (
                isActive ? "text-[#8E97FD]" : "text-[#8E90B0]"
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
            className={"flex flex-col items-center py-1 px-3 rounded-2xl transition-all duration-200 active:scale-95 " + (
              isActive ? "text-[#8E97FD]" : "text-[#8E90B0] hover:text-[#585A7E]"
            )}
            aria-label={tab.label}
          >
            <div className="relative flex flex-col items-center">
              <img 
                src={tab.iconSrc} 
                alt={tab.label} 
                className={"w-5 h-5 object-contain transition-all " + (isActive ? "opacity-100 scale-105" : "opacity-60 grayscale hover:opacity-100")} 
              />
              {isActive && (
                <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#8E97FD] rounded-full" />
              )}
            </div>
            <span className={"text-[11px] font-medium mt-1.5 " + (
              isActive ? "font-bold text-[#8E97FD]" : ""
            )}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
