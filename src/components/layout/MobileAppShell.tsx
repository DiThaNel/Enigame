'use client';

import React, { useState } from 'react';
import { useEnigameStore, AppStage } from '@/store/useEnigameStore';
import { TopStatusBar } from './TopStatusBar';
import { BottomNavBar } from './BottomNavBar';
import { HomeDashboard } from '@/components/home/HomeDashboard';
import { RoutesCatalog } from '@/components/routes/RoutesCatalog';
import { MeetupHub } from '@/components/meetup/MeetupHub';
import { ProfileView } from '@/components/profile/ProfileView';
import { PointsStoreView } from '@/components/store/PointsStoreView';
import { QRScannerView } from '@/components/scanner/QRScannerView';
import { EditProfileModal } from '@/components/profile/EditProfileModal';
import { ExplorerProfileModal } from '@/components/meetup/ExplorerProfileModal';
import { HostExpeditionModal } from '@/components/meetup/HostExpeditionModal';
import { SplashScreen } from '@/components/onboarding/SplashScreen';
import { SelectLanguageScreen } from '@/components/onboarding/SelectLanguageScreen';
import { CreateAccountScreen } from '@/components/onboarding/CreateAccountScreen';
import { UserGuideScreen } from '@/components/onboarding/UserGuideScreen';
import { Smartphone, Monitor, RotateCcw } from 'lucide-react';

export const MobileAppShell: React.FC = () => {
  const { appStage, setAppStage, activeTab } = useEnigameStore();
  const [deviceFrame, setDeviceFrame] = useState(true);

  const stages: { id: AppStage; label: string }[] = [
    { id: 'splash', label: '1. Splash' },
    { id: 'language', label: '2. Language' },
    { id: 'auth', label: '3. Register' },
    { id: 'guide', label: '4. Guide' },
    { id: 'main', label: '5. Dashboard' },
  ];

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#0C0D1A] p-0 sm:p-4 md:p-8 font-sans">
      {/* Desktop Stage Switcher & Frame Controls */}
      <div className="hidden sm:flex flex-wrap items-center justify-center gap-2 mb-3 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-white text-xs font-semibold max-w-2xl">
        <div className="flex items-center gap-1 border-r border-white/20 pr-2 mr-1">
          <button
            onClick={() => setDeviceFrame(true)}
            className={"flex items-center gap-1 px-2.5 py-1 rounded-full transition-all cursor-pointer " + (
              deviceFrame ? "bg-[#7C82ED] text-white shadow-sm" : "opacity-70 hover:opacity-100"
            )}
          >
            <Smartphone size={14} />
            <span>Mobile Frame</span>
          </button>
          <button
            onClick={() => setDeviceFrame(false)}
            className={"flex items-center gap-1 px-2.5 py-1 rounded-full transition-all cursor-pointer " + (
              !deviceFrame ? "bg-[#7C82ED] text-white shadow-sm" : "opacity-70 hover:opacity-100"
            )}
          >
            <Monitor size={14} />
            <span>Full Width</span>
          </button>
        </div>

        {/* Quick jump between Figma onboarding stages */}
        <div className="flex items-center gap-1">
          {stages.map((st) => (
            <button
              key={st.id}
              onClick={() => setAppStage(st.id)}
              className={"px-2.5 py-1 rounded-full text-[11px] font-medium transition-all cursor-pointer " + (
                appStage === st.id
                  ? "bg-[#8E97FD] text-white font-bold shadow-sm ring-1 ring-white/50"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              )}
            >
              {st.label}
            </button>
          ))}
        </div>

        <button
          onClick={() => setAppStage('splash')}
          className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] text-[#A5A7C4] hover:text-white hover:bg-white/10 transition-all border border-white/10 ml-1 cursor-pointer"
          title="Restart Onboarding"
        >
          <RotateCcw size={12} />
          <span>Restart</span>
        </button>
      </div>

      {/* Main Device Container */}
      <div
        className={"relative w-full overflow-hidden bg-[#F4F6FB] flex flex-col transition-all duration-300 " + (
          deviceFrame
            ? "max-w-[420px] h-[100dvh] sm:h-[860px] sm:rounded-[50px] shadow-[0_25px_70px_rgba(0,0,0,0.6)] sm:border-[10px] sm:border-[#1F213A]"
            : "max-w-3xl min-h-[100dvh] sm:rounded-3xl shadow-2xl"
        )}
      >
        {/* Dynamic Island / Notch decoration on desktop */}
        {deviceFrame && (
          <div className="hidden sm:block absolute top-2.5 left-1/2 -translate-x-1/2 w-28 h-4 bg-[#1F213A] rounded-full z-40" />
        )}

        {/* Stage 1: 01 - Splash Screen */}
        {appStage === 'splash' && <SplashScreen />}

        {/* Stage 2: 02 - Select Language */}
        {appStage === 'language' && <SelectLanguageScreen />}

        {/* Stage 3: 03 - Login / Create Account */}
        {appStage === 'auth' && <CreateAccountScreen />}

        {/* Stage 4: 04 - 04.3 User Guide */}
        {appStage === 'guide' && <UserGuideScreen />}

        {/* Stage 5: Main App Dashboard & Navigation */}
        {appStage === 'main' && (
          <>
            <TopStatusBar />

            <main className="flex-1 overflow-y-auto no-scrollbar relative">
              {activeTab === 'home' && <HomeDashboard />}
              {activeTab === 'routes' && <RoutesCatalog />}
              {activeTab === 'meetup' && <MeetupHub />}
              {activeTab === 'points' && <PointsStoreView />}
              {activeTab === 'profile' && <ProfileView />}
            </main>

            <BottomNavBar />

            {/* Global Modals & Overlays */}
            <QRScannerView />
            <EditProfileModal />
            <ExplorerProfileModal />
            <HostExpeditionModal />
          </>
        )}
      </div>
    </div>
  );
};
