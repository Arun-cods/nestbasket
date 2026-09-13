import React, { useState, useMemo } from 'react';
import { 
  Search, Sparkles, ShoppingBag, ExternalLink, ArrowUpDown, Check, Tag, 
  ChevronDown, Database, Zap, ArrowLeft, ArrowRight, Layers, SlidersHorizontal, RefreshCw,
  Plus, Minus, LayoutGrid, List, MoveHorizontal, Bell
} from 'lucide-react';
import { Product, PlatformId } from '../types';
import { PLATFORMS } from '../data/mockGroceryData';
import { MASTER_CATALOG_CATEGORIES } from '../data/comprehensiveCatalog';
import { queryMasterCatalog, CATEGORY_TOTALS } from '../data/masterCatalogEngine';
import { getDirectStoreBuyUrl } from '../utils/storeLinks';

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
  onToggleWatchlist?: (product: Product) => void;
  watchlistProductIds?: Set<string>;
}

const CATEGORY_FALLBACKS: Record<string, string> = {
  paan: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/layout-engine/2022-11/Slice-1.png',
  dairy: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/layout-engine/2022-11/Slice-2.png',
  veggies: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/layout-engine/2022-11/Slice-3.png',
  cold_drinks: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/layout-engine/2022-11/Slice-4.png',
  snacks: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/layout-engine/2022-11/Slice-5.png',
  instant: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/layout-engine/2022-11/Slice-6.png',
  sweet_tooth: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/layout-engine/2022-11/Slice-7.png',
  bakery: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/layout-engine/2022-11/Slice-8.png',
  tea_coffee: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/layout-engine/2022-11/Slice-9.png',
  atta_rice_dal: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/layout-engine/2022-11/Slice-10.png',
  masala_oil: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/layout-engine/2022-11/Slice-11.png',
  sauces: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/layout-engine/2022-11/Slice-12.png',
  meat_fish: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/layout-engine/2022-11/Slice-13.png',
  organic_healthy: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/layout-engine/2022-11/Slice-14.png',
  baby_care: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/layout-engine/2022-11/Slice-15.png',
  pharma_wellness: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/layout-engine/2022-11/Slice-16.png',
  cleaning: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/layout-engine/2022-11/Slice-17.png',
  home_office: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/layout-engine/2022-11/Slice-18.png',
  personal_care: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/layout-engine/2022-11/Slice-19.png',
  pet_care: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/layout-engine/2022-11/Slice-20.png',
  beverages: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/layout-engine/2022-11/Slice-4.png',
  staples: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/layout-engine/2022-11/Slice-10.png',
  household: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/layout-engine/2022-11/Slice-17.png',
  personal: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/layout-engine/2022-11/Slice-19.png',
  all: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=2700/layout-engine/2022-05/Group-33704.jpg',
};

