'use client';

import React, { useState, useRef } from 'react';
import { useEnigameStore } from '@/store/useEnigameStore';
import { PaymentTransaction, PurchaseOrder, GiftRoutePass } from '@/types';
import {
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Lock,
  Check,
  CreditCard,
  User,
  Gift,
  AlertCircle,
  Sparkles,
  Info,
  CheckCircle2,
  XCircle,
  Loader2,
  Coins,
  Smartphone
} from 'lucide-react';

export const PaymentMethodView: React.FC = () => {
  const {
    selectedRoute,
    routes,
    setRoutesViewStep,
    currentUser,
    points,
    addPoints,
    unlockRoute,
    addPurchaseOrder,
    addGiftRoutePass,
    setLastPayment,
    showToast,
    lastPayment
  } = useEnigameStore();

  const activeRoute = selectedRoute || routes[0];

  // Purchase Type: 'me' (Solo para mí) vs 'gift' (Para regalar a amigos)
  const [purchaseType, setPurchaseType] = useState<'me' | 'gift'>(
    lastPayment?.isGift ? 'gift' : 'me'
  );
  const [giftQuantity, setGiftQuantity] = useState<number>(
    lastPayment?.giftQuantity || 1
  );

  // Points Discount Dropdown ('Points to use' matching Figma 07.4)
  // 1000 pts = -20€, 2500 pts = -30€
  const [pointsToUse, setPointsToUse] = useState<number>(
    lastPayment?.pointsUsed || 0
  );

  // Selected Payment Method: 'mastercard' | 'visa' | 'paypal' | 'mb' | 'amex' | 'applepay' | 'googlepay'
  const [selectedMethod, setSelectedMethod] = useState<'mastercard' | 'visa' | 'paypal' | 'mb' | 'amex' | 'applepay' | 'googlepay'>('mastercard');

  // Horizontal Drag Ref & Handlers for Payment Methods
  const methodsTrackRef = useRef<HTMLDivElement>(null);
  const isDraggingMethods = useRef(false);
  const startXMethods = useRef(0);
  const scrollLeftMethods = useRef(0);

  const onMethodsMouseDown = (e: React.MouseEvent) => {
    if (!methodsTrackRef.current) return;
    isDraggingMethods.current = true;
    startXMethods.current = e.pageX - methodsTrackRef.current.offsetLeft;
    scrollLeftMethods.current = methodsTrackRef.current.scrollLeft;
  };

  const onMethodsMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingMethods.current || !methodsTrackRef.current) return;
    e.preventDefault();
    const x = e.pageX - methodsTrackRef.current.offsetLeft;
    const walk = (x - startXMethods.current) * 1.5;
    methodsTrackRef.current.scrollLeft = scrollLeftMethods.current - walk;
  };

  const onMethodsMouseUp = () => {
    isDraggingMethods.current = false;
  };

  const scrollMethods = (direction: 'left' | 'right') => {
    if (!methodsTrackRef.current) return;
    const delta = direction === 'left' ? -150 : 150;
    methodsTrackRef.current.scrollBy({ left: delta, behavior: 'smooth' });
  };

  // Card Form Fields (Figma 07.4)
  const [cardholderName, setCardholderName] = useState(
    lastPayment?.cardholderName || currentUser.name || 'Tiana Rosser'
  );
  const [cardNumber, setCardNumber] = useState(
    lastPayment?.cardLast4 ? `4532 8921 7392 ${lastPayment.cardLast4}` : '4532 8921 7392 3947'
  );
  const [expMonth, setExpMonth] = useState('12');
  const [expYear, setExpYear] = useState('2026');
  const [cvc, setCvc] = useState(lastPayment?.status === 'failure' ? '' : '123');

  // Simulation Mode switcher: 'success' | 'failure' (allows easy testing of both 07.6 and 07.7)
  const [simulationMode, setSimulationMode] = useState<'success' | 'failure'>('success');

  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [showTermsModal, setShowTermsModal] = useState(false);

  // Calculations
  const unitPrice = activeRoute?.price || 30;
  const quantity = purchaseType === 'gift' ? giftQuantity : 1;
  const subtotal = unitPrice * quantity;

  // Points discount calculation:
  // 1000 pts = -20€, 2500 pts = -30€
  // 500 pts = -10€, 250 pts = -5€
  let calculatedDiscount = 0;
  if (pointsToUse >= 2500) {
    calculatedDiscount = 30;
  } else if (pointsToUse >= 1000) {
    calculatedDiscount = 20;
  } else if (pointsToUse >= 500) {
    calculatedDiscount = 10;
  } else if (pointsToUse >= 250) {
    calculatedDiscount = 5;
  }
  const discountFromPoints = Math.min(subtotal, calculatedDiscount);
  const finalTotal = Math.max(0, subtotal - discountFromPoints);

  // Format card number with spaces
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '').substring(0, 16);
    let formatted = val.match(/.{1,4}/g)?.join(' ') || val;
    setCardNumber(formatted);
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!cardholderName.trim()) {
      errors.cardholderName = 'Cardholder name is required.';
    }
    const cleanCard = cardNumber.replace(/\s/g, '');
    if (cleanCard.length < 15) {
      errors.cardNumber = 'Please enter a valid card number.';
    }
    if (!cvc || cvc.length < 3) {
      errors.cvc = 'CVC must be 3 or 4 digits.';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      showToast('Please check your card details.', 'error');
      return;
    }

    setIsProcessing(true);
    setProcessingStep('Encrypting payment credentials (256-bit SSL)...');

    const isTestEnv = typeof process !== 'undefined' && process.env.NODE_ENV === 'test';

    setTimeout(() => {
      setProcessingStep('Contacting banking network & verifying CVV...');
    }, isTestEnv ? 10 : 600);

    setTimeout(() => {
      setProcessingStep('Finalizing transaction authorization...');
    }, isTestEnv ? 20 : 1100);

    setTimeout(() => {
      setIsProcessing(false);

      // Trigger failure if simulation mode is failure OR if CVC is '000' OR card ends in '0000'
      const cleanCard = cardNumber.replace(/\s/g, '');
      const shouldFail =
        simulationMode === 'failure' ||
        cvc === '000' ||
        cleanCard.endsWith('0000');

      const cardLast4 = cleanCard.slice(-4) || '3947';
      const orderNumber = '№' + Math.floor(10000000 + Math.random() * 90000000);
      const isGift = purchaseType === 'gift';

      if (shouldFail) {
        const failureTx: PaymentTransaction = {
          orderNumber,
          routeId: activeRoute.id,
          routeTitle: activeRoute.title,
          city: activeRoute.city,
          coverImage: activeRoute.coverImage,
          isGift,
          giftQuantity: quantity,
          giftCodes: [],
          pricePerUnit: unitPrice,
          subtotal,
          pointsUsed: pointsToUse,
          discountFromPoints,
          totalAmount: finalTotal,
          cardholderName,
          cardLast4,
          paymentMethod: 'card',
          timestamp: new Date().toLocaleString(),
          status: 'failure',
          failureReason:
            cvc === '000'
              ? 'Security Code (CVV) verification rejected by bank.'
              : 'Transaction declined by card issuer: Insufficient test funds or restricted online sandbox card.',
        };
        setLastPayment(failureTx);
        setRoutesViewStep('purchase-failure');
      } else {
        // Success flow: Generate Gift Codes if gift
        const generatedCodes: string[] = [];
        if (isGift) {
          for (let i = 0; i < quantity; i++) {
            const randSuffix = Math.floor(100000 + Math.random() * 900000);
            const cityPrefix = activeRoute.city.substring(0, 4).toUpperCase();
            const code = `IW-${cityPrefix}-${randSuffix}`;
            generatedCodes.push(code);

            const pass: GiftRoutePass = {
              code,
              routeId: activeRoute.id,
              routeTitle: activeRoute.title,
              dateCreated: new Date().toISOString(),
              isRedeemed: false,
            };
            addGiftRoutePass(pass);
          }
        } else {
          // Unlock for current user
          unlockRoute(activeRoute.id);
        }

        // Deduct points if used
        if (pointsToUse > 0) {
          addPoints(-pointsToUse, `Points discount applied to ${activeRoute.title}`);
        }

        // Create transaction record
        const successTx: PaymentTransaction = {
          orderNumber,
          routeId: activeRoute.id,
          routeTitle: activeRoute.title,
          city: activeRoute.city,
          coverImage: activeRoute.coverImage,
          isGift,
          giftQuantity: quantity,
          giftCodes: generatedCodes,
          pricePerUnit: unitPrice,
          subtotal,
          pointsUsed: pointsToUse,
          discountFromPoints,
          totalAmount: finalTotal,
          cardholderName,
          cardLast4,
          paymentMethod: 'card',
          timestamp: new Date().toLocaleString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
          }),
          status: 'success',
        };

        // Create Order for Purchase History (07.8)
        const newOrder: PurchaseOrder = {
          id: 'ord-' + Date.now(),
          orderNumber,
          type: isGift ? 'gift' : 'completed',
          date: successTx.timestamp,
          productCodes: isGift ? generatedCodes : [`EN-${activeRoute.id.toUpperCase()}-PASS`],
          valueOfItems: `${finalTotal}€`,
          quantity,
          items: [
            {
              title: `${activeRoute.title}${isGift ? ` (x${quantity} Gift Pass)` : ' (Full Pass)'}`,
              category: isGift ? 'Gift Voucher' : 'Route Pass',
              price: `${finalTotal}€`,
            },
          ],
          routeId: activeRoute.id,
          paymentMethod: `MasterCard •••• ${cardLast4}`,
        };

        addPurchaseOrder(newOrder);
        setLastPayment(successTx);
        setRoutesViewStep('purchase-success');
      }
    }, isTestEnv ? 30 : 1500);
  };

  return (
    <div className="w-full min-h-screen pb-28 bg-[#F4F6FC] flex flex-col relative select-none animate-fadeIn">
      {/* 1. CURVED BLUE HEADER WITH DASHED TRAILS ("fondo azul con trazos") */}
      <div className="relative bg-[#8E97FD] rounded-b-[38px] pt-7 pb-6 px-5 text-white shadow-md shrink-0 z-20 overflow-hidden">

        <div className="relative z-10 flex items-center justify-between mb-1">
          <button
            onClick={() => setRoutesViewStep('route-detail')}
            className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all cursor-pointer active:scale-95"
            title="Back to Route Details"
            aria-label="Back to Route Details"
          >
            <ChevronLeft size={22} />
          </button>
          <h1 className="text-base font-bold text-white tracking-wide drop-shadow-xs">
            Payment Method
          </h1>
          <div className="w-9 flex items-center justify-end">
            <ShieldCheck size={20} className="text-white/80" />
          </div>
        </div>

        <div className="relative z-10 text-center mt-1">
          <p className="text-xs text-white/90 font-medium">
            Enter your payment details
          </p>
          <p className="text-[11px] text-white/70 mt-0.5">
            By continuing you agree to our{' '}
            <button
              type="button"
              onClick={() => setShowTermsModal(true)}
              className="text-white font-bold underline hover:text-white/90 cursor-pointer"
            >
              Terms
            </button>
          </p>
        </div>
      </div>

      <div className="px-5 pt-4 pb-6 flex flex-col gap-4">
        {/* 2. PURCHASE TYPE SELECTOR (Solo para mí vs Para regalar a amigos) */}
        <div className="bg-white rounded-2xl p-3.5 border border-[#EAEFFE] shadow-xs flex flex-col gap-3">
          <span className="text-[11px] font-bold text-[#8E90B0] uppercase tracking-wider">
            Purchase Type
          </span>

          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => setPurchaseType('me')}
              className={`p-3 rounded-xl border text-left transition-all flex flex-col gap-1.5 cursor-pointer active:scale-[0.98] ${
                purchaseType === 'me'
                  ? 'border-[#6979F8] bg-[#F7F8FE] ring-2 ring-[#6979F8]/20 shadow-xs'
                  : 'border-[#EAEFFE] hover:border-[#6979F8]/40 bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="w-7 h-7 rounded-lg bg-[#8E97FD]/15 flex items-center justify-center text-[#6979F8]">
                  <User size={15} />
                </div>
                {purchaseType === 'me' && (
                  <div className="w-4 h-4 rounded-full bg-[#6979F8] flex items-center justify-center text-white">
                    <Check size={10} strokeWidth={3} />
                  </div>
                )}
              </div>
              <span className="text-xs font-bold text-[#1E1F3D]">
                For Me
              </span>
              <span className="text-[10px] text-[#8E90B0] leading-tight">
                Unlock route directly for your account
              </span>
            </button>

            <button
              type="button"
              onClick={() => setPurchaseType('gift')}
              className={`p-3 rounded-xl border text-left transition-all flex flex-col gap-1.5 cursor-pointer active:scale-[0.98] ${
                purchaseType === 'gift'
                  ? 'border-[#6979F8] bg-[#F7F8FE] ring-2 ring-[#6979F8]/20 shadow-xs'
                  : 'border-[#EAEFFE] hover:border-[#6979F8]/40 bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="w-7 h-7 rounded-lg bg-[#FFB800]/15 flex items-center justify-center text-[#FFB800]">
                  <Gift size={15} />
                </div>
                {purchaseType === 'gift' && (
                  <div className="w-4 h-4 rounded-full bg-[#6979F8] flex items-center justify-center text-white">
                    <Check size={10} strokeWidth={3} />
                  </div>
                )}
              </div>
              <span className="text-xs font-bold text-[#1E1F3D]">
                Gift to Friends
              </span>
              <span className="text-[10px] text-[#8E90B0] leading-tight">
                Generates redeemable coupon codes
              </span>
            </button>
          </div>

          {/* When buying for a friend: Quantity Stepper (1 to 5) as in Figma 07.5 */}
          {purchaseType === 'gift' && (
            <div className="pt-2 border-t border-[#EEF0FA] flex flex-col gap-2 animate-fadeIn">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#1E1F3D]">
                  Number of Friends (Vouchers):
                </span>
                <span className="text-xs font-bold text-[#6979F8] bg-[#8E97FD]/15 px-2.5 py-0.5 rounded-full">
                  {giftQuantity} {giftQuantity === 1 ? 'Friend' : 'Friends'}
                </span>
              </div>

              {/* Stepper pills 1 to 5 */}
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => setGiftQuantity(q)}
                    className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      giftQuantity === q
                        ? 'bg-[#6979F8] text-white shadow-xs scale-105'
                        : 'bg-[#F4F6FB] text-[#8E90B0] hover:bg-[#EAEFFE]'
                    }`}
                  >
                    {q}
                  </button>
                ))}
              </div>

              <div className="p-2.5 rounded-xl bg-[#FFF9E6] border border-[#FFE799] flex items-start gap-2 mt-1">
                <Sparkles size={14} className="text-[#FFB800] shrink-0 mt-0.5" />
                <p className="text-[11px] text-[#8C6D00] leading-snug">
                  You will receive <span className="font-bold">{giftQuantity} unique gift code{giftQuantity > 1 ? 's' : ''}</span>. Your friends can redeem them in the <span className="font-bold">Coupons</span> tab or route checkout for 100% free access!
                </p>
              </div>
            </div>
          )}
        </div>

        {/* 3. ROUTE SUMMARY & POINTS DISCOUNT (1000 pts = -20€, 2500 pts = -30€) */}
        <div className="bg-white rounded-2xl p-4 border border-[#EAEFFE] shadow-xs flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <img
              src={activeRoute.coverImage || '/assets/BragancaHome.png'}
              alt={activeRoute.title}
              className="w-14 h-14 rounded-xl object-cover shrink-0 border border-[#EEF0FA]"
            />
            <div className="flex-1 min-w-0">
              <h3 className="text-xs font-bold text-[#1E1F3D] truncate">
                {activeRoute.title}
              </h3>
              <p className="text-[11px] text-[#8E90B0] mt-0.5">
                {activeRoute.city}, Portugal • {activeRoute.durationMinutes} min
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs font-black text-[#6979F8]">
                  {unitPrice}€ {quantity > 1 ? `× ${quantity}` : ''}
                </span>
                {quantity > 1 && (
                  <span className="text-[10px] text-[#8E90B0]">
                    (Subtotal: {subtotal}€)
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Points to use dropdown (Figma 07.4) with 1000 = -20€ and 2500 = -30€ */}
          <div className="pt-3 border-t border-[#EEF0FA] flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#1E1F3D] flex items-center gap-1.5">
                <Coins size={14} className="text-[#FFB800]" />
                <span>Points to use</span>
              </label>
              <span className="text-[10px] font-bold text-[#8E90B0]">
                Balance: {points.toLocaleString()} Pts
              </span>
            </div>

            <select
              value={pointsToUse}
              onChange={(e) => setPointsToUse(Number(e.target.value))}
              className="w-full h-10 px-3 rounded-xl border border-[#EAEFFE] bg-[#F4F6FB] text-xs font-bold text-[#1E1F3D] focus:outline-none focus:ring-2 focus:ring-[#6979F8]/30 cursor-pointer"
            >
              <option value={0}>0 Points — No discount (0.00€)</option>
              <option value={250}>250 Points — Save 5.00€</option>
              <option value={500}>500 Points — Save 10.00€</option>
              <option value={1000}>1000 Points — Save 20.00€</option>
              <option value={2500}>2500 Points — Save 30.00€</option>
            </select>
            <p className="text-[10px] text-[#8E90B0] italic">
              you can use points to get a discount on your purchase.
            </p>
          </div>

          {/* Final price line */}
          <div className="pt-2.5 border-t border-[#EEF0FA] flex items-center justify-between">
            <span className="text-xs font-bold text-[#8E90B0]">Total to pay:</span>
            <div className="flex items-baseline gap-1.5">
              {discountFromPoints > 0 && (
                <span className="text-xs text-[#8E90B0] line-through">
                  {subtotal}€
                </span>
              )}
              <span className="text-lg font-black text-[#1E1F3D]">
                {finalTotal}€
              </span>
            </div>
          </div>
        </div>

        {/* 4. PAYMENT METHODS ROW WITH SMOOTH HORIZONTAL SCROLLING & ARROWS */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between px-0.5">
            <span className="text-[11px] font-bold text-[#8E90B0] uppercase tracking-wider">
              Select Payment Method
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => scrollMethods('left')}
                className="w-6 h-6 rounded-full bg-white border border-[#EAEFFE] flex items-center justify-center text-[#8E90B0] hover:text-[#1E1F3D] hover:border-[#6979F8]/40 shadow-xs cursor-pointer active:scale-95"
                title="Scroll left"
                aria-label="Scroll payment methods left"
              >
                <ChevronLeft size={14} />
              </button>
              <button
                type="button"
                onClick={() => scrollMethods('right')}
                className="w-6 h-6 rounded-full bg-white border border-[#EAEFFE] flex items-center justify-center text-[#8E90B0] hover:text-[#1E1F3D] hover:border-[#6979F8]/40 shadow-xs cursor-pointer active:scale-95"
                title="Scroll right"
                aria-label="Scroll payment methods right"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>

          {/* Scrollable Container with drag, wheel & touch support */}
          <div
            ref={methodsTrackRef}
            onMouseDown={onMethodsMouseDown}
            onMouseMove={onMethodsMouseMove}
            onMouseUp={onMethodsMouseUp}
            onMouseLeave={onMethodsMouseUp}
            onWheel={(e) => {
              if (methodsTrackRef.current && e.deltaY !== 0) {
                methodsTrackRef.current.scrollLeft += e.deltaY;
              }
            }}
            className="w-full flex items-center gap-2.5 overflow-x-auto no-scrollbar pb-2 pt-0.5 px-0.5 touch-pan-x scroll-smooth cursor-grab active:cursor-grabbing select-none"
          >
            {/* MasterCard */}
            <button
              type="button"
              onClick={() => setSelectedMethod('mastercard')}
              className={`px-3.5 py-2.5 rounded-2xl border flex items-center gap-2 shrink-0 min-w-[130px] transition-all cursor-pointer relative ${
                selectedMethod === 'mastercard'
                  ? 'border-[#6979F8] bg-[#F7F8FE] shadow-xs ring-2 ring-[#6979F8]/20'
                  : 'border-[#EAEFFE] bg-white hover:border-[#6979F8]/40'
              }`}
            >
              <div className="flex items-center">
                <span className="w-4 h-4 rounded-full bg-[#EB001B] inline-block" />
                <span className="w-4 h-4 rounded-full bg-[#F79E1B] -ml-2 inline-block opacity-90" />
              </div>
              <span className="text-xs font-bold text-[#1E1F3D]">MasterCard</span>
              {selectedMethod === 'mastercard' && (
                <div className="w-4 h-4 rounded-full bg-[#22C55E] flex items-center justify-center text-white ml-auto">
                  <Check size={10} strokeWidth={3} />
                </div>
              )}
            </button>

            {/* VISA */}
            <button
              type="button"
              onClick={() => setSelectedMethod('visa')}
              className={`px-3.5 py-2.5 rounded-2xl border flex items-center gap-2 shrink-0 min-w-[130px] transition-all cursor-pointer relative ${
                selectedMethod === 'visa'
                  ? 'border-[#6979F8] bg-[#F7F8FE] shadow-xs ring-2 ring-[#6979F8]/20'
                  : 'border-[#EAEFFE] bg-white hover:border-[#6979F8]/40'
              }`}
            >
              <span className="text-xs font-black italic text-[#1A1F71] tracking-tighter">VISA</span>
              {selectedMethod === 'visa' && (
                <div className="w-4 h-4 rounded-full bg-[#22C55E] flex items-center justify-center text-white ml-auto">
                  <Check size={10} strokeWidth={3} />
                </div>
              )}
            </button>

            {/* PayPal */}
            <button
              type="button"
              onClick={() => setSelectedMethod('paypal')}
              className={`px-3.5 py-2.5 rounded-2xl border flex items-center gap-2 shrink-0 min-w-[130px] transition-all cursor-pointer relative ${
                selectedMethod === 'paypal'
                  ? 'border-[#6979F8] bg-[#F7F8FE] shadow-xs ring-2 ring-[#6979F8]/20'
                  : 'border-[#EAEFFE] bg-white hover:border-[#6979F8]/40'
              }`}
            >
              <span className="text-xs font-bold text-[#003087]">PayPal</span>
              {selectedMethod === 'paypal' && (
                <div className="w-4 h-4 rounded-full bg-[#22C55E] flex items-center justify-center text-white ml-auto">
                  <Check size={10} strokeWidth={3} />
                </div>
              )}
            </button>

            {/* Multibanco (MB) */}
            <button
              type="button"
              onClick={() => setSelectedMethod('mb')}
              className={`px-3.5 py-2.5 rounded-2xl border flex items-center gap-2 shrink-0 min-w-[130px] transition-all cursor-pointer relative ${
                selectedMethod === 'mb'
                  ? 'border-[#6979F8] bg-[#F7F8FE] shadow-xs ring-2 ring-[#6979F8]/20'
                  : 'border-[#EAEFFE] bg-white hover:border-[#6979F8]/40'
              }`}
            >
              <span className="text-xs font-black text-[#E65100]">MB</span>
              <span className="text-xs font-bold text-[#1E1F3D]">Multibanco</span>
              {selectedMethod === 'mb' && (
                <div className="w-4 h-4 rounded-full bg-[#22C55E] flex items-center justify-center text-white ml-auto">
                  <Check size={10} strokeWidth={3} />
                </div>
              )}
            </button>

            {/* AMEX */}
            <button
              type="button"
              onClick={() => setSelectedMethod('amex')}
              className={`px-3.5 py-2.5 rounded-2xl border flex items-center gap-2 shrink-0 min-w-[130px] transition-all cursor-pointer relative ${
                selectedMethod === 'amex'
                  ? 'border-[#6979F8] bg-[#F7F8FE] shadow-xs ring-2 ring-[#6979F8]/20'
                  : 'border-[#EAEFFE] bg-white hover:border-[#6979F8]/40'
              }`}
            >
              <span className="text-xs font-bold text-[#0070BA]">AMEX</span>
              {selectedMethod === 'amex' && (
                <div className="w-4 h-4 rounded-full bg-[#22C55E] flex items-center justify-center text-white ml-auto">
                  <Check size={10} strokeWidth={3} />
                </div>
              )}
            </button>

            {/* Apple Pay */}
            <button
              type="button"
              onClick={() => setSelectedMethod('applepay')}
              className={`px-3.5 py-2.5 rounded-2xl border flex items-center gap-2 shrink-0 min-w-[130px] transition-all cursor-pointer relative ${
                selectedMethod === 'applepay'
                  ? 'border-[#6979F8] bg-[#F7F8FE] shadow-xs ring-2 ring-[#6979F8]/20'
                  : 'border-[#EAEFFE] bg-white hover:border-[#6979F8]/40'
              }`}
            >
              <Smartphone size={14} className="text-[#1E1F3D]" />
              <span className="text-xs font-bold text-[#1E1F3D]">Apple Pay</span>
              {selectedMethod === 'applepay' && (
                <div className="w-4 h-4 rounded-full bg-[#22C55E] flex items-center justify-center text-white ml-auto">
                  <Check size={10} strokeWidth={3} />
                </div>
              )}
            </button>

            {/* Google Pay */}
            <button
              type="button"
              onClick={() => setSelectedMethod('googlepay')}
              className={`px-3.5 py-2.5 rounded-2xl border flex items-center gap-2 shrink-0 min-w-[130px] transition-all cursor-pointer relative ${
                selectedMethod === 'googlepay'
                  ? 'border-[#6979F8] bg-[#F7F8FE] shadow-xs ring-2 ring-[#6979F8]/20'
                  : 'border-[#EAEFFE] bg-white hover:border-[#6979F8]/40'
              }`}
            >
              <CreditCard size={14} className="text-[#4285F4]" />
              <span className="text-xs font-bold text-[#1E1F3D]">GPay</span>
              {selectedMethod === 'googlepay' && (
                <div className="w-4 h-4 rounded-full bg-[#22C55E] flex items-center justify-center text-white ml-auto">
                  <Check size={10} strokeWidth={3} />
                </div>
              )}
            </button>
          </div>
        </div>

        {/* 5. CREDIT CARD FORM (Figma 07.4) */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-4 border border-[#EAEFFE] shadow-xs flex flex-col gap-3.5">
          {/* Cardholder name */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-[#1E1F3D]">
              Cardholder name
            </label>
            <input
              type="text"
              value={cardholderName}
              onChange={(e) => setCardholderName(e.target.value)}
              placeholder="e.g. Tiana Rosser"
              className={`w-full h-11 px-3.5 rounded-xl border bg-[#F8F9FE] text-xs font-bold text-[#1E1F3D] placeholder-[#A5A7C4] focus:outline-none focus:bg-white transition-all ${
                formErrors.cardholderName ? 'border-red-400 focus:ring-2 focus:ring-red-200' : 'border-[#EAEFFE] focus:border-[#6979F8]'
              }`}
            />
            {formErrors.cardholderName && (
              <span className="text-[10px] text-red-500 font-semibold">{formErrors.cardholderName}</span>
            )}
          </div>

          {/* Card Number */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-[#1E1F3D]">
              Card Number
            </label>
            <div className="relative">
              <input
                type="text"
                value={cardNumber}
                onChange={handleCardNumberChange}
                placeholder="4532 8921 7392 3947"
                maxLength={19}
                className={`w-full h-11 pl-3.5 pr-12 rounded-xl border bg-[#F8F9FE] text-xs font-mono font-bold text-[#1E1F3D] placeholder-[#A5A7C4] focus:outline-none focus:bg-white transition-all ${
                  formErrors.cardNumber ? 'border-red-400 focus:ring-2 focus:ring-red-200' : 'border-[#EAEFFE] focus:border-[#6979F8]'
                }`}
              />
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center">
                <div className="flex items-center">
                  <span className="w-3.5 h-3.5 rounded-full bg-[#EB001B] inline-block" />
                  <span className="w-3.5 h-3.5 rounded-full bg-[#F79E1B] -ml-1.5 inline-block opacity-90" />
                </div>
              </div>
            </div>
            {formErrors.cardNumber && (
              <span className="text-[10px] text-red-500 font-semibold">{formErrors.cardNumber}</span>
            )}
          </div>

          {/* 2-Column: Exp Month & Exp Year */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-[#1E1F3D]">
                Exp Month
              </label>
              <select
                value={expMonth}
                onChange={(e) => setExpMonth(e.target.value)}
                className="w-full h-11 px-3 rounded-xl border border-[#EAEFFE] bg-[#F8F9FE] text-xs font-bold text-[#1E1F3D] focus:outline-none focus:border-[#6979F8] focus:bg-white cursor-pointer"
              >
                {Array.from({ length: 12 }, (_, i) => {
                  const m = String(i + 1).padStart(2, '0');
                  return (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-[#1E1F3D]">
                Exp Year
              </label>
              <select
                value={expYear}
                onChange={(e) => setExpYear(e.target.value)}
                className="w-full h-11 px-3 rounded-xl border border-[#EAEFFE] bg-[#F8F9FE] text-xs font-bold text-[#1E1F3D] focus:outline-none focus:border-[#6979F8] focus:bg-white cursor-pointer"
              >
                {Array.from({ length: 10 }, (_, i) => {
                  const y = String(2024 + i);
                  return (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          {/* CVC (Figma 07.4) */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-[#1E1F3D] flex items-center gap-1">
              <Lock size={12} className="text-[#8E90B0]" />
              <span>CVC</span>
            </label>
            <input
              type="password"
              value={cvc}
              onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').substring(0, 4))}
              placeholder="123"
              maxLength={4}
              className={`w-32 h-11 px-3.5 rounded-xl border bg-[#F8F9FE] text-xs font-mono font-bold text-[#1E1F3D] placeholder-[#A5A7C4] focus:outline-none focus:bg-white transition-all ${
                formErrors.cvc ? 'border-red-400 focus:ring-2 focus:ring-red-200' : 'border-[#EAEFFE] focus:border-[#6979F8]'
              }`}
            />
            <p className="text-[10px] text-[#8E90B0] italic mt-0.5">
              3 or 4 digits usually found on the signature strip
            </p>
            {formErrors.cvc && (
              <span className="text-[10px] text-red-500 font-semibold">{formErrors.cvc}</span>
            )}
          </div>

          {/* SIMULATION TEST CONTROLLER (Allows user to test Approved vs Declined) */}
          <div className="mt-1 p-2.5 rounded-xl bg-[#F0F2FA] border border-[#E0E4F5] flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#585A7E] uppercase tracking-wider flex items-center gap-1">
                <ShieldCheck size={12} className="text-[#6979F8]" />
                <span>Simulated Sandbox Test Mode:</span>
              </span>
              <span className="text-[10px] font-semibold text-[#8E90B0]">
                Toggle Outcome
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setSimulationMode('success')}
                className={`py-1.5 px-2 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                  simulationMode === 'success'
                    ? 'bg-[#22C55E] text-white shadow-xs'
                    : 'bg-white text-[#585A7E] border border-[#E0E4F5]'
                }`}
              >
                <CheckCircle2 size={12} />
                <span>Simulate: Success (07.6)</span>
              </button>

              <button
                type="button"
                onClick={() => setSimulationMode('failure')}
                className={`py-1.5 px-2 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                  simulationMode === 'failure'
                    ? 'bg-[#EF4444] text-white shadow-xs'
                    : 'bg-white text-[#585A7E] border border-[#E0E4F5]'
                }`}
              >
                <XCircle size={12} />
                <span>Simulate: Decline (07.7)</span>
              </button>
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={isProcessing}
            className="w-full h-12 mt-1 rounded-2xl bg-[#8E97FD] hover:bg-[#7C82ED] text-white font-bold text-sm tracking-wide shadow-md shadow-indigo-400/30 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {isProcessing ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Processing Payment...</span>
              </>
            ) : (
              <span>Add Now • Pay {finalTotal}€</span>
            )}
          </button>
        </form>

        {/* Security badge at bottom */}
        <div className="flex items-center justify-center gap-2 text-[#8E90B0] text-[11px] py-1">
          <ShieldCheck size={14} className="text-[#22C55E]" />
          <span>256-Bit SSL Encrypted • PCI-DSS Certified Simulated Processing</span>
        </div>
      </div>

      {/* Processing Modal Overlay */}
      {isProcessing && (
        <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center p-6 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 shadow-2xl flex flex-col items-center text-center max-w-[300px] border border-white/40 animate-popIn">
            <div className="w-14 h-14 rounded-full bg-[#8E97FD]/15 flex items-center justify-center text-[#6979F8] mb-3">
              <Loader2 size={28} className="animate-spin" />
            </div>
            <h4 className="text-sm font-bold text-[#1E1F3D]">
              Securing Transaction
            </h4>
            <p className="text-xs text-[#8E90B0] mt-1.5 leading-snug animate-pulse">
              {processingStep}
            </p>
          </div>
        </div>
      )}

      {/* Terms Modal */}
      {showTermsModal && (
        <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 shadow-2xl max-w-sm w-full flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#1E1F3D]">Enigame Payment Terms</h3>
              <button
                onClick={() => setShowTermsModal(false)}
                className="w-7 h-7 rounded-full bg-[#F4F6FB] flex items-center justify-center text-[#8E90B0]"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-[#585A7E] leading-relaxed">
              All transactions in this demo application are simulated with test tokens. Unlocked routes grant unlimited access to riddles and geolocation markers. Gift codes never expire and can be redeemed in the Coupons section.
            </p>
            <button
              onClick={() => setShowTermsModal(false)}
              className="w-full py-2.5 rounded-xl bg-[#8E97FD] text-white text-xs font-bold mt-2"
            >
              I Understand
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
