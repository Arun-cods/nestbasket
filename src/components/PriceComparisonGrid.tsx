import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, Sparkles, ShoppingBag, ExternalLink, ArrowUpDown, Check, Tag, 
  ChevronDown, Database, Zap, ArrowLeft, ArrowRight, Layers, SlidersHorizontal, RefreshCw,
  Plus, Minus, LayoutGrid, List, MoveHorizontal
} from 'lucide-react';
import { Product, PlatformId } from '../types';
import { PLATFORMS } from '../data/mockGroceryData';
import { MASTER_CATALOG_CATEGORIES } from '../data/comprehensiveCatalog';
import { queryMasterCatalog, CATEGORY_TOTALS } from '../data/masterCatalogEngine';
import { getDirectStoreBuyUrl, isStoreOfferVerified } from '../utils/storeLinks';
import { searchPersistedCatalog } from '../lib/catalog/liveSearch';
import { verifiedRowsToProducts } from '../lib/catalog/toProduct';

interface PriceComparisonGridProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  onUpdateQuantity?: (productId: string, delta: number) => void;
  onTrackAffiliateClick: (platform: PlatformId, product: Product) => void;
  cartProductIds: Set<string>;
  cartQuantities?: Record<string, number>;
  cityMultiplier?: number;
  externalCategory?: string;
  externalSearchQuery?: string;
  onCategoryChange?: (category: string) => void;
  onSearchChange?: (query: string) => void;
}

