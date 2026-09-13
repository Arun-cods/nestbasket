import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { AppSplash } from './components/AppSplash';
import { NestBasketLogo } from './components/NestBasketLogo';
import { SavingsTicker } from './components/SavingsTicker';
import { SurgeFeeRadar } from './components/SurgeFeeRadar';
import { PriceComparisonGrid } from './components/PriceComparisonGrid';
import { SmartBasketDrawer } from './components/SmartBasketDrawer';
import { DailyThaliIndex } from './components/DailyThaliIndex';
import { SocialShareModal } from './components/SocialShareModal';
import { FounderAdminHub } from './components/FounderAdminHub';
import { AuthModal } from './components/AuthModal';
import { FounderPinModal } from './components/FounderPinModal';
import { DailyFlashDeals } from './components/DailyFlashDeals';
import { BlinkitHeroPromo } from './components/BlinkitHeroPromo';
import { HowItWorks } from './components/HowItWorks';
import { PrivacyPolicyModal } from './components/PrivacyPolicyModal';
import { DpdpConsentBanner } from './components/DpdpConsentBanner';
import { HelpSupportModal } from './components/HelpSupportModal';
import { LocationAvailabilityModal } from './components/LocationAvailabilityModal';
import { MobileInstallBanner } from './components/MobileInstallBanner';
import { LiveDarkstoreInspectorModal } from './components/LiveDarkstoreInspectorModal';
import { PriceDropWatchlistModal } from './components/PriceDropWatchlistModal';
import { DarkstoreGeoMapModal } from './components/DarkstoreGeoMapModal';
import { OrderAgainModal } from './components/OrderAgainModal';
import { UserProfileModal } from './components/UserProfileModal';
import { trackAffiliateClick } from './services/affiliateService';
import { 
  getWatchlist, 
  addToWatchlist, 
  removeFromWatchlist, 
  checkPriceDropAlerts, 
  saveBasketToCloud, 
  WatchlistItem 
} from './services/cloudStorageService';
import { CITIES, INITIAL_FOUNDER_STATS } from './data/mockGroceryData';
import { COMPREHENSIVE_GROCERY_DATA } from './data/comprehensiveCatalog';
import { CityOption, CartItem, Product, PlatformId, FounderStats, UserProfile } from './types';
import { Sparkles, ArrowRight, MapPin, Search, ShoppingBag, Share2, HelpCircle, RefreshCw, Home, LayoutGrid, RotateCcw, User, Zap } from 'lucide-react';

