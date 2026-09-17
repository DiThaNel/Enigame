'use client';

import React, { useState } from 'react';
import { useEnigameStore } from '@/store/useEnigameStore';
import { MOCK_LEADERBOARD } from '@/data/mockData';
import { ChevronLeft, Trophy, Flame } from 'lucide-react';

export const LeaderboardView: React.FC = () => {
  const { setPointsSubView, points, currentUser } = useEnigameStore();
  const [timeFilter, setTimeFilter] = useState<'all' | 'month' | 'week'>('all');

  // Dynamic leaderboard computed from current user's actual points
  const dynamicLeaderboard = React.useMemo(() => {
    const list = MOCK_LEADERBOARD.map((u) =>
      u.isCurrentUser
        ? { ...u, name: currentUser.name, points: points }
        : u
    );
    // Sort descending by points
    list.sort((a, b) => b.points - a.points);
    // Reassign ranks
    return list.map((u, idx) => ({
      ...u,
      rank: idx + 1,
    }));
  }, [points, currentUser.name]);

  const userIndex = dynamicLeaderboard.findIndex((u) => u.isCurrentUser);
  const currentUserRank = userIndex !== -1 ? userIndex + 1 : 8;
  const prevUser = userIndex > 0 ? dynamicLeaderboard[userIndex - 1] : null;
  const pointsToNextRank = prevUser ? Math.max(0, prevUser.points - points) : 0;

  return (
    <div className="w-full min-h-screen pb-28 bg-[#F4F6FB] flex flex-col animate-modal-screen select-none relative">
      {/* Curved Purple Header matching Figma 08 */}
      <div className="relative bg-[#8E97FD] rounded-b-[38px] pt-8 pb-6 px-6 text-white text-center shadow-md shrink-0 z-20">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => setPointsSubView('hub')}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-all cursor-pointer active:scale-95"
            title="Back to Points"
            aria-label="Back"
          >
            <ChevronLeft size={22} />
          </button>
          <div className="flex items-center gap-2">
            <Trophy size={18} className="text-[#FFB800]" />
            <h1 className="text-base font-extrabold tracking-wide">Explorer Leaderboard</h1>
          </div>
          <div className="w-9" />
        </div>

        <p className="text-xs text-white/80 font-medium max-w-xs mx-auto">
          Top adventurers solving historical riddles across Europe
        </p>

        {/* Time Filter Pills */}
        <div className="flex items-center justify-center gap-2 mt-4 bg-white/15 p-1 rounded-full max-w-[280px] mx-auto backdrop-blur-xs">
          {(['all', 'month', 'week'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setTimeFilter(filter)}
              className={`flex-1 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer active:scale-95 ${
                timeFilter === filter
                  ? 'bg-white text-[#8E97FD] shadow-sm animate-pill-pop ring-2 ring-white/60'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              {filter === 'all' && 'All Time'}
              {filter === 'month' && 'This Month'}
              {filter === 'week' && 'This Week'}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="px-5 pt-5 flex-1 flex flex-col gap-4">
        {/* Section Header */}
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#7A7C99]">
            Rankings ({MOCK_LEADERBOARD.length} Explorers)
          </span>
          <span className="text-[11px] font-semibold text-[#8E97FD] flex items-center gap-1">
            <Flame size={12} className="text-amber-500" /> Active Today
          </span>
        </div>

        {/* All Rankings in Uniform Cards with Respective Medals and Colors */}
        <div className="flex flex-col gap-2.5">
          {dynamicLeaderboard.map((user, idx) => {
            const isUser = user.isCurrentUser;
            const userPoints = isUser ? points : user.points;
            const isFirst = user.rank === 1;
            const isSecond = user.rank === 2;
            const isThird = user.rank === 3;

            // Define card borders, gradient backgrounds, and medal styling for top 3
            let cardStyle = 'bg-white border-[#EAEFFE] hover:border-[#8E97FD]/40 shadow-xs';
            let rankBadgeStyle = 'text-[#7A7C99] font-black text-xs';
            let avatarRing = 'ring-0';
            let pointsTextStyle = 'text-[#1E1F3D]';

            if (isFirst) {
              cardStyle = 'bg-gradient-to-r from-amber-50 via-amber-100/20 to-white border-2 border-[#FFB800] shadow-[0_6px_20px_rgba(255,184,0,0.18)]';
              rankBadgeStyle = 'bg-[#FFB800] text-[#1E1F3D] font-black text-xs px-2 py-0.5 rounded-full shadow-xs';
              pointsTextStyle = 'text-[#D97706]';
            } else if (isSecond) {
              cardStyle = 'bg-gradient-to-r from-slate-100 via-slate-50 to-white border-2 border-slate-300 shadow-[0_4px_16px_rgba(148,163,184,0.16)]';
              rankBadgeStyle = 'bg-slate-300 text-[#1E1F3D] font-black text-xs px-2 py-0.5 rounded-full shadow-xs';
              pointsTextStyle = 'text-slate-700';
            } else if (isThird) {
              cardStyle = 'bg-gradient-to-r from-amber-100/40 via-amber-50/20 to-white border-2 border-amber-600/50 shadow-[0_4px_16px_rgba(217,119,6,0.14)]';
              rankBadgeStyle = 'bg-amber-700 text-white font-black text-xs px-2 py-0.5 rounded-full shadow-xs';
              pointsTextStyle = 'text-amber-800';
            } else if (isUser) {
              cardStyle = 'bg-[#EEF0FF] border-2 border-[#8E97FD] shadow-sm ring-1 ring-[#8E97FD]/30';
              rankBadgeStyle = 'text-[#8E97FD] font-black text-xs';
            }

            return (
              <div
                key={user.id}
                className={`animate-card-stagger stagger-${Math.min(idx + 1, 8)} p-3.5 rounded-2xl border transition-all flex items-center justify-between ${cardStyle}`}
              >
                {/* Left: Rank badge, avatar, and Explorer info */}
                <div className="flex items-center gap-3">
                  {/* Rank Position */}
                  <div className="w-8 flex items-center justify-center shrink-0">
                    <span className={rankBadgeStyle}>
                      #{user.rank}
                    </span>
                  </div>

                  {/* Avatar with flag and optional medal */}
                  <div className="relative shrink-0">
                    <img
                      src="/assets/TianaAvatar.png"
                      alt={user.name}
                      className={`w-15 h-15 rounded-full object-cover ${avatarRing}`}
                    />
                    <img
                      src={user.flagUrl}
                      alt={user.country}
                      className="w-4 h-4 rounded-full object-cover absolute -bottom-0 -right-0"
                    />
                  </div>

                  {/* Name and Subtitle */}
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className={`text-xs font-extrabold ${isFirst ? 'text-[#B45309]' : 'text-[#1E1F3D]'}`}>
                        {isUser ? currentUser.name : user.name}
                      </h4>
                      {isUser && (
                        <span className="text-[9px] bg-[#8E97FD] text-white px-1.5 py-0.2 rounded-full font-extrabold">
                          YOU
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-[#7A7C99]">
                      Lvl {user.level} • {user.title}
                    </span>
                  </div>
                </div>

                {/* Right: Medal Graphic + Points */}
                <div className="flex items-center gap-2.5">
                  {/* Official Medal Image for 1st, 2nd, and 3rd */}
                  {isFirst && (
                    <img
                      src="/assets/TopPointsMedal.png"
                      alt="Gold Medal"
                      className="w-6 h-6 object-contain drop-shadow"
                    />
                  )}
                  {isSecond && (
                    <img
                      src="/assets/SilverPointsMedal.png"
                      alt="Silver Medal"
                      className="w-6 h-6 object-contain drop-shadow"
                    />
                  )}
                  {isThird && (
                    <img
                      src="/assets/BronzePointsMedal.png"
                      alt="Bronze Medal"
                      className="w-6 h-6 object-contain drop-shadow"
                    />
                  )}

                  <div className="flex flex-col items-end">
                    <span className={`text-xs font-black ${pointsTextStyle}`}>
                      {userPoints.toLocaleString()} <span className="text-[10px] font-bold text-[#8E97FD]">pts</span>
                    </span>
                    <span className="text-[9px] text-[#7A7C99]">{user.city.split(',')[0]}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating Sticky Banner for Current User */}
      <div className="sticky bottom-0 left-0 right-0 max-w-[420px] my-5 px-4 z-30 pointer-events-none">
        <div className="pointer-events-auto bg-[#1E1F3D] text-white p-3 rounded-2xl shadow-2xl border border-white/20 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-full bg-[#8E97FD] text-white font-semibold text-xs flex items-center justify-center">
              #{currentUserRank}
            </span>
            <div>
              <span className="text-xs font-extrabold block">{currentUser.name}</span>
              <span className="text-[10px] text-white/70">
                {prevUser
                  ? `${pointsToNextRank.toLocaleString()} pts to reach Rank #${prevUser.rank} (${prevUser.name.split(' ')[0]})`
                  : 'Top Rank #1 in Europe!'}
              </span>
            </div>
          </div>

          <div className="bg-white/10 px-3 py-1 rounded-xl text-right">
            <span className="text-xs font-black text-[#FFB800]">{points.toLocaleString()}</span>
            <span className="text-[10px] text-white/70 ml-1">Pts</span>
          </div>
        </div>
      </div>
    </div>
  );
};
