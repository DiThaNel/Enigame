'use client';

import React, { useEffect, useState } from 'react';
import { Wifi, BatteryMedium } from 'lucide-react';

export const TopStatusBar: React.FC = () => {
  const [time, setTime] = useState('10:09');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const h = now.getHours().toString().padStart(2, '0');
      const m = now.getMinutes().toString().padStart(2, '0');
      setTime(`${h}:${m}`);
    };
    update();
    const timer = setInterval(update, 30000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full h-11 px-6 pt-3 flex items-center justify-between text-xs font-semibold text-[#1E1F3D] select-none z-30">
      <span>{time}</span>
      <div className="flex items-center gap-1.5 opacity-80">
        <Wifi size={14} strokeWidth={2.5} />
        <BatteryMedium size={16} strokeWidth={2.5} />
      </div>
    </div>
  );
};
