import React, { useState } from 'react';
import { MapPin, ShoppingBag, Share2, TrendingUp, User, LogOut, CheckCircle, Sparkles, Building2, HelpCircle } from 'lucide-react';
import { CityOption, UserProfile } from '../types';
import { CITIES } from '../data/mockGroceryData';

interface NavbarProps {
  selectedCity: CityOption;
  selectedArea?: string;
  onSelectCity: (city: CityOption) => void;
  onOpenLocationModal: () => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenShare: () => void;
  isFounderMode: boolean;
  onToggleFounderMode: () => void;
  currentUser: UserProfile | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  onOpenHelp?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  selectedCity,
  selectedArea,
  onSelectCity,
  onOpenLocationModal,
  cartCount,
  onOpenCart,
  onOpenShare,
  isFounderMode,
  onToggleFounderMode,
  currentUser,
  onOpenAuth,
  onLogout,
  onOpenHelp,
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2 sm:gap-4">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 text-xl font-black tracking-wider">
              ₹
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl text-slate-900 tracking-tight">
                  Nest<span className="text-emerald-600">Basket</span>
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-800 rounded-full border border-emerald-300">
                  LIVE INDIA
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block font-medium">
                Blinkit vs Zepto vs Instamart vs BB Now
              </p>
            </div>
          </div>

          {/* Interactive City / Location & Service Availability Selector */}
          <button
            type="button"
            onClick={onOpenLocationModal}
            className="flex items-center bg-slate-100 hover:bg-emerald-50 transition-all rounded-xl px-2.5 sm:px-3 py-1.5 border border-slate-200 hover:border-emerald-300 text-xs sm:text-sm group cursor-pointer"
            title="Click to detect live GPS location, change area, or check darkstore availability"
          >
            <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 mr-1.5 sm:mr-2 shrink-0 group-hover:scale-110 transition-transform" />
            <div className="text-left leading-tight min-w-0">
              <div className="font-extrabold text-slate-900 flex items-center gap-1 min-w-0">
                <span className="truncate">{selectedCity.name}</span>
                <span className="text-[10px] text-slate-500 font-normal hidden sm:inline">({selectedCity.pincode})</span>
                <span className="text-[10px] text-emerald-600 font-bold ml-0.5 shrink-0">▾</span>
              </div>
              <div className="text-[10px] text-emerald-700 font-semibold hidden md:block">
                {selectedArea || selectedCity.popularAreas[0]} • Change Location
              </div>
            </div>
          </button>

          {/* Right Action Items */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Help Desk Problem Reporting Button - hidden on mobile since it's on bottom bar */}
            <button
              onClick={onOpenHelp}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-950 transition-all border border-amber-300/80 shadow-sm cursor-pointer"
              title="Report an issue or get help from Founder Desk"
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden sm:inline">Help</span>
            </button>

            {/* Social Share Button - hidden on mobile since it's on bottom bar */}
            <button
              onClick={onOpenShare}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white transition-all shadow-sm cursor-pointer"
              title="Share NestBasket with friends & family"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Share</span>
            </button>

            {/* User Login / Profile Pill */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold hover:bg-emerald-100 transition-all cursor-pointer"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                  <div className="text-left">
                    <div className="leading-tight font-extrabold flex items-center gap-1 text-[11px] sm:text-xs">
                      <span className="truncate max-w-[90px] sm:max-w-[130px]">{currentUser.isFounder ? 'Arun (Founder)' : currentUser.name}</span>
                      {currentUser.isFounder && <span className="text-amber-500 text-[10px]">👑</span>}
                    </div>
                    <div className="text-[9px] text-emerald-700 font-medium truncate max-w-[120px] hidden lg:block">{currentUser.society}</div>
                  </div>
                  <span className="bg-emerald-600 text-white px-1.5 py-0.5 rounded-md text-[10px] font-black shrink-0 hidden sm:inline-block">
                    ₹{currentUser.lifetimeSavingsRupees} Saved
                  </span>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200 p-3.5 z-50 text-xs space-y-3">
                    <div className="pb-2.5 border-b border-slate-100">
                      <div className="font-extrabold text-sm text-slate-900 flex items-center justify-between">
                        <span>{currentUser.name}</span>
                        {currentUser.isFounder && (
                          <span className="text-[9px] bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-full font-black">
                            FOUNDER & CEO
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <Building2 className="w-3 h-3 text-emerald-600" />
                        <span>{currentUser.society}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{currentUser.phone}</div>
                    </div>

                    {/* Private Founder Button (Only visible if currentUser is Founder) */}
                    {currentUser.isFounder && (
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          onToggleFounderMode();
                        }}
                        className="w-full py-2 px-2.5 rounded-xl bg-slate-900 border border-purple-800 text-amber-400 font-bold text-xs flex items-center justify-between hover:bg-slate-800 transition-all cursor-pointer"
                      >
                        <div className="flex items-center gap-1.5">
                          <span>👑</span>
                          <span>Executive Founder Hub</span>
                        </div>
                        <span className="text-[9px] bg-amber-400 text-slate-950 px-1.5 py-0.5 rounded font-black">
                          PRIVATE
                        </span>
                      </button>
                    )}

                    <div className="space-y-1">
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          onOpenHelp?.();
                        }}
                        className="w-full py-1.5 text-left text-slate-700 hover:bg-slate-100 px-2 rounded-lg font-bold flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
                          <span>Help & Report Issue</span>
                        </div>
                        <span className="text-[10px] text-slate-400">→</span>
                      </button>

                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          onOpenShare();
                        }}
                        className="w-full py-1.5 text-left text-slate-700 hover:bg-slate-100 px-2 rounded-lg font-bold flex items-center justify-between text-emerald-700"
                      >
                        <div className="flex items-center gap-2">
                          <Share2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Share NestBasket</span>
                        </div>
                        <span className="text-[10px] text-slate-400">→</span>
                      </button>

                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          onOpenAuth();
                        }}
                        className="w-full py-1.5 text-left text-slate-700 hover:bg-slate-100 px-2 rounded-lg font-bold flex items-center justify-between"
                      >
                        <span>Switch Account</span>
                        <span className="text-[10px] text-slate-400">→</span>
                      </button>

                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          onLogout();
                        }}
                        className="w-full py-1.5 text-left text-red-600 hover:bg-red-50 px-2 rounded-lg font-bold flex items-center gap-1.5"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Log Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white transition-all shadow-sm cursor-pointer"
              >
                <User className="w-3.5 h-3.5 text-emerald-400" />
                <span>Login</span>
              </button>
            )}

            {/* Smart Basket Button */}
            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-md shadow-emerald-600/20 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Cart</span>
              {cartCount > 0 && (
                <span className="bg-amber-400 text-amber-950 font-black text-xs px-2 py-0.5 rounded-full">
                  {cartCount}
                </span>
              )}
            </button>

          </div>
        </div>
      </div>
    </header>
  );
};