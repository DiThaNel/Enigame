'use client';

import React from 'react';
import { useEnigameStore, MeetupSubTab } from '@/store/useEnigameStore';
import { ExplorersTab } from './ExplorersTab';
import { ExplorerProfileView } from './ExplorerProfileView';
import { ExplorerChatView } from './ExplorerChatView';
import { ConversationsView } from './ConversationsView';
import { TravelingTab } from './TravelingTab';
import { MapRadarTab } from './MapRadarTab';
import { Compass, Users, Plane, MessageSquare } from 'lucide-react';

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
    setProfileOpenedFromChatExplorer,
    chatReturnToConversations,
    setChatReturnToConversations,
    readConversationIds
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
          if (chatReturnToConversations) {
            setMeetupSubTab('conversations');
            setChatReturnToConversations(false);
          }
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

  // Count unread conversations (Marco Polo and Sofia Ramos start as unread)
  const unreadCount = 2 - readConversationIds.filter(id => ['conv-1', 'conv-2'].includes(id)).length;

  const tabs: { id: MeetupSubTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { 
      id: 'explorers', 
      label: 'Explorers', 
      icon: <Users size={15} /> 
    },
    { 
      id: 'traveling', 
      label: 'Travels', 
      icon: <Plane size={15} /> 
    },
    { 
      id: 'map', 
      label: 'Map', 
      icon: <Compass size={15} /> 
    },
    { 
      id: 'conversations', 
      label: 'Chats', 
      icon: <MessageSquare size={15} />,
      badge: Math.max(0, unreadCount),
    },
  ];

  return (
    <div className="w-full flex-1 flex flex-col min-h-full">
      {/* Top Header Segment Control (shown when exploring tabs) */}
      {meetupSubTab !== 'conversations' && (
        <div className="px-5 pt-3 pb-2 bg-white border-b border-[#EEF0FA] shrink-0">
          <div className="flex items-center justify-center p-1 bg-[#F4F6FB] rounded-2xl">
            {tabs.map((tab) => {
              const isActive = meetupSubTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setMeetupSubTab(tab.id)}
                  className={"flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-all relative cursor-pointer active:scale-95 " + (
                    isActive
                      ? "bg-white text-[#7C82ED] shadow-sm font-bold"
                      : "text-[#8E90B0] hover:text-[#585A7E]"
                  )}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span className="w-2 h-2 rounded-full bg-[#8E97FD] animate-pulse shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Render Active SubTab with smooth fade-slide transition */}
      <div key={meetupSubTab} className="w-full flex-1 flex flex-col animate-tab-enter">
        {meetupSubTab === 'explorers' && <ExplorersTab />}
        {meetupSubTab === 'traveling' && <TravelingTab />}
        {meetupSubTab === 'map' && <MapRadarTab />}
        {meetupSubTab === 'conversations' && (
          <ConversationsView
            onOpenChat={(exp) => {
              setChatReturnToConversations(true);
              setActiveChatExplorer(exp);
            }}
            onBack={() => setMeetupSubTab('explorers')}
          />
        )}
      </div>
    </div>
  );
};
