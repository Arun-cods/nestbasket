import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, Sparkles, CheckCircle2, ShoppingBag, ShieldCheck, Zap, ExternalLink, Cloud, RefreshCw } from 'lucide-react';
import { CartItem, PlatformId } from '../types';
import { PLATFORMS } from '../data/mockGroceryData';
import { getDirectStoreBuyUrl } from '../utils/storeLinks';

interface SmartBasketDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onSyncToCloud?: () => void;
  isSyncingToCloud?: boolean;
  lastCloudSync?: string | null;
}

export const SmartBasketDrawer: React.FC<SmartBasketDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onSyncToCloud,
  isSyncingToCloud,
  lastCloudSync,
}) => {
  const [strategy, setStrategy] = useState<'split-arbitrage' | 'single-cheapest'>('split-arbitrage');

  if (!isOpen) return null;

  // Calculate totals for each single platform
  const platforms = Object.keys(PLATFORMS) as PlatformId[];

  const singleStoreTotals: Record<PlatformId, { itemsTotal: number; platformFee: number; deliveryFee: number; grandTotal: number; unavailableItems: number }> = {} as any;

  platforms.forEach((pId) => {
    let itemsTotal = 0;
    let unavailable = 0;
    const platform = PLATFORMS[pId];

    items.forEach((item) => {
      const offer = item.product.offers[pId];
      if (offer && offer.inStock) {
        itemsTotal += offer.price * item.quantity;
      } else {
        unavailable += 1;
        // Fallback price if missing
        itemsTotal += item.product.offers.blinkit?.price * item.quantity || 50;
      }
    });

    const deliveryFee = itemsTotal >= platform.freeDeliveryAbove ? 0 : platform.baseDeliveryFee;
    const platformFee = platform.handlingFee;
    const grandTotal = itemsTotal + deliveryFee + platformFee;

    singleStoreTotals[pId] = {
      itemsTotal,
      platformFee,
      deliveryFee,
      grandTotal,
      unavailableItems: unavailable,
    };
  });

  // Find cheapest single store
  const bestSingleStore = platforms.reduce((best, pId) => {
    return singleStoreTotals[pId].grandTotal < singleStoreTotals[best].grandTotal ? pId : best;
  }, platforms[0]);

  // Calculate Smart Split Arbitrage:
  // For each item, select the platform that has the absolute lowest price
  const splitStoreBuckets: Partial<Record<PlatformId, { items: CartItem[]; subtotal: number }>> = {};
  let rawSplitItemsTotal = 0;

  items.forEach((item) => {
    // Find cheapest platform for this individual item
    let lowestPId: PlatformId = 'zepto';
    let lowestPrice = 999999;

    platforms.forEach((pId) => {
      const offer = item.product.offers[pId];
      if (offer && offer.inStock && offer.price < lowestPrice) {
        lowestPrice = offer.price;
        lowestPId = pId;
      }
    });

    rawSplitItemsTotal += lowestPrice * item.quantity;

    if (!splitStoreBuckets[lowestPId]) {
      splitStoreBuckets[lowestPId] = { items: [], subtotal: 0 };
    }
    splitStoreBuckets[lowestPId]!.items.push(item);
    splitStoreBuckets[lowestPId]!.subtotal += lowestPrice * item.quantity;
  });

  // Calculate delivery & handling for the split buckets
  let splitTotalDelivery = 0;
  let splitTotalHandling = 0;
  Object.keys(splitStoreBuckets).forEach((pKey) => {
    const pId = pKey as PlatformId;
    const bucket = splitStoreBuckets[pId]!;
    const platform = PLATFORMS[pId];
    splitTotalHandling += platform.handlingFee;
    if (bucket.subtotal < platform.freeDeliveryAbove) {
      splitTotalDelivery += platform.baseDeliveryFee;
    }
  });

  const splitGrandTotal = rawSplitItemsTotal + splitTotalDelivery + splitTotalHandling;
  const singleStoreGrandTotal = singleStoreTotals[bestSingleStore].grandTotal;
  const highestSingleGrandTotal = Math.max(...platforms.map((p) => singleStoreTotals[p].grandTotal));

  const totalArbitrageSavings = highestSingleGrandTotal - splitGrandTotal;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-4 sm:p-6 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-slate-950 font-black">
                ₹
              </div>
              <div>
                <h2 className="font-extrabold text-base sm:text-lg">Smart Basket Optimizer</h2>
                <p className="text-xs text-slate-400">Live Multi-App Cart Arbitrage</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cloud Sync Status Strip */}
          {items.length > 0 && onSyncToCloud && (
            <div className="px-4 py-2 bg-emerald-50 border-b border-emerald-200 flex items-center justify-between text-xs shrink-0">
              <div className="flex items-center gap-1.5 text-emerald-800 font-medium">
                <Cloud className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="truncate">{lastCloudSync ? `Synced ${lastCloudSync}` : 'Cloud Backup Ready'}</span>
              </div>
              <button
                onClick={onSyncToCloud}
                disabled={isSyncingToCloud}
                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer disabled:opacity-50 shrink-0 shadow-2xs"
              >
                <RefreshCw className={`w-3 h-3 ${isSyncingToCloud ? 'animate-spin' : ''}`} />
                <span>{isSyncingToCloud ? 'Saving...' : 'Sync to Cloud'}</span>
              </button>
            </div>
          )}

          {/* Cart Contents */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            
            {items.length === 0 ? (
              <div className="text-center py-16">
                <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="font-bold text-slate-700">Your basket is empty.</p>
                <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                  Add milk, atta, vegetables or groceries from the homepage to calculate your highest daily savings.
                </p>
              </div>
            ) : (
              <>
                {/* Mode Selector Pill */}
                <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl text-xs font-bold">
                  <button
                    onClick={() => setStrategy('split-arbitrage')}
                    className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                      strategy === 'split-arbitrage'
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Split Arbitrage (Max Savings)</span>
                  </button>
                  <button
                    onClick={() => setStrategy('single-cheapest')}
                    className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                      strategy === 'single-cheapest'
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span>Single Store Only</span>
                  </button>
                </div>

                {/* Savings Banner */}
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-300 rounded-2xl p-4 text-emerald-950">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-700">
                        {strategy === 'split-arbitrage' ? 'Smart Split Savings' : 'Cheapest App Selected'}
                      </div>
                      <div className="text-2xl font-black mt-0.5 text-emerald-900">
                        ₹{strategy === 'split-arbitrage' ? Math.max(0, totalArbitrageSavings) : (highestSingleGrandTotal - singleStoreGrandTotal)} Saved
                      </div>
                    </div>
                    <span className="text-2xl">💰</span>
                  </div>
                  <p className="text-xs text-emerald-800 mt-2 font-medium">
                    {strategy === 'split-arbitrage'
                      ? `By splitting items across ${Object.keys(splitStoreBuckets).length} apps, you beat the highest single app price by ₹${totalArbitrageSavings}!`
                      : `${PLATFORMS[bestSingleStore].name} gives you the lowest single-order total of ₹${singleStoreGrandTotal}.`}
                  </p>
                </div>

                {/* Items List */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <span>Items in Basket ({items.length})</span>
                    <button
                      onClick={onClearCart}
                      className="text-red-500 hover:text-red-600 flex items-center gap-1 text-[11px]"
                    >
                      <Trash2 className="w-3 h-3" /> Clear
                    </button>
                  </div>

                  {items.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50/50"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          className="w-12 h-12 rounded-lg object-cover border border-slate-200 shrink-0"
                        />
                        <div>
                          <div className="font-bold text-xs text-slate-900 line-clamp-1">
                            {item.product.name}
                          </div>
                          <div className="text-[11px] text-slate-500 font-medium">
                            {item.product.unit}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <div className="flex items-center border border-slate-300 rounded-lg bg-white overflow-hidden">
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, -1)}
                            className="p-1 hover:bg-slate-100 text-slate-600 transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-bold text-slate-800">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, 1)}
                            className="p-1 hover:bg-slate-100 text-slate-600 transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <button
                          onClick={() => onRemoveItem(item.product.id)}
                          className="text-slate-400 hover:text-red-500 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Split Breakdown */}
                {strategy === 'split-arbitrage' && (
                  <div className="space-y-3 pt-2">
                    <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Split Order Roadmap:
                    </div>

                    {Object.entries(splitStoreBuckets).map(([pId, bucket]) => {
                      const platform = PLATFORMS[pId as PlatformId];
                      return (
                        <div
                          key={pId}
                          className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-sm space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-extrabold text-xs flex items-center gap-1.5 text-slate-900">
                              <span>{platform.logo}</span>
                              <span>Order on {platform.name}</span>
                            </span>
                            <span className="font-black text-xs text-slate-900">
                              ₹{bucket.subtotal}
                            </span>
                          </div>

                          <div className="text-[11px] text-slate-500">
                            {bucket.items.map((it) => it.product.name.split(' ')[0]).join(', ')} ({bucket.items.length} items)
                          </div>

                          <a
                            href={bucket.items[0]?.product.offers[pId as PlatformId]?.affiliateUrl || getDirectStoreBuyUrl(pId as PlatformId, bucket.items[0]?.product.name || '')}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full py-1.5 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1 transition-colors shadow-xs"
                          >
                            <span>Open {platform.name} Order</span>
                            <ExternalLink className="w-3 h-3 text-slate-400" />
                          </a>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}

          </div>

          {/* Footer & Checkout Summary */}
          {items.length > 0 && (
            <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200 space-y-3">
              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Items Subtotal:</span>
                  <span className="font-bold text-slate-900">
                    ₹{strategy === 'split-arbitrage' ? rawSplitItemsTotal : singleStoreTotals[bestSingleStore].itemsTotal}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Platform Handling Fees:</span>
                  <span className="font-semibold text-slate-800">
                    ₹{strategy === 'split-arbitrage' ? splitTotalHandling : singleStoreTotals[bestSingleStore].platformFee}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Delivery Fees:</span>
                  <span className="font-semibold text-slate-800">
                    ₹{strategy === 'split-arbitrage' ? splitTotalDelivery : singleStoreTotals[bestSingleStore].deliveryFee}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-200 text-sm font-black text-slate-900">
                  <span>Optimized Grand Total:</span>
                  <span className="text-emerald-700 text-base">
                    ₹{strategy === 'split-arbitrage' ? splitGrandTotal : singleStoreGrandTotal}
                  </span>
                </div>
              </div>

              {/* Direct Buy Checkout CTA */}
              <a
                href={
                  strategy === 'split-arbitrage'
                    ? (items[0]?.product.offers[(Object.keys(splitStoreBuckets)[0] || 'zepto') as PlatformId]?.affiliateUrl || getDirectStoreBuyUrl((Object.keys(splitStoreBuckets)[0] || 'zepto') as PlatformId, items[0]?.product.name || ''))
                    : (items[0]?.product.offers[bestSingleStore]?.affiliateUrl || getDirectStoreBuyUrl(bestSingleStore, items[0]?.product.name || ''))
                }
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-600/20"
              >
                <span>Proceed to Buy on {strategy === 'split-arbitrage' ? 'Best Stores' : PLATFORMS[bestSingleStore].name}</span>
                <ExternalLink className="w-4 h-4" />
              </a>

              <div className="text-[11px] text-center text-slate-400 font-medium">
                Affiliate tracking verified • Zero markup charged
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
