import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { MobileAppShell } from '../src/components/layout/MobileAppShell';
import { useEnigameStore } from '../src/store/useEnigameStore';
import { MOCK_ROUTES } from '../src/data/mockData';

describe('Enigame Payment Gateway & Checkout Flow (07.4, 07.6, 07.7)', () => {
  beforeEach(() => {
    useEnigameStore.setState({
      appStage: 'main',
      activeTab: 'routes',
      routesViewStep: 'route-detail',
      selectedRoute: MOCK_ROUTES[0],
      points: 1000,
      unlockedRouteIds: [],
      purchasedOrders: [],
      giftRoutePasses: [],
      lastPayment: null,
      isPurchaseHistoryOpen: false,
      isScannerOpen: false,
    });
  });

  it('navigates from Route Detail Checkout to 07.4 Payment Method', () => {
    render(<MobileAppShell />);

    // Click Checkout
    const checkoutBtn = screen.getByRole('button', { name: /Checkout/i });
    fireEvent.click(checkoutBtn);

    // Should now be on 07.4 Payment Method
    expect(screen.getByText('Payment Method')).toBeInTheDocument();
    expect(screen.getByText(/Enter your payment details/i)).toBeInTheDocument();
    expect(screen.getByText('For Me')).toBeInTheDocument();
    expect(screen.getByText('Gift to Friends')).toBeInTheDocument();
    expect(screen.getByText('Cardholder name')).toBeInTheDocument();
    expect(screen.getByText('Card Number')).toBeInTheDocument();
  });

  it('supports selecting Gift to Friends and selecting number of vouchers', () => {
    useEnigameStore.setState({ routesViewStep: 'payment-method' });
    render(<MobileAppShell />);

    const giftBtn = screen.getByText('Gift to Friends');
    fireEvent.click(giftBtn);

    // Shows friends voucher counter
    expect(screen.getByText(/Number of Friends/i)).toBeInTheDocument();
    // Click 3 friends
    const threeBtn = screen.getByRole('button', { name: '3' });
    fireEvent.click(threeBtn);

    expect(screen.getByText('3 Friends')).toBeInTheDocument();
  });

  it('simulates successful payment and navigates to 07.6 Purchase Success with gift codes', async () => {
    useEnigameStore.setState({ routesViewStep: 'payment-method' });
    render(<MobileAppShell />);

    // Select Gift
    fireEvent.click(screen.getByText('Gift to Friends'));

    // Submit payment
    const payBtn = screen.getByRole('button', { name: /Add Now • Pay/i });
    fireEvent.click(payBtn);

    // Wait for processing to complete
    await waitFor(() => {
      expect(screen.getByText('Congrats!')).toBeInTheDocument();
    }, { timeout: 2000 });

    expect(screen.getByText(/Your purchase was placed successfully!/i)).toBeInTheDocument();
    expect(screen.getByText(/Gift Voucher Codes/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Continue Exploring/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Details/i })).toBeInTheDocument();
  });

  it('simulates payment failure and allows Review Payment to return to 07.4', async () => {
    useEnigameStore.setState({ routesViewStep: 'payment-method' });
    render(<MobileAppShell />);

    // Switch simulation mode to failure
    const failToggle = screen.getByRole('button', { name: /Simulate: Decline/i });
    fireEvent.click(failToggle);

    // Submit payment
    const payBtn = screen.getByRole('button', { name: /Add Now • Pay/i });
    fireEvent.click(payBtn);

    // Wait for processing to complete
    await waitFor(() => {
      expect(screen.getByText('Payment Failed!')).toBeInTheDocument();
    }, { timeout: 2000 });

    expect(screen.getByText(/Card Declined by Bank/i)).toBeInTheDocument();

    // Click Review Payment to retry
    const reviewBtn = screen.getByRole('button', { name: /Review Payment/i });
    fireEvent.click(reviewBtn);

    // Returns to 07.4 Payment Method
    expect(screen.getByText('Payment Method')).toBeInTheDocument();
    expect(screen.getByText(/Enter your payment details/i)).toBeInTheDocument();
  });

  it('redeems gifted code in Coupons and unlocks route', () => {
    const passCode = 'IW-BRAG-778899';
    useEnigameStore.getState().addGiftRoutePass({
      code: passCode,
      routeId: 'route-braganca-medieval',
      routeTitle: 'The Skeletons of Bragança: Uncovering a Mystery',
      dateCreated: new Date().toISOString(),
      isRedeemed: false,
    });

    // Redeem promo code
    const res = useEnigameStore.getState().redeemPromoCode(passCode);
    expect(res.success).toBe(true);
    expect(useEnigameStore.getState().unlockedRouteIds).toContain('route-braganca-medieval');
  });
});
