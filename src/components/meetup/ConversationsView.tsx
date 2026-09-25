'use client';

import React, { useState, useMemo } from 'react';
import { Explorer } from '@/types';
import { useEnigameStore } from '@/store/useEnigameStore';
import { MOCK_CONVERSATIONS } from '@/data/mockData';
import { 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  X, 
  MessageSquare, 
  Mic, 
  Paperclip,
  CheckCheck
} from 'lucide-react';

interface ConversationsViewProps {
  onOpenChat: (explorer: Explorer) => void;
  onBack: () => void;
}

export const ConversationsView: React.FC<ConversationsViewProps> = ({ 
  onOpenChat, 
  onBack 
}) => {
  const { 
    explorerChats, 
    readConversationIds, 
    markConversationAsRead 
  } = useEnigameStore();

  const [activeFilter, setActiveFilter] = useState<'all' | 'read' | 'unread'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Compute live conversations combining mock data and real active store chats
  const conversations = useMemo(() => {
    // Start with default mock conversations
    const list = MOCK_CONVERSATIONS.map((conv) => {
      const isReadExplicit = readConversationIds.includes(conv.id);
      const isUnread = !isReadExplicit && conv.unread;
      const customChat = explorerChats[conv.explorer.id];

      if (customChat && customChat.length > 0) {
        const lastMsg = customChat[customChat.length - 1];
        let preview = lastMsg.text;
        if (lastMsg.audioDuration) {
          preview = `Voice note (${lastMsg.audioDuration})`;
        } else if (lastMsg.fileAttachment) {
          preview = `Attachment: ${lastMsg.fileAttachment.name}`;
        }
        return {
          id: conv.id,
          explorer: conv.explorer,
          lastMessage: preview,
          lastTimestamp: lastMsg.timestamp || conv.lastTimestamp,
          unread: isUnread,
          hasAudio: !!lastMsg.audioDuration,
          hasAttachment: !!lastMsg.fileAttachment,
          isUserSender: lastMsg.sender === 'user',
        };
      }

      return {
        id: conv.id,
        explorer: conv.explorer,
        lastMessage: conv.lastMessage,
        lastTimestamp: conv.lastTimestamp,
        unread: isUnread,
        hasAudio: false,
        hasAttachment: !!conv.hasAttachment,
        isUserSender: false,
      };
    });

    return list;
  }, [explorerChats, readConversationIds]);

  // Filtered by All / Read / Unread and search query
  const filteredConversations = useMemo(() => {
    let result = conversations;

    if (activeFilter === 'read') {
      result = result.filter((c) => !c.unread);
    } else if (activeFilter === 'unread') {
      result = result.filter((c) => c.unread);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.explorer.name.toLowerCase().includes(q) ||
          c.explorer.city.toLowerCase().includes(q) ||
          c.lastMessage.toLowerCase().includes(q)
      );
    }

    return result;
  }, [conversations, activeFilter, searchQuery]);

  const unreadCount = conversations.filter((c) => c.unread).length;

  const handleSelectConversation = (chat: typeof conversations[0]) => {
    markConversationAsRead(chat.id);
    onOpenChat(chat.explorer);
  };

  return (
    <div className="w-full flex-1 flex flex-col bg-white min-h-full animate-fadeIn select-none">
      {/* Curved Header matching Figma 06.5 - Conversations */}
      <div className="relative w-full bg-[#8E97FD] rounded-b-[32px] pt-7 pb-5 px-5 text-white shadow-xs shrink-0 z-20">
        <div className="flex items-center justify-between">
          {/* Back Button */}
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all cursor-pointer active:scale-95 shadow-xs"
            title="Back to Explorers"
            aria-label="Back"
          >
            <ChevronLeft size={22} />
          </button>

          {/* Title */}
          <h1 className="text-base font-bold tracking-wide text-white">
            Conversations
          </h1>

          {/* Search Toggle Button */}
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer active:scale-95 shadow-xs ${
              isSearchOpen ? 'bg-white text-[#8E97FD]' : 'bg-white/20 hover:bg-white/30 text-white'
            }`}
            title="Search conversations"
            aria-label="Search"
          >
            <Search size={17} />
          </button>
        </div>

        {/* Expandable Search Bar */}
        {isSearchOpen && (
          <div className="mt-3 relative flex items-center animate-fadeIn">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by explorer or message..."
              autoFocus
              className="w-full h-10 pl-9 pr-9 rounded-2xl bg-white text-xs text-[#1E1F3D] placeholder-[#A5A7C4] focus:outline-none shadow-md"
            />
            <Search size={15} className="absolute left-3 text-[#8E97FD]" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 text-[#A5A7C4] hover:text-[#1E1F3D]"
              >
                <X size={15} />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Filter Tabs Segment Control with Animated Transitions */}
      <div className="flex items-center justify-between px-6 bg-white border-b border-[#EEF0FA] pt-3 shrink-0 relative">
        {(['all', 'read', 'unread'] as const).map((filter) => {
          const isActive = activeFilter === filter;
          const label =
            filter === 'all'
              ? 'All Messages'
              : filter === 'read'
              ? 'Read'
              : 'Unread';

          return (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`flex-1 pb-3 text-xs font-bold transition-all duration-200 relative flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 ${
                isActive ? 'text-[#1E1F3D]' : 'text-[#8E90B0] hover:text-[#585A7E]'
              }`}
            >
              <span className="transition-colors duration-200">{label}</span>
              {filter === 'unread' && unreadCount > 0 && (
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[9px] font-bold border transition-transform duration-200 ${
                    isActive
                      ? 'bg-[#EEF0FF] text-[#8E97FD] border-[#8E97FD]/30 scale-105'
                      : 'bg-[#F4F6FB] text-[#8E90B0] border-[#EEF0FA]'
                  }`}
                >
                  {unreadCount}
                </span>
              )}
              {/* Active Underline Indicator with animated pill pop */}
              {isActive && (
                <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-[#8E97FD] rounded-full animate-pill-pop" />
              )}
            </button>
          );
        })}
      </div>

      {/* Conversation List Rows with Stagger Entrance Animation */}
      <div
        key={activeFilter}
        className="flex-1 overflow-y-auto no-scrollbar pb-24 animate-tab-enter"
      >
        {filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center text-[#8E90B0] animate-fadeIn">
            <div className="w-14 h-14 rounded-full bg-[#F4F6FB] flex items-center justify-center text-[#8E97FD] mb-3 animate-popIn">
              <MessageSquare size={24} />
            </div>
            <p className="text-xs font-bold text-[#1E1F3D]">No conversations found</p>
            <p className="text-[11px] text-[#A5A7C4] mt-1 max-w-xs">
              {searchQuery
                ? `No results matching "${searchQuery}"`
                : activeFilter === 'unread'
                ? 'All messages have been read!'
                : 'Start a chat with an explorer from the Meetup tab!'}
            </p>
          </div>
        ) : (
          filteredConversations.map((chat, idx) => {
            return (
              <div
                key={chat.id}
                onClick={() => handleSelectConversation(chat)}
                style={{ animationDelay: `${(idx % 8) * 45}ms` }}
                className="animate-card-stagger flex items-center gap-3.5 px-5 py-4 border-b border-[#EEF0FA] hover:bg-[#F9FAFE] active:scale-[0.99] transition-all cursor-pointer group"
              >
                {/* Explorer Avatar Frame with Dynamic Medal top-right and Country Flag bottom-right */}
                <div className="relative w-12 h-12 shrink-0">
                  <div className="w-12 h-12 rounded-full overflow-hidden border border-[#EEF0FA] shadow-xs bg-white group-hover:scale-105 transition-transform">
                    <img
                      src={chat.explorer.avatar}
                      alt={chat.explorer.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Top-Right Ranking Medal Badge */}
                  <div className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center pointer-events-none drop-shadow">
                    <img
                      src={chat.explorer.rankMedal || '/assets/TopPointsMedal.png'}
                      alt="Medal"
                      className="w-4.5 h-4.5 object-contain"
                    />
                  </div>

                  {/* Bottom-Right Dynamic National Flag */}
                  <div className="absolute -bottom-0.5 -right-0.5 w-4.5 h-4.5 rounded-full overflow-hidden border border-white shadow-xs flex items-center justify-center bg-white pointer-events-none">
                    <img
                      src={chat.explorer.countryFlag || '/assets/PT.png'}
                      alt="Flag"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Middle Content matching Figma 06.5 layout */}
                <div className="flex-1 min-w-0">
                  {/* Top row: Explorer Name & Timestamp */}
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <h3
                        className={`text-xs truncate ${
                          chat.unread ? 'font-bold text-[#1E1F3D]' : 'font-semibold text-[#2A2B4A]'
                        }`}
                      >
                        {chat.explorer.name}
                      </h3>
                      {chat.unread && (
                        <span className="w-2 h-2 rounded-full bg-[#8E97FD] shrink-0 animate-pulse" />
                      )}
                    </div>
                    <span className="text-[10px] text-[#A5A7C4] font-medium shrink-0 ml-2">
                      {chat.lastTimestamp}
                    </span>
                  </div>

                  {/* Bottom row: Message Preview with subtle indicators */}
                  <div className="flex items-center gap-1">
                    {chat.isUserSender && (
                      <CheckCheck size={12} className="text-[#8E97FD] shrink-0" />
                    )}
                    {chat.hasAudio && (
                      <Mic size={12} className="text-[#8E97FD] shrink-0" />
                    )}
                    {chat.hasAttachment && (
                      <Paperclip size={12} className="text-[#8E97FD] shrink-0" />
                    )}
                    <p
                      className={`text-xs truncate leading-snug ${
                        chat.unread
                          ? 'font-medium text-[#1E1F3D]'
                          : 'font-normal text-[#7A7C99]'
                      }`}
                    >
                      {chat.lastMessage}
                    </p>
                  </div>
                </div>

                {/* Right Chevron > Indicator matching Figma 06.5 */}
                <div className="text-[#C4C7E0] group-hover:text-[#8E97FD] transition-colors shrink-0 ml-1">
                  <ChevronRight size={18} />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