export const PriceComparisonGrid: React.FC<PriceComparisonGridProps> = ({
  products: _legacyProducts,
  onAddToCart,
  onUpdateQuantity,
  onTrackAffiliateClick,
  cartProductIds,
  cartQuantities,
  cityMultiplier = 1.0,
  externalCategory,
  externalSearchQuery,
  onCategoryChange: _onCategoryChange,
  onSearchChange: _onSearchChange,
}) => {
  const [searchQuery, setSearchQuery] = useState(externalSearchQuery || '');
  const [selectedCategory, setSelectedCategory] = useState<string>(externalCategory || 'all');
  const [selectedWeightFilter, setSelectedWeightFilter] = useState<'all' | 'grams' | 'half-kg' | '1kg-plus' | 'packs'>('all');
  const [onlyEssentials, setOnlyEssentials] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'savings' | 'price-asc' | 'price-desc'>('savings');
  const [mobileLayout, setMobileLayout] = useState<'single' | 'double' | 'scroll'>('scroll');
  const [liveProducts, setLiveProducts] = useState<Product[]>([]);
  const [liveSearchLoading, setLiveSearchLoading] = useState(false);
  const [liveSearchError, setLiveSearchError] = useState<string | null>(null);

  React.useEffect(() => {
    if (externalCategory !== undefined && externalCategory !== selectedCategory) {
      setSelectedCategory(externalCategory);
    }
  }, [externalCategory]);

  React.useEffect(() => {
    if (externalSearchQuery !== undefined && externalSearchQuery !== searchQuery) {
      setSearchQuery(externalSearchQuery);
    }
  }, [externalSearchQuery]);
  
  // Navigation & Load More controls
  const [displayMode, setDisplayMode] = useState<'infinite' | 'pages'>('infinite');
  const [cumulativePageSize, setCumulativePageSize] = useState<number>(120);
  const [itemsPerPage, setItemsPerPage] = useState<number>(60);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [jumpPageInput, setJumpPageInput] = useState<string>('');

  const quickSearchTags = [
    'Amul Milk', 'Tomatoes 500g', 'Onions 1kg', 'Atta 10kg', 'Toor Dal 500g',
    'Butter 100g', 'Sunflower Oil', 'Eggs 12s', 'Maggi 70g', 'Surf Excel 1kg'
  ];

  useEffect(() => {
    let cancelled = false;
    const query = searchQuery.trim();
    if (!query) {
      setLiveProducts([]);
      setLiveSearchError(null);
      return;
    }
    setLiveSearchLoading(true);
    setLiveSearchError(null);
    const timer = window.setTimeout(async () => {
      try {
        const rows = await searchPersistedCatalog(query);
        if (!cancelled) setLiveProducts(verifiedRowsToProducts(rows));
      } catch (error) {
        if (!cancelled) {
          setLiveProducts([]);
          setLiveSearchError(error instanceof Error ? error.message : 'Verified catalog search failed');
        }
      } finally {
        if (!cancelled) setLiveSearchLoading(false);
      }
    }, 300);
    return () => { cancelled = true; window.clearTimeout(timer); };
  }, [searchQuery]);

  // Query the Master Catalog Engine across all 24,580 SKUs
  const catalogResponse = useMemo(() => {
    const effectivePage = displayMode === 'infinite' ? 1 : currentPage;
    const effectivePageSize = displayMode === 'infinite' ? cumulativePageSize : itemsPerPage;

    return queryMasterCatalog({
      category: selectedCategory,
      searchQuery,
      page: effectivePage,
      pageSize: effectivePageSize,
      sortBy,
      onlyEssentials,
      cityMultiplier,
    });
  }, [selectedCategory, searchQuery, displayMode, cumulativePageSize, itemsPerPage, currentPage, sortBy, onlyEssentials, cityMultiplier]);

  const displayedProducts = useMemo(() => {
    const source = liveProducts;
    if (selectedWeightFilter === 'all') return source;
    return source.filter((p) => {
      const u = (p.unit || '').toLowerCase();
      if (selectedWeightFilter === 'half-kg') {
        return /\b500\s*(g|gm|gram|ml)\b|0\.5\s*kg/i.test(u);
      }
      if (selectedWeightFilter === 'grams') {
        return /\b(50|70|73|75|85|90|100|120|125|150|180|200|250|280|300|350|400)\s*(g|gm|gram|ml)\b/i.test(u) && !/\b500\s*(g|gm|ml)/i.test(u);
      }
      if (selectedWeightFilter === '1kg-plus') {
        return /\b([1-9][0-9]?)\s*(kg|l|litre|liter)\b/i.test(u);
      }
      if (selectedWeightFilter === 'packs') {
        return /\b(pack|tray|pcs|bar|bottle|can|bag|combo|box)\b/i.test(u);
      }
      return true;
    });
  }, [catalogResponse.items, selectedWeightFilter, liveProducts, searchQuery]);

  const totalCategorySkus = liveProducts.length;
  const totalPages = Math.max(1, Math.ceil(liveProducts.length / itemsPerPage));

  // Calculate cheapest store and max savings for a product
  const getProductStats = (product: Product) => {
    const validOffers = Object.values(product.offers).filter((o) => o.inStock && isStoreOfferVerified(o.platform, product.name, o.productUrl || o.affiliateUrl) && o.price != null);
    if (validOffers.length === 0) return null;

    const lowestOffer = validOffers.reduce((min, o) => (o.price < min.price ? o : min), validOffers[0]);
    const highestOffer = validOffers.reduce((max, o) => (o.price > max.price ? o : max), validOffers[0]);
    const maxSavings = highestOffer.price - lowestOffer.price;
    const savingsPercent = highestOffer.price > 0 ? Math.round(((highestOffer.price - lowestOffer.price) / highestOffer.price) * 100) : 0;

    return { lowestOffer, highestOffer, maxSavings, savingsPercent };
  };

  const handleCategoryChange = (catId: string) => {
    setSelectedCategory(catId);
    setCurrentPage(1);
  };

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };

  const handleLoadMore = (increment: number) => {
    setCumulativePageSize((prev) => Math.min(prev + increment, totalCategorySkus));
  };

  
    const handleJumpPage = (e: React.FormEvent) => {
    e.preventDefault();
    const p = parseInt(jumpPageInput);
    if (p >= 1 && p <= totalPages) {
      setCurrentPage(p);
      setJumpPageInput('');
    }
  };

  return (
    <section className="mb-12" id="catalog-section">
      
      {/* Master Data Metrics Badge */}
      <div className="mb-4 bg-slate-900 text-white rounded-2xl p-3.5 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-slate-800 shadow-md w-full max-w-full min-w-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold shrink-0">
            <Database className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-extrabold text-white text-xs sm:text-base">
                Verified Catalog Results
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                VERIFIED DATA
              </span>
            </div>
            <div className="text-slate-400 text-[11px] sm:text-xs mt-0.5 break-words">
              Search results are shown only when a connected source has verified the product ID, direct URL, current price, stock and timestamp.
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <div className="flex items-center gap-1.5 text-[11px] font-bold bg-slate-800 text-emerald-400 px-3 py-1.5 rounded-xl border border-slate-700">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Multi-App Arbitrage Active</span>
          </div>
        </div>
      </div>

      {/* Search, Filter & Category Bar */}
      <div className="bg-white rounded-3xl p-3.5 sm:p-6 shadow-sm border border-slate-200 mb-6 space-y-4 w-full max-w-full min-w-0 overflow-hidden">
        
        {/* Top Controls: Search Input + Sorting */}
        <div className="flex flex-col md:flex-row gap-3 md:items-center justify-between w-full max-w-full">
          
          {/* Universal Search Input */}
          <div className="relative flex-1 min-w-0 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search the verified catalog: Nutella, Atta, Amul Gold, Tomatoes, Surf Excel..."
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-slate-400 text-slate-900 font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => handleSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-bold px-1.5 py-0.5"
              >
                Clear
              </button>
            )}
          </div>

          {/* Essentials & Sorting Controls */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end">
            <button
              onClick={() => setOnlyEssentials(!onlyEssentials)}
              className={`px-3 py-2.5 rounded-2xl text-xs font-bold border transition-all flex items-center gap-1.5 shrink-0 ${
                onlyEssentials
                  ? 'bg-emerald-50 border-emerald-400 text-emerald-700'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Essentials Only</span>
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2.5 text-xs font-semibold text-slate-700 shrink-0">
              <ArrowUpDown className="w-3.5 h-3.5 mr-1.5 text-slate-400 shrink-0" />
              <select
                aria-label="Sort items"
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="bg-transparent focus:outline-none cursor-pointer pr-1"
              >
                <option value="savings">Highest Savings</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Quick Search Tag Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px] w-full max-w-full min-w-0">
          <span className="text-slate-400 font-bold shrink-0">Popular:</span>
          {quickSearchTags.map((tag) => (
            <button
              key={tag}
              onClick={() => handleSearchChange(tag)}
              className={`px-2.5 py-1 rounded-full font-semibold shrink-0 transition-colors border ${
                searchQuery === tag
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Verified Catalog Categories */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-slate-100 pb-1 scrollbar-none w-full max-w-full min-w-0">
          {MASTER_CATALOG_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className={`px-3.5 py-2 rounded-2xl text-xs font-bold shrink-0 transition-all flex items-center gap-1.5 ${
                selectedCategory === cat.id
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Quick-Commerce Weight & Unit Variation Filter Bar (Grams, Half Kg, 1Kg+, Packs) */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-slate-100 pb-1 scrollbar-none text-xs w-full max-w-full min-w-0">
          <span className="text-[11px] font-bold text-slate-400 shrink-0 uppercase tracking-wider">
            Weight / Size:
          </span>
          {[
            { id: 'all', label: 'All Sizes' },
            { id: 'grams', label: '⚖️ Grams (50g - 250g)' },
            { id: 'half-kg', label: '🥗 Half Kg (500g / 500ml)' },
            { id: '1kg-plus', label: '📦 1 Kg & Above' },
            { id: 'packs', label: '🧺 Multipacks & Combos' },
          ].map((w) => (
            <button
              key={w.id}
              onClick={() => setSelectedWeightFilter(w.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all border ${
                selectedWeightFilter === w.id
                  ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-sm font-black'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {w.label}
            </button>
          ))}
        </div>

        {/* Status Bar: Live count + Display Mode Switcher */}
        <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs w-full max-w-full min-w-0">
          <div className="flex items-center gap-2 text-slate-600 font-bold min-w-0">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span className="truncate">
              Showing <strong className="text-slate-900 font-black">{displayedProducts.length}</strong> of{' '}
              <strong className="text-emerald-700 font-black">{totalCategorySkus.toLocaleString('en-IN')}</strong> items
            </span>
            {searchQuery && (
              <span className="text-slate-400 font-normal truncate hidden sm:inline">
                ("{searchQuery}")
              </span>
            )}
          </div>

          {/* Display Mode Toggle & Batch Size Controls */}
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto min-w-0">
            <div className="flex items-center bg-slate-100 rounded-xl p-0.5 text-[11px] font-bold overflow-x-auto max-w-full scrollbar-none">
              <span className="px-2 text-slate-400 shrink-0">View:</span>
              <button
                onClick={() => setCumulativePageSize(60)}
                className={`px-2 py-0.5 rounded-lg transition-all shrink-0 ${
                  cumulativePageSize === 60 ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                60
              </button>
              <button
                onClick={() => setCumulativePageSize(120)}
                className={`px-2 py-0.5 rounded-lg transition-all shrink-0 ${
                  cumulativePageSize === 120 ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                120
              </button>
              <button
                onClick={() => setCumulativePageSize(300)}
                className={`px-2 py-0.5 rounded-lg transition-all shrink-0 ${
                  cumulativePageSize === 300 ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                300
              </button>
              <button
                onClick={() => setCumulativePageSize(1000)}
                className={`px-2 py-0.5 rounded-lg transition-all shrink-0 ${
                  cumulativePageSize === 1000 ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                1,000
              </button>
              <button
                onClick={() => setCumulativePageSize(totalCategorySkus)}
                className={`px-2 py-0.5 rounded-lg font-black transition-all flex items-center gap-1 shrink-0 ${
                  cumulativePageSize >= totalCategorySkus
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'bg-purple-100 text-purple-800 hover:bg-purple-200'
                }`}
              >
                <Zap className="w-3 h-3 text-amber-500" />
                <span>All</span>
              </button>
            </div>

            <div className="flex items-center bg-slate-100 rounded-xl p-0.5 text-[11px] font-bold shrink-0">
              <button
                onClick={() => setDisplayMode('infinite')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  displayMode === 'infinite' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Scroll
              </button>
              <button
                onClick={() => setDisplayMode('pages')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  displayMode === 'pages' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Pages ({totalPages})
              </button>
            </div>

            {/* Layout Toggle: Scroll in 1 Line vs Full Section vs 2 in 1 Line */}
            <div className="flex items-center bg-slate-100 rounded-xl p-0.5 text-[11px] font-bold shrink-0">
              <button
                type="button"
                onClick={() => setMobileLayout('scroll')}
                className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                  mobileLayout === 'scroll' ? 'bg-white text-emerald-700 shadow-sm font-black' : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Horizontal Scroll: Multiple items in 1 line"
              >
                <MoveHorizontal className="w-3.5 h-3.5 text-emerald-600" />
                <span>Scroll (1 Line)</span>
              </button>
              <button
                type="button"
                onClick={() => setMobileLayout('double')}
                className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                  mobileLayout === 'double' ? 'bg-white text-emerald-700 shadow-sm font-black' : 'text-slate-600 hover:text-slate-900'
                }`}
                title="2 in 1 Line"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>2 in 1 Line</span>
              </button>
              <button
                type="button"
                onClick={() => setMobileLayout('single')}
                className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                  mobileLayout === 'single' ? 'bg-white text-emerald-700 shadow-sm font-black' : 'text-slate-600 hover:text-slate-900'
                }`}
                title="1 Full Section per product"
              >
                <List className="w-3.5 h-3.5" />
                <span>Full Section</span>
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* 24,580 Multi-Store Products Grid */}
      <div className={
        mobileLayout === 'scroll'
          ? 'flex sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 overflow-x-auto sm:overflow-x-visible scrollbar-none pb-4 sm:pb-0 pt-1 w-full max-w-full snap-x'
          : mobileLayout === 'double'
          ? 'grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-6 w-full max-w-full'
          : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full max-w-full'
      }>
        {displayedProducts.map((product) => {
          const stats = getProductStats(product);
          const isAddedToCart = cartProductIds.has(product.id);
          const itemQuantity = cartQuantities ? (cartQuantities[product.id] || 0) : (isAddedToCart ? 1 : 0);

          return (
            <div
              key={product.id}
              className={
                mobileLayout === 'scroll'
                  ? 'w-[84vw] max-w-[340px] shrink-0 snap-start sm:w-auto sm:max-w-none bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between hover:border-slate-300'
                  : 'bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between hover:border-slate-300 w-full max-w-full'
              }
            >
              {/* Product Header & Image */}
              <div>
                {/* Sponsored Brand Banner if present */}
                {product.sponsored && (
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-200 px-3 py-1 flex items-center justify-between text-[11px]">
                    <span className="font-bold text-amber-900 flex items-center gap-1">
                      <Tag className="w-3 h-3 text-amber-600" />
                      Sponsored by {product.sponsored.brandName}
                    </span>
                    <span className="text-[10px] text-amber-700 hidden sm:inline">{product.sponsored.tagline}</span>
                  </div>
                )}

                <div className={mobileLayout === 'double' ? 'p-3 sm:p-5' : 'p-4 sm:p-5'}>
                  <div className={mobileLayout === 'double' ? 'flex flex-col sm:flex-row gap-2 sm:gap-4 items-start' : 'flex gap-4 items-start'}>
                    <img
                      src={product.canonicalImageUrl || product.imageUrl}
                      alt={product.name}
                      className={
                        mobileLayout === 'double'
                          ? 'w-full h-24 sm:w-24 sm:h-24 object-cover rounded-xl border border-slate-100 shrink-0 bg-slate-50'
                          : 'w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-2xl border border-slate-100 shrink-0 bg-slate-50'
                      }
                      loading="lazy"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-[9.5px] sm:text-[11px] font-bold text-emerald-700 bg-emerald-50 px-1.5 sm:px-2 py-0.5 rounded-md uppercase tracking-wider">
                        {product.brand}
                      </span>
                      <h3 className="font-black text-xs sm:text-base text-slate-900 leading-snug mt-1 line-clamp-2">
                        {product.name}
                      </h3>
                      {product.nameHindi && (
                        <p className="text-[11px] sm:text-xs text-slate-500 font-medium truncate">{product.nameHindi}</p>
                      )}
                      <div className="mt-1 flex flex-wrap items-center gap-1.5 sm:gap-2">
                        <span className="text-[10px] sm:text-xs bg-slate-100 text-slate-700 px-1.5 sm:px-2 py-0.5 rounded-lg font-semibold">
                          {product.unit}
                        </span>
                        {stats && stats.maxSavings > 0 && (
                          <span className="text-[10px] sm:text-xs bg-emerald-100 text-emerald-800 font-black px-1.5 sm:px-2 py-0.5 rounded-full border border-emerald-200">
                            Save ₹{stats.maxSavings} ({stats.savingsPercent}%)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Multi-Store Price Comparison Matrix (Full details - Never Hidden) */}
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                      <span>Store Offers</span>
                      <span className="text-slate-400 font-mono text-[10px]">Verified where available</span>
                    </div>

                    <div className="space-y-1.5">
                      {(Object.keys(PLATFORMS) as PlatformId[]).map((platformId) => {
                        const platform = PLATFORMS[platformId];
                        const offer = product.offers[platformId];
                        const isVerified = isStoreOfferVerified(platformId, product.name, offer?.productUrl || offer?.affiliateUrl);
                        const isLowest = Boolean(stats && stats.lowestOffer.platform === platformId && offer.inStock && isVerified && offer.price != null);

                        if (!offer) return null;

                        return (
                          <a
                            key={platformId}
                            href={isVerified ? (offer.productUrl || offer.affiliateUrl) : getDirectStoreBuyUrl(platformId, product.name)}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => onTrackAffiliateClick(platformId, product)}
                            title={isVerified ? `Verified product listing on ${platform.name}` : `Search ${product.name} on ${platform.name}`}
                            className={`flex items-center justify-between p-2 rounded-xl text-xs transition-colors hover:ring-2 hover:ring-emerald-400/30 cursor-pointer ${
                              isLowest
                                ? 'bg-emerald-50 border border-emerald-300 font-bold text-emerald-950 shadow-xs'
                                : 'bg-slate-50 border border-slate-100 text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span>{platform.logo}</span>
                              <span className="font-semibold">{platform.name}</span>
                              {isVerified && (
                                <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100/80 px-1.5 py-0.5 rounded border border-emerald-300 flex items-center gap-0.5" title="100% Verified Direct SKU Link">
                                  <Check className="w-2.5 h-2.5 text-emerald-600 stroke-[3]" />
                                  <span>Direct</span>
                                </span>
                              )}
                              {isLowest && (
                                <span className="bg-emerald-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider">
                                  Cheapest
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-3">
                              {isVerified && offer.inStock && offer.price != null && offer.mrp != null ? (
                                <>
                                  <span className="text-slate-400 text-[11px] line-through">
                                    ₹{offer.mrp}
                                  </span>
                                  <span className={`text-sm font-black ${isLowest ? 'text-emerald-700' : 'text-slate-900'}`}>
                                    ₹{offer.price}
                                  </span>
                                  <span className="text-[10px] text-slate-500 hidden sm:inline">
                                    {offer.deliveryTimeMin ?? '—'}m
                                  </span>
                                  <ExternalLink className="w-3 h-3 text-slate-400 opacity-60" />
                                </>
                              ) : (
                                <span className="text-slate-400 text-[11px] italic">Out of Stock</span>
                              )}
                            </div>
                          </a>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons: External Buy + Smart Basket */}
              <div className="p-4 sm:p-5 bg-slate-50/70 border-t border-slate-100 flex items-center gap-2">
                {stats && stats.lowestOffer && (
                  <a
                    href={stats.lowestOffer.affiliateUrl || getDirectStoreBuyUrl(stats.lowestOffer.platform, product.name)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => onTrackAffiliateClick(stats.lowestOffer.platform, product)}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm cursor-pointer"
                  >
                    <span>Buy on {PLATFORMS[stats.lowestOffer.platform].name}</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  </a>
                )}

                {itemQuantity > 0 ? (
                  <div className="flex items-center rounded-xl bg-emerald-600 text-white font-black text-xs shadow-sm overflow-hidden border border-emerald-600">
                    <button
                      type="button"
                      onClick={() => onUpdateQuantity ? onUpdateQuantity(product.id, -1) : onAddToCart(product)}
                      className="px-2.5 py-2.5 hover:bg-emerald-700 transition-colors flex items-center justify-center font-black text-sm active:scale-95 cursor-pointer"
                      title="Decrease quantity or remove from basket"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-2.5 py-1 font-black text-xs min-w-[1.75rem] text-center bg-emerald-700/50 select-none">
                      {itemQuantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => onUpdateQuantity ? onUpdateQuantity(product.id, 1) : onAddToCart(product)}
                      className="px-2.5 py-2.5 hover:bg-emerald-700 transition-colors flex items-center justify-center font-black text-sm active:scale-95 cursor-pointer"
                      title="Add more to basket"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => onAddToCart(product)}
                    className="py-2.5 px-4 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 transition-all border bg-white hover:bg-emerald-50 text-slate-800 hover:text-emerald-700 border-slate-300 hover:border-emerald-500 shadow-xs cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4 text-emerald-600" />
                    <span>+ Basket</span>
                  </button>
                )}
              </div>

            </div>
          );
        })}
      </div>

      {/* Batch Load Controls & Pagination for 24,580 Items */}
      <div className="mt-10 pt-6 border-t border-slate-200">
        
        {/* Mode 1: Continuous / Infinite Batch Loading */}
        {displayMode === 'infinite' ? (
          <div className="flex flex-col items-center gap-4">
            <div className="text-xs text-slate-500 font-bold">
              Loaded {displayedProducts.length} of {totalCategorySkus.toLocaleString('en-IN')} quick-commerce items
            </div>

            {displayedProducts.length < totalCategorySkus && (
              <div className="flex flex-wrap items-center justify-center gap-2.5">
                <button
                  onClick={() => handleLoadMore(50)}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs sm:text-sm font-black transition-all shadow-md shadow-emerald-600/20 flex items-center gap-2"
                >
                  <span>Load Next 50 Items</span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleLoadMore(100)}
                  className="px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-300 rounded-2xl text-xs sm:text-sm font-bold text-slate-800 transition-all shadow-sm flex items-center gap-1.5"
                >
                  <span>+100 Items</span>
                </button>

                <button
                  onClick={() => handleLoadMore(500)}
                  className="px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-300 rounded-2xl text-xs sm:text-sm font-bold text-slate-800 transition-all shadow-sm flex items-center gap-1.5"
                >
                  <span>+500 Items</span>
                </button>

                <button
                  onClick={() => handleLoadMore(1000)}
                  className="px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-300 rounded-2xl text-xs sm:text-sm font-bold text-slate-800 transition-all shadow-sm flex items-center gap-1.5"
                >
                  <span>+1,000 Items</span>
                </button>

                <button
                  onClick={() => setCumulativePageSize(totalCategorySkus)}
                  className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-2xl text-xs sm:text-sm font-black transition-all shadow-lg shadow-purple-600/20 flex items-center gap-2"
                >
                  <Zap className="w-4 h-4 text-amber-300" />
                  <span>🚀 Load All {totalCategorySkus.toLocaleString('en-IN')} Items Now</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Mode 2: Structured Page Navigation */
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 disabled:opacity-40 text-xs font-bold text-slate-700 flex items-center gap-1 hover:bg-slate-50 transition-colors shadow-sm"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>

              <div className="flex items-center gap-1 text-xs font-bold text-slate-700">
                <span className="px-3 py-2 bg-emerald-600 text-white rounded-xl font-black">
                  Page {currentPage}
                </span>
                <span className="text-slate-400">of {totalPages.toLocaleString('en-IN')}</span>
              </div>

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages}
                className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 disabled:opacity-40 text-xs font-bold text-slate-700 flex items-center gap-1 hover:bg-slate-50 transition-colors shadow-sm"
              >
                <span>Next</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Jump to Page Input */}
            <form onSubmit={handleJumpPage} className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Jump to page:</span>
              <input
                type="number"
                min="1"
                max={totalPages}
                value={jumpPageInput}
                onChange={(e) => setJumpPageInput(e.target.value)}
                placeholder="1"
                className="w-16 px-2.5 py-1.5 text-xs text-center border border-slate-300 rounded-xl font-bold focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-colors"
              >
                Go
              </button>
            </form>
          </div>
        )}

      </div>

      {searchQuery.trim() && liveSearchLoading && (
        <div className="text-center py-8 text-sm font-semibold text-slate-500">Checking verified catalog data…</div>
      )}
      {searchQuery.trim() && liveSearchError && (
        <div className="text-center py-8 bg-amber-50 rounded-3xl border border-amber-200 mt-6 text-sm font-semibold text-amber-800">
          Verified catalog is not connected yet. Configure DATABASE_URL and an approved store feed.
        </div>
      )}
      {displayedProducts.length === 0 && !liveSearchLoading && (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 mt-6">
          <p className="text-slate-500 font-semibold text-sm">No grocery items found for "{searchQuery}".</p>
          <button
            onClick={() => {
              handleSearchChange('');
              handleCategoryChange('all');
            }}
            className="mt-3 text-xs text-emerald-600 font-bold hover:underline"
          >
            Clear search and view all 24,580 products
          </button>
        </div>
      )}
    </section>
  );
};
