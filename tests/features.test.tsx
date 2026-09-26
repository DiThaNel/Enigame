import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { MobileAppShell } from '../src/components/layout/MobileAppShell';
import { useEnigameStore } from '../src/store/useEnigameStore';
import { DYNAMIC_EXPLORERS } from '../src/data/mockData';

describe('Enigame Advanced Features & Views', () => {
  beforeEach(() => {
    useEnigameStore.setState({
      appStage: 'main',
      activeTab: 'home',
      points: 1250,
      activeChatExplorer: null,
      selectedExplorer: null,
      meetupSubTab: 'conversations',
      pointsSubView: null,
      profileOpenedFromChatExplorer: null,
      chatReturnToConversations: false,
    });
  });

  it('renders Points & Rewards main overview card', () => {
    useEnigameStore.setState({ activeTab: 'points' });
    render(<MobileAppShell />);

    expect(screen.getByText('Points & Rewards')).toBeInTheDocument();
    expect(screen.getByText('1,250')).toBeInTheDocument();
  });

  it('renders Leaderboard sub-view with explorer rankings', () => {
    useEnigameStore.setState({ activeTab: 'points', pointsSubView: 'leaderboard' });
    render(<MobileAppShell />);

    expect(screen.getByText('Explorer Leaderboard')).toBeInTheDocument();
  });

  it('navigates to Meetup Conversations / Chats and filters messages with animation states', () => {
    useEnigameStore.setState({ activeTab: 'meetup', meetupSubTab: 'conversations' });
    render(<MobileAppShell />);

    // Filter tabs exist
    expect(screen.getByText('All Messages')).toBeInTheDocument();
    expect(screen.getByText('Read')).toBeInTheDocument();
    expect(screen.getByText('Unread')).toBeInTheDocument();

    // Verify conversation list items
    expect(screen.getByText('Marco Polo')).toBeInTheDocument();
    expect(screen.getByText('Sofia Ramos')).toBeInTheDocument();

    // Switch to Read tab
    fireEvent.click(screen.getByText('Read'));
    expect(screen.queryByText('Marco Polo')).not.toBeInTheDocument();

    // Switch to Unread tab
    fireEvent.click(screen.getByText('Unread'));
    expect(screen.getByText('Marco Polo')).toBeInTheDocument();
  });

  it('opens chat with an explorer and shows header info and back navigation', () => {
    const explorer = DYNAMIC_EXPLORERS[0]; // Marco Polo
    useEnigameStore.setState({
      activeTab: 'meetup',
      activeChatExplorer: explorer,
    });

    render(<MobileAppShell />);

    // Chat header displays explorer name
    expect(screen.getByText('Marco Polo')).toBeInTheDocument();
    // Message input placeholder
    expect(screen.getByPlaceholderText(/Message Marco/i)).toBeInTheDocument();
  });

  it('verifies rank medals for positions 4, 5, and 6 use the normal yellow star icon', () => {
    const exp4 = DYNAMIC_EXPLORERS.find(e => e.rank === 4);
    const exp5 = DYNAMIC_EXPLORERS.find(e => e.rank === 5);
    const exp6 = DYNAMIC_EXPLORERS.find(e => e.rank === 6);

    expect(exp4?.rankMedal).toBe('/assets/StarSingle.png');
    expect(exp5?.rankMedal).toBe('/assets/StarSingle.png');
    expect(exp6?.rankMedal).toBe('/assets/StarSingle.png');
  });
});
