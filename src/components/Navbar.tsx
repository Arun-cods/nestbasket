import React, { useState, useEffect } from 'react';
import { NestBasketLogo } from './NestBasketLogo';
import { MapPin, ShoppingBag, Share2, User, LogOut, Building2, HelpCircle, Search, Zap } from 'lucide-react';
import { CityOption, UserProfile } from '../types';

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
  onOpenDarkstoreTelemetry?: () => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

const ROTATING_SEARCH_ITEMS = [
  'butter',
  'milk',
  'atta',
  'paneer',
  'eggs',
  'maggi',
  'tomatoes',
  'curd',
  'bread',
  'surf excel',
  'toor dal',
  'ghee',
  'chips',
  'cold drinks',
];

export const Navbar: React.FC<NavbarProps> = ({
  selectedCity,
  selectedArea,
  onSelectCity: _onSelectCity,
  onOpenLocationModal,
  cartCount,
  onOpenCart,
  onOpenShare,
  isFounderMode: _isFounderMode,
  onToggleFounderMode,
  currentUser,
  onOpenAuth,
  onLogout,
  onOpenHelp,
  onOpenDarkstoreTelemetry,
  searchQuery,
  onSearchChange,
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % ROTATING_SEARCH_ITEMS.length);
    }, 2400);
    return () => clearInterval(timer);
  }, []);

  const currentPlaceholder = `Search "${ROTATING_SEARCH_ITEMS[placeholderIndex]}"`;

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const el = document.getElementById('catalog-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2 sm:gap-4">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <NestBasketLogo size="md" />
            <div>
              <div className="flex items-center gap-1">
                <span className="font-extrabold text-lg sm:text-xl text-slate-900 tracking-tight">
                  Nest<span className="text-emerald-600">Basket</span>
                </span>
                <span className="hidden xl:inline-block px-1.5 py-0.5 text-[9px] font-bold bg-emerald-100 text-emerald-800 rounded-full border border-emerald-300">
                  ALL-IN-ONE
                </span>
              </div>
              <p className="text-[10px] text-slate-500 hidden xl:block font-medium">
                Blinkit • Zepto • Instamart • BigBasket
              </p>
            </div>
          </div>

          {/* Blinkit-Style "Delivery in 8 minutes" & Address Text Block */}
          <button
            type="button"
            onClick={onOpenLocationModal}
            className="flex flex-col text-left justify-center cursor-pointer min-w-0 max-w-[160px] sm:max-w-[240px] lg:max-w-[280px] shrink-0 py-1 px-1.5 rounded-xl hover:bg-slate-50 transition-colors"
            title="Click to detect live GPS location, change area, or check darkstore availability"
          >
            <div className="font-extrabold text-xs sm:text-[14px] text-slate-900 leading-tight">
              Delivery in 8 minutes
            </div>
            <div className="text-[10.5px] sm:text-xs text-slate-600 font-medium truncate flex items-center gap-0.5 mt-0.5">
              <span className="truncate">{selectedArea || '7-1-211/18, near sixsigma, beside Image Hospitals Lane, ShivBagh, Balkampet'}</span>
              <span className="text-[10px] text-slate-700 font-bold ml-0.5 shrink-0">▾</span>
            </div>
          </button>

          {/* Desktop Blinkit-Style Wide Animated Rotating Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex flex-1 max-w-xl lg:max-w-2xl mx-2 lg:mx-4 relative items-center min-w-0"
          >
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery || ''}
                onChange={(e) => {
                  onSearchChange?.(e.target.value);
                  if (e.target.value.length === 1) {
                    const el = document.getElementById('catalog-section');
                    if (el && window.scrollY < 180) {
                      el.scrollIntoView({ behavior: 'smooth' });
                    }
                  }
                }}
                placeholder={currentPlaceholder}
                className="w-full pl-10 pr-9 py-2.5 bg-[#f8f9fa] hover:bg-slate-100 border border-[#eceff1] rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-slate-400 text-slate-900 font-medium shadow-2xs"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => onSearchChange?.('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-700 font-bold px-1"
                >
                  ✕
                </button>
              )}
            </div>
          </form>

          {/* Right Action Items: Login & My Cart */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Live Darkstore Telemetry Radar Button */}
            {onOpenDarkstoreTelemetry && (
              <button
                onClick={onOpenDarkstoreTelemetry}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 transition-all border border-emerald-300 shadow-2xs cursor-pointer"
                title="Live Quick-Commerce Darkstore Telemetry Radar"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping shrink-0" />
                <Zap className="w-3.5 h-3.5 text-emerald-600" />
                <span className="hidden sm:inline">Radar</span>
              </button>
            )}

            {/* Help Button */}
            <button
              onClick={onOpenHelp}
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-950 transition-all border border-amber-300/80 shadow-xs cursor-pointer"
              title="Report an issue or get help from Founder Desk"
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
              <span>Help</span>
            </button>

            {/* Share Button */}
            <button
              onClick={onOpenShare}
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all border border-slate-200 cursor-pointer"
              title="Share NestBasket"
            >
              <Share2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Share</span>
            </button>

            {/* User Login / Profile Pill */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold hover:bg-emerald-100 transition-colors shadow-xs cursor-pointer"
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
                        className="w-full py-2 px-2.5 rounded-xl bg-slate-900 border border-purple-800 text-amber-400 font-bold text-xs flex items-center justify-between hover:bg-slate-800 transition-colors shadow-sm cursor-pointer"
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
                        className="w-full py-1.5 text-left text-slate-700 hover:bg-slate-100 px-2 rounded-lg font-bold flex items-center justify-between cursor-pointer"
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
                        className="w-full py-1.5 text-left text-slate-700 hover:bg-slate-100 px-2 rounded-lg font-bold flex items-center justify-between text-emerald-700 cursor-pointer"
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
                        className="w-full py-1.5 text-left text-slate-700 hover:bg-slate-100 px-2 rounded-lg font-bold flex items-center justify-between cursor-pointer"
                      >
                        <span>Switch Account</span>
                        <span className="text-[10px] text-slate-400">→</span>
                      </button>

                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          onLogout();
                        }}
                        className="w-full py-1.5 text-left text-red-600 hover:bg-red-50 px-2 rounded-lg font-bold flex items-center gap-1.5 cursor-pointer"
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
                className="text-slate-800 hover:text-slate-950 font-extrabold text-xs sm:text-sm px-2 sm:px-3 py-2 cursor-pointer transition-colors"
              >
                Login
              </button>
            )}

            {/* My Cart Button */}
            <button
              onClick={onOpenCart}
              className={`relative flex items-center gap-2 px-3 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer shrink-0 ${
                cartCount > 0 
                  ? 'bg-[#0c831f] hover:bg-[#0b721b] text-white shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">My Cart</span>
              {cartCount > 0 && (
                <span className="bg-white text-[#0c831f] font-black text-xs px-1.5 py-0.5 rounded-full">
                  {cartCount}
                </span>
              )}
            </button>

          </div>
        </div>

        {/* Mobile Animated Rotating Search Bar */}
        <div className="md:hidden pb-2.5 pt-0.5">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery || ''}
              onChange={(e) => {
                onSearchChange?.(e.target.value);
                if (e.target.value.length === 1) {
                  const el = document.getElementById('catalog-section');
                  if (el && window.scrollY < 180) {
                    el.scrollIntoView({ behavior: 'smooth' });
                  }
                }
              }}
              placeholder={currentPlaceholder}
              className="w-full pl-10 pr-9 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-slate-400 text-slate-900 font-medium"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange?.('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-700 font-bold px-1"
              >
                ✕
              </button>
            )}
          </form>
        </div>

      </div>
    </header>
  );
};
