'use client';

import React from 'react';
import { useEnigameStore, MeetupSubTab } from '@/store/useEnigameStore';
import { ExplorersTab } from './ExplorersTab';
import { TravelingTab } from './TravelingTab';
import { MapRadarTab } from './MapRadarTab';
import { Compass } from 'lucide-react';

export const MeetupHub: React.FC = () => {
  const { meetupSubTab, setMeetupSubTab } = useEnigameStore();

  const tabs: { id: MeetupSubTab; label: string; icon: React.ReactNode }[] = [
    { 
      id: 'explorers', 
      label: 'Explorers', 
      icon: <img src="/assets/MeetupExplorerIcon.png" alt="Explorers" className="w-4 h-4 object-contain" /> 
    },
    { 
      id: 'traveling', 
      label: 'Traveling', 
      icon: <img src="/assets/MeetupTravelerIcon.png" alt="Traveling" className="w-4 h-4 object-contain" /> 
    },
    { 
      id: 'map', 
      label: 'Map', 
      icon: <Compass size={16} /> 
    },
  ];

  return (
    <div className="w-full flex flex-col">
      {/* Top Header Segment Control */}
      <div className="px-5 pt-3 pb-2 bg-white border-b border-[#EEF0FA]">
        <div className="flex items-center justify-center p-1 bg-[#F4F6FB] rounded-2xl">
          {tabs.map((tab) => {
            const isActive = meetupSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setMeetupSubTab(tab.id)}
                className={"flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all " + (
                  isActive
                    ? "bg-white text-[#7C82ED] shadow-sm font-extrabold"
                    : "text-[#8E90B0] hover:text-[#585A7E]"
                )}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Render Active SubTab */}
      {meetupSubTab === 'explorers' && <ExplorersTab />}
      {meetupSubTab === 'traveling' && <TravelingTab />}
      {meetupSubTab === 'map' && <MapRadarTab />}
    </div>
  );
};
