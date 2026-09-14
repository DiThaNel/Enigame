import { describe, it, expect, beforeEach } from 'vitest';
import { useEnigameStore } from '../src/store/useEnigameStore';

describe('useEnigameStore', () => {
  beforeEach(() => {
    // Reset points
    useEnigameStore.setState({
      points: 1000,
      completedCheckpointIds: ['cp-1'],
      activeTab: 'home',
      meetupSubTab: 'explorers',
      redeemedItemIds: [],
    });
  });

  it('initializes with default explorer profile', () => {
    const state = useEnigameStore.getState();
    expect(state.currentUser.name).toBe('Tiana Rosser');
    expect(state.currentUser.level).toBe(18);
    expect(state.points).toBe(1000);
  });

  it('switches main navigation tabs', () => {
    useEnigameStore.getState().setActiveTab('meetup');
    expect(useEnigameStore.getState().activeTab).toBe('meetup');

    useEnigameStore.getState().setActiveTab('profile');
    expect(useEnigameStore.getState().activeTab).toBe('profile');
  });

  it('completes checkpoint and awards points', () => {
    const initialPoints = useEnigameStore.getState().points;
    useEnigameStore.getState().completeCheckpoint('cp-2');

    const state = useEnigameStore.getState();
    expect(state.completedCheckpointIds).toContain('cp-2');
    expect(state.points).toBe(initialPoints + 100);
    expect(state.activities[0].type).toBe('qr_scan');
  });

  it('joins expedition and adds user to participant list', () => {
    const expId = 'exped-1';
    useEnigameStore.getState().joinExpedition(expId);

    const exped = useEnigameStore.getState().expeditions.find(e => e.id === expId);
    expect(exped?.participants.some(p => p.id === 'usr-current')).toBe(true);
  });

  it('redeems store items when sufficient points', () => {
    const item = useEnigameStore.getState().storeItems[0]; // 400 pts
    const success = useEnigameStore.getState().redeemStoreItem(item);

    expect(success).toBe(true);
    expect(useEnigameStore.getState().points).toBe(600);
    expect(useEnigameStore.getState().redeemedItemIds).toContain(item.id);
  });

  it('prevents store item redemption when insufficient points', () => {
    useEnigameStore.setState({ points: 50 });
    const expensiveItem = useEnigameStore.getState().storeItems[0]; // 400 pts
    const success = useEnigameStore.getState().redeemStoreItem(expensiveItem);

    expect(success).toBe(false);
    expect(useEnigameStore.getState().points).toBe(50);
  });

  it('updates profile info and persists in state', () => {
    useEnigameStore.getState().updateProfile({
      nickname: 'Valkyrie',
      bio: 'New adventure motto',
      city: 'Porto, Portugal'
    });

    const state = useEnigameStore.getState();
    expect(state.currentUser.nickname).toBe('Valkyrie');
    expect(state.currentUser.bio).toBe('New adventure motto');
    expect(state.currentUser.city).toBe('Porto, Portugal');
  });
});
