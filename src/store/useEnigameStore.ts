'use client';

import { create } from 'zustand';
import { Route, Explorer, Expedition, StoreItem, ActivityRecord, Checkpoint } from '@/types';
import { CURRENT_USER, MOCK_EXPLORERS, MOCK_ROUTES, MOCK_EXPEDITIONS, MOCK_STORE_ITEMS, MOCK_ACTIVITIES } from '@/data/mockData';

export type AppStage = 'splash' | 'language' | 'auth' | 'guide' | 'main';
export type AppLanguage = 'pt' | 'en';
export type MainTab = 'routes' | 'meetup' | 'home' | 'points' | 'profile';
export type MeetupSubTab = 'explorers' | 'traveling' | 'map';
export type RoutesViewStep = 'select-city' | 'city-routes' | 'route-detail';

export interface UserAccountData {
  name: string;
  email: string;
  password?: string;
  agreedToPolicy: boolean;
}

interface EnigameState {
  appStage: AppStage;
  setAppStage: (stage: AppStage) => void;
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;
  userAccount: UserAccountData;
  setUserAccount: (acc: Partial<UserAccountData>) => void;
  resetOnboarding: () => void;

  activeTab: MainTab;
  setActiveTab: (tab: MainTab) => void;
  meetupSubTab: MeetupSubTab;
  setMeetupSubTab: (tab: MeetupSubTab) => void;

  // Routes Navigation Flow
  routesViewStep: RoutesViewStep;
  setRoutesViewStep: (step: RoutesViewStep) => void;
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  selectedRoute: Route | null;
  routesReturnTab: 'home' | 'routes';
  viewRouteDetail: (route: Route, fromTab?: 'home' | 'routes') => void;

  currentUser: Explorer;
  points: number;
  updateProfile: (updated: Partial<Explorer>) => void;
  addPoints: (amount: number, reason: string) => void;

  routes: Route[];
  activeRouteId: string | null;
  setActiveRouteId: (id: string | null) => void;
  completedCheckpointIds: string[];
  completeCheckpoint: (checkpointId: string) => void;

  expeditions: Expedition[];
  joinExpedition: (expeditionId: string) => void;
  createExpedition: (expedition: Omit<Expedition, 'id' | 'host' | 'participants' | 'status'>) => void;

  explorers: Explorer[];
  selectedExplorer: Explorer | null;
  setSelectedExplorer: (explorer: Explorer | null) => void;

  isScannerOpen: boolean;
  setScannerOpen: (open: boolean) => void;
  selectedRouteDetail: Route | null;
  setSelectedRouteDetail: (route: Route | null) => void;
  profileViewStep: 'profile' | 'edit-profile';
  setProfileViewStep: (step: 'profile' | 'edit-profile') => void;
  isEditProfileOpen: boolean;
  setEditProfileOpen: (open: boolean) => void;
  isSettingsOpen: boolean;
  setSettingsOpen: (open: boolean) => void;
  isChangePasswordOpen: boolean;
  setChangePasswordOpen: (open: boolean) => void;
  isChangeEmailOpen: boolean;
  setChangeEmailOpen: (open: boolean) => void;
  isPurchaseHistoryOpen: boolean;
  setPurchaseHistoryOpen: (open: boolean) => void;
  isHostExpeditionOpen: boolean;
  setHostExpeditionOpen: (open: boolean) => void;
  activeRiddleCheckpoint: Checkpoint | null;
  setActiveRiddleCheckpoint: (cp: Checkpoint | null) => void;

  storeItems: StoreItem[];
  activities: ActivityRecord[];
  redeemedItemIds: string[];
  redeemStoreItem: (item: StoreItem) => boolean;
}

