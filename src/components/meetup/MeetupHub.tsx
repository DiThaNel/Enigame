'use client';

import React from 'react';
import { useEnigameStore, MeetupSubTab } from '@/store/useEnigameStore';
import { ExplorersTab } from './ExplorersTab';
import { ExplorerProfileView } from './ExplorerProfileView';
import { ExplorerChatView } from './ExplorerChatView';
import { TravelingTab } from './TravelingTab';
import { MapRadarTab } from './MapRadarTab';
import { Compass, Users, Plane } from 'lucide-react';

export const MeetupHub: React.FC = () => {
  const { 
    meetupSubTab, 
    setMeetupSubTab, 
    selectedExplorer, 
    setSelectedExplorer, 
    activeChatExplorer, 
    setActiveChatExplorer, 
    chatAutoWave, 
    setChatAutoWave,
    profileOpenedFromChatExplorer,
    setProfileOpenedFromChatExplorer
  } = useEnigameStore();

  if (activeChatExplorer) {
    return (
      <ExplorerChatView
        explorer={activeChatExplorer}
        autoWave={chatAutoWave}
        onBack={() => {
          setActiveChatExplorer(null);
          setChatAutoWave(false);
          setProfileOpenedFromChatExplorer(null);
        }}
        onOpenProfile={() => {
          setProfileOpenedFromChatExplorer(activeChatExplorer);
          setSelectedExplorer(activeChatExplorer);
          setActiveChatExplorer(null);
        }}
      />
    );
  }

  if (selectedExplorer) {
    return (
      <ExplorerProfileView
        explorer={selectedExplorer}
        onBack={() => {
          if (profileOpenedFromChatExplorer) {
            setActiveChatExplorer(profileOpenedFromChatExplorer);
            setSelectedExplorer(null);
            setProfileOpenedFromChatExplorer(null);
          } else {
            setSelectedExplorer(null);
          }
        }}
        onOpenChat={(wave) => {
          setChatAutoWave(!!wave);
          setActiveChatExplorer(selectedExplorer);
          setSelectedExplorer(null);
          setProfileOpenedFromChatExplorer(null);
        }}
      />
    );
  }

  const tabs: { id: MeetupSubTab; label: string; icon: React.ReactNode }[] = [
    { 
      id: 'explorers', 
      label: 'Explorers', 
      icon: <Users size={16} /> 
    },
    { 
      id: 'traveling', 
      label: 'Traveling', 
      icon: <Plane size={16} /> 
    },
    { 
      id: 'map', 
      label: 'Map', 
      icon: <Compass size={16} /> 
    },
  ];

  return (
    <div className="w-full flex-1 flex flex-col min-h-full">
      {/* Top Header Segment Control */}
      <div className="px-5 pt-3 pb-2 bg-white border-b border-[#EEF0FA] shrink-0">
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

      {/* Render Active SubTab with smooth fade-slide transition */}
      <div key={meetupSubTab} className="w-full flex-1 flex flex-col animate-tab-enter">
        {meetupSubTab === 'explorers' && <ExplorersTab />}
        {meetupSubTab === 'traveling' && <TravelingTab />}
        {meetupSubTab === 'map' && <MapRadarTab />}
      </div>
    </div>
  );
};
