'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Explorer, ChatMessage } from '@/types';
import { useEnigameStore } from '@/store/useEnigameStore';
import { 
  ChevronLeft, 
  ChevronRight,
  Send, 
  Hand, 
  CheckCheck, 
} from 'lucide-react';

interface ExplorerChatViewProps {
  explorer: Explorer;
  onBack: () => void;
  autoWave?: boolean;
}

export const ExplorerChatView: React.FC<ExplorerChatViewProps> = ({ explorer, onBack, autoWave }) => {
  const { 
    currentUser, 
    explorerChats, 
    sendChatMessage, 
    receiveChatMessage,
    showToast 
  } = useEnigameStore();

  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const questionsRef = useRef<HTMLDivElement>(null);

  // Mouse drag-to-scroll state for questions
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollStart, setScrollStart] = useState(0);
  const [hasMoved, setHasMoved] = useState(false);

  // Default initial greeting if no chat history
  const defaultMessages: ChatMessage[] = [
    {
      id: 'init-1',
      sender: 'explorer',
      text: `Hey explorer! 👋 I'm currently at the ${explorer.city || 'Bragança'} citadel. Have you checked out the mystery checkpoints yet?`,
      timestamp: '10:42 AM',
    }
  ];
  const messages: ChatMessage[] = (explorerChats && explorerChats[explorer.id]) || defaultMessages;

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    scrollToBottom('auto');
  }, []);

  useEffect(() => {
    scrollToBottom('smooth');
  }, [messages, isTyping]);

  // Handle auto-wave trigger if passed
  useEffect(() => {
    if (autoWave) {
      handleSendWave();
    }
  }, [autoWave]);

  const simulateExplorerReply = (userMessage: string) => {
    setIsTyping(true);
    const lower = userMessage.toLowerCase();

    let replyText = "That sounds awesome! I'm planning to head towards the next castle checkpoint this afternoon. Let's team up!";

    if (lower.includes('hola') || lower.includes('hello') || lower.includes('hey') || lower.includes('wave') || lower.includes('salud')) {
      replyText = `Hey ${currentUser.name || 'there'}! 👋 Awesome to connect with a fellow adventurer. Are you exploring Bragança today?`;
    } else if (lower.includes('route') || lower.includes('ruta') || lower.includes('citadel') || lower.includes('castelo')) {
      replyText = "The Bragança Medieval Mystery route is incredible! The riddles near the stone keep gave me 350 points yesterday!";
    } else if (lower.includes('level') || lower.includes('nivel') || lower.includes('points') || lower.includes('puntos')) {
      replyText = `I'm currently Level ${explorer.level || 18}! Deciphering ancient riddles is the fastest way to rank up.`;
    } else if (lower.includes('team') || lower.includes('together') || lower.includes('juntos') || lower.includes('hacemos')) {
      replyText = "Count me in! Let's meet up by the Citadel entrance near Café do Castelo. Ready whenever you are!";
    }

    setTimeout(() => {
      setIsTyping(false);
      receiveChatMessage(explorer.id, replyText);
    }, 1400);
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const text = inputText.trim();
    if (!text) return;

    sendChatMessage(explorer.id, text, false);
    setInputText('');
    simulateExplorerReply(text);
  };

  const handleSendWave = () => {
    sendChatMessage(explorer.id, '👋 Sent a wave!', true);
    showToast(`Wave sent to ${explorer.name}!`, 'success');
    simulateExplorerReply('wave');
  };

  // Questions WITHOUT icons/emojis as requested by user
  const quickSuggestions = [
    'Want to do a route together?',
    'What level are you on?',
    'Let\'s conquer the citadel!',
    'Where are you exploring today?',
    'Ready for a mystery expedition?',
    'Any tips for the castle riddles?',
    'Which checkpoint is your favorite?',
    'Let\'s team up for points!',
  ];

  // Mouse wheel horizontal scrolling
  const handleQuestionsWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (e.deltaY !== 0 && questionsRef.current) {
      questionsRef.current.scrollLeft += e.deltaY;
    }
  };

  // Drag to scroll handlers for desktop mouse
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!questionsRef.current) return;
    setIsDragging(true);
    setHasMoved(false);
    setStartX(e.pageX - questionsRef.current.offsetLeft);
    setScrollStart(questionsRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !questionsRef.current) return;
    e.preventDefault();
    const x = e.pageX - questionsRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    if (Math.abs(walk) > 4) {
      setHasMoved(true);
    }
    questionsRef.current.scrollLeft = scrollStart - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Left/Right button click scroll
  const scrollQuestionsBy = (offset: number) => {
    if (questionsRef.current) {
      questionsRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col bg-[#F4F6FC] select-none overflow-hidden animate-fadeIn">
      <div className="relative w-full bg-[#8E97FD] rounded-b-[28px] pt-4 pb-3.5 px-4 text-white shadow-sm shrink-0 z-20 overflow-hidden">
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {/* Back Button */}
            <button
              onClick={onBack}
              className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all cursor-pointer active:scale-95"
              title="Back"
              aria-label="Back"
            >
              <ChevronLeft size={22} />
            </button>

            {/* Avatar & Info */}
            <div className="flex items-center gap-2.5">
              <div className="relative w-10 h-10 rounded-full border-2 border-white/70 overflow-hidden shadow-xs shrink-0">
                <img 
                  src={explorer.avatar} 
                  alt={explorer.name} 
                  className="w-full h-full object-cover bg-white" 
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-white" />
              </div>

              <div>
                <h2 className="text-sm font-bold tracking-tight text-white leading-tight">
                  {explorer.name}
                </h2>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
                  <span className="text-[10px] text-white/90 font-medium">
                    Active now • {explorer.city || 'Bragança, PT'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Wave Action */}
          <button
            onClick={handleSendWave}
            className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-all cursor-pointer active:scale-95 shadow-xs"
            title="Wave to explorer"
          >
            <Hand size={18} />
          </button>
        </div>
      </div>

      {/* Messages Stream - ONLY this container scrolls when scrolling conversation */}
      <div className="flex-1 min-h-0 overflow-y-auto px-4 py-3 space-y-3.5 no-scrollbar overscroll-contain">
        {/* Date separator */}
        <div className="flex justify-center my-1">
          <span className="text-[10px] font-semibold text-[#8E90B0] bg-white/80 border border-[#EEF0FA] px-3 py-0.5 rounded-full shadow-2xs">
            Today
          </span>
        </div>

        {/* Messages */}
        {messages.map((msg: ChatMessage) => {
          const isUser = msg.sender === 'user';

          if (isUser) {
            return (
              <div key={msg.id} className="flex flex-col items-end animate-slideUp">
                <div className="bg-gradient-to-r from-[#8E97FD] to-[#7C82ED] text-white rounded-2xl rounded-tr-xs px-4 py-2.5 shadow-sm shadow-indigo-300/30 max-w-[80%]">
                  {msg.isWave ? (
                    <div className="flex items-center gap-1.5 font-bold text-xs">
                      <span>👋</span>
                      <span>You waved at {explorer.name}!</span>
                    </div>
                  ) : (
                    <p className="text-xs font-medium leading-relaxed break-words">{msg.text}</p>
                  )}
                  <div className="flex items-center justify-end gap-1 mt-1 text-[9px] text-white/80">
                    <span>{msg.timestamp}</span>
                    <CheckCheck size={11} className="text-white" />
                  </div>
                </div>
              </div>
            );
          }

          return (
            <div key={msg.id} className="flex items-end gap-2 animate-slideUp">
              <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 border border-[#EEF0FA] shadow-2xs mb-1">
                <img 
                  src={explorer.avatar} 
                  alt={explorer.name} 
                  className="w-full h-full object-cover bg-white" 
                />
              </div>

              <div className="bg-white rounded-2xl rounded-tl-xs px-4 py-2.5 shadow-xs border border-[#EEF0FA] max-w-[80%]">
                <p className="text-xs text-[#1E1F3D] font-medium leading-relaxed break-words">
                  {msg.text}
                </p>
                <div className="text-right mt-1 text-[9px] text-[#A5A7C4]">
                  {msg.timestamp}
                </div>
              </div>
            </div>
          );
        })}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex items-end gap-2 animate-fadeIn">
            <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 border border-[#EEF0FA] shadow-2xs mb-1">
              <img 
                src={explorer.avatar} 
                alt={explorer.name} 
                className="w-full h-full object-cover bg-white" 
              />
            </div>
            <div className="bg-white rounded-2xl rounded-tl-xs px-4 py-3 shadow-xs border border-[#EEF0FA] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#8E97FD] animate-bounce [animation-delay:-0.3s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#8E97FD] animate-bounce [animation-delay:-0.15s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#8E97FD] animate-bounce" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Suggestions Chips - FIXED above input with smooth horizontal scroll & arrow buttons */}
      <div className="shrink-0 bg-[#F4F6FC] border-t border-[#EEF0FA] py-2 z-10">
        <div className="relative flex items-center px-1">
          {/* Scroll Left Button */}
          <button
            type="button"
            onClick={() => scrollQuestionsBy(-160)}
            className="w-6 h-6 rounded-full bg-white/90 hover:bg-white text-[#7C82ED] shadow-xs border border-[#EEF0FA] flex items-center justify-center shrink-0 ml-1 active:scale-90 transition-all cursor-pointer z-10"
            title="Scroll left"
            aria-label="Scroll left"
          >
            <ChevronLeft size={14} />
          </button>

          {/* Horizontally Scrollable Questions Bar */}
          <div
            ref={questionsRef}
            onWheel={handleQuestionsWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className="flex-1 flex items-center gap-2 overflow-x-auto no-scrollbar px-2 touch-pan-x cursor-grab active:cursor-grabbing"
            style={{ scrollBehavior: 'smooth' }}
          >
            {quickSuggestions.map((suggestion, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  if (!hasMoved) {
                    sendChatMessage(explorer.id, suggestion, false);
                    simulateExplorerReply(suggestion);
                  }
                }}
                className="shrink-0 text-[11px] font-medium px-3.5 py-1.5 rounded-full bg-white hover:bg-[#EEF0FF] text-[#585A7E] hover:text-[#7C82ED] border border-[#EEF0FA] shadow-xs whitespace-nowrap transition-all active:scale-95 cursor-pointer"
              >
                {suggestion}
              </button>
            ))}
          </div>

          {/* Scroll Right Button */}
          <button
            type="button"
            onClick={() => scrollQuestionsBy(160)}
            className="w-6 h-6 rounded-full bg-white/90 hover:bg-white text-[#7C82ED] shadow-xs border border-[#EEF0FA] flex items-center justify-center shrink-0 mr-1 active:scale-90 transition-all cursor-pointer z-10"
            title="Scroll right"
            aria-label="Scroll right"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Input Bar - 100% FIXED at the bottom */}
      <div className="p-3 bg-white border-t border-[#EEF0FA] shrink-0 z-10">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          {/* Quick Wave Button */}
          <button
            type="button"
            onClick={handleSendWave}
            className="w-10 h-10 rounded-full bg-[#F4F6FB] hover:bg-[#EEF0FF] text-[#8E97FD] flex items-center justify-center transition-colors shrink-0 cursor-pointer active:scale-95 shadow-2xs"
            title="Send wave"
          >
            <Hand size={18} />
          </button>

          {/* Text Input */}
          <div className="flex-1 relative flex items-center">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={"Message " + explorer.name.split(" ")[0] + "..."}
              className="w-full h-11 pl-4 pr-10 rounded-2xl bg-[#F4F6FB] border border-[#EEF0FA] text-xs text-[#1E1F3D] placeholder-[#A5A7C4] focus:outline-none focus:ring-2 focus:ring-[#8E97FD]/40 focus:bg-white transition-all"
            />
          </div>

          {/* Send Button */}
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="w-11 h-11 rounded-2xl bg-[#8E97FD] hover:bg-[#7C82ED] disabled:opacity-40 text-white flex items-center justify-center shadow-md shadow-indigo-300/40 transition-all active:scale-95 cursor-pointer shrink-0"
            title="Send message"
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
};