export const useEnigameStore = create<EnigameState>((set, get) => ({
  appStage: 'splash',
  setAppStage: (stage) => set({ appStage: stage }),
  language: 'en',
  setLanguage: (lang) => set({ language: lang }),
  userAccount: {
    name: 'Gabriel',
    email: 'Gabriel@gmail.com',
    agreedToPolicy: true,
  },
  setUserAccount: (acc) => set((state) => ({
    userAccount: { ...state.userAccount, ...acc },
    currentUser: acc.name ? { ...state.currentUser, name: acc.name } : state.currentUser,
  })),
  resetOnboarding: () => set({ appStage: 'splash' }),

  activeTab: 'home',
  setActiveTab: (tab) => set({ activeTab: tab }),
  meetupSubTab: 'explorers',
  setMeetupSubTab: (tab) => set({ meetupSubTab: tab }),

  // Routes Navigation Flow
  routesViewStep: 'select-city',
  setRoutesViewStep: (step) => set({ routesViewStep: step }),
  selectedCity: 'Bragança',
  setSelectedCity: (city) => set({ selectedCity: city }),
  selectedRoute: MOCK_ROUTES[0],
  routesReturnTab: 'routes',
  viewRouteDetail: (route, fromTab = 'routes') => set({
    selectedRoute: route,
    selectedRouteDetail: null,
    routesReturnTab: fromTab,
    routesViewStep: 'route-detail',
    activeTab: 'routes',
  }),

  currentUser: CURRENT_USER,
  points: 1000,
  updateProfile: (updated) => set((state) => ({
    currentUser: { ...state.currentUser, ...updated }
  })),
  addPoints: (amount, reason) => set((state) => ({
    points: state.points + amount,
    activities: [
      {
        id: 'act-' + Date.now(),
        title: reason,
        timestamp: 'Just now',
        pointsDelta: amount,
        type: amount > 0 ? 'bonus' : 'redeem',
      },
      ...state.activities,
    ]
  })),

  routes: MOCK_ROUTES,
  activeRouteId: 'route-braganca-medieval',
  setActiveRouteId: (id) => set({ activeRouteId: id }),
  completedCheckpointIds: ['cp-1'],
  completeCheckpoint: (checkpointId) => {
    const state = get();
    if (state.completedCheckpointIds.includes(checkpointId)) return;
    
    set((state) => ({
      completedCheckpointIds: [...state.completedCheckpointIds, checkpointId],
      points: state.points + 100,
      activities: [
        {
          id: 'act-' + Date.now(),
          title: 'Deciphered checkpoint puzzle!',
          timestamp: 'Just now',
          pointsDelta: 100,
          type: 'qr_scan',
        },
        ...state.activities,
      ]
    }));
  },

  expeditions: MOCK_EXPEDITIONS,
  joinExpedition: (expeditionId) => set((state) => {
    const exps = state.expeditions.map((exp) => {
      if (exp.id === expeditionId) {
        const isJoined = exp.participants.some(p => p.id === state.currentUser.id);
        if (isJoined) return exp;
        return {
          ...exp,
          participants: [...exp.participants, state.currentUser],
          status: exp.participants.length + 1 >= exp.maxParticipants ? ('filling' as const) : exp.status
        };
      }
      return exp;
    });
    return { expeditions: exps };
  }),
  createExpedition: (newExp) => set((state) => ({
    expeditions: [
      {
        ...newExp,
        id: 'exped-' + Date.now(),
        host: state.currentUser,
        participants: [state.currentUser],
        status: 'open',
      },
      ...state.expeditions,
    ]
  })),

  explorers: MOCK_EXPLORERS,
  selectedExplorer: null,
  setSelectedExplorer: (explorer) => set({ selectedExplorer: explorer }),

  isScannerOpen: false,
  setScannerOpen: (open) => set({ isScannerOpen: open }),
  selectedRouteDetail: null,
  setSelectedRouteDetail: (route) => set({ selectedRouteDetail: route, selectedRoute: route }),
  profileViewStep: 'profile',
  setProfileViewStep: (step) => set({ profileViewStep: step, isEditProfileOpen: step === 'edit-profile' }),
  isEditProfileOpen: false,
  setEditProfileOpen: (open) => set({ isEditProfileOpen: open, profileViewStep: open ? 'edit-profile' : 'profile' }),
  isSettingsOpen: false,
  setSettingsOpen: (open) => set({ isSettingsOpen: open }),
  isChangePasswordOpen: false,
  setChangePasswordOpen: (open) => set({ isChangePasswordOpen: open }),
  isChangeEmailOpen: false,
  setChangeEmailOpen: (open) => set({ isChangeEmailOpen: open }),
  isPurchaseHistoryOpen: false,
  setPurchaseHistoryOpen: (open) => set({ isPurchaseHistoryOpen: open }),
  isHostExpeditionOpen: false,
  setHostExpeditionOpen: (open) => set({ isHostExpeditionOpen: open }),
  activeRiddleCheckpoint: null,
  setActiveRiddleCheckpoint: (cp) => set({ activeRiddleCheckpoint: cp }),

  storeItems: MOCK_STORE_ITEMS,
  activities: MOCK_ACTIVITIES,
  redeemedItemIds: [],
  redeemStoreItem: (item) => {
    const state = get();
    if (state.points < item.costPoints) return false;
    
    set({
      points: state.points - item.costPoints,
      redeemedItemIds: [...state.redeemedItemIds, item.id],
      activities: [
        {
          id: 'act-' + Date.now(),
          title: 'Redeemed: ' + item.title,
          timestamp: 'Just now',
          pointsDelta: -item.costPoints,
          type: 'redeem',
        },
        ...state.activities,
      ]
    });
    return true;
  }
}));
