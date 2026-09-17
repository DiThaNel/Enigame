export type RouteDifficulty = 1 | 2 | 3 | 4; // 1: Easy, 2: Medium, 3: Hard, 4: Explorer
export type Difficulty = 'Easy' | 'Medium' | 'Hard' | 'Explorer' | RouteDifficulty;

export const DIFFICULTY_LABELS: Record<RouteDifficulty, string> = {
  1: 'Easy',
  2: 'Medium',
  3: 'Hard',
  4: 'Explorer',
};

export type RouteCategory = 'experiences' | 'adventure' | 'tour';

export interface Checkpoint {
  id: string;
  order: number;
  name: string;
  landmark: string;
  riddle: string;
  qrToken: string;
  hint: string;
  distanceMeters?: number;
  isCompleted?: boolean;
}

export interface Route {
  id: string;
  title: string;
  city: string;
  country: string;
  coverImage: string;
  difficulty: RouteDifficulty;
  culture: 1 | 2 | 3;
  price: number;
  distanceKm: number;
  durationMinutes: number;
  rewardPoints: number;
  category: RouteCategory;
  isPromoted?: boolean;
  checkpoints: Checkpoint[];
  description: string;
}

export interface Explorer {
  id: string;
  name: string;
  nickname: string;
  avatar: string;
  level: number;
  rankTitle: string;
  bio: string;
  city: string;
  gender: string;
  ageGroup: string;
  instagram?: string;
  distanceMeters?: number;
  isOnline?: boolean;
  badges: string[];
}

export interface Expedition {
  id: string;
  title: string;
  routeId: string;
  coverImage: string;
  date: string;
  time: string;
  difficulty: Difficulty;
  distanceKm: number;
  rewardPoints: number;
  host: Explorer;
  participants: Explorer[];
  maxParticipants: number;
  status: 'open' | 'filling' | 'in_progress';
}

export interface StoreItem {
  id: string;
  title: string;
  description: string;
  category: 'coupon' | 'pass' | 'gear' | 'badge';
  costPoints: number;
  discountText: string;
  iconName: string;
}

export interface ActivityRecord {
  id: string;
  title: string;
  timestamp: string;
  pointsDelta: number;
  type: 'route_complete' | 'qr_scan' | 'bonus' | 'redeem';
}

export interface Coupon {
  id: string;
  code: string;
  title: string;
  description: string;
  discountBadge: string;
  partnerName: string;
  category: 'restaurant' | 'museum' | 'route' | 'bonus';
  expiryDate: string;
  isUsed: boolean;
  qrCodeValue: string;
  terms?: string;
}

export interface LeaderboardUser {
  rank: number;
  id: string;
  name: string;
  title: string;
  city: string;
  avatar: string;
  points: number;
  level: number;
  country: string;
  flagUrl: string;
  badgeUrl?: string;
  isCurrentUser?: boolean;
}
