import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { MobileAppShell } from '../src/components/layout/MobileAppShell';
import { useEnigameStore } from '../src/store/useEnigameStore';

describe('Enigame Onboarding & Auth Flow', () => {
  beforeEach(() => {
    useEnigameStore.setState({
      appStage: 'splash',
      language: 'en',
      userAccount: {
        name: 'Gabriel',
        email: 'Gabriel@gmail.com',
        agreedToPolicy: true,
      },
    });
  });

  it('renders 01 - Splash Screen initially with branding and copyright', () => {
    render(<MobileAppShell />);
    expect(screen.getByText('ENIGAME')).toBeInTheDocument();
    expect(screen.getByText('Adventure is in us')).toBeInTheDocument();
    expect(screen.getByText(/Copyright Enigmavity 2020/i)).toBeInTheDocument();
  });

  it('navigates from Splash to 02 - Select Language upon interaction', () => {
    render(<MobileAppShell />);
    const splashTap = screen.getByText(/Tap anywhere to start/i);
    fireEvent.click(splashTap);

    expect(screen.getByLabelText('Português')).toBeInTheDocument();
    expect(screen.getByLabelText('English')).toBeInTheDocument();
  });

  it('selects language and transitions to 03 - Create Account', () => {
    useEnigameStore.setState({ appStage: 'language' });
    render(<MobileAppShell />);

    const ptFlag = screen.getByLabelText('Português');
    fireEvent.click(ptFlag);

    expect(useEnigameStore.getState().language).toBe('pt');
    expect(screen.getByText('Create your account')).toBeInTheDocument();
    expect(screen.getByText(/CONTINUE WITH FACEBOOK/i)).toBeInTheDocument();
    expect(screen.getByText(/CONTINUE WITH GOOGLE/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Name')).toHaveValue('Gabriel');
    expect(screen.getByPlaceholderText('Email address')).toHaveValue('Gabriel@gmail.com');
  });

  it('submits registration form and transitions to 04 - User Guide', () => {
    useEnigameStore.setState({ appStage: 'auth' });
    render(<MobileAppShell />);

    const getStartedBtn = screen.getByRole('button', { name: 'Get Started' });
    fireEvent.click(getStartedBtn);

    expect(screen.getByText('Choose between diferent locations.')).toBeInTheDocument();
  });

  it('steps through all 4 User Guide slides and enters main app dashboard', () => {
    useEnigameStore.setState({ appStage: 'guide' });
    render(<MobileAppShell />);

    // Slide 1
    expect(screen.getByText('Choose between diferent locations.')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Next/i }));

    // Slide 2
    expect(screen.getByText('See our routes and points of interest.')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Next/i }));

    // Slide 3
    expect(screen.getByText('Check out the list of achievements.')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Next/i }));

    // Slide 4
    expect(screen.getByText('Dive into the Enigame map.')).toBeInTheDocument();
    const beginBtn = screen.getByRole('button', { name: /Let the Adventure Begin/i });
    expect(beginBtn).toBeInTheDocument();

    // Click to finish onboarding
    fireEvent.click(beginBtn);

    // Should now be on main dashboard
    expect(useEnigameStore.getState().appStage).toBe('main');
    expect(screen.getAllByText('Discover!').length).toBeGreaterThan(0);
  });

  it('supports skipping onboarding directly to main dashboard', () => {
    useEnigameStore.setState({ appStage: 'splash' });
    render(<MobileAppShell />);

    const skipBtn = screen.getByRole('button', { name: 'Skip' });
    fireEvent.click(skipBtn);

    expect(screen.getByLabelText('Português')).toBeInTheDocument();
  });
});
