import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, Sparkles, CheckCircle2, ShoppingBag, ShieldCheck, Zap, ExternalLink, Cloud, RefreshCw, Share2, Copy, Check } from 'lucide-react';
import { CartItem, PlatformId } from '../types';
import { PLATFORMS } from '../data/mockGroceryData';
import { getDirectStoreBuyUrl } from '../utils/storeLinks';
import { openPlatformCartCheckout, buildAffiliateUrl, generateWhatsAppOrderSummary } from '../services/affiliateService';

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
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);
  const [mountedTime, setMountedTime] = useState<number>(0);

  React.useEffect(() => {
    if (isOpen) {
      setMountedTime(Date.now());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Calculate totals for each single platform
  const platforms = Object.keys(PLATFORMS) as PlatformId[];

  const singleStoreTotals: Record<PlatformId, { itemsTotal: number; platformFee: number; deliveryFee: number; grandTotal: number; unavailableItems: number }> = {} as any;

  platforms.forEach((pId) => {
    let itemsTotal = 0;
    let unavailable = 0;
    const platform = PLATFORMS[pId] || PLATFORMS.zepto;

    items.forEach((item) => {
      if (!item || !item.product) return;
      const offers = item.product.offers || {};
      const offer = offers[pId];
      if (offer && offer.inStock && typeof offer.price === 'number') {
        itemsTotal += offer.price * item.quantity;
      } else {
        unavailable += 1;
        // Fallback price if missing
        const fallback = offers.blinkit?.price || offers.zepto?.price || item.product.price || 50;
        itemsTotal += fallback * item.quantity;
      }
    });

    const deliveryFee = itemsTotal >= (platform.freeDeliveryAbove || 199) ? 0 : (platform.baseDeliveryFee || 15);
    const platformFee = platform.handlingFee || 4;
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
    const current = singleStoreTotals[pId]?.grandTotal ?? 999999;
    const bestTotal = singleStoreTotals[best]?.grandTotal ?? 999999;
    return current < bestTotal ? pId : best;
  }, platforms[0] || 'zepto');

  // Calculate Smart Split Arbitrage:
  // For each item, select the platform that has the absolute lowest price
  const splitStoreBuckets: Partial<Record<PlatformId, { items: CartItem[]; subtotal: number }>> = {};
  let rawSplitItemsTotal = 0;

  items.forEach((item) => {
    if (!item || !item.product) return;
    const offers = item.product.offers || {};
    let lowestPId: PlatformId = 'zepto';
    let lowestPrice = 999999;

    platforms.forEach((pId) => {
      const offer = offers[pId];
      if (offer && offer.inStock && typeof offer.price === 'number' && offer.price < lowestPrice) {
        lowestPrice = offer.price;
        lowestPId = pId;
      }
    });

    if (lowestPrice === 999999) {
      lowestPrice = offers.blinkit?.price || offers.zepto?.price || item.product.price || 50;
      lowestPId = 'zepto';
    }

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
    const bucket = splitStoreBuckets[pId];
    if (!bucket) return;
    const platform = PLATFORMS[pId] || PLATFORMS.zepto;
    splitTotalHandling += platform.handlingFee || 0;
    if (bucket.subtotal < (platform.freeDeliveryAbove || 199)) {
      splitTotalDelivery += platform.baseDeliveryFee || 15;
    }
  });

  const splitGrandTotal = rawSplitItemsTotal + splitTotalDelivery + splitTotalHandling;
  const singleStoreGrandTotal = singleStoreTotals[bestSingleStore]?.grandTotal ?? rawSplitItemsTotal;
  const highestSingleGrandTotal = Math.max(...platforms.map((p) => singleStoreTotals[p]?.grandTotal ?? 0));

  const totalArbitrageSavings = highestSingleGrandTotal - splitGrandTotal;


  const handleBackdropClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Ignore synthetic clicks that arrive within 350ms of mounting
    if (Date.now() - mountedTime < 350) return;
    onClose();
  };

  const handleCopyWhatsAppList = () => {
    const grandTotal = strategy === 'split-arbitrage' ? splitGrandTotal : singleStoreGrandTotal;
    const totalSaved = totalArbitrageSavings;
    const cheapestName = strategy === 'split-arbitrage' ? 'Split Across 2 Stores' : (PLATFORMS[bestSingleStore]?.name || 'Best Store');
    const summaryText = generateWhatsAppOrderSummary(items, cheapestName, totalSaved, grandTotal);
    navigator.clipboard.writeText(summaryText);
    setCopyFeedback('✓ Copied grocery list with store links to clipboard!');
    setTimeout(() => setCopyFeedback(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        onClick={handleBackdropClick}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity cursor-pointer z-0"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10 z-10 pointer-events-none">
        <div
          onClick={(e) => e.stopPropagation()}
          className="w-full sm:w-screen sm:max-w-md bg-white shadow-2xl flex flex-col justify-between h-full pointer-events-auto animate-in slide-in-from-right duration-200"
        >
          
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
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="Close Basket"
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

                  {items.map((item) => {
                    const prodName = item.product?.name || 'Item';
                    const prodImg = item.product?.imageUrl || item.product?.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=100&auto=format&fit=crop&q=60';
                    return (
                    <div
                      key={item.product?.id || Math.random()}
                      className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50/50"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={prodImg}
                          alt={prodName}
                          className="w-12 h-12 rounded-lg object-cover border border-slate-200 shrink-0"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=100&auto=format&fit=crop&q=60';
                          }}
                        />
                        <div>
                          <div className="font-bold text-xs text-slate-900 line-clamp-1">
                            {prodName}
                          </div>
                          <div className="text-[11px] text-slate-500 font-medium">
                            {item.product?.unit || '1 unit'}
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
                  );
                  })}
                </div>

                {/* Split Breakdown */}
                {strategy === 'split-arbitrage' && (
                  <div className="space-y-3 pt-2">
                    <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Split Order Roadmap:
                    </div>

                    {Object.entries(splitStoreBuckets).map(([pId, bucket]) => {
                      if (!bucket) return null;
                      const platform = PLATFORMS[pId as PlatformId] || PLATFORMS.zepto;
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
                            {bucket.items.map((it) => (it.product?.name || 'Item').split(' ')[0]).join(', ')} ({bucket.items.length} items)
                          </div>

                          <button
                            type="button"
                            onClick={() => openPlatformCartCheckout(pId as PlatformId, bucket.items)}
                            className="w-full py-1.5 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 active:scale-95 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
                          >
                            <span>1-Tap Order ({bucket.items.length} items on {platform.name})</span>
                            <ExternalLink className="w-3 h-3 text-slate-400" />
                          </button>
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

              {/* Action Buttons: WhatsApp List & 1-Tap Checkout */}
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    const targetPlatform = strategy === 'split-arbitrage'
                      ? ((Object.keys(splitStoreBuckets)[0] || 'zepto') as PlatformId)
                      : bestSingleStore;
                    openPlatformCartCheckout(targetPlatform, items);
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-600/25 cursor-pointer"
                >
                  <span>🚀 1-Tap Checkout on {strategy === 'split-arbitrage' ? 'Cheapest Stores' : PLATFORMS[bestSingleStore].name}</span>
                  <ExternalLink className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={handleCopyWhatsAppList}
                  className="w-full py-2 px-3 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                >
                  {copyFeedback ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700 font-extrabold">{copyFeedback}</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3.5 h-3.5 text-slate-500" />
                      <span>Copy WhatsApp Grocery List with Links</span>
                    </>
                  )}
                </button>
              </div>

              <div className="text-[10px] text-center text-slate-400 font-medium flex items-center justify-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                <span>Verified Direct Affiliate Links • Zero Price Markup Guaranteed</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
