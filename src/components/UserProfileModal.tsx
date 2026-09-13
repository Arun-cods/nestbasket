import React, { useState } from 'react';
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
  Crown, 
  ShieldCheck, 
  Check, 
  ExternalLink,
  User as UserIcon,
  Sparkles
} from 'lucide-react';
import { UserProfile, CityOption } from '../types';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  onLogout: () => void;
  onOpenOrders: () => void;
  onOpenHelp: () => void;
  onOpenWishlist: () => void;
  onOpenLocation: () => void;
  onOpenPrivacy: () => void;
  onOpenFounderPortal: () => void;
  selectedCity: CityOption;
  selectedArea: string;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLogout,
  onOpenOrders,
  onOpenHelp,
  onOpenWishlist,
  onOpenLocation,
  onOpenPrivacy,
  onOpenFounderPortal,
  selectedCity,
  selectedArea,
}) => {
  const [updateStatus, setUpdateStatus] = useState<'idle' | 'updating' | 'updated'>('idle');
  const [copiedCode, setCopiedCode] = useState(false);

  if (!isOpen) return null;

  // Defaults based on user's exact uploaded screenshots
  const displayName = currentUser?.name || 'Lucky Arun';
  const displayPhone = currentUser?.phone || '+91 90142 18406';

  const handleAppUpdate = () => {
    setUpdateStatus('updating');
    setTimeout(() => {
      setUpdateStatus('updated');
      setTimeout(() => {
        window.location.reload();
      }, 800);
    }, 1200);
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
        <div className="bg-white px-4 py-3.5 border-b border-slate-100 flex items-center gap-3 shrink-0 shadow-2xs">
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

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-5">
          
          {/* User Profile Header (Purple avatar + Name + Phone) */}
          <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
            <div className="w-14 h-14 rounded-full bg-[#7c3aed] text-white flex items-center justify-center shrink-0 shadow-sm relative">
              <UserIcon className="w-8 h-8 text-white" />
              {currentUser?.isFounder && (
                <span className="absolute -bottom-1 -right-1 text-xs" title="Founder & CEO">👑</span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-extrabold text-slate-900 truncate">{displayName}</h2>
                {currentUser?.isFounder && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-black border border-amber-300">
                    FOUNDER
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-600 font-semibold mt-0.5">{displayPhone}</p>
              <p className="text-[11px] text-emerald-700 font-bold mt-0.5">
                Saved ₹{currentUser?.lifetimeSavingsRupees || 1540}+ on Grocery Arbitrage
              </p>
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
              
              {/* Zepto / NestBasket Cash */}
              <div className="p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <Wallet className="w-5 h-5 text-slate-700" />
                  <span className="text-xs font-extrabold text-slate-800">NestBasket Cash & Savings</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-black text-slate-900">
                  <span className="text-emerald-600">₹{currentUser?.lifetimeSavingsRupees || 1540}</span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
              </div>

              {/* Price Arbitrage Pay Later */}
              <div className="p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer">
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
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: 'NestBasket Grocery Price Comparison',
                      text: 'I use NestBasket to compare live Blinkit, Zepto & Instamart grocery rates. Try it here:',
                      url: 'https://arungopagani.is-a.dev/nestbasket/',
                    }).catch(() => {});
                  } else {
                    navigator.clipboard.writeText('https://arungopagani.is-a.dev/nestbasket/');
                    setCopiedCode(true);
                    setTimeout(() => setCopiedCode(false), 2000);
                  }
                }}
                className="w-full p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer text-left"
              >
                <div className="flex items-center gap-3">
                  <Star className="w-5 h-5 text-slate-700" />
                  <span className="text-xs font-extrabold text-slate-800">Review & Earn</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-slate-400">
                  {copiedCode && <span className="text-emerald-600 font-bold text-[10px]">Copied!</span>}
                  <ChevronRight className="w-4 h-4" />
                </div>
              </button>

              {/* Your Refunds & Support */}
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
                    <div className="text-[10px] text-slate-400">{selectedArea || 'ShivBagh'}, {selectedCity.name} (1 Address)</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              {/* Founder Desk Portal (Special privileged access for Arun Gopagani) */}
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenFounderPortal();
                }}
                className="w-full p-3.5 flex items-center justify-between hover:bg-amber-50/60 transition-colors cursor-pointer text-left"
              >
                <div className="flex items-center gap-3">
                  <Crown className="w-5 h-5 text-amber-500" />
                  <div>
                    <div className="text-xs font-extrabold text-slate-900 leading-tight flex items-center gap-1.5">
                      <span>Founder & Executive Desk</span>
                      <span className="text-[9px] bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded-full font-bold">Arun</span>
                    </div>
                    <div className="text-[10px] text-slate-400">Live darkstore scrapes & system telemetry</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              {/* E-Gift Cards */}
              <div className="p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <Gift className="w-5 h-5 text-slate-700" />
                  <span className="text-xs font-extrabold text-slate-800">E-Gift Cards</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>

              {/* Payment Management */}
              <div className="p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-slate-700" />
                  <span className="text-xs font-extrabold text-slate-800">Payment Management</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>

            </div>
          </div>

          {/* Section: Other Information */}
          <div className="space-y-2">
            <h4 className="text-xs font-extrabold text-slate-900 ml-1">Other Information</h4>
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs divide-y divide-slate-100 overflow-hidden">
              
              {/* Suggest Products */}
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenHelp();
                }}
                className="w-full p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer text-left"
              >
                <div className="flex items-center gap-3">
                  <Star className="w-5 h-5 text-slate-700" />
                  <span className="text-xs font-extrabold text-slate-800">Suggest Products</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              {/* Notifications */}
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenWishlist();
                }}
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

      </div>
    </div>
  );
};
