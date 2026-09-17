'use client';

import React, { useState } from 'react';
import { useEnigameStore } from '@/store/useEnigameStore';
import { ChevronLeft, ChevronRight, Check, X, Receipt, ShieldCheck } from 'lucide-react';

interface PurchaseOrder {
  id: string;
  orderNumber: string;
  type: 'gift' | 'completed';
  date: string;
  productCodes: string[];
  valueOfItems: string;
  quantity: number;
  items: Array<{ title: string; category: string; price: string }>;
}

export const PurchaseHistoryModal: React.FC = () => {
  const { isPurchaseHistoryOpen, setPurchaseHistoryOpen, redeemedItemIds, storeItems } = useEnigameStore();
  const [selectedOrder, setSelectedOrder] = useState<PurchaseOrder | null>(null);

  if (!isPurchaseHistoryOpen) return null;

  // Base mock orders matching Figma Frame 07.8 - Purchase History
  const defaultOrders: PurchaseOrder[] = [
    {
      id: 'ord-1',
      orderNumber: '№64913158',
      type: 'gift',
      date: 'December 13, 2024 5:08 PM',
      productCodes: ['IW34841831846'],
      valueOfItems: '$30',
      quantity: 1,
      items: [
        { title: 'Bragança Medieval Citadel Pass', category: 'City Pass', price: '$30' }
      ]
    },
    {
      id: 'ord-2',
      orderNumber: '№1947034',
      type: 'completed',
      date: 'December 16, 2024 8:46 PM',
      productCodes: ['IW3475453457', 'IW3475453458', 'IW3475453459', 'IW3475453460', 'IW3475453461'],
      valueOfItems: '$150',
      quantity: 5,
      items: [
        { title: 'Douro Valley Explorer Bundle', category: 'Expedition Pass', price: '$45' },
        { title: 'Castelo de Bragança Audio Guide', category: 'Audio Experience', price: '$25' },
        { title: 'Artisan Pastelaria Voucher (x2)', category: 'Coupon', price: '$30' },
        { title: 'Citadel Quest Master Token', category: 'Digital Asset', price: '$50' }
      ]
    }
  ];

  // If user redeemed store items, add dynamic order at top
  const redeemedOrders: PurchaseOrder[] = redeemedItemIds.length > 0 ? [{
    id: 'ord-store-redeemed',
    orderNumber: '№' + Math.floor(10000000 + Math.random() * 90000000),
    type: 'completed',
    date: 'Recent Store Redemption',
    productCodes: redeemedItemIds.map((id, idx) => `EN-${id.toUpperCase()}-${100 + idx}`),
    valueOfItems: `${redeemedItemIds.length * 250} Pts`,
    quantity: redeemedItemIds.length,
    items: redeemedItemIds.map(id => {
      const item = storeItems.find(s => s.id === id);
      return {
        title: item?.title || 'Enigame Store Reward',
        category: item?.category?.toUpperCase() || 'REWARD',
        price: `${item?.costPoints || 250} pts`
      };
    })
  }] : [];

  const allOrders = [...redeemedOrders, ...defaultOrders];

  return (
    <div className="absolute inset-0 z-50 bg-[#F4F6FC] flex flex-col animate-modal-screen overflow-hidden">
      {/* Top Curved Wave Header matching Figma 07.8 */}
      <div className="relative w-full bg-[#8E97FD] rounded-b-[36px] pt-8 pb-5 px-6 flex items-center justify-between text-white shadow-xs shrink-0">
        <button
          onClick={() => setPurchaseHistoryOpen(false)}
          className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors cursor-pointer"
          title="Back"
        >
          <ChevronLeft size={22} />
        </button>
        <h1 className="text-base font-bold tracking-wide">Purchase History</h1>
        <div className="w-9" />
      </div>

      {/* Orders List matching Figma Frame 07.8 - Purchase History */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 no-scrollbar">
        {allOrders.map((order, idx) => (
          <div
            key={order.id}
            style={{ animationDelay: `${(idx % 6) * 60}ms` }}
            className="animate-card-stagger bg-white rounded-[24px] p-5 shadow-[0_8px_25px_rgba(142,151,253,0.12)] border border-[#EAEFFE] flex flex-col gap-3 transition-all hover:shadow-md"
          >
            {/* Status and Date */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Check
                  size={14}
                  className={order.type === 'gift' ? 'text-[#3E8BFF] stroke-[3]' : 'text-[#00B894] stroke-[3]'}
                />
                <span
                  className={`text-xs font-black tracking-wider uppercase font-semibold ${
                    order.type === 'gift' ? 'text-[#3E8BFF]' : 'text-[#00B894]'
                  }`}
                >
                  {order.type}
                </span>
              </div>
              <span className="text-[11px] font-medium text-[#7A7C99]">
                {order.date}
              </span>
            </div>

            {/* Order Number & Product Codes */}
            <div>
              <h3 className="text-lg font-black text-[#1E1F3D] tracking-tight font-semibold">
                Order {order.orderNumber}
              </h3>
              <div className="mt-1">
                <span className="text-xs font-semibold text-[#7A7C99] block mb-1">
                  {order.productCodes.length > 1 ? 'Product Codes:' : 'Product Code:'}
                </span>
                <div className="flex flex-wrap gap-x-3 gap-y-1">
                  {order.productCodes.map((code, idx) => (
                    <span
                      key={idx}
                      className="text-xs font-black text-[#4E75FF] font-mono tracking-wider hover:underline cursor-pointer"
                    >
                      {code}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Thin Divider */}
            <div className="w-full h-px bg-[#EEF0FA] my-0.5" />

            {/* Value of Items & Quantity Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#A5A7C4] block">
                  VALUE OF ITEMS
                </span>
                <span className="text-sm font-black text-[#4E75FF] mt-0.5 block font-semibold">
                  {order.valueOfItems}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#A5A7C4] block">
                  QUANTITY
                </span>
                <span className="text-sm font-black text-[#4E75FF] mt-0.5 block font-semibold">
                  {order.quantity}
                </span>
              </div>
            </div>

            {/* Action Button: Details > matching Figma */}
            <button
              onClick={() => setSelectedOrder(order)}
              className="w-full h-11 rounded-2xl bg-[#8E97FD] hover:bg-[#7B85F8] text-white text-xs font-extrabold flex items-center justify-between px-5 shadow-sm active:scale-[0.98] transition-all cursor-pointer mt-1"
            >
              <span className="mx-auto pl-4">Details</span>
              <ChevronRight size={16} />
            </button>
          </div>
        ))}
      </div>

      {/* Order Details Modal Drawer */}
      {selectedOrder && (
        <div className="absolute inset-0 z-60 flex items-end justify-center bg-black/60 backdrop-blur-xs p-3 animate-fadeIn">
          <div className="w-full bg-white rounded-[32px] p-6 shadow-2xl flex flex-col gap-4 animate-slideUp">
            <div className="flex items-center justify-between border-b border-[#EEF0FA] pb-3">
              <div className="flex items-center gap-2">
                <Receipt className="text-[#8E97FD]" size={20} />
                <h3 className="font-semibold text-[#1E1F3D] text-sm">Receipt {selectedOrder.orderNumber}</h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-8 h-8 rounded-full bg-[#F4F6FB] flex items-center justify-center text-[#7A7C99] hover:text-[#1E1F3D] cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-xs">
                <span className="text-[#7A7C99]">Date &amp; Time</span>
                <span className="font-semibold text-[#1E1F3D]">{selectedOrder.date}</span>
              </div>

              <div className="flex justify-between text-xs">
                <span className="text-[#7A7C99]">Status</span>
                <span className="font-bold text-emerald-600 uppercase flex items-center gap-1">
                  <ShieldCheck size={13} /> {selectedOrder.type}
                </span>
              </div>

              <div className="w-full h-px bg-[#EEF0FA]" />

              <div className="space-y-2">
                <span className="text-[11px] font-bold text-[#7A7C99] uppercase">Items Purchased:</span>
                {selectedOrder.items.map((it, idx) => (
                  <div key={idx} className="p-2.5 bg-[#F8F9FE] rounded-xl flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-[#1E1F3D]">{it.title}</p>
                      <p className="text-[10px] text-[#8E97FD] font-semibold">{it.category}</p>
                    </div>
                    <span className="font-bold text-[#1E1F3D]">{it.price}</span>
                  </div>
                ))}
              </div>

              <div className="w-full h-px bg-[#EEF0FA]" />

              <div className="flex justify-between text-sm font-semibold text-[#1E1F3D]">
                <span>Total Paid</span>
                <span className="text-[#4E75FF]">{selectedOrder.valueOfItems}</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedOrder(null)}
              className="w-full h-11 rounded-2xl bg-[#8E97FD] text-white font-bold text-xs hover:bg-[#7B85F8] transition-all cursor-pointer"
            >
              Close Receipt
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
