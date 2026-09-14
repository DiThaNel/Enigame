'use client';

import React from 'react';
import { useEnigameStore } from '@/store/useEnigameStore';

export const ExplorersTab: React.FC = () => {
  const { setSelectedExplorer } = useEnigameStore();

  // 12 explorers matching the Figma grid pattern
  const explorerList = Array.from({ length: 12 }).map((_, i) => ({
    id: 'exp-' + i,
    name: i % 2 === 0 ? 'Tiana Rosser' : 'Lucas Silva',
    nickname: 'Explorer ' + (i + 1),
    avatar: '/assets/TianaAvatar.png',
    level: 18 - (i % 5),
    rankTitle: 'Pathfinder',
    bio: 'Must go faster. Must go faster... go, go, go!',
    city: 'Bragança, Portugal',
    gender: 'Female',
    ageGroup: '20s',
    badges: ['Top Explorer', 'Citadel Legend'],
  }));

  return (
    <div className="w-full min-h-screen pb-24 bg-[#EEF0FA] relative overflow-hidden px-4 pt-4">
      {/* Background Dashed Path Lines matching Figma */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <svg className="w-full h-full" viewBox="0 0 375 800" fill="none">
          <path d="M40 50 Q180 180 80 320 T280 500" stroke="#8E97FD" strokeWidth="2" strokeDasharray="6 6" />
          <path d="M300 100 Q150 250 220 400 T80 650" stroke="#8E97FD" strokeWidth="2" strokeDasharray="6 6" />
        </svg>
      </div>

      {/* Grid of character avatars matching Figma 06 - Meet-up */}
      <div className="relative z-10 grid grid-cols-2 gap-y-6 gap-x-4">
        {explorerList.map((exp, idx) => (
          <div
            key={exp.id}
            onClick={() => setSelectedExplorer(exp)}
            className={"flex flex-col items-center cursor-pointer group active:scale-95 transition-transform " + (
              idx % 2 === 1 ? "translate-y-6" : ""
            )}
          >
            {/* Explorer Avatar Frame */}
            <div className="relative w-22 h-22 rounded-full p-1 bg-white shadow-[0_8px_25px_rgba(142,151,253,0.22)] group-hover:shadow-[0_12px_30px_rgba(142,151,253,0.35)] transition-shadow">
              <img
                src={exp.avatar}
                alt={exp.name}
                className="w-full h-full rounded-full object-cover"
              />

              {/* Star Medal Badge top-right */}
              <div className="absolute top-0 right-0 w-6 h-6 flex items-center justify-center">
                <img src="/assets/TopPointsMedal.png" alt="Medal" className="w-5 h-5 object-contain drop-shadow" />
              </div>

              {/* Country Badge bottom-right */}
              <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full overflow-hidden border-2 border-white shadow-sm flex items-center justify-center bg-white">
                <img src="/assets/PortugalMiniIcon.png" alt="PT" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
