import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import React from 'react';
import { MobileAppShell } from '../src/components/layout/MobileAppShell';
import { useEnigameStore } from '../src/store/useEnigameStore';

describe('Enigame MobileAppShell Navigation & Routes Flow', () => {
  beforeEach(() => {
    useEnigameStore.setState({
      appStage: 'main',
      activeTab: 'home',
      routesViewStep: 'select-city',
      selectedCity: 'Bragança',
      meetupSubTab: 'explorers',
      isScannerOpen: false,
    });
  });

  it('renders home dashboard with search bar and quick action pills', () => {
    render(<MobileAppShell />);
    expect(screen.getByPlaceholderText(/What are you looking for/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Discover!' })).toBeInTheDocument();
  });

  it('navigates directly to Route Detail page when clicking Discover! on Home carousel', () => {
    render(<MobileAppShell />);
    const discoverBtn = screen.getByRole('button', { name: 'Discover!' });
    fireEvent.click(discoverBtn);

    // Should now be on full Route Detail page (07.3)
    expect(screen.getByText(/Bragança Medieval Mystery/i)).toBeInTheDocument();
    expect(screen.getByText(/Difficulty/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Checkout/i })).toBeInTheDocument();
  });

  it('navigates to Routes catalog and progresses from Select City to City Selected to Route Detail', () => {
    render(<MobileAppShell />);
    const nav = screen.getByRole('navigation', { name: 'Main Navigation' });
    const routesTabBtn = within(nav).getByRole('button', { name: 'Routes' });
    fireEvent.click(routesTabBtn);

    // Step 1: 07 - Routes (Select City)
    expect(screen.getByText('Bragança, Portugal')).toBeInTheDocument();
    const selectCityBtn = screen.getByRole('button', { name: 'Select City' });
    fireEvent.click(selectCityBtn);

    // Step 2: 07.2 - Routes (City Selected)
    expect(screen.getByText('Tech Route')).toBeInTheDocument();
    expect(screen.getByText(/The Skeletons of Bragança: Uncovering a Mystery/i)).toBeInTheDocument();

    // Step 3: Click a route card to view full Route Detail page (07.3)
    const routeCard = screen.getByText(/The Skeletons of Bragança: Uncovering a Mystery/i);
    fireEvent.click(routeCard);

    expect(screen.getByRole('button', { name: /Checkout/i })).toBeInTheDocument();
  });

  it('navigates to Meet-up and renders sub-tabs', () => {
    render(<MobileAppShell />);
    const nav = screen.getByRole('navigation', { name: 'Main Navigation' });
    const meetupTabBtn = within(nav).getByRole('button', { name: 'Meet-up' });
    fireEvent.click(meetupTabBtn);

    expect(screen.getByText('Explorers')).toBeInTheDocument();
    expect(screen.getByText('Traveling')).toBeInTheDocument();
    expect(screen.getByText('Map')).toBeInTheDocument();
  });

  it('switches to Traveling tab in Meet-up and displays Host button', () => {
    useEnigameStore.setState({ appStage: 'main', activeTab: 'meetup', meetupSubTab: 'traveling' });
    render(<MobileAppShell />);

    expect(screen.getByText('Host an Expedition')).toBeInTheDocument();
  });

  it('switches to Map radar tab and displays radar controls', () => {
    useEnigameStore.setState({ appStage: 'main', activeTab: 'meetup', meetupSubTab: 'map' });
    render(<MobileAppShell />);

    expect(screen.getByText('Scan QR Clue')).toBeInTheDocument();
    expect(screen.getByText('Team Up')).toBeInTheDocument();
  });

  it('navigates to Profile view and shows explorer profile', () => {
    render(<MobileAppShell />);
    const nav = screen.getByRole('navigation', { name: 'Main Navigation' });
    const profileTabBtn = within(nav).getByRole('button', { name: 'Profile' });
    fireEvent.click(profileTabBtn);

    expect(screen.getByText('Tiana Rosser')).toBeInTheDocument();
    expect(screen.getByText('Edit Profile')).toBeInTheDocument();
  });

  it('opens and closes QR code scanner HUD', () => {
    render(<MobileAppShell />);
    const qrBtn = screen.getByRole('button', { name: 'QR Code' });
    fireEvent.click(qrBtn);

    expect(screen.getByText('Scan Clue Marker')).toBeInTheDocument();
    expect(screen.getByLabelText('Close Scanner')).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText('Close Scanner'));
    expect(screen.queryByText('Scan Clue Marker')).not.toBeInTheDocument();
  });
});
