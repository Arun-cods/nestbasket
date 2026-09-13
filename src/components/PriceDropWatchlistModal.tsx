import React, { useState } from 'react';
import { 
  X, 
  Bell, 
  Trash2, 
  TrendingDown, 
  ExternalLink, 
  ShoppingBag, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight,
  Download,
  Plus,
  Minus
} from 'lucide-react';
import { WatchlistItem, removeFromWatchlist, updateTargetPrice, exportUserDataJson } from '../services/cloudStorageService';
import { UserProfile, Product, PlatformId } from '../types';
import { getDirectStoreBuyUrl } from '../utils/storeLinks';

interface PriceDropWatchlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  watchlist: WatchlistItem[];
  onRefreshWatchlist: () => void;
  onAddToCart: (product: Product) => void;
  currentUser: UserProfile | null;
  products: Product[];
}

export const PriceDropWatchlistModal: React.FC<PriceDropWatchlistModalProps> = ({
  isOpen,
  onClose,
  watchlist,
  onRefreshWatchlist,
  onAddToCart,
  currentUser,
  products,
}) => {
  const [filterMode, setFilterMode] = useState<'all' | 'dropped'>('all');
  const [editingTargetId, setEditingTargetId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleRemove = (productId: string, name: string) => {
    removeFromWatchlist(productId, currentUser?.id);
    onRefreshWatchlist();
    showToast(`Removed "${name}" from Watchlist`);
  };

  const handleAdjustTarget = (productId: string, currentTarget: number, delta: number) => {
    const newTarget = Math.max(10, currentTarget + delta);
    updateTargetPrice(productId, newTarget, currentUser?.id);
    onRefreshWatchlist();
  };

  const handleAddTrackedItemToCart = (item: WatchlistItem) => {
    const fullProduct = products.find((p) => p.id === item.productId);
    if (fullProduct) {
      onAddToCart(fullProduct);
      showToast(`Added ${item.productName} to Smart Basket!`);
    }
  };

  const handleExportData = () => {
    if (!currentUser) return;
    const jsonString = exportUserDataJson(currentUser);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nestbasket-data-${currentUser.phone}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('User Data Exported Successfully (DPDP Act 2023)');
  };

  const triggeredCount = watchlist.filter((w) => w.alertTriggered || w.currentLowestPrice <= w.targetPrice).length;
  const displayedItems = filterMode === 'dropped'
    ? watchlist.filter((w) => w.alertTriggered || w.currentLowestPrice <= w.targetPrice)
    : watchlist;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 md:p-6 animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white flex items-center justify-between border-b border-slate-700/60 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
              <Bell className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black tracking-tight text-white">
                  Price Drop Watchlist &amp; Alerts
                </h2>
                {triggeredCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-400 text-amber-950 animate-bounce">
                    {triggeredCount} DROPPED!
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-300">
                Automatic price monitoring across Blinkit, Zepto, Swiggy Instamart &amp; BigBasket
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Pills */}
        <div className="px-5 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-2 text-xs shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1 rounded-xl font-bold transition-all ${
                filterMode === 'all'
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              All Tracked ({watchlist.length})
            </button>
            <button
              onClick={() => setFilterMode('dropped')}
              className={`px-3 py-1 rounded-xl font-bold transition-all flex items-center gap-1 ${
                filterMode === 'dropped'
                  ? 'bg-amber-500 text-amber-950 shadow-2xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              <TrendingDown className="w-3.5 h-3.5 text-amber-600" />
              <span>Price Dropped ({triggeredCount})</span>
            </button>
          </div>

          {currentUser && (
            <button
              onClick={handleExportData}
              title="Download your saved data as JSON under DPDP Act 2023"
              className="text-[11px] font-bold text-slate-600 hover:text-emerald-700 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export JSON</span>
            </button>
          )}
        </div>

        {/* Toast */}
        {toastMessage && (
          <div className="bg-emerald-600 text-white text-xs font-bold px-4 py-2 text-center animate-in slide-in-from-top-1">
            {toastMessage}
          </div>
        )}

        {/* List Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-3">
          {displayedItems.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-16 h-16 rounded-3xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                <Bell className="w-8 h-8 stroke-1" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">
                  {filterMode === 'dropped' ? 'No Price Drops Yet' : 'Your Watchlist is Empty'}
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                  Click the 🔔 or ❤️ icon on any product in the catalog to set a target price alert!
                </p>
              </div>
            </div>
          ) : (
            displayedItems.map((item) => {
              const isDropped = item.alertTriggered || item.currentLowestPrice <= item.targetPrice;
              const savingsRupees = Math.max(0, item.initialPrice - item.currentLowestPrice);

              return (
                <div
                  key={item.id}
                  className={`rounded-2xl p-3.5 border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                    isDropped
                      ? 'bg-amber-50/70 border-amber-300 ring-2 ring-amber-300/30 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.productName}
                        className="w-12 h-12 rounded-xl object-contain bg-slate-50 p-1 border border-slate-100 shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 shrink-0">
                        <ShoppingBag className="w-5 h-5" />
                      </div>
                    )}

                    <div className="min-w-0">
                      <div className="font-extrabold text-xs sm:text-sm text-slate-900 truncate">
                        {item.productName}
                      </div>
                      <div className="text-[11px] text-slate-500 font-medium">
                        Unit: {item.unit}
                      </div>

                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-black text-slate-900">
                          Now ₹{item.currentLowestPrice}
                        </span>
                        <span className="text-[10px] text-slate-400 line-through">
                          ₹{item.initialPrice}
                        </span>
                        {isDropped && (
                          <span className="text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded border border-emerald-300">
                            Save ₹{savingsRupees || item.initialPrice - item.targetPrice}!
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions & Target Price Pill */}
                  <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    {/* Target Price Adjuster */}
                    <div className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-xl border border-slate-200 text-xs">
                      <span className="text-[10px] text-slate-500 font-bold">Alert below:</span>
                      <button
                        onClick={() => handleAdjustTarget(item.productId, item.targetPrice, -2)}
                        className="w-5 h-5 rounded-md bg-white hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center transition-colors"
                        title="Lower alert threshold"
                      >
                        -
                      </button>
                      <span className="font-extrabold text-slate-900 px-1">₹{item.targetPrice}</span>
                      <button
                        onClick={() => handleAdjustTarget(item.productId, item.targetPrice, 2)}
                        className="w-5 h-5 rounded-md bg-white hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center transition-colors"
                        title="Increase alert threshold"
                      >
                        +
                      </button>
                    </div>

                    {/* Add to Cart button */}
                    <button
                      onClick={() => handleAddTrackedItemToCart(item)}
                      className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shadow-2xs"
                      title="Add to Smart Basket"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Add</span>
                    </button>

                    {/* Delete button */}
                    <button
                      onClick={() => handleRemove(item.productId, item.productName)}
                      className="p-1.5 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                      title="Remove from Watchlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Real-time price drop scanning active</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
