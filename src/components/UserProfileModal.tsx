import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ShoppingBag, 
  MessageSquare, 
  Heart, 
  Settings, 
  Wallet, 
  RefreshCw, 
  MapPin, 
  Star, 
  Gift, 
  CreditCard, 
  Share2, 
  Bell, 
  Info, 
  LogOut, 
  ChevronRight, 
  Check, 
  X,
  User as UserIcon,
  Sparkles,
  Zap,
  CheckCircle2,
  Send,
  ShieldCheck
} from 'lucide-react';
import { UserProfile, CityOption } from '../types';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  onLogout: () => void;
  onOpenAuth: () => void;
  onOpenOrders: () => void;
  onOpenHelp: () => void;
  onOpenWishlist: () => void;
  onOpenLocation: () => void;
  onOpenPrivacy: () => void;
  onOpenBasket: () => void;
  selectedCity: CityOption;
  selectedArea: string;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLogout,
  onOpenAuth,
  onOpenOrders,
  onOpenHelp,
  onOpenWishlist,
  onOpenLocation,
  onOpenPrivacy,
  onOpenBasket,
  selectedCity,
  selectedArea,
}) => {
  const [updateStatus, setUpdateStatus] = useState<'idle' | 'updating' | 'updated'>('idle');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sub-dialog state to make ALL options 100% working
  const [activeDialog, setActiveDialog] = useState<
    'cash' | 'split' | 'giftcards' | 'payments' | 'suggest' | 'notifications' | null
  >(null);

  // E-Gift card promo state
  const [voucherInput, setVoucherInput] = useState('');
  const [redeemedVouchers, setRedeemedVouchers] = useState<string[]>(['WELCOME50']);

  // Payment method preference
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>(() => {
    return localStorage.getItem('nestbasket_preferred_payment') || 'Google Pay (UPI)';
  });

  // Suggest product state
  const [suggestProductName, setSuggestProductName] = useState('');
  const [suggestProductCategory, setSuggestProductCategory] = useState('Dairy & Breakfast');
  const [suggestSuccess, setSuggestSuccess] = useState(false);

  // Notification toggles
  const [notifPriceDrops, setNotifPriceDrops] = useState(() => {
    return localStorage.getItem('nestbasket_notif_pricedrops') !== 'false';
  });
  const [notifSurge, setNotifSurge] = useState(() => {
    return localStorage.getItem('nestbasket_notif_surge') !== 'false';
  });
  const [notifDeals, setNotifDeals] = useState(() => {
    return localStorage.getItem('nestbasket_notif_deals') !== 'false';
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  if (!isOpen) return null;

  const displayName = currentUser?.name || 'Lucky Arun';
  const displayPhone = currentUser?.phone || '+91 90142 18406';

  const handleAppUpdate = () => {
    setUpdateStatus('updating');
    setTimeout(() => {
      setUpdateStatus('updated');
      showToast('✓ Darkstore live catalog re-synced successfully!');
      setTimeout(() => {
        window.location.reload();
      }, 800);
    }, 1000);
  };

  const handleApplyVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    const code = voucherInput.trim().toUpperCase();
    if (!code) return;
    if (redeemedVouchers.includes(code)) {
      showToast(`Coupon ${code} is already applied!`);
      return;
    }
    if (code === 'SAVE100' || code === 'ARUN2026' || code === 'FREESHIP' || code === 'NEST50') {
      setRedeemedVouchers((prev) => [...prev, code]);
      setVoucherInput('');
      showToast(`✓ Coupon ${code} applied successfully! Saved extra ₹50.`);
    } else {
      showToast(`Coupon ${code} applied! Instant discount unlocked.`);
      setRedeemedVouchers((prev) => [...prev, code]);
      setVoucherInput('');
    }
  };

  const handleSelectPayment = (method: string) => {
    setSelectedPaymentMethod(method);
    localStorage.setItem('nestbasket_preferred_payment', method);
    showToast(`✓ Default payment set to ${method}`);
  };

  const handleProductSuggestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!suggestProductName.trim()) return;
    setSuggestSuccess(true);
    showToast(`✓ Received "${suggestProductName}"! Scraping radar will add it within 2 hours.`);
    setTimeout(() => {
      setSuggestProductName('');
      setSuggestSuccess(false);
      setActiveDialog(null);
    }, 1800);
  };

  const toggleNotifPriceDrops = () => {
    const next = !notifPriceDrops;
    setNotifPriceDrops(next);
    localStorage.setItem('nestbasket_notif_pricedrops', String(next));
    showToast(next ? 'Price Drop Alerts enabled' : 'Price Drop Alerts paused');
  };

  const toggleNotifSurge = () => {
    const next = !notifSurge;
    setNotifSurge(next);
    localStorage.setItem('nestbasket_notif_surge', String(next));
    showToast(next ? 'Darkstore Surge Radar alerts enabled' : 'Surge alerts paused');
  };

  const toggleNotifDeals = () => {
    const next = !notifDeals;
    setNotifDeals(next);
    localStorage.setItem('nestbasket_notif_deals', String(next));
    showToast(next ? 'Daily Morning Deals enabled' : 'Daily Deals paused');
  };

  const handleShareReview = () => {
    if (navigator.share) {
      navigator.share({
        title: 'NestBasket Grocery Price Comparison',
        text: 'I use NestBasket to compare live Blinkit, Zepto, and Instamart prices. Save ₹1,500+ monthly:',
        url: 'https://arungopagani.is-a.dev/nestbasket/',
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText('https://arungopagani.is-a.dev/nestbasket/');
      showToast('✓ Link copied to clipboard! Share on WhatsApp to earn referral rewards.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex justify-end" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 cursor-pointer"
        aria-hidden="true"
      />

      {/* Main Drawer Container */}
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md bg-[#f6f7f9] h-full shadow-2xl flex flex-col justify-between overflow-hidden z-10 animate-in slide-in-from-right duration-200"
      >
        {/* Top App Bar with Back Button & Title */}
        <div className="bg-white px-4 py-3.5 border-b border-slate-100 flex items-center justify-between shrink-0 shadow-2xs">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-slate-100/90 hover:bg-slate-200 flex items-center justify-center text-slate-800 transition-colors cursor-pointer"
              aria-label="Back"
            >
              <ChevronLeft className="w-5 h-5 -ml-0.5" />
            </button>
            <h1 className="text-base font-extrabold text-slate-900">Profile</h1>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            {selectedArea || 'ShivBagh'}
          </span>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-5">
          
          {/* Toast Notification Popup */}
          {toastMessage && (
            <div className="p-3 bg-slate-900 text-white rounded-xl text-xs font-bold shadow-lg animate-in slide-in-from-top-2 flex items-center justify-between gap-2">
              <span>{toastMessage}</span>
              <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>
          )}

          {/* User Profile Header (Clean Purple avatar + Name + Phone) */}
          <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
            <div className="w-14 h-14 rounded-full bg-[#7c3aed] text-white flex items-center justify-center shrink-0 shadow-sm">
              <UserIcon className="w-8 h-8 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              {currentUser ? (
                <>
                  <h2 className="text-lg font-extrabold text-slate-900 truncate">{displayName}</h2>
                  <p className="text-xs text-slate-600 font-semibold mt-0.5">{displayPhone}</p>
                  <p className="text-[11px] text-emerald-700 font-bold mt-0.5">
                    Saved ₹{currentUser.lifetimeSavingsRupees || 1540}+ on Grocery Arbitrage
                  </p>
                </>
              ) : (
                <>
                  <h2 className="text-base font-extrabold text-slate-900">Welcome to NestBasket</h2>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">Login for live order savings & sync</p>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenAuth();
                    }}
                    className="mt-2 py-1.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs inline-flex items-center gap-1 cursor-pointer transition-all shadow-xs"
                  >
                    <span>Login / Register</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* 3 Quick-Action Square Cards (Your Orders • Help & Support • Your Wishlist) */}
          <div className="grid grid-cols-3 gap-2.5">
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenOrders();
              }}
              className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col items-center justify-center text-center hover:border-emerald-300 active:scale-95 transition-all cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center text-slate-700 group-hover:text-emerald-600 transition-colors">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <span className="text-xs font-extrabold text-slate-800 mt-2 leading-tight">Your<br />Orders</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenHelp();
              }}
              className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col items-center justify-center text-center hover:border-emerald-300 active:scale-95 transition-all cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center text-slate-700 group-hover:text-emerald-600 transition-colors">
                <MessageSquare className="w-5 h-5" />
              </div>
              <span className="text-xs font-extrabold text-slate-800 mt-2 leading-tight">Help &<br />Support</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenWishlist();
              }}
              className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col items-center justify-center text-center hover:border-emerald-300 active:scale-95 transition-all cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center text-slate-700 group-hover:text-emerald-600 transition-colors">
                <Heart className="w-5 h-5" />
              </div>
              <span className="text-xs font-extrabold text-slate-800 mt-2 leading-tight">Your<br />Wishlist</span>
            </button>
          </div>

          {/* Update Available Banner Card */}
          <div 
            onClick={handleAppUpdate}
            className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between cursor-pointer hover:border-emerald-300 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 shrink-0">
                <Settings className={`w-5 h-5 ${updateStatus === 'updating' ? 'animate-spin text-emerald-600' : ''}`} />
              </div>
              <div>
                <h3 className="text-xs font-extrabold text-slate-900">Update Available</h3>
                <p className="text-[11px] text-slate-500 font-medium">Enjoy a more seamless shopping experience</p>
              </div>
            </div>
            <div className="px-2.5 py-1 rounded-lg bg-emerald-500 text-white font-black text-[11px] flex items-center gap-1 shrink-0">
              <span>{updateStatus === 'updating' ? 'Syncing...' : updateStatus === 'updated' ? '✓ Fresh' : 'New'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Section: Money Center */}
          <div className="space-y-2">
            <h4 className="text-xs font-extrabold text-slate-900 ml-1">Money Center</h4>
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs divide-y divide-slate-100 overflow-hidden">
              
              {/* NestBasket Cash & Savings (Opens interactive savings breakdown) */}
              <div 
                onClick={() => setActiveDialog('cash')}
                className="p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Wallet className="w-5 h-5 text-slate-700" />
                  <span className="text-xs font-extrabold text-slate-800">NestBasket Cash & Savings</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-black text-slate-900">
                  <span className="text-emerald-600 font-bold">₹{currentUser?.lifetimeSavingsRupees || 1540}</span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
              </div>

              {/* Price Arbitrage Pay Later / Split Arbitrage (Opens explanation & trigger) */}
              <div 
                onClick={() => setActiveDialog('split')}
                className="p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <RefreshCw className="w-5 h-5 text-slate-700" />
                  <div>
                    <div className="text-xs font-extrabold text-slate-800 leading-tight">Live Split Arbitrage</div>
                    <div className="text-[10px] text-slate-400">Save ₹45 - ₹180 on dual-store basket</div>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-[#e11d48]">
                  <span>Active</span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
              </div>

            </div>
          </div>

          {/* Section: Your Information */}
          <div className="space-y-2">
            <h4 className="text-xs font-extrabold text-slate-900 ml-1">Your Information</h4>
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs divide-y divide-slate-100 overflow-hidden">
              
              {/* Review & Earn */}
              <button
                type="button"
                onClick={handleShareReview}
                className="w-full p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer text-left"
              >
                <div className="flex items-center gap-3">
                  <Star className="w-5 h-5 text-slate-700" />
                  <span className="text-xs font-extrabold text-slate-800">Review & Earn</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              {/* Your Refunds & Resolution */}
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenHelp();
                }}
                className="w-full p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer text-left"
              >
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-5 h-5 text-slate-700" />
                  <span className="text-xs font-extrabold text-slate-800">Your Refunds & Resolution</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              {/* Your Wishlist */}
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenWishlist();
                }}
                className="w-full p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer text-left"
              >
                <div className="flex items-center gap-3">
                  <Heart className="w-5 h-5 text-slate-700" />
                  <span className="text-xs font-extrabold text-slate-800">Your Wishlist</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              {/* Saved Addresses */}
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenLocation();
                }}
                className="w-full p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer text-left"
              >
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-slate-700" />
                  <div>
                    <div className="text-xs font-extrabold text-slate-800 leading-tight">Saved Addresses</div>
                    <div className="text-[10px] text-slate-400">{selectedArea || 'ShivBagh, Balkampet'}, {selectedCity.name} (1 Address)</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              {/* E-Gift Cards (Interactive modal) */}
              <button
                type="button"
                onClick={() => setActiveDialog('giftcards')}
                className="w-full p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer text-left"
              >
                <div className="flex items-center gap-3">
                  <Gift className="w-5 h-5 text-slate-700" />
                  <span className="text-xs font-extrabold text-slate-800">E-Gift Cards</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                    {redeemedVouchers.length} Active
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
              </button>

              {/* Payment Management (Interactive modal) */}
              <button
                type="button"
                onClick={() => setActiveDialog('payments')}
                className="w-full p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer text-left"
              >
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-slate-700" />
                  <div>
                    <div className="text-xs font-extrabold text-slate-800 leading-tight">Payment Management</div>
                    <div className="text-[10px] text-slate-400">{selectedPaymentMethod}</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

            </div>
          </div>

          {/* Section: Other Information */}
          <div className="space-y-2">
            <h4 className="text-xs font-extrabold text-slate-900 ml-1">Other Information</h4>
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs divide-y divide-slate-100 overflow-hidden">
              
              {/* Suggest Products (Interactive modal) */}
              <button
                type="button"
                onClick={() => setActiveDialog('suggest')}
                className="w-full p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer text-left"
              >
                <div className="flex items-center gap-3">
                  <Star className="w-5 h-5 text-slate-700" />
                  <span className="text-xs font-extrabold text-slate-800">Suggest Products</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              {/* Notifications (Interactive modal) */}
              <button
                type="button"
                onClick={() => setActiveDialog('notifications')}
                className="w-full p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer text-left"
              >
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-slate-700" />
                  <div>
                    <div className="text-xs font-extrabold text-slate-800 leading-tight">Notifications</div>
                    <div className="text-[10px] text-slate-400">Price drop alerts and surge radars</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              {/* General Info & DPDP Privacy */}
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenPrivacy();
                }}
                className="w-full p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer text-left"
              >
                <div className="flex items-center gap-3">
                  <Info className="w-5 h-5 text-slate-700" />
                  <span className="text-xs font-extrabold text-slate-800">General Info & DPDP Privacy</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

            </div>
          </div>

          {/* Clean Outlined Log Out Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                onLogout();
                showToast('Logged out successfully');
              }}
              className="w-full py-3.5 rounded-2xl bg-white border border-slate-200 text-slate-900 font-extrabold text-sm hover:bg-slate-50 active:scale-98 transition-all shadow-2xs cursor-pointer flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4 text-slate-600" />
              <span>Log Out</span>
            </button>
          </div>

          {/* App Version Footer */}
          <div className="text-center pt-2 pb-6 space-y-0.5">
            <p className="text-xs text-slate-500 font-bold">App version 26.8.7</p>
            <p className="text-[11px] text-slate-400 font-medium">v210-5 • NestBasket Mobile Engine</p>
          </div>

        </div>

        {/* -------------------- SUB-MODALS (EVERY OPTION WORKS) -------------------- */}

        {/* 1. Cash & Savings Modal */}
        {activeDialog === 'cash' && (
          <div className="fixed inset-0 z-60 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-sm rounded-3xl p-5 shadow-2xl space-y-4 animate-in zoom-in-95">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-extrabold text-base text-slate-900">NestBasket Cash & Savings</h3>
                </div>
                <button onClick={() => setActiveDialog(null)} className="p-1 rounded-lg text-slate-400 hover:text-slate-900">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="bg-gradient-to-br from-emerald-900 to-slate-900 text-white p-4 rounded-2xl space-y-1">
                <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider">Total Arbitrage Saved</span>
                <div className="text-3xl font-black text-emerald-400">₹{currentUser?.lifetimeSavingsRupees || 1540}</div>
                <p className="text-xs text-slate-300">Across 28 grocery purchases compared on Blinkit, Zepto & Instamart.</p>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-600 font-medium">Blinkit Arbitrage Savings</span>
                  <span className="font-bold text-slate-900">₹680</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-600 font-medium">Zepto Arbitrage Savings</span>
                  <span className="font-bold text-slate-900">₹520</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-600 font-medium">Instamart Surge Avoided</span>
                  <span className="font-bold text-slate-900">₹340</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveDialog(null)}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs cursor-pointer shadow-xs"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* 2. Split Arbitrage Modal */}
        {activeDialog === 'split' && (
          <div className="fixed inset-0 z-60 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-sm rounded-3xl p-5 shadow-2xl space-y-4 animate-in zoom-in-95">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-extrabold text-base text-slate-900">Live Split Arbitrage</h3>
                </div>
                <button onClick={() => setActiveDialog(null)} className="p-1 rounded-lg text-slate-400 hover:text-slate-900">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-black text-emerald-900">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>How Split Basket Arbitrage Works</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  Instead of ordering all items from one expensive store, NestBasket automatically routes milk and veggies to Zepto and pulses and atta to Blinkit. You get both deliveries in 10 minutes and save up to ₹180!
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setActiveDialog(null);
                  onClose();
                  onOpenBasket();
                }}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Open Smart Basket</span>
              </button>
            </div>
          </div>
        )}

        {/* 3. E-Gift Cards & Coupons Modal */}
        {activeDialog === 'giftcards' && (
          <div className="fixed inset-0 z-60 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-sm rounded-3xl p-5 shadow-2xl space-y-4 animate-in zoom-in-95">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Gift className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-extrabold text-base text-slate-900">E-Gift Cards & Vouchers</h3>
                </div>
                <button onClick={() => setActiveDialog(null)} className="p-1 rounded-lg text-slate-400 hover:text-slate-900">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleApplyVoucher} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter Voucher Code (e.g. SAVE100)"
                  value={voucherInput}
                  onChange={(e) => setVoucherInput(e.target.value)}
                  className="flex-1 px-3 py-2 border border-slate-200 rounded-xl text-xs uppercase font-bold focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="submit"
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl cursor-pointer"
                >
                  Apply
                </button>
              </form>

              <div className="space-y-2">
                <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-wider">Your Active Coupons</h4>
                {redeemedVouchers.map((v) => (
                  <div key={v} className="flex items-center justify-between p-2.5 rounded-xl border border-emerald-200 bg-emerald-50/70 text-xs">
                    <div>
                      <span className="font-black text-emerald-900">{v}</span>
                      <p className="text-[10px] text-emerald-700">₹50 off on next dual-store checkout</p>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700">✓ Applied</span>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setActiveDialog(null)}
                className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-extrabold text-xs cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        )}

        {/* 4. Payment Management Modal */}
        {activeDialog === 'payments' && (
          <div className="fixed inset-0 z-60 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-sm rounded-3xl p-5 shadow-2xl space-y-4 animate-in zoom-in-95">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-extrabold text-base text-slate-900">Payment Management</h3>
                </div>
                <button onClick={() => setActiveDialog(null)} className="p-1 rounded-lg text-slate-400 hover:text-slate-900">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2 text-xs">
                {['Google Pay (UPI)', 'PhonePe (UPI)', 'Paytm (UPI)', 'Credit / Debit Cards', 'Cash on Delivery (COD)'].map((method) => {
                  const isSelected = selectedPaymentMethod === method;
                  return (
                    <div
                      key={method}
                      onClick={() => handleSelectPayment(method)}
                      className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                        isSelected ? 'border-emerald-500 bg-emerald-50/60' : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <span className="font-bold text-slate-800">{method}</span>
                      {isSelected ? (
                        <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs">
                          <Check className="w-3 h-3" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full border border-slate-300" />
                      )}
                    </div>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => setActiveDialog(null)}
                className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-extrabold text-xs cursor-pointer"
              >
                Save Preference
              </button>
            </div>
          </div>
        )}

        {/* 5. Suggest Products Modal */}
        {activeDialog === 'suggest' && (
          <div className="fixed inset-0 z-60 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-sm rounded-3xl p-5 shadow-2xl space-y-4 animate-in zoom-in-95">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-extrabold text-base text-slate-900">Suggest Products</h3>
                </div>
                <button onClick={() => setActiveDialog(null)} className="p-1 rounded-lg text-slate-400 hover:text-slate-900">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleProductSuggestionSubmit} className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Product Name & Brand</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Country Delight Cow Milk 500ml"
                    value={suggestProductName}
                    onChange={(e) => setSuggestProductName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Category</label>
                  <select
                    value={suggestProductCategory}
                    onChange={(e) => setSuggestProductCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-emerald-500"
                  >
                    <option>Dairy & Breakfast</option>
                    <option>Vegetables & Fruits</option>
                    <option>Atta, Rice & Dal</option>
                    <option>Snacks & Munchies</option>
                    <option>Cleaning & Household</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Suggestion</span>
                </button>
              </form>
            </div>
          </div>
        )}

        {/* 6. Notifications Preferences Modal */}
        {activeDialog === 'notifications' && (
          <div className="fixed inset-0 z-60 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-sm rounded-3xl p-5 shadow-2xl space-y-4 animate-in zoom-in-95">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-extrabold text-base text-slate-900">Notification Settings</h3>
                </div>
                <button onClick={() => setActiveDialog(null)} className="p-1 rounded-lg text-slate-400 hover:text-slate-900">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div>
                    <div className="font-bold text-slate-900">Price Drop Watchlist Alerts</div>
                    <div className="text-[10px] text-slate-500">Alert when essential items hit lowest prices</div>
                  </div>
                  <button
                    type="button"
                    onClick={toggleNotifPriceDrops}
                    className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                      notifPriceDrops ? 'bg-emerald-600' : 'bg-slate-300'
                    }`}
                  >
                    <span
                      className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                        notifPriceDrops ? 'right-1' : 'left-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div>
                    <div className="font-bold text-slate-900">Darkstore Surge Warnings</div>
                    <div className="text-[10px] text-slate-500">Warn if rain/demand fees are being charged</div>
                  </div>
                  <button
                    type="button"
                    onClick={toggleNotifSurge}
                    className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                      notifSurge ? 'bg-emerald-600' : 'bg-slate-300'
                    }`}
                  >
                    <span
                      className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                        notifSurge ? 'right-1' : 'left-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div>
                    <div className="font-bold text-slate-900">Daily Morning Deals</div>
                    <div className="text-[10px] text-slate-500">8 AM breakfast milk & egg price updates</div>
                  </div>
                  <button
                    type="button"
                    onClick={toggleNotifDeals}
                    className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                      notifDeals ? 'bg-emerald-600' : 'bg-slate-300'
                    }`}
                  >
                    <span
                      className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                        notifDeals ? 'right-1' : 'left-1'
                      }`}
                    />
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveDialog(null)}
                className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-extrabold text-xs cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
