'use client';

import React from 'react';
import { useEnigameStore } from '@/store/useEnigameStore';
import { DYNAMIC_EXPLORERS } from '@/data/mockData';
import { Explorer } from '@/types';

export const ExplorersTab: React.FC = () => {
  const { setSelectedExplorer } = useEnigameStore();

  const explorerList = DYNAMIC_EXPLORERS;

  // Split into 3 columns for staggered masonry layout matching Figma 06 - Meet-up
  const col1 = explorerList.filter((_, idx) => idx % 3 === 0);
  const col2 = explorerList.filter((_, idx) => idx % 3 === 1);
  const col3 = explorerList.filter((_, idx) => idx % 3 === 2);

  const renderExplorerCard = (exp: Explorer, originalIndex: number) => (
    <div
      key={exp.id}
      onClick={() => setSelectedExplorer(exp)}
      style={{ animationDelay: `${(originalIndex % 6) * 50}ms` }}
      className="animate-card-stagger flex flex-col items-center cursor-pointer group active:scale-95 transition-transform"
      title={`${exp.name} (Rank #${exp.rank}) - ${exp.city}`}
    >
      {/* Explorer Avatar Frame - Circle matches explorer image */}
      <div className="relative w-23 h-23 group-hover:scale-105 transition-transform">
        <img
          src={exp.avatar}
          alt={exp.name}
          className="w-full h-full rounded-full object-cover"
        />

        {/* Dynamic Ranking Medal Badge top-right */}
        <div className="absolute -top-1 -right-1 w-6 h-6 flex items-center justify-center pointer-events-none drop-shadow">
          <img
            src={exp.rankMedal || '/assets/TopPointsMedal.png'}
            alt={`Rank #${exp.rank} Medal`}
            className="w-5 h-5 object-contain"
          />
        </div>

        {/* Dynamic National Flag Badge bottom-right */}
        <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full overflow-hidden border-2 border-white shadow-sm flex items-center justify-center bg-white pointer-events-none">
          <img
            src={exp.countryFlag || '/assets/PT.png'}
            alt={exp.country || 'Flag'}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );

  return (
    <div
      className="w-full flex-1 min-h-full pb-8 relative overflow-hidden px-3 pt-5 bg-no-repeat"
      style={{
        backgroundImage: 'url(/assets/Lenguaje.png)',
        backgroundSize: '100% 100%',
        backgroundPosition: 'top center',
      }}
    >
      {/* 3-Column Staggered Masonry Layout matching Figma 06 - Meet-up */}
      <div className="relative z-10 grid grid-cols-3 gap-x-2">
        {/* Column 1 */}
        <div className="flex flex-col items-center gap-y-7">
          {col1.map((exp, idx) => renderExplorerCard(exp, idx * 3))}
        </div>

        {/* Column 2 (staggered downward for masonry effect) */}
        <div className="flex flex-col items-center gap-y-7 pt-10">
          {col2.map((exp, idx) => renderExplorerCard(exp, idx * 3 + 1))}
        </div>

        {/* Column 3 */}
        <div className="flex flex-col items-center gap-y-7">
          {col3.map((exp, idx) => renderExplorerCard(exp, idx * 3 + 2))}
        </div>
      </div>
    </div>
  );
};
