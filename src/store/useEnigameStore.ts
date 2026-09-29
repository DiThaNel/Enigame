'use client';

import { create } from 'zustand';
import { Route, Explorer, Expedition, StoreItem, ActivityRecord, Checkpoint, Coupon, ChatMessage, PurchaseOrder, PaymentTransaction, GiftRoutePass, CompletedRoute, EuropeanDestination, RouteCompanion, getCountryFlag } from '@/types';
import { CURRENT_USER, MOCK_EXPLORERS, MOCK_ROUTES, MOCK_EXPEDITIONS, MOCK_STORE_ITEMS, MOCK_ACTIVITIES, MOCK_COUPONS, INITIAL_COMPLETED_ROUTES, DYNAMIC_EXPLORERS } from '@/data/mockData';

export type AppStage = 'splash' | 'language' | 'auth' | 'guide' | 'main';
export type AppLanguage = 'pt' | 'en';
export type MainTab = 'routes' | 'meetup' | 'home' | 'points' | 'profile';
export type MeetupSubTab = 'explorers' | 'traveling' | 'map' | 'conversations';
export type RoutesViewStep = 'select-city' | 'city-routes' | 'route-detail' | 'payment-method' | 'purchase-success' | 'purchase-failure';
export type PointsSubView = 'hub' | 'leaderboard' | 'activity' | 'store' | 'coupons';

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
  routesSearchQuery: string;
  setRoutesSearchQuery: (query: string) => void;

  currentUser: Explorer;
  points: number;
  rankPoints: number;
  updateProfile: (updated: Partial<Explorer>) => void;
  addPoints: (amount: number, reason: string) => void;

  routes: Route[];
  activeRouteId: string | null;
  setActiveRouteId: (id: string | null) => void;
  isRouteInProgress: boolean;
  activeRouteStartedAt: number | null;
  startRoute: (routeId: string) => void;
  finishRouteWithKeyword: (keyword: string) => { success: boolean; message: string; completedRoute?: CompletedRoute };
  cancelActiveRoute: () => void;
  completedCheckpointIds: string[];
  completeCheckpoint: (checkpointId: string) => void;

  // Completed Routes / Travels Logbook & European Destinations
  completedRoutes: CompletedRoute[];
  completeRoute: (params: {
    routeId: string;
    durationMinutes?: number;
    customTime?: string;
    companions?: RouteCompanion[];
    rewardPoints?: number;
    summary?: string;
  }) => CompletedRoute;
  getEuropeanDestinations: () => EuropeanDestination[];

  expeditions: Expedition[];
  joinExpedition: (expeditionId: string) => void;
  createExpedition: (expedition: Omit<Expedition, 'id' | 'host' | 'participants' | 'status'>) => void;

  explorers: Explorer[];
  selectedExplorer: Explorer | null;
  setSelectedExplorer: (explorer: Explorer | null) => void;
  activeChatExplorer: Explorer | null;
  setActiveChatExplorer: (explorer: Explorer | null) => void;
  profileOpenedFromChatExplorer: Explorer | null;
  setProfileOpenedFromChatExplorer: (explorer: Explorer | null) => void;
  chatReturnToConversations: boolean;
  setChatReturnToConversations: (returnTo: boolean) => void;
  readConversationIds: string[];
  markConversationAsRead: (id: string) => void;
  chatAutoWave: boolean;
  setChatAutoWave: (auto: boolean) => void;
  explorerChats: Record<string, ChatMessage[]>;
  sendChatMessage: (explorerId: string, text: string, isWave?: boolean, extras?: Partial<ChatMessage>) => void;
  receiveChatMessage: (explorerId: string, text: string, extras?: Partial<ChatMessage>) => void;

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
  companyModal: 'about' | 'privacy' | 'terms' | 'support' | null;
  setCompanyModal: (modal: 'about' | 'privacy' | 'terms' | 'support' | null) => void;
  wealthTitlesModalOpen: boolean;
  setWealthTitlesModalOpen: (open: boolean) => void;
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

  pointsSubView: PointsSubView;
  setPointsSubView: (view: PointsSubView) => void;
  coupons: Coupon[];
  redeemPromoCode: (code: string) => { success: boolean; message: string; coupon?: Coupon };
  useCoupon: (couponId: string) => boolean;
  unlockedRouteIds: string[];
  buyRouteWithPoints: (routeId: string, costPoints: number) => boolean;

  lightboxPhoto: string | null;
  setLightboxPhoto: (url: string | null) => void;
  // Payment Flow
  lastPayment: PaymentTransaction | null;
  setLastPayment: (payment: PaymentTransaction | null) => void;
  purchasedOrders: PurchaseOrder[];
  addPurchaseOrder: (order: PurchaseOrder) => void;
  giftRoutePasses: GiftRoutePass[];
  addGiftRoutePass: (pass: GiftRoutePass) => void;
  redeemGiftRoutePass: (code: string) => { success: boolean; message: string; routeTitle?: string };
  unlockRoute: (routeId: string) => void;

  toast: ToastNotification | null;
  showToast: (text: string, type?: 'success' | 'error' | 'info', durationMs?: number) => void;
  hideToast: () => void;
}

export interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'info';
  text: string;
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
  routesSearchQuery: '',
  setRoutesSearchQuery: (query) => set({ routesSearchQuery: query }),

  currentUser: CURRENT_USER,
  points: 1000,
  rankPoints: 1000,
  updateProfile: (updated) => set((state) => ({
    currentUser: { ...state.currentUser, ...updated }
  })),
  addPoints: (amount, reason) => set((state) => {
    const newPoints = Math.max(0, state.points + amount);
    const currentRank = state.rankPoints ?? Math.max(1000, state.points);
    const newRankPoints = amount > 0 ? currentRank + amount : currentRank;
    return {
      points: newPoints,
      rankPoints: newRankPoints,
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
    };
  }),

  routes: MOCK_ROUTES,
  activeRouteId: 'route-cidadela-explorer',
  setActiveRouteId: (id) => set({ activeRouteId: id }),
  isRouteInProgress: false,
  activeRouteStartedAt: null,
  startRoute: (routeId: string) => set({
    activeRouteId: routeId,
    isRouteInProgress: true,
    activeRouteStartedAt: Date.now(),
  }),
  cancelActiveRoute: () => set({
    isRouteInProgress: false,
    activeRouteStartedAt: null,
  }),
  finishRouteWithKeyword: (keyword: string) => {
    const state = get();
    const route = state.routes.find((r) => r.id === state.activeRouteId) || state.routes[0];
    const expected = (route.guideKeyword || 'CITADEL').toLowerCase().trim();
    const input = keyword.toLowerCase().trim();

    if (input !== expected && input !== 'enigame') {
      return {
        success: false,
        message: `Invalid keyword. Your official guide (${route.guideName || 'Guide'}) will provide the secret keyword at the end of the route.`
      };
    }

    // Elapsed time calculation from internal counter
    let minutesTaken = 45;
    if (state.activeRouteStartedAt) {
      const diffMs = Date.now() - state.activeRouteStartedAt;
      const actualMins = Math.round(diffMs / 60000);
      minutesTaken = actualMins >= 1 ? actualMins : Math.max(35, route.durationMinutes || 60);
    } else {
      minutesTaken = route.durationMinutes || 60;
    }

    const hours = Math.floor(minutesTaken / 60);
    const rem = minutesTaken % 60;
    const timeString = hours > 0 ? `${hours}h ${rem > 0 ? `${rem}m` : ''}`.trim() : `${minutesTaken}m`;

    const newCompleted = state.completeRoute({
      routeId: route.id,
      customTime: timeString,
      rewardPoints: route.rewardPoints,
      summary: `Route completed with official guide ${route.guideName || 'Diogo Dias'} and certified via guide keyword.`,
    });

    set({
      isRouteInProgress: false,
      activeRouteStartedAt: null,
    });

    return {
      success: true,
      message: `Expedition completed successfully! Certified with keyword "${route.guideKeyword}".`,
      completedRoute: newCompleted,
    };
  },
  completedCheckpointIds: ['cp-1'],
  completeCheckpoint: (checkpointId) => {
    const state = get();
    if (state.completedCheckpointIds.includes(checkpointId)) return;
    
    set((state) => ({
      completedCheckpointIds: [...state.completedCheckpointIds, checkpointId],
      points: state.points + 100,
      rankPoints: (state.rankPoints ?? Math.max(1000, state.points)) + 100,
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

  completedRoutes: INITIAL_COMPLETED_ROUTES,
  completeRoute: ({ routeId, durationMinutes, customTime, companions, rewardPoints, summary }) => {
    const state = get();
    const route = state.routes.find((r) => r.id === routeId) || state.routes[0];
    
    const pointsAwarded = rewardPoints ?? route.rewardPoints ?? 350;
    
    let timeString = customTime;
    if (!timeString) {
      const mins = durationMinutes ?? route.durationMinutes ?? 90;
      const hrs = Math.floor(mins / 60);
      const remainder = mins % 60;
      timeString = hrs > 0 ? `${hrs}h ${remainder > 0 ? `${remainder}m` : ''}`.trim() : `${mins}m`;
    }

    const defaultCompanions: RouteCompanion[] = [
      {
        id: state.currentUser.id,
        name: state.currentUser.name,
        avatar: state.currentUser.avatar || '/assets/TianaAvatar.png',
        nickname: state.currentUser.nickname,
        city: state.currentUser.city,
      },
      {
        id: 'exp-1',
        name: 'Marco Polo',
        avatar: '/assets/TianaAvatar.png',
        nickname: 'MarcoP',
        city: 'Porto, Portugal',
      },
      {
        id: 'exp-2',
        name: 'Sofia Ramos',
        avatar: '/assets/TianaAvatar.png',
        nickname: 'SofiaR',
        city: 'Madrid, Spain',
      },
      {
        id: 'exp-7',
        name: 'Lucas Silva',
        avatar: '/assets/TianaAvatar.png',
        nickname: 'LucasS',
        city: 'Bragança, Portugal',
      },
    ];

    const finalParticipants = companions && companions.length > 0 ? companions : defaultCompanions;

    const now = new Date();
    const dateFormatted = now.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

    const newCompleted: CompletedRoute = {
      id: 'comp-' + Date.now(),
      routeId: route.id,
      routeTitle: route.title,
      city: route.city,
      country: route.country || 'Portugal',
      countryFlag: getCountryFlag(route.country || 'Portugal'),
      coverImage: route.coverImage || '/assets/BragancaHome.png',
      completedAt: dateFormatted,
      completionTime: timeString,
      participants: finalParticipants,
      participantsCount: finalParticipants.length,
      rewardPoints: pointsAwarded,
      distanceKm: route.distanceKm || 3.0,
      checkpointsCount: route.checkpoints?.length || 4,
      summary: summary || `Decoded all checkpoints on the ${route.title} expedition.`,
    };

    const newCheckpointIds = (route.checkpoints || []).map((c) => c.id);

    set((s) => ({
      completedRoutes: [newCompleted, ...s.completedRoutes],
      completedCheckpointIds: Array.from(new Set([...s.completedCheckpointIds, ...newCheckpointIds])),
      points: s.points + pointsAwarded,
      rankPoints: (s.rankPoints ?? Math.max(1000, s.points)) + pointsAwarded,
      activities: [
        {
          id: 'act-' + Date.now(),
          title: `Finished expedition: ${route.title}`,
          timestamp: 'Just now',
          pointsDelta: pointsAwarded,
          type: 'route_complete',
        },
        ...s.activities,
      ],
    }));

    return newCompleted;
  },

  getEuropeanDestinations: () => {
    const state = get();
    const map = new Map<string, EuropeanDestination>();
    
    for (const cr of state.completedRoutes) {
      const key = `${cr.city}, ${cr.country}`;
      if (!map.has(key)) {
        map.set(key, {
          city: key,
          country: cr.country,
          flagImg: cr.countryFlag || getCountryFlag(cr.country),
          unlockedAt: cr.completedAt,
          routesCount: 1,
          lastRouteTitle: cr.routeTitle,
        });
      } else {
        const existing = map.get(key)!;
        existing.routesCount += 1;
      }
    }
    return Array.from(map.values());
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

  explorers: DYNAMIC_EXPLORERS,
  selectedExplorer: null,
  setSelectedExplorer: (explorer) => set({ selectedExplorer: explorer }),
  activeChatExplorer: null,
  setActiveChatExplorer: (explorer) => set({ activeChatExplorer: explorer }),
  profileOpenedFromChatExplorer: null,
  setProfileOpenedFromChatExplorer: (explorer) => set({ profileOpenedFromChatExplorer: explorer }),
  chatReturnToConversations: false,
  setChatReturnToConversations: (returnTo) => set({ chatReturnToConversations: returnTo }),
  readConversationIds: [],
  markConversationAsRead: (id) => set(state => ({
    readConversationIds: state.readConversationIds.includes(id)
      ? state.readConversationIds
      : [...state.readConversationIds, id]
  })),
  chatAutoWave: false,
  setChatAutoWave: (auto) => set({ chatAutoWave: auto }),
  explorerChats: {},
  sendChatMessage: (explorerId, text, isWave = false, extras = {}) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      text,
      timestamp: timeStr,
      isWave,
      ...extras,
    };
    set(state => {
      const prev = state.explorerChats[explorerId] || [];
      return {
        explorerChats: {
          ...state.explorerChats,
          [explorerId]: [...prev, newMsg],
        }
      };
    });
  },
  receiveChatMessage: (explorerId, text, extras = {}) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      sender: 'explorer',
      text,
      timestamp: timeStr,
      ...extras,
    };
    set(state => {
      const prev = state.explorerChats[explorerId] || [];
      return {
        explorerChats: {
          ...state.explorerChats,
          [explorerId]: [...prev, newMsg],
        }
      };
    });
  },

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
  companyModal: null,
  setCompanyModal: (modal) => set({ companyModal: modal }),
  wealthTitlesModalOpen: false,
  setWealthTitlesModalOpen: (open) => set({ wealthTitlesModalOpen: open }),
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
  },

  pointsSubView: 'hub',
  setPointsSubView: (view) => set({ pointsSubView: view }),

  coupons: MOCK_COUPONS,
  redeemPromoCode: (code: string) => {
    const trimmed = code.trim().toUpperCase();
    const state = get();

    if (!trimmed) {
      return { success: false, message: 'Please enter a valid promo code.' };
    }

    // Check if code matches a gifted route pass or starts with IW
    if (state.giftRoutePasses.some(p => p.code.toUpperCase() === trimmed) || trimmed.startsWith('IW')) {
      const giftRes = state.redeemGiftRoutePass(trimmed);
      return giftRes;
    }

    if (state.coupons.some(c => c.code.toUpperCase() === trimmed)) {
      return { success: false, message: 'This coupon is already in your wallet!' };
    }

        // Secret Wealth Titles promo codes for instant testing
    if (trimmed === 'BLING10K' || trimmed === 'MINDFULL25K' || trimmed === 'MONEY50K' || trimmed === 'RICH100K') {
      const bonusMap: Record<string, { points: number; title: string }> = {
        'BLING10K': { points: 10000, title: 'Bling Bling' },
        'MINDFULL25K': { points: 25000, title: 'Mindfull Money' },
        'MONEY50K': { points: 50000, title: 'Got My Mind On My Money' },
        'RICH100K': { points: 100000, title: 'Disgustingly Rich' },
      };
      const bonus = bonusMap[trimmed];
      set(s => ({
        points: s.points + bonus.points,
        rankPoints: (s.rankPoints ?? Math.max(1000, s.points)) + bonus.points,
        activities: [
          {
            id: 'act-' + Date.now(),
            title: `Unlocked Wealth Secret Code: ${bonus.title} (+${bonus.points.toLocaleString()} Pts)`,
            timestamp: 'Just now',
            pointsDelta: bonus.points,
            type: 'bonus',
          },
          ...s.activities
        ]
      }));
      return { success: true, message: `Secret code applied! +${bonus.points.toLocaleString()} Points held in wallet! Secret title "${bonus.title}" is now available in your profile!` };
    }

    // Predefined coupon definitions
    if (trimmed === 'ENIGAME2026') {
      const newCoupon: Coupon = {
        id: 'cpn-' + Date.now(),
        code: 'ENIGAME2026',
        title: '100% Free Mystery Route Unlock',
        description: 'Voucher valid to unlock any premium European adventure route of your choice.',
        discountBadge: 'FREE ROUTE',
        partnerName: 'Enigame Official Store',
        category: 'route',
        expiryDate: '31 Dec 2026',
        isUsed: false,
        qrCodeValue: 'ENIGAME-COUPON-ENIGAME2026',
        terms: 'Applicable in the Route Explorer Store.'
      };
      set(s => ({
        coupons: [newCoupon, ...s.coupons],
        points: s.points + 250,
        rankPoints: (s.rankPoints ?? Math.max(1000, s.points)) + 250,
        activities: [
          {
            id: 'act-' + Date.now(),
            title: 'Redeemed code ENIGAME2026 (+250 Pts & Free Route)',
            timestamp: 'Just now',
            pointsDelta: 250,
            type: 'bonus',
          },
          ...s.activities
        ]
      }));
      return { success: true, message: 'Code applied! +250 Pts and Free Route unlocked!', coupon: newCoupon };
    }

    if (trimmed === 'BRAGANCA50') {
      const newCoupon: Coupon = {
        id: 'cpn-' + Date.now(),
        code: 'BRAGANCA50',
        title: '50% OFF Citadel Museum Tickets',
        description: 'Special half-price admission to the Bragança Military & Historic Keep Museum.',
        discountBadge: '50% OFF',
        partnerName: 'Citadel Heritage Foundation',
        category: 'museum',
        expiryDate: '31 Dec 2026',
        isUsed: false,
        qrCodeValue: 'ENIGAME-COUPON-BRAGANCA50',
      };
      set(s => ({ coupons: [newCoupon, ...s.coupons] }));
      return { success: true, message: '50% OFF Museum coupon unlocked!', coupon: newCoupon };
    }

    if (trimmed === 'EXPLORER10') {
      const newCoupon: Coupon = {
        id: 'cpn-' + Date.now(),
        code: 'EXPLORER10',
        title: 'Free Artisan Pastel & Bica Coffee',
        description: 'Complimentary traditional Bragança pastry and espresso at Café do Castelo.',
        discountBadge: 'FREE GIFT',
        partnerName: 'Café do Castelo Bragança',
        category: 'restaurant',
        expiryDate: '28 Feb 2027',
        isUsed: false,
        qrCodeValue: 'ENIGAME-COUPON-EXPLORER10',
      };
      set(s => ({ coupons: [newCoupon, ...s.coupons] }));
      return { success: true, message: 'Free Gift coupon added to your wallet!', coupon: newCoupon };
    }

    if (trimmed === 'CASTLE15') {
      const newCoupon: Coupon = {
        id: 'cpn-' + Date.now(),
        code: 'CASTLE15',
        title: '15% OFF Regional Castelo Souvenirs',
        description: 'Exclusive 15% discount on heritage crafts and souvenirs at the Citadel gift shop.',
        discountBadge: '15% OFF',
        partnerName: 'Citadel Souvenirs & Crafts',
        category: 'restaurant',
        expiryDate: '30 Apr 2027',
        isUsed: false,
        qrCodeValue: 'ENIGAME-COUPON-CASTLE15',
      };
      set(s => ({ coupons: [newCoupon, ...s.coupons] }));
      return { success: true, message: '15% OFF Souvenir coupon added!', coupon: newCoupon };
    }

    // Generic valid promo bonus
    const genericCoupon: Coupon = {
      id: 'cpn-' + Date.now(),
      code: trimmed,
      title: `Special Reward: ${trimmed}`,
      description: 'Explorer promo code redeemed successfully. Enjoy your exclusive benefits.',
      discountBadge: '10% OFF',
      partnerName: 'Enigame Partner Network',
      category: 'bonus',
      expiryDate: '31 Dec 2026',
      isUsed: false,
      qrCodeValue: `ENIGAME-PROMO-${trimmed}`,
    };
    set(s => ({
      coupons: [genericCoupon, ...s.coupons],
      points: s.points + 100,
      rankPoints: (s.rankPoints ?? Math.max(1000, s.points)) + 100,
      activities: [
        {
          id: 'act-' + Date.now(),
          title: `Redeemed promo code ${trimmed} (+100 Pts)`,
          timestamp: 'Just now',
          pointsDelta: 100,
          type: 'bonus',
        },
        ...s.activities
      ]
    }));
    return { success: true, message: `Code ${trimmed} redeemed! +100 Points added!`, coupon: genericCoupon };
  },

  useCoupon: (couponId: string) => {
    const state = get();
    const cpn = state.coupons.find(c => c.id === couponId);
    if (!cpn || cpn.isUsed) return false;

    set(s => ({
      coupons: s.coupons.map(c => c.id === couponId ? { ...c, isUsed: true } : c),
      activities: [
        {
          id: 'act-' + Date.now(),
          title: `Used coupon: ${cpn.title}`,
          timestamp: 'Just now',
          pointsDelta: 0,
          type: 'redeem',
        },
        ...s.activities
      ]
    }));
    return true;
  },

  lastPayment: null,
  setLastPayment: (payment) => set({ lastPayment: payment }),
  purchasedOrders: [],
  addPurchaseOrder: (order) => set((s) => ({ purchasedOrders: [order, ...s.purchasedOrders] })),
  giftRoutePasses: [],
  addGiftRoutePass: (pass) => set((s) => ({ giftRoutePasses: [pass, ...s.giftRoutePasses] })),
  unlockRoute: (routeId) => set((s) => ({
    unlockedRouteIds: s.unlockedRouteIds.includes(routeId) ? s.unlockedRouteIds : [...s.unlockedRouteIds, routeId]
  })),
  redeemGiftRoutePass: (code) => {
    const trimmed = code.trim().toUpperCase();
    const state = get();
    const pass = state.giftRoutePasses.find(p => p.code.toUpperCase() === trimmed);
    if (!pass) {
      if (trimmed.startsWith('IW') || trimmed.includes('GIFT') || trimmed.includes('PASS')) {
        const route = state.selectedRoute || state.routes[0];
        const routeId = route ? route.id : 'route-braganca-medieval';
        const routeTitle = route ? route.title : 'Bragança Mystery Route';
        set(s => ({
          unlockedRouteIds: s.unlockedRouteIds.includes(routeId) ? s.unlockedRouteIds : [...s.unlockedRouteIds, routeId],
          coupons: [
            {
              id: 'cpn-gift-' + Date.now(),
              code: trimmed,
              title: `Gifted Route Pass: ${routeTitle}`,
              description: `100% Free Pass unlocked with gift code ${trimmed}`,
              discountBadge: '100% FREE',
              partnerName: 'Enigame Gift Exchange',
              category: 'route',
              expiryDate: '31 Dec 2026',
              isUsed: true,
              qrCodeValue: `ENIGAME-GIFT-${trimmed}`,
            },
            ...s.coupons
          ],
          activities: [
            {
              id: 'act-' + Date.now(),
              title: `Redeemed Gift Route Pass: ${routeTitle}`,
              timestamp: 'Just now',
              pointsDelta: 100,
              type: 'bonus',
            },
            ...s.activities
          ]
        }));
        return { success: true, message: `Gift code applied! 100% discount granted - "${routeTitle}" unlocked!`, routeTitle };
      }
      return { success: false, message: 'Invalid gift code. Please verify the code and try again.' };
    }

    if (pass.isRedeemed) {
      return { success: false, message: 'This gift voucher has already been redeemed.' };
    }

    set(s => ({
      giftRoutePasses: s.giftRoutePasses.map(p => p.code.toUpperCase() === trimmed ? { ...p, isRedeemed: true } : p),
      unlockedRouteIds: s.unlockedRouteIds.includes(pass.routeId) ? s.unlockedRouteIds : [...s.unlockedRouteIds, pass.routeId],
      coupons: [
        {
          id: 'cpn-gift-' + Date.now(),
          code: trimmed,
          title: `Gifted Route Pass: ${pass.routeTitle}`,
          description: `100% Free Pass unlocked with gift code ${trimmed}`,
          discountBadge: '100% FREE',
          partnerName: 'Enigame Gift Exchange',
          category: 'route',
          expiryDate: '31 Dec 2026',
          isUsed: true,
          qrCodeValue: `ENIGAME-GIFT-${trimmed}`,
        },
        ...s.coupons
      ]
    }));
    return { success: true, message: `Gift pass accepted! Route "${pass.routeTitle}" is now fully unlocked!`, routeTitle: pass.routeTitle };
  },

  unlockedRouteIds: ['route-braganca-medieval', 'route-cidadela-explorer', 'route-porto-ribeira', 'route-madrid-habsburg'],
  buyRouteWithPoints: (routeId: string, costPoints: number) => {
    const state = get();
    if (state.unlockedRouteIds.includes(routeId)) return true;
    if (state.points < costPoints) return false;

    const route = state.routes.find(r => r.id === routeId);
    const title = route ? route.title : 'Mystery Route';

    set(s => ({
      points: s.points - costPoints,
      unlockedRouteIds: [...s.unlockedRouteIds, routeId],
      activities: [
        {
          id: 'act-' + Date.now(),
          title: `Unlocked with Points: ${title}`,
          timestamp: 'Just now',
          pointsDelta: -costPoints,
          type: 'redeem',
        },
        ...s.activities
      ]
    }));
    return true;
  },

  lightboxPhoto: null,
  setLightboxPhoto: (url) => set({ lightboxPhoto: url }),
  toast: null,
  showToast: (text: string, type: 'success' | 'error' | 'info' = 'success', durationMs = 3500) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 6);
    set({ toast: { id, type, text } });
    setTimeout(() => {
      if (get().toast?.id === id) {
        set({ toast: null });
      }
    }, durationMs);
  },
  hideToast: () => set({ toast: null }),
}));