const SUBCATEGORIES_BY_CATEGORY: Record<string, string[]> = {
  paan: [
    'All',
    'Paan & Supari',
    'Mouth Fresheners',
    'Mints & Lozenges',
    'Hookah & Flavours',
    'Lighters & Accessories',
    'Rolling Paper & Cones',
    'Digestives & Churan',
  ],
  dairy: [
    'All',
    'Fresh Milk',
    'Bread & Pav',
    'Eggs',
    'Butter & Ghee',
    'Paneer & Tofu',
    'Curd & Yogurt',
    'Cheese & Cream',
    'Condensed Milk',
  ],
  veggies: [
    'All',
    'Fresh Vegetables',
    'Fresh Fruits',
    'Leafies & Herbs',
    'Seasonal & Exotics',
    'Freshly Cut & Sprouts',
    'Frozen Veg',
    'Apples & Pears',
    'Mangoes & Melons',
    'Flowers & Leaves',
  ],
  cold_drinks: [
    'All',
    'Soft Drinks',
    'Fruit Juices',
    'Mango Drinks',
    'Energy Drinks',
    'Coconut Water',
    'Lassi, Shakes & More',
    'Cold Coffee & Ice Tea',
    'Water & Ice Cubes',
    'Soda & Mixers',
    'Concentrates & Syrups',
  ],
  snacks: [
    'All',
    'Chips & Crisps',
    'Nachos',
    'Bhujia & Mixtures',
    'Namkeen Snacks',
    'Popcorn',
    'Papad & Fryums',
    'Makhana & More',
    'Imported Snacks',
  ],
  instant: [
    'All',
    'Noodles',
    'Pasta & More',
    'Instant Mixes',
    'Frozen Veg Snacks',
    'Frozen Non-Veg Snacks',
    'Energy Bars',
    'Soup & Broth',
    'Breakfast Cereals',
    'Batter',
  ],
  sweet_tooth: [
    'All',
    'Chocolates & Candies',
    'Ice Creams & More',
    'Indian Sweets & Mithai',
    'Cakes & Pastries',
    'Dessert Mixes',
    'Gifting Sweets',
  ],
  bakery: [
    'All',
    'Cookies & Biscuits',
    'Cream Biscuits',
    'Glucose & Marie',
    'Healthy & Digestive',
    'Rusks & Wafers',
    'Cakes & Rolls',
    'Gourmet Bakery',
    'Bread & Pav',
  ],
  tea_coffee: [
    'All',
    'Tea',
    'Coffee',
    'Milk Drinks',
    'Green & Flavoured Tea',
    'Herbal Drinks',
    'Hot Chocolate',
    'Cold Coffee & Ice Tea',
    'Lactose Free Drink',
    'Herbal Infusion',
    'Imported Tea & Coffee',
  ],
  atta_rice_dal: [
    'All',
    'Atta',
    'Rice',
    'Toor, Urad & Chana',
    'Moong & Masoor',
    'Rajma, Chhole & Others',
    'Besan, Sooji & Maida',
    'Poha, Daliya & Other Grains',
    'Fresh Atta',
    'Millet & Other Flours',
  ],
  masala_oil: [
    'All',
    'Oil',
    'Ghee & Vanaspati',
    'Whole Spices',
    'Powdered Spices',
    'Salt, Sugar & Jaggery',
    'Dry Fruits & Nuts',
    'Dates & Seeds',
    'Gravy Mixes & Pastes',
    'Dry Fruit Gift Packs',
    'Whole Herbs',
  ],
  sauces: [
    'All',
    'Tomato & Chilli Ketchup',
    'Asian Sauces',
    'Mayonnaise',
    'Peanut Butter',
    'Jam & Spreads',
    'Honey & Chyawanprash',
    'Syrups',
    'Indian Chutney & Pickle',
    'Dips & Salad Dressings',
    'Table Sauces',
    'Cooking Sauces & Vinegar',
    'Imported Spreads',
  ],
  meat_fish: [
    'All',
    'Fresh Chicken',
    'Mutton & Lamb',
    'Fresh Fish & Seafood',
    'Eggs',
    'Marinated & Ready to Cook',
    'Cold Cuts & Sausages',
  ],
  organic_healthy: [
    'All',
    'Organic Staples',
    'Organic Fruits & Veggies',
    'Cold Pressed Oils',
    'Healthy Flours & Grains',
    'Superfoods & Seeds',
    'Organic Tea & Infusions',
  ],
  baby_care: [
    'All',
    'Diapers & Wipes',
    'Baby Food & Formula',
    'Baby Skin & Hair Care',
    'Baby Bath & Hygiene',
    'Baby Oral Care & Teethers',
    'Nursing & Feeding',
  ],
  pharma_wellness: [
    'All',
    'First Aid & Antiseptics',
    'Pain Relief',
    'Cough, Cold & Immunity',
    'Digestive Health & Antacids',
    'Healthcare Devices',
    'Nutritional Supplements & Vitamins',
  ],
  cleaning: [
    'All',
    'Detergent Powder & Liquid',
    'Dishwash Bars & Liquids',
    'Floor & Surface Cleaners',
    'Toilet & Bathroom Cleaners',
    'Garbage Bags & Clean Tools',
    'Air Fresheners',
  ],
  home_office: [
    'All',
    'Kitchenware & Storage',
    'Stationery & Craft',
    'Batteries & Bulbs',
    'Puja Essentials',
    'Home Improvement & Tools',
    'Tissues & Disposables',
  ],
  personal_care: [
    'All',
    'Bath & Body Wash',
    'Hair Care & Shampoo',
    'Oral Care & Toothpaste',
    'Skin Care & Creams',
    'Shaving & Grooming',
    'Feminine Hygiene & Deodorants',
  ],
  pet_care: [
    'All',
    'Dog Food & Treats',
    'Cat Food & Treats',
    'Pet Grooming & Hygiene',
    'Pet Toys & Accessories',
    'Pet Health & Supplements',
  ],
  // Legacy aliases
  beverages: [
    'All',
    'Soft Drinks',
    'Fruit Juices',
    'Tea',
    'Coffee',
    'Milk Drinks',
    'Energy Drinks',
    'Cold Coffee & Ice Tea',
  ],
  staples: [
    'All',
    'Atta',
    'Rice',
    'Cooking Oils',
    'Ghee & Vanaspati',
    'Whole Spices',
    'Dry Fruits',
    'Moong & Masoor',
  ],
  household: [
    'All',
    'Detergent Powder & Liquid',
    'Dishwash Bars & Liquids',
    'Floor & Surface Cleaners',
    'Kitchenware & Storage',
  ],
  personal: [
    'All',
    'Bath & Body Wash',
    'Hair Care & Shampoo',
    'Oral Care & Toothpaste',
    'Diapers & Wipes',
  ],
};

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
  onToggleWatchlist,
  watchlistProductIds,
}) => {
  const [searchQuery, setSearchQuery] = useState(externalSearchQuery || '');
  const [selectedCategory, setSelectedCategory] = useState<string>(externalCategory || 'all');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('all');
  const [selectedWeightFilter, setSelectedWeightFilter] = useState<'all' | 'grams' | 'half-kg' | '1kg-plus' | 'packs'>('all');
  const [onlyEssentials, setOnlyEssentials] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'savings' | 'price-asc' | 'price-desc'>('savings');
  type LayoutMode = '1' | '2' | '3' | '4' | 'scroll';
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('2');

  React.useEffect(() => {
    if (externalCategory !== undefined && externalCategory !== selectedCategory) {
      setSelectedCategory(externalCategory);
      setSelectedSubCategory('all');
      setCurrentPage(1);
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
  ];
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % ROTATING_SEARCH_ITEMS.length);
    }, 2400);
    return () => clearInterval(timer);
  }, []);

  const currentPlaceholder = `Search "${ROTATING_SEARCH_ITEMS[placeholderIndex]}" (e.g. Milk, Eggs, Atta, Tomatoes...)`;

  // Query the Master Catalog Engine across all 24,580 SKUs
  const catalogResponse = useMemo(() => {
    const effectivePage = displayMode === 'infinite' ? 1 : currentPage;
    const effectivePageSize = displayMode === 'infinite' ? cumulativePageSize : itemsPerPage;

    return queryMasterCatalog({
      category: selectedCategory,
      subCategory: selectedSubCategory,
      searchQuery,
      page: effectivePage,
      pageSize: effectivePageSize,
      sortBy,
      onlyEssentials,
      cityMultiplier,
    });
  }, [selectedCategory, selectedSubCategory, searchQuery, displayMode, cumulativePageSize, itemsPerPage, currentPage, sortBy, onlyEssentials, cityMultiplier]);

  const displayedProducts = useMemo(() => {
    if (selectedWeightFilter === 'all') return catalogResponse.items;
    return catalogResponse.items.filter((p) => {
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
  }, [catalogResponse.items, selectedWeightFilter]);

  const totalCategorySkus = catalogResponse.totalCount;
  const totalPages = catalogResponse.totalPages;

  // Calculate cheapest store and max savings for a product
  const getProductStats = (product: Product) => {
    const validOffers = Object.values(product.offers).filter((o) => o.inStock);
    if (validOffers.length === 0) return null;

    const lowestOffer = validOffers.reduce((min, o) => (o.price < min.price ? o : min), validOffers[0]);
    const highestOffer = validOffers.reduce((max, o) => (o.price > max.price ? o : max), validOffers[0]);
    const maxSavings = highestOffer.price - lowestOffer.price;
    const savingsPercent = highestOffer.price > 0 ? Math.round(((highestOffer.price - lowestOffer.price) / highestOffer.price) * 100) : 0;

    return { lowestOffer, highestOffer, maxSavings, savingsPercent };
  };

  const handleCategoryChange = (catId: string) => {
    setSelectedCategory(catId);
    setSelectedSubCategory('all');
    setCurrentPage(1);
    _onCategoryChange?.(catId);
  };

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    _onSearchChange?.(val);
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
      {/* Search, Filter & Category Bar */}
      <div className="bg-white rounded-2xl p-3 sm:p-5 shadow-sm border border-slate-200 mb-6 space-y-4 w-full max-w-full min-w-0 overflow-hidden">
        
        {/* Top Controls: Active Search Status Chip + Essentials + Sorting */}
        <div className="flex flex-col md:flex-row gap-3 md:items-center justify-between w-full max-w-full">
          
          {/* Active Search Status Indicator (No redundant second search input) */}
          {searchQuery ? (
            <div className="flex-1 min-w-0 flex items-center justify-between bg-emerald-50 border border-emerald-300/80 px-3.5 py-2 rounded-xl text-xs">
              <span className="font-bold text-emerald-950 flex items-center gap-1.5 truncate">
                <Search className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="truncate">Searching for: <strong className="text-emerald-900 underline font-black">"{searchQuery}"</strong></span>
              </span>
              <button
                onClick={() => handleSearchChange('')}
                className="ml-2 px-2 py-0.5 rounded-lg bg-white hover:bg-emerald-100 text-emerald-800 font-bold border border-emerald-300 text-[11px] shrink-0 transition-colors cursor-pointer"
              >
                Clear ✕
              </button>
            </div>
          ) : (
            <div className="flex-1 min-w-0 flex items-center gap-2 text-slate-800 text-xs font-extrabold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping shrink-0" />
              <span className="truncate">Live Best Deals &amp; 5-Store Price Comparison</span>
            </div>
          )}

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

        {/* Category Pills with Live 24,580 SKU Counts */}
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
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                selectedCategory === cat.id ? 'bg-emerald-800 text-emerald-100' : 'bg-slate-200 text-slate-600'
              }`}>
                {cat.totalSkus}
              </span>
            </button>
          ))}
        </div>

        {/* Blinkit Department Subcategory Filter Pills */}
        {SUBCATEGORIES_BY_CATEGORY[selectedCategory] && (
          <div className="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-slate-100 pb-1 scrollbar-none text-xs w-full max-w-full min-w-0">
            <span className="text-[11px] font-bold text-slate-400 shrink-0 uppercase tracking-wider">
              Section:
            </span>
            {SUBCATEGORIES_BY_CATEGORY[selectedCategory].map((sub) => {
              const subId = sub.toLowerCase();
              const isSelected = selectedSubCategory.toLowerCase() === subId || (selectedSubCategory === 'all' && sub === 'All');
              return (
                <button
                  key={sub}
                  onClick={() => {
                    setSelectedSubCategory(sub === 'All' ? 'all' : sub);
                    setCurrentPage(1);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all border cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm font-black'
                      : 'bg-emerald-50/50 text-slate-700 border-slate-200 hover:bg-emerald-50 hover:border-emerald-300'
                  }`}
                >
                  {sub}
                </button>
              );
            })}
          </div>
        )}

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

            {/* Layout Toggle: 1 in 1 Line, 2 in 1 Line, 3 in 1 Line, 4 in 1 Line, Scrolling */}
            <div className="flex items-center bg-slate-100 rounded-xl p-0.5 text-[11px] font-bold shrink-0">
              <button
                type="button"
                onClick={() => setLayoutMode('1')}
                className={`px-2 py-1 rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                  layoutMode === '1' ? 'bg-white text-emerald-700 shadow-xs font-black' : 'text-slate-600 hover:text-slate-900'
                }`}
                title="1 in 1 Line: Full width items"
              >
                <List className="w-3.5 h-3.5 text-emerald-600" />
                <span>1 in 1 Line</span>
              </button>
              <button
                type="button"
                onClick={() => setLayoutMode('2')}
                className={`px-2 py-1 rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                  layoutMode === '2' ? 'bg-white text-emerald-700 shadow-xs font-black' : 'text-slate-600 hover:text-slate-900'
                }`}
                title="2 in 1 Line: 2 items per row"
              >
                <LayoutGrid className="w-3.5 h-3.5 text-emerald-600" />
                <span>2 in 1 Line</span>
              </button>
              <button
                type="button"
                onClick={() => setLayoutMode('3')}
                className={`px-2 py-1 rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                  layoutMode === '3' ? 'bg-white text-emerald-700 shadow-xs font-black' : 'text-slate-600 hover:text-slate-900'
                }`}
                title="3 in 1 Line: 3 items per row"
              >
                <Layers className="w-3.5 h-3.5 text-emerald-600" />
                <span>3 in 1 Line</span>
              </button>
              <button
                type="button"
                onClick={() => setLayoutMode('4')}
                className={`px-2 py-1 rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                  layoutMode === '4' ? 'bg-white text-emerald-700 shadow-xs font-black' : 'text-slate-600 hover:text-slate-900'
                }`}
                title="4 in 1 Line: 4 items per row"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-600" />
                <span>4 in 1 Line</span>
              </button>
              <button
                type="button"
                onClick={() => setLayoutMode('scroll')}
                className={`px-2 py-1 rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                  layoutMode === 'scroll' ? 'bg-white text-emerald-700 shadow-xs font-black' : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Scrolling: Horizontal ribbon"
              >
                <MoveHorizontal className="w-3.5 h-3.5 text-emerald-600" />
                <span>Scrolling</span>
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* 24,580 Multi-Store Products Grid */}
      <div className={
        layoutMode === 'scroll'
          ? 'flex gap-3 sm:gap-4 overflow-x-auto scrollbar-none pb-4 pt-1 w-full max-w-full snap-x'
          : layoutMode === '1'
          ? 'grid grid-cols-1 gap-4 sm:gap-6 w-full max-w-full'
          : layoutMode === '2'
          ? 'grid grid-cols-2 gap-2.5 sm:gap-4 lg:gap-6 w-full max-w-full'
          : layoutMode === '3'
          ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 w-full max-w-full'
          : 'grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3.5 lg:gap-4 w-full max-w-full'
      }>
        {displayedProducts.map((product) => {
          const stats = getProductStats(product);
          const isAddedToCart = cartProductIds.has(product.id);
          const itemQuantity = cartQuantities ? (cartQuantities[product.id] || 0) : (isAddedToCart ? 1 : 0);
          const isCompact = layoutMode === '2' || layoutMode === '4';
          const isWatched = watchlistProductIds?.has(product.id);

          return (
            <div
              key={product.id}
              className={
                layoutMode === 'scroll'
                  ? 'w-[84vw] max-w-[340px] shrink-0 snap-start bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between hover:border-slate-300 relative'
                  : layoutMode === '1'
                  ? 'bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between hover:border-slate-300 w-full max-w-full relative'
                  : 'bg-white rounded-2xl sm:rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between hover:border-slate-300 w-full max-w-full relative'
              }
            >
              {/* Price Drop Alert Bell Trigger */}
              {onToggleWatchlist && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onToggleWatchlist(product);
                  }}
                  title={isWatched ? 'Remove from Price Drop Watchlist' : 'Set Price Drop Alert'}
                  className={`absolute top-2.5 right-2.5 z-20 p-1.5 rounded-xl border transition-all cursor-pointer ${
                    isWatched
                      ? 'bg-amber-100 text-amber-900 border-amber-300 shadow-xs'
                      : 'bg-white/85 backdrop-blur-xs text-slate-400 hover:text-amber-600 hover:bg-white border-slate-200/80 shadow-2xs'
                  }`}
                >
                  <Bell className={`w-3.5 h-3.5 ${isWatched ? 'fill-amber-500 text-amber-600' : ''}`} />
                </button>
              )}

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

                <div className={isCompact ? 'p-3 sm:p-5' : 'p-4 sm:p-5'}>
                  <div className={isCompact ? 'flex flex-col sm:flex-row gap-2 sm:gap-4 items-start' : 'flex gap-4 items-start'}>
                    <img
                      src={product.imageUrl || product.image || CATEGORY_FALLBACKS[product.category] || CATEGORY_FALLBACKS.all}
                      alt={product.name}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        const fallback = CATEGORY_FALLBACKS[product.category] || CATEGORY_FALLBACKS.all;
                        if (target.src !== fallback) {
                          target.src = fallback;
                        }
                      }}
                      className={
                        isCompact
                          ? 'w-full h-24 sm:w-24 sm:h-24 object-contain sm:object-cover rounded-xl border border-slate-100 shrink-0 bg-slate-50'
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
                      <span>Live Darkstore Rates</span>
                      <span className="text-slate-400 font-mono text-[10px]">Real-Time Sync</span>
                    </div>

                    <div className="space-y-1.5">
                      {(Object.keys(PLATFORMS) as PlatformId[]).map((platformId) => {
                        const platform = PLATFORMS[platformId];
                        const offer = product.offers[platformId];
                        const isLowest = stats && stats.lowestOffer.platform === platformId && offer.inStock;

                        if (!offer) return null;

                        return (
                          <a
                            key={platformId}
                            href={offer.affiliateUrl || getDirectStoreBuyUrl(platformId, product.name)}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => onTrackAffiliateClick(platformId, product)}
                            title={`Click to buy directly on ${platform.name}`}
                            className={`flex items-center justify-between p-2 rounded-xl text-xs transition-colors hover:ring-2 hover:ring-emerald-400/30 cursor-pointer ${
                              isLowest
                                ? 'bg-emerald-50 border border-emerald-300 font-bold text-emerald-950 shadow-xs'
                                : 'bg-slate-50 border border-slate-100 text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span>{platform.logo}</span>
                              <span className="font-semibold">{platform.name}</span>
                              {isLowest && (
                                <span className="bg-emerald-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider">
                                  Cheapest
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-3">
                              {offer.inStock ? (
                                <>
                                  <span className="text-slate-400 text-[11px] line-through">
                                    ₹{offer.mrp}
                                  </span>
                                  <span className={`text-sm font-black ${isLowest ? 'text-emerald-700' : 'text-slate-900'}`}>
                                    ₹{offer.price}
                                  </span>
                                  <span className="text-[10px] text-slate-500 hidden sm:inline">
                                    {offer.deliveryTimeMin}m
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
              <div className={`p-3 sm:p-5 bg-slate-50/70 border-t border-slate-100 flex ${isCompact ? 'flex-col sm:flex-row' : 'flex-row'} items-stretch sm:items-center gap-2`}>
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

      {displayedProducts.length === 0 && (
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
