import React from 'react';
import { X, RotateCcw, Plus, Check, ShoppingBag, Sparkles, Clock, ArrowRight } from 'lucide-react';
import { Product } from '../types';
import { PLATFORMS } from '../data/mockGroceryData';

interface OrderAgainModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  onOpenBasket: () => void;
  products: Product[];
  cartProductIds: Set<string>;
}

export const OrderAgainModal: React.FC<OrderAgainModalProps> = ({
  isOpen,
  onClose,
  onAddToCart,
  onOpenBasket,
  products,
  cartProductIds,
}) => {
  if (!isOpen) return null;

  // Curate common daily essentials from catalog
  const repeatProducts = products.slice(0, 10);

  const pastOrders = [
    {
      id: 'NB-9842',
      date: 'Yesterday, 8:40 AM',
      itemsCount: 3,
      summary: '2x Toned Milk (500ml), Farm Fresh Eggs (6 pcs), Sandwich Bread (400g)',
      totalSaved: 74,
      store: 'Zepto',
    },
    {
      id: 'NB-9411',
      date: '11 Sep 2026',
      itemsCount: 4,
      summary: '10kg Chakki Atta, Toor Dal (1kg), Sunflower Oil (1L), Maggi 4-Pack',
      totalSaved: 168,
      store: 'Blinkit',
    },
  ];

  const handleReorderBundle = () => {
    repeatProducts.slice(0, 3).forEach((p) => onAddToCart(p));
    onClose();
    onOpenBasket();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity cursor-pointer z-0"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10 z-10 pointer-events-none">
        <div
          onClick={(e) => e.stopPropagation()}
          className="w-full sm:w-screen sm:max-w-md bg-white shadow-2xl flex flex-col justify-between h-full pointer-events-auto animate-in slide-in-from-right duration-200"
        >
          {/* Header */}
          <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-black">
                <RotateCcw className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-black text-base sm:text-lg leading-tight">Order Again</h2>
                <p className="text-xs text-slate-400">Instant 1-Tap Repeat Groceries</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6">
            
            {/* 1-Tap Morning Bundle Re-order Card */}
            <div className="bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 text-white p-4 rounded-2xl shadow-lg border border-emerald-500/30 relative overflow-hidden">
              <div className="relative z-10 space-y-2">
                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 text-[10px] font-black uppercase tracking-wider">
                  <Sparkles className="w-3 h-3" />
                  Daily Routine
                </div>
                <h3 className="font-extrabold text-sm sm:text-base">
                  Reorder Morning Essentials Bundle
                </h3>
                <p className="text-xs text-slate-300">
                  Milk + Brown Bread + Farm Eggs packed together with live lowest prices.
                </p>
                <button
                  type="button"
                  onClick={handleReorderBundle}
                  className="w-full py-2.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Reorder All 3 to Basket • Save ₹45</span>
                </button>
              </div>
            </div>

            {/* Frequent Re-orders List */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-black text-xs text-slate-900 uppercase tracking-wider">
                  Frequent Household Items ({repeatProducts.length})
                </h4>
                <span className="text-[11px] text-emerald-700 font-bold">Live Lowest Rates</span>
              </div>

              <div className="space-y-2.5">
                {repeatProducts.map((product) => {
                  const isInCart = cartProductIds.has(product.id);
                  const lowestOffer = Object.values(product.offers || {}).reduce((lowest: any, curr: any) => {
                    if (!lowest) return curr;
                    return (curr?.price || 9999) < (lowest?.price || 9999) ? curr : lowest;
                  }, null);
                  const lowestPrice = lowestOffer?.price || product.price || 40;
                  const platformName = lowestOffer ? ((PLATFORMS as any)[lowestOffer.platform]?.name || 'Cheapest') : 'Blinkit';

                  return (
                    <div
                      key={product.id}
                      className="flex items-center justify-between p-3 rounded-2xl border border-slate-200 bg-white hover:border-emerald-300 transition-all shadow-2xs"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={product.imageUrl || product.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=100&auto=format&fit=crop&q=60'}
                          alt={product.name}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-100 shrink-0"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=100&auto=format&fit=crop&q=60';
                          }}
                        />
                        <div className="min-w-0">
                          <p className="font-extrabold text-xs text-slate-900 truncate">
                            {product.name}
                          </p>
                          <p className="text-[11px] text-slate-500 font-medium">
                            {product.unit} • <span className="text-emerald-700 font-bold">₹{lowestPrice} on {platformName}</span>
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => onAddToCart(product)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all shrink-0 flex items-center gap-1 active:scale-95 cursor-pointer ${
                          isInCart
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs'
                        }`}
                      >
                        {isInCart ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Added</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add</span>
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Past Orders History */}
            <div className="space-y-3 pt-2">
              <h4 className="font-black text-xs text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span>Recent Completed Orders</span>
              </h4>

              <div className="space-y-2.5">
                {pastOrders.map((order) => (
                  <div
                    key={order.id}
                    className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-extrabold text-slate-800">Order #{order.id}</span>
                      <span className="text-[11px] text-slate-500">{order.date}</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-snug">
                      {order.summary}
                    </p>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-200">
                        Saved ₹{order.totalSaved}
                      </span>
                      <button
                        type="button"
                        onClick={handleReorderBundle}
                        className="text-xs text-slate-900 font-extrabold hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
                      >
                        <span>Repeat Order</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Footer with Basket Navigation */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-3 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-100 transition-colors cursor-pointer text-center"
            >
              Continue Browsing
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenBasket();
              }}
              className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Go to Basket</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