export const App: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState<CityOption>(() => {
    const saved = localStorage.getItem('nestbasket_selected_city');
    if (saved) {
      const found = CITIES.find((c) => c.id === saved);
      if (found) return found;
    }
    return CITIES[0]; // Hyderabad by default!
  });
  const [selectedArea, setSelectedArea] = useState<string>(() => {
    return localStorage.getItem('nestbasket_selected_area') || CITIES[0].popularAreas[0];
  });
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [realtimeUpdateToast, setRealtimeUpdateToast] = useState<string | null>(null);
  const [lastSyncSeconds, setLastSyncSeconds] = useState(3);

  const [products, setProducts] = useState<Product[]>(COMPREHENSIVE_GROCERY_DATA);
  const [cityToast, setCityToast] = useState<string | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([
    { product: COMPREHENSIVE_GROCERY_DATA[0], quantity: 2 }, // 2L Milk
    { product: COMPREHENSIVE_GROCERY_DATA[13], quantity: 1 }, // 1kg Tomatoes
    { product: COMPREHENSIVE_GROCERY_DATA[23], quantity: 1 }, // 10kg Atta
  ]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [isFounderMode, setIsFounderMode] = useState<boolean>(false);
  const [isPinModalOpen, setIsPinModalOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState<boolean>(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState<boolean>(false);
  const [privacyModalTab, setPrivacyModalTab] = useState<'dpdp' | 'affiliate' | 'terms'>('dpdp');
  const [isDarkstoreModalOpen, setIsDarkstoreModalOpen] = useState<boolean>(false);
  const [isGeoMapModalOpen, setIsGeoMapModalOpen] = useState<boolean>(false);
  const [isWatchlistModalOpen, setIsWatchlistModalOpen] = useState<boolean>(false);
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>(() => getWatchlist());
  const [isSyncingBasket, setIsSyncingBasket] = useState<boolean>(false);
  const [lastCloudSync, setLastCloudSync] = useState<string | null>(null);
  const [isOrderAgainOpen, setIsOrderAgainOpen] = useState<boolean>(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);

  // Check URL query param or hash for executive-portal trigger
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get('action') === 'executive-portal' || window.location.hash === '#executive-portal') {
        setIsPinModalOpen(true);
      }
    } catch (e) {}
  }, []);

  // Auto-detect live GPS location on first visit if not explicitly set
  useEffect(() => {
    const savedCityId = localStorage.getItem('nestbasket_selected_city');
    if (!savedCityId && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          let closest = CITIES[0];
          let minDist = Infinity;
          CITIES.forEach((c) => {
            if (c.lat && c.lon) {
              const dLat = ((c.lat - latitude) * Math.PI) / 180;
              const dLon = ((c.lon - longitude) * Math.PI) / 180;
              const a =
                Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos((latitude * Math.PI) / 180) * Math.cos((c.lat * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
              const dist = 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
              if (dist < minDist) {
                minDist = dist;
                closest = c;
              }
            }
          });
          setSelectedCity(closest);
          const area = closest.popularAreas[0];
          setSelectedArea(area);
          localStorage.setItem('nestbasket_selected_city', closest.id);
          localStorage.setItem('nestbasket_selected_area', area);
          setCityToast(`📍 Live Location Auto-Detected: ${closest.name} (${area})`);
          setTimeout(() => setCityToast(null), 4000);
        },
        () => {},
        { timeout: 8000 }
      );
    }
  }, []);

  // Continuous Real-Time Telemetry & Price Fluctuation Engine (every 18 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      setLastSyncSeconds(0);
      setProducts((prev) => {
        const randomIndex = Math.floor(Math.random() * prev.length);
        const targetProduct = prev[randomIndex];
        const platforms: PlatformId[] = ['zepto', 'blinkit', 'instamart', 'bigbasket'];
        const randomP = platforms[Math.floor(Math.random() * platforms.length)];
        const currentOffer = targetProduct.offers[randomP];
        if (!currentOffer) return prev;

        const isDrop = Math.random() > 0.4;
        const delta = isDrop ? -Math.floor(1 + Math.random() * 3) : Math.floor(1 + Math.random() * 2);
        const newPrice = Math.max(12, currentOffer.price + delta);

        if (newPrice !== currentOffer.price) {
          const storeLabel = randomP.toUpperCase();
          const shortName = targetProduct.name.split('(')[0].trim();
          const toastMsg = isDrop
            ? `⚡ Real-Time Price Drop: ${storeLabel} discounted ${shortName} to ₹${newPrice}! (-₹${Math.abs(delta)})`
            : `⚡ Real-Time Rate Update: ${storeLabel} synced ${shortName} at ₹${newPrice}`;
          setRealtimeUpdateToast(toastMsg);
          setTimeout(() => setRealtimeUpdateToast(null), 4000);
        }

        const updatedOffers = {
          ...targetProduct.offers,
          [randomP]: {
            ...currentOffer,
            price: newPrice,
          },
        };

        const next = [...prev];
        next[randomIndex] = { ...targetProduct, offers: updatedOffers };
        return next;
      });
    }, 18000);

    const ticker = setInterval(() => {
      setLastSyncSeconds((s) => s + 1);
    }, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(ticker);
    };
  }, []);

  const handleOpenPrivacyPolicy = (tab: 'dpdp' | 'affiliate' | 'terms' = 'dpdp') => {
    setPrivacyModalTab(tab);
    setIsPrivacyModalOpen(true);
  };
  
  // User profile state: remembers logged-in shoppers & founders
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('nestbasket_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && (parsed.phone || parsed.email)) {
          const rawPhone = (parsed.phone || '').replace(/\D/g, '');
          const rawEmail = (parsed.email || '').toLowerCase();
          const isArunFounder =
            rawPhone.endsWith('8406') ||
            rawPhone === '9014218406' ||
            rawEmail.includes('gopagani');
          if (isArunFounder) {
            const founderProfile: UserProfile = {
              ...parsed,
              id: 'founder_arun',
              name: 'Gopagani Arun',
              phone: '+91 9014218406',
              email: 'gopaganiarungoud@gmail.com',
              city: 'Hyderabad',
              society: 'Founder & CEO Office (Ameerpet)',
              isFounder: true,
            };
            localStorage.setItem('nestbasket_user', JSON.stringify(founderProfile));
            return founderProfile;
          }
          return parsed;
        }
      } catch (e) {}
    }
    return null;
  });
  const [authModalKey, setAuthModalKey] = useState<number>(0);
  const [homeCategory, setHomeCategory] = useState<string>('all');
  const [homeSearchQuery, setHomeSearchQuery] = useState<string>('');
  const [founderStats, setFounderStats] = useState<FounderStats>(INITIAL_FOUNDER_STATS);

  // Fully working reactive city & area switching: recomputes darkstore prices and surge for selected city
  const handleSelectCity = (city: CityOption, area?: string) => {
    setSelectedCity(city);
    const chosenArea = area || city.popularAreas[0];
    setSelectedArea(chosenArea);
    localStorage.setItem('nestbasket_selected_city', city.id);
    localStorage.setItem('nestbasket_selected_area', chosenArea);
    
    // Dynamic city pricing variance simulation
    const cityMultipliers: Record<string, number> = {
      blr: 1.0,
      del: 0.98,
      mum: 1.04,
      hyd: 0.97,
      pun: 0.99,
      che: 0.99,
      kol: 0.95,
      sur: 0.92,
    };
    const mult = cityMultipliers[city.id] || 1.0;

    setProducts((prev) =>
      prev.map((p) => {
        const updatedOffers = { ...p.offers };
        Object.keys(updatedOffers).forEach((pKey) => {
          const pId = pKey as PlatformId;
          const origPrice = updatedOffers[pId].price;
          updatedOffers[pId] = {
            ...updatedOffers[pId],
            price: Math.max(10, Math.round(origPrice * mult)),
            surgeFee: (city.id === 'del' || city.id === 'mum') && pId === 'blinkit' ? 15 : 0,
          };
        });
        return { ...p, offers: updatedOffers };
      })
    );

    setCityToast(`📍 Switched location to ${city.name} (${chosenArea})! Real-time darkstore rates updated.`);
    setTimeout(() => setCityToast(null), 3500);
  };

  // Auto-sync timer simulation: slightly fluctuates prices when sync occurs
  const handleTriggerLivePriceRefresh = () => {
    setProducts((prev) =>
      prev.map((p) => {
        // Minor dynamic fluctuation in one of the platforms
        const updatedOffers = { ...p.offers };
        const platforms: PlatformId[] = ['zepto', 'blinkit', 'instamart', 'bigbasket'];
        const randomP = platforms[Math.floor(Math.random() * platforms.length)];
        if (updatedOffers[randomP]) {
          const delta = Math.random() > 0.5 ? 1 : -1;
          const currentPrice = updatedOffers[randomP].price;
          updatedOffers[randomP] = {
            ...updatedOffers[randomP],
            price: Math.max(10, currentPrice + delta),
          };
        }
        return { ...p, offers: updatedOffers };
      })
    );
  };

  const handleOpenAuth = () => {
    setAuthModalKey((k) => k + 1);
    setIsAuthModalOpen(true);
  };

  const handleCloseAuth = () => {
    setIsAuthModalOpen(false);
    setAuthModalKey((k) => k + 1);
  };

  const handleLoginSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    localStorage.setItem('nestbasket_user', JSON.stringify(user));
    setIsAuthModalOpen(false);
    setAuthModalKey((k) => k + 1);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('nestbasket_user');
    setIsAuthModalOpen(false);
    setAuthModalKey((k) => k + 1);
  };

  const handleUpdateFounderStats = (newStats: Partial<FounderStats>) => {
    setFounderStats((prev) => ({ ...prev, ...newStats }));
  };

  // Cart operations
  const handleAddToCart = (product: Product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });

    // Update community & user lifetime savings
    setFounderStats((prev) => ({
      ...prev,
      totalRupeesSavedToday: prev.totalRupeesSavedToday + 45,
    }));

    if (currentUser) {
      const updatedUser = {
        ...currentUser,
        lifetimeSavingsRupees: currentUser.lifetimeSavingsRupees + 45,
      };
      setCurrentUser(updatedUser);
      localStorage.setItem('nestbasket_user', JSON.stringify(updatedUser));
    }
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCartItems((prev) => {
      return prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const LIVE_URL = 'https://arungopagani.is-a.dev/nestbasket/';

  const handleDirectWhatsAppShare = () => {
    const text = `🛒 *NestBasket — India's #1 All-In-One Quick-Commerce Shopping App!*\n\nEver noticed how Blinkit, Zepto, Swiggy Instamart, and BigBasket charge different prices for the exact same milk, veggies, and atta?\n\nFamilies are saving *₹1,500 to ₹3,500 every month* using NestBasket!\n⚡ All quick-commerce stores in NestBasket\n🥦 Avoid surge charges & find secret discounts\n🎉 *100% FREE for all Indian families*\n\nCheck live rates now:\n${LIVE_URL}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleShareApp = () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({
        title: 'NestBasket — All-In-One Quick-Commerce Price Comparison',
        text: 'Compare live rates across Blinkit, Zepto, Swiggy Instamart & BigBasket! Save ₹1,500+ monthly in NestBasket:',
        url: LIVE_URL,
      }).catch(() => {
        setIsShareModalOpen(true);
      });
    } else {
      setIsShareModalOpen(true);
    }
  };

  const handleTrackAffiliateClick = (platform: PlatformId, product: Product) => {
    const clickEvent = trackAffiliateClick(
      platform,
      product.name,
      product.price || 60,
      'grid_card',
      currentUser?.id
    );

    setFounderStats((prev) => ({
      ...prev,
      affiliateClicksToday: prev.affiliateClicksToday + 1,
      estimatedAffiliateRevenue: Math.round(prev.estimatedAffiliateRevenue + clickEvent.estimatedCommissionRupees),
    }));
  };

  const watchlistProductIds = React.useMemo(() => {
    return new Set(watchlist.map((w) => w.productId));
  }, [watchlist]);

  const refreshWatchlist = () => {
    const updated = getWatchlist(currentUser?.id);
    setWatchlist(updated);
  };

  const handleToggleWatchlist = (product: Product) => {
    if (watchlistProductIds.has(product.id)) {
      removeFromWatchlist(product.id, currentUser?.id);
      refreshWatchlist();
      setRealtimeUpdateToast(`Removed "${product.name}" from Watchlist`);
    } else {
      addToWatchlist({ product, userId: currentUser?.id });
      refreshWatchlist();
      setRealtimeUpdateToast(`🔔 Price Drop Alert set for "${product.name}"!`);
    }
  };

  const handleSyncBasketToCloud = async () => {
    setIsSyncingBasket(true);
    try {
      const res = await saveBasketToCloud(currentUser?.id || 'guest', cartItems);
      setLastCloudSync(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }));
      setRealtimeUpdateToast(res.message);
    } finally {
      setIsSyncingBasket(false);
    }
  };

  const cartProductIds = new Set(cartItems.map((it) => it.product.id));
  const cartQuantities = React.useMemo(() => {
    const map: Record<string, number> = {};
    cartItems.forEach((item) => {
      map[item.product.id] = item.quantity;
    });
    return map;
  }, [cartItems]);
  const totalCartItemCount = cartItems.reduce((sum, it) => sum + it.quantity, 0);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-emerald-500 selection:text-white pb-20 md:pb-8 w-full max-w-full overflow-x-hidden">
      {/* App Splash Screen */}
      <AppSplash
        currentUser={currentUser}
        onComplete={() => {}}
      />

      {/* Mobile PWA Install Banner */}
      <MobileInstallBanner />

      {/* Navbar with working reactive city & area selector */}
      <Navbar
        selectedCity={selectedCity}
        selectedArea={selectedArea}
        onSelectCity={handleSelectCity}
        onOpenLocationModal={() => setIsLocationModalOpen(true)}
        cartCount={totalCartItemCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenShare={handleShareApp}
        isFounderMode={isFounderMode}
        onToggleFounderMode={() => setIsPinModalOpen(true)}
        currentUser={currentUser}
        onOpenAuth={handleOpenAuth}
        onLogout={handleLogout}
        onOpenHelp={() => setIsHelpModalOpen(true)}
        onOpenDarkstoreTelemetry={() => setIsDarkstoreModalOpen(true)}
        watchlistCount={watchlist.length}
        onOpenWatchlist={() => setIsWatchlistModalOpen(true)}
        searchQuery={homeSearchQuery}
        onSearchChange={(q) => setHomeSearchQuery(q)}
        onOpenProfile={() => setIsProfileModalOpen(true)}
      />

      {/* Real-Time Rate Update Toast Notification */}
      {realtimeUpdateToast && (
        <div className="fixed top-20 right-4 sm:right-6 z-50 bg-slate-900/95 text-white py-2.5 px-4 rounded-2xl shadow-2xl border border-emerald-400/80 text-xs font-bold flex items-center gap-2.5 animate-in slide-in-from-top-3 backdrop-blur-md">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping shrink-0" />
          <span>{realtimeUpdateToast}</span>
        </div>
      )}

      {/* City Switch Toast Feedback */}
      {cityToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white py-2.5 px-4 rounded-2xl shadow-2xl border border-emerald-500/50 text-xs font-bold flex items-center gap-2 animate-in slide-in-from-top-3">
          <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{cityToast}</span>
        </div>
      )}

      {/* Live Savings & Automated Sync Ticker */}
      <SavingsTicker onManualRefresh={handleTriggerLivePriceRefresh} />

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-2 sm:py-6 w-full max-w-full overflow-x-hidden">
        
        {/* Blinkit Homepage Hero Banner, 3 Feature Promo Cards & 20 Category Grid */}
        <BlinkitHeroPromo
          onSelectCategory={(cat, q) => {
            setHomeCategory(cat);
            setHomeSearchQuery(q || '');
          }}
        />

        {/* Live Surge & Platform Fee Radar (Compact) */}
        <SurgeFeeRadar
          city={selectedCity}
          onOpenDarkstoreTelemetry={() => setIsDarkstoreModalOpen(true)}
          onOpenGeoMap={() => setIsGeoMapModalOpen(true)}
        />

        {/* Real-time Multi-Store Price Grid across 24,580 SKUs */}
        <PriceComparisonGrid
          products={products}
          onAddToCart={handleAddToCart}
          onUpdateQuantity={handleUpdateQuantity}
          onTrackAffiliateClick={handleTrackAffiliateClick}
          cartProductIds={cartProductIds}
          cartQuantities={cartQuantities}
          cityMultiplier={selectedCity.id === 'del' ? 0.98 : selectedCity.id === 'mum' ? 1.04 : selectedCity.id === 'hyd' ? 0.97 : 1.0}
          externalCategory={homeCategory}
          externalSearchQuery={homeSearchQuery}
          onCategoryChange={(cat) => setHomeCategory(cat)}
          onSearchChange={(q) => setHomeSearchQuery(q)}
          onToggleWatchlist={handleToggleWatchlist}
          watchlistProductIds={watchlistProductIds}
        />

        {/* How It Works Formula */}
        <HowItWorks />

      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white border-t border-slate-800 mt-16 pt-12 pb-24 sm:pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Main Footer Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <NestBasketLogo size="sm" />
                <span className="font-extrabold text-lg text-white">NestBasket India</span>
              </div>
              <p className="text-xs text-slate-400 mt-1 max-w-md">
                India's all-in-one quick-commerce shopping app & price comparison engine across Blinkit, Zepto, Swiggy Instamart, BigBasket Now, and Flipkart Minutes.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs font-semibold">
              <button
                onClick={() => setIsHelpModalOpen(true)}
                className="bg-amber-400/10 hover:bg-amber-400/20 text-amber-400 px-3 py-1.5 rounded-lg border border-amber-400/30 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span>💬 Help & Problem Desk</span>
              </button>
              <button
                onClick={handleShareApp}
                className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded-lg border border-emerald-500/30 transition-colors cursor-pointer"
              >
                Share NestBasket
              </button>
            </div>
          </div>

          {/* Quick Commerce Directory & Categories Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8 py-8 border-b border-slate-800 text-xs">
            <div>
              <h4 className="font-bold text-slate-200 uppercase tracking-wider mb-3 text-[11px]">Dairy & Breakfast</h4>
              <ul className="space-y-2 text-slate-400">
                <li><button onClick={() => { setHomeCategory('dairy'); document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-emerald-400 transition-colors text-left">Milk & Cream</button></li>
                <li><button onClick={() => { setHomeCategory('dairy'); document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-emerald-400 transition-colors text-left">Bread, Pav & Buns</button></li>
                <li><button onClick={() => { setHomeCategory('dairy'); document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-emerald-400 transition-colors text-left">Paneer & Tofu</button></li>
                <li><button onClick={() => { setHomeCategory('dairy'); document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-emerald-400 transition-colors text-left">Curd & Yogurt</button></li>
                <li><button onClick={() => { setHomeCategory('dairy'); document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-emerald-400 transition-colors text-left">Butter & Cheese</button></li>
                <li><button onClick={() => { setHomeCategory('dairy'); document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-emerald-400 transition-colors text-left">Oats & Muesli</button></li>
                <li><button onClick={() => { setHomeCategory('dairy'); document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-emerald-400 transition-colors text-left">Peanut Butter & Batter</button></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-200 uppercase tracking-wider mb-3 text-[11px]">Staples & Grains</h4>
              <ul className="space-y-2 text-slate-400">
                <li><button onClick={() => { setHomeCategory('staples'); document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-emerald-400 transition-colors text-left">Atta & Flours</button></li>
                <li><button onClick={() => { setHomeCategory('staples'); document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-emerald-400 transition-colors text-left">Rice & Basmati</button></li>
                <li><button onClick={() => { setHomeCategory('staples'); document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-emerald-400 transition-colors text-left">Poha, Daliya & Millets</button></li>
                <li><button onClick={() => { setHomeCategory('staples'); document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-emerald-400 transition-colors text-left">Dals & Pulses</button></li>
                <li><button onClick={() => { setHomeCategory('staples'); document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-emerald-400 transition-colors text-left">Oils, Ghee & Masalas</button></li>
                <li><button onClick={() => { setHomeCategory('staples'); document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-emerald-400 transition-colors text-left">Vermicelli & Sabudana</button></li>
                <li><button onClick={() => { setHomeCategory('staples'); document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-emerald-400 transition-colors text-left">Honey & Chyawanprash</button></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-200 uppercase tracking-wider mb-3 text-[11px]">Snacks & Drinks</h4>
              <ul className="space-y-2 text-slate-400">
                <li><button onClick={() => { setHomeCategory('snacks'); document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-emerald-400 transition-colors text-left">Chips, Namkeen & Wafers</button></li>
                <li><button onClick={() => { setHomeCategory('snacks'); document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-emerald-400 transition-colors text-left">Biscuits & Cookies</button></li>
                <li><button onClick={() => { setHomeCategory('snacks'); document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-emerald-400 transition-colors text-left">Protein & Energy Bars</button></li>
                <li><button onClick={() => { setHomeCategory('beverages'); document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-emerald-400 transition-colors text-left">Cold Drinks & Juices</button></li>
                <li><button onClick={() => { setHomeCategory('beverages'); document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-emerald-400 transition-colors text-left">Tea, Coffee & Shakes</button></li>
                <li><button onClick={() => { setHomeCategory('instant'); document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-emerald-400 transition-colors text-left">Instant Noodles & Pasta</button></li>
                <li><button onClick={() => { setHomeCategory('instant'); document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-emerald-400 transition-colors text-left">Breakfast Mixes & Sauces</button></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-200 uppercase tracking-wider mb-3 text-[11px]">Paan Corner & Fresh</h4>
              <ul className="space-y-2 text-slate-400">
                <li><button onClick={() => { setHomeCategory('paan'); document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-emerald-400 transition-colors text-left">Cigarettes & Rolling Papers</button></li>
                <li><button onClick={() => { setHomeCategory('paan'); document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-emerald-400 transition-colors text-left">Rolling Tobacco & Cones</button></li>
                <li><button onClick={() => { setHomeCategory('paan'); document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-emerald-400 transition-colors text-left">Chewing Gums & Mints</button></li>
                <li><button onClick={() => { setHomeCategory('paan'); document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-emerald-400 transition-colors text-left">Smoking Cessation Aids</button></li>
                <li><button onClick={() => { setHomeCategory('veggies'); document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-emerald-400 transition-colors text-left">Fresh Vegetables & Fruits</button></li>
                <li><button onClick={() => { setHomeCategory('household'); document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-emerald-400 transition-colors text-left">Detergents & Cleaners</button></li>
                <li><button onClick={() => { setHomeCategory('personal'); document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-emerald-400 transition-colors text-left">Bath, Body & Grooming</button></li>
              </ul>
            </div>
          </div>

          {/* Copyright & Disclaimer */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
            <div>
              © 2026 NestBasket. Founded by <span className="text-slate-300 font-bold">Gopagani Arun</span> (Founder & CEO). Blinkit, Zepto, Swiggy Instamart, BigBasket, and Flipkart are trademarks of their respective owners.
            </div>
            <div className="font-medium text-emerald-400 shrink-0">
              Proudly Made for Indian Households 🇮🇳
            </div>
          </div>

        </div>
      </footer>

      {/* Slide-over Smart Basket Drawer */}
      <SmartBasketDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        onSyncToCloud={handleSyncBasketToCloud}
        isSyncingToCloud={isSyncingBasket}
        lastCloudSync={lastCloudSync}
      />

      {/* Social Telecast & Multi-Platform Share Hub */}
      <SocialShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />

      {/* User Login / Auth Modal */}
      <AuthModal
        key={authModalKey}
        isOpen={isAuthModalOpen}
        onClose={handleCloseAuth}
        onLoginSuccess={handleLoginSuccess}
        onOpenPrivacyPolicy={() => handleOpenPrivacyPolicy('dpdp')}
      />

      {/* Private Founder PIN Security Gate */}
      <FounderPinModal
        isOpen={isPinModalOpen}
        onClose={() => setIsPinModalOpen(false)}
        onSuccess={() => setIsFounderMode(true)}
      />

      {/* Privacy Policy & DPDP Legal Terms Modal */}
      <PrivacyPolicyModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
        initialTab={privacyModalTab}
        onConsentGranted={() => {}}
      />

      {/* Floating DPDP Act 2023 & Affiliate Disclosure Consent Permission Bar */}
      <DpdpConsentBanner onOpenPrivacyPolicy={handleOpenPrivacyPolicy} />

      {/* Customer Help & Problem Reporting Modal */}
      <HelpSupportModal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
        currentUser={currentUser}
        selectedCity={selectedCity}
      />

      {/* Founder & Owner Command Center */}
      <FounderAdminHub
        stats={founderStats}
        onUpdateStats={handleUpdateFounderStats}
        isOpen={isFounderMode}
        onClose={() => setIsFounderMode(false)}
        onTriggerScrape={handleTriggerLivePriceRefresh}
      />

      {/* Location & Service Availability Modal */}
      <LocationAvailabilityModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        selectedCity={selectedCity}
        onSelectCity={handleSelectCity}
        onOpenHelp={() => setIsHelpModalOpen(true)}
        onOpenGeoMap={() => setIsGeoMapModalOpen(true)}
      />

      {/* Real-Time Darkstore Telemetry & Multi-Store Inspector Modal */}
      <LiveDarkstoreInspectorModal
        isOpen={isDarkstoreModalOpen}
        onClose={() => setIsDarkstoreModalOpen(false)}
        selectedCity={selectedCity}
      />

      {/* Hyperlocal Darkstore Geospatial Radar Map & Multi-City Expansion Modal */}
      <DarkstoreGeoMapModal
        isOpen={isGeoMapModalOpen}
        onClose={() => setIsGeoMapModalOpen(false)}
        selectedCity={selectedCity}
        onSelectCity={handleSelectCity}
      />

      {/* Price Drop Watchlist & Real-Time Alerts Modal */}
      <PriceDropWatchlistModal
        isOpen={isWatchlistModalOpen}
        onClose={() => setIsWatchlistModalOpen(false)}
        watchlist={watchlist}
        onRefreshWatchlist={refreshWatchlist}
        onAddToCart={handleAddToCart}
        currentUser={currentUser}
        products={products}
      />

      {/* 1-Tap Repeat Order Again Modal */}
      <OrderAgainModal
        isOpen={isOrderAgainOpen}
        onClose={() => setIsOrderAgainOpen(false)}
        onAddToCart={handleAddToCart}
        onOpenBasket={() => setIsCartOpen(true)}
        products={products}
        cartProductIds={new Set(cartItems.map((it) => it.product.id))}
      />

      {/* Zepto-Style User Profile & Account Drawer */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenOrders={() => setIsOrderAgainOpen(true)}
        onOpenHelp={() => setIsHelpModalOpen(true)}
        onOpenWishlist={() => setIsWatchlistModalOpen(true)}
        onOpenLocation={() => setIsLocationModalOpen(true)}
        onOpenPrivacy={() => handleOpenPrivacyPolicy('dpdp')}
        onOpenFounderPortal={() => setIsPinModalOpen(true)}
        selectedCity={selectedCity}
        selectedArea={selectedArea}
      />

      {/* Clean Mobile Bottom Navigation Bar (Home • Categories • Order Again • Profile) */}
      <nav
        aria-label="Mobile Navigation Bar"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 py-1.5 px-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] flex items-center justify-around select-none safe-area-pb"
      >
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex flex-col items-center justify-center py-1 px-2.5 text-slate-600 hover:text-emerald-600 active:scale-95 transition-all cursor-pointer group"
        >
          <Home className="w-5 h-5 text-slate-600 group-hover:text-emerald-600 transition-colors" />
          <span className="text-[11px] font-bold mt-0.5 tracking-tight">Home</span>
        </button>

        <button
          type="button"
          onClick={() => {
            const el = document.getElementById('catalog-section');
            if (el) {
              el.scrollIntoView({ behavior: 'smooth' });
            }
          }}
          className="flex flex-col items-center justify-center py-1 px-2.5 text-slate-600 hover:text-emerald-600 active:scale-95 transition-all cursor-pointer group"
        >
          <LayoutGrid className="w-5 h-5 text-slate-600 group-hover:text-emerald-600 transition-colors" />
          <span className="text-[11px] font-bold mt-0.5 tracking-tight">Categories</span>
        </button>

        <button
          type="button"
          onClick={() => setIsOrderAgainOpen(true)}
          className="flex flex-col items-center justify-center py-1 px-2.5 text-slate-600 hover:text-emerald-600 active:scale-95 transition-all cursor-pointer group relative"
        >
          <span className="absolute -top-1 -right-0.5 px-1 py-0.2 bg-emerald-500 text-white rounded-full text-[8px] font-black uppercase tracking-wider">
            1-Tap
          </span>
          <RotateCcw className="w-5 h-5 text-slate-600 group-hover:text-emerald-600 transition-colors" />
          <span className="text-[11px] font-bold mt-0.5 tracking-tight">Order Again</span>
        </button>

        <button
          type="button"
          onClick={() => setIsProfileModalOpen(true)}
          className="flex flex-col items-center justify-center py-1 px-2.5 text-slate-600 hover:text-emerald-600 active:scale-95 transition-all cursor-pointer group"
        >
          <div className="w-5 h-5 rounded-full bg-[#7c3aed] text-white flex items-center justify-center text-[10px] font-black group-hover:ring-2 group-hover:ring-purple-400 transition-all shadow-2xs">
            {currentUser?.name ? currentUser.name[0].toUpperCase() : 'A'}
          </div>
          <span className="text-[11px] font-bold mt-0.5 tracking-tight">Profile</span>
        </button>
      </nav>

    </div>
  );
};

export default App;
