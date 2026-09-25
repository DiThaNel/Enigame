'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Explorer, ChatMessage } from '@/types';
import { useEnigameStore } from '@/store/useEnigameStore';
import { 
  ChevronLeft, 
  ChevronRight,
  Send, 
  Settings, 
  Paperclip, 
  Mic, 
  X, 
  Check, 
  CheckCheck, 
  Play, 
  Pause, 
  FileText, 
  Download 
} from 'lucide-react';

interface ExplorerChatViewProps {
  explorer: Explorer;
  onBack: () => void;
  onOpenProfile?: () => void;
  autoWave?: boolean;
}

export const ExplorerChatView: React.FC<ExplorerChatViewProps> = ({ 
  explorer, 
  onBack, 
  onOpenProfile, 
  autoWave 
}) => {
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Audio recording state
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Audio playback state
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const playbackTimerRef = useRef<NodeJS.Timeout | null>(null);

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
      text: `Hey explorer! 👋 I'm currently near the ${explorer.city?.split(',')[0] || 'Bragança'} citadel. Have you checked out the mystery checkpoints yet?`,
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
  }, [messages, isTyping, isRecordingAudio]);

  // Handle auto-wave trigger if passed
  useEffect(() => {
    if (autoWave) {
      handleSendWave();
    }
  }, [autoWave]);

  // Clean up recording timer on unmount
  useEffect(() => {
    return () => {
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
      if (playbackTimerRef.current) clearTimeout(playbackTimerRef.current);
    };
  }, []);

  const simulateExplorerReply = (userMessage: string, isAudio = false, isFile = false) => {
    setIsTyping(true);
    const lower = userMessage.toLowerCase();

    let replyText = "That sounds awesome! I'm planning to head towards the next castle checkpoint this afternoon. Let's team up!";

    if (isAudio) {
      replyText = `Listening to your voice note! 🎧 That's super clear. I'm near the Citadel Torre de Menagem, let's meet up!`;
    } else if (isFile) {
      replyText = `Thanks for sharing this file! 📄 The checkpoint clues and coordinates look spot on for deciphering the next mystery.`;
    } else if (lower.includes('hola') || lower.includes('hello') || lower.includes('hey') || lower.includes('wave') || lower.includes('salud')) {
      replyText = `Hey ${currentUser.name || 'there'}! 👋 Awesome to connect with a fellow adventurer. Are you exploring Bragança today?`;
    } else if (lower.includes('route') || lower.includes('ruta') || lower.includes('citadel') || lower.includes('castelo')) {
      replyText = "The Bragança Medieval Mystery route is incredible! The riddles near the stone keep gave me 350 points yesterday!";
    } else if (lower.includes('level') || lower.includes('nivel') || lower.includes('points') || lower.includes('puntos') || lower.includes('rank')) {
      replyText = `I'm currently Rank #${explorer.rank || 1} with Level ${explorer.level || 18}! Deciphering ancient riddles is the fastest way to rank up.`;
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

  // Voice Note Handlers
  const handleStartRecording = () => {
    setIsRecordingAudio(true);
    setRecordingSeconds(0);
    if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    recordingTimerRef.current = setInterval(() => {
      setRecordingSeconds((prev) => prev + 1);
    }, 1000);
  };

  const handleCancelRecording = () => {
    if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    setIsRecordingAudio(false);
    setRecordingSeconds(0);
  };

  const handleFinishRecording = () => {
    if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    const secs = Math.max(recordingSeconds, 4);
    const durationStr = `0:${secs < 10 ? '0' + secs : secs}`;
    
    sendChatMessage(explorer.id, 'Voice message', false, {
      audioDuration: durationStr,
    });
    
    setIsRecordingAudio(false);
    setRecordingSeconds(0);
    showToast(`Voice note (${durationStr}) sent!`, 'success');
    simulateExplorerReply('', true, false);
  };

  const togglePlayAudio = (msgId: string) => {
    if (playingAudioId === msgId) {
      setPlayingAudioId(null);
      if (playbackTimerRef.current) clearTimeout(playbackTimerRef.current);
    } else {
      setPlayingAudioId(msgId);
      if (playbackTimerRef.current) clearTimeout(playbackTimerRef.current);
      playbackTimerRef.current = setTimeout(() => {
        setPlayingAudioId(null);
      }, 4000);
    }
  };

  // File Sharing Handlers
  const handleTriggerFilePicker = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isImg = file.type.startsWith('image/');
    const previewUrl = isImg ? URL.createObjectURL(file) : undefined;
    const formattedSize = file.size > 1024 * 1024 
      ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
      : `${Math.round(file.size / 1024)} KB`;

    sendChatMessage(explorer.id, isImg ? `Photo: ${file.name}` : `Document: ${file.name}`, false, {
      fileAttachment: {
        name: file.name,
        size: formattedSize,
        type: isImg ? 'image' : 'file',
        url: previewUrl,
      }
    });

    showToast(`Sent ${file.name} to ${explorer.name.split(' ')[0]}!`, 'success');
    simulateExplorerReply(file.name, false, true);

    // Reset input
    e.target.value = '';
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
      {/* Top Header - Purple with Settings Gear and Dynamic Medals/Flags */}
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

            {/* Explorer Avatar & Header Details with dynamic medal & flag */}
            <div className="flex items-center gap-2.5">
              <div className="relative w-10 h-10 shrink-0">
                {/* Main Avatar Circle */}
                <div className="w-10 h-10 rounded-full border-2 border-white/80 overflow-hidden shadow-xs bg-white">
                  <img 
                    src={explorer.avatar} 
                    alt={explorer.name} 
                    className="w-full h-full object-cover" 
                  />
                </div>

                {/* Top-Right Ranking Medal */}
                <div className="absolute -top-1 -right-1 w-4.5 h-4.5 flex items-center justify-center pointer-events-none drop-shadow">
                  <img
                    src={explorer.rankMedal || '/assets/TopPointsMedal.png'}
                    alt="Medal"
                    className="w-4 h-4 object-contain"
                  />
                </div>

                {/* Bottom-Right Dynamic National Flag */}
                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full overflow-hidden border border-white shadow-xs flex items-center justify-center bg-white pointer-events-none">
                  <img
                    src={explorer.countryFlag || '/assets/PT.png'}
                    alt={explorer.country || 'Flag'}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div>
                <h2 className="text-sm font-bold tracking-tight text-white leading-tight">
                  {explorer.name}
                </h2>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse shrink-0" />
                  <span className="text-[10px] text-white/90 font-medium">
                    Rank #{explorer.rank || 1} • {explorer.city || 'Bragança, PT'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Settings Gear Action - Opens Explorer Profile */}
          <button
            onClick={onOpenProfile}
            className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-all cursor-pointer active:scale-95 shadow-xs"
            title="View Explorer Profile"
            aria-label="View Explorer Profile"
          >
            <Settings size={18} />
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
                <div className="bg-gradient-to-r from-[#8E97FD] to-[#7C82ED] text-white rounded-2xl rounded-tr-xs px-4 py-2.5 shadow-sm shadow-indigo-300/30 max-w-[85%]">
                  {msg.isWave ? (
                    <div className="flex items-center gap-1.5 font-bold text-xs">
                      <span>👋</span>
                      <span>You waved at {explorer.name}!</span>
                    </div>
                  ) : msg.audioDuration ? (
                    /* Interactive Voice Note Bubble */
                    <div className="flex items-center gap-3 py-1 min-w-[190px]">
                      <button
                        type="button"
                        onClick={() => togglePlayAudio(msg.id)}
                        className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center shrink-0 transition-transform active:scale-90 cursor-pointer"
                        title={playingAudioId === msg.id ? "Pause" : "Play"}
                      >
                        {playingAudioId === msg.id ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
                      </button>
                      <div className="flex-1 flex flex-col gap-1">
                        <div className="flex items-center gap-1 h-5">
                          {[35, 65, 90, 45, 75, 100, 60, 80, 50, 95, 70, 40, 85, 60, 45, 75].map((h, i) => (
                            <span
                              key={i}
                              style={{ height: `${h}%` }}
                              className={`w-1 rounded-full transition-all ${
                                playingAudioId === msg.id ? 'bg-white animate-pulse' : 'bg-white/75'
                              }`}
                            />
                          ))}
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-white/90 font-mono">
                          <span>Voice Note</span>
                          <span>{msg.audioDuration}</span>
                        </div>
                      </div>
                    </div>
                  ) : msg.fileAttachment ? (
                    /* File / Photo Attachment Bubble */
                    <div className="space-y-1.5 min-w-[170px]">
                      {msg.fileAttachment.type === 'image' && msg.fileAttachment.url ? (
                        <div className="rounded-xl overflow-hidden max-w-[220px] max-h-[160px] border border-white/20 bg-black/10">
                          <img
                            src={msg.fileAttachment.url}
                            alt={msg.fileAttachment.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="flex items-center gap-2.5 p-2 bg-white/15 rounded-xl border border-white/20">
                          <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                            <FileText size={18} className="text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-white truncate">{msg.fileAttachment.name}</p>
                            <span className="text-[10px] text-white/80">{msg.fileAttachment.size}</span>
                          </div>
                          <Download size={14} className="text-white/80 shrink-0" />
                        </div>
                      )}
                      {msg.text && msg.text !== 'Photo attachment' && msg.text !== 'File attachment' && (
                        <p className="text-xs font-medium leading-relaxed break-words">{msg.text}</p>
                      )}
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
        {isRecordingAudio ? (
          /* Live Voice Recording UI */
          <div className="flex items-center justify-between gap-3 px-3 py-2 bg-[#F4F6FB] border border-[#8E97FD]/30 rounded-2xl animate-fadeIn">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
              <span className="text-xs font-bold text-rose-600">Recording</span>
              <span className="text-xs font-mono font-bold text-[#1E1F3D]">
                0:{recordingSeconds < 10 ? `0${recordingSeconds}` : recordingSeconds}
              </span>
            </div>

            {/* Audio Waveform Bars Visualizer */}
            <div className="flex items-center gap-1 h-5 flex-1 max-w-[140px] justify-center">
              {[40, 75, 55, 90, 60, 80, 45, 95, 70, 50, 65, 85].map((h, i) => (
                <span
                  key={i}
                  style={{ height: `${h}%` }}
                  className="w-1 bg-[#8E97FD] rounded-full animate-pulse"
                />
              ))}
            </div>

            {/* Actions: Cancel & Send */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={handleCancelRecording}
                className="w-8 h-8 rounded-full bg-white hover:bg-rose-50 text-rose-500 flex items-center justify-center shadow-xs border border-rose-100 transition-all cursor-pointer active:scale-95"
                title="Cancel recording"
              >
                <X size={15} />
              </button>
              <button
                type="button"
                onClick={handleFinishRecording}
                className="w-8 h-8 rounded-full bg-[#8E97FD] hover:bg-[#7C82ED] text-white flex items-center justify-center shadow-sm shadow-indigo-300/40 transition-all cursor-pointer active:scale-95"
                title="Send voice note"
              >
                <Check size={16} />
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            {/* Left Action Buttons: Share File & Send Voice Note */}
            <div className="flex items-center gap-1 shrink-0">
              {/* Share File / Image Button */}
              <button
                type="button"
                onClick={handleTriggerFilePicker}
                className="w-10 h-10 rounded-2xl bg-[#F4F6FB] hover:bg-[#EEF0FF] text-[#7C82ED] flex items-center justify-center transition-all cursor-pointer active:scale-95 shadow-2xs border border-[#EEF0FA]"
                title="Share a file or photo"
                aria-label="Share file"
              >
                <Paperclip size={18} />
              </button>

              {/* Voice Note Button */}
              <button
                type="button"
                onClick={handleStartRecording}
                className="w-10 h-10 rounded-2xl bg-[#F4F6FB] hover:bg-[#EEF0FF] text-[#7C82ED] flex items-center justify-center transition-all cursor-pointer active:scale-95 shadow-2xs border border-[#EEF0FA]"
                title="Send voice note"
                aria-label="Send voice note"
              >
                <Mic size={18} />
              </button>
            </div>

            {/* Hidden native file input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelected}
              className="hidden"
              accept="image/*,.pdf,.doc,.docx,.txt"
            />

            {/* Text Input */}
            <div className="flex-1 relative flex items-center">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={"Message " + explorer.name.split(" ")[0] + "..."}
                className="w-full h-11 pl-4 pr-3 rounded-2xl bg-[#F4F6FB] border border-[#EEF0FA] text-xs text-[#1E1F3D] placeholder-[#A5A7C4] focus:outline-none focus:ring-2 focus:ring-[#8E97FD]/40 focus:bg-white transition-all"
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
        )}
      </div>
    </div>
  );
};
