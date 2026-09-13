import React from 'react';

interface BlinkitHeroPromoProps {
  onSelectCategory: (categoryKey: string, searchQuery?: string) => void;
}

interface CategoryTile {
  id: number;
  label: string;
  sliceId: number;
  categoryKey?: string;
  searchQuery?: string;
}

const CATEGORY_TILES: CategoryTile[] = [
  // Row 1
  { id: 1, label: 'Fresh Groceries', sliceId: 3, categoryKey: 'veggies', searchQuery: '' },
  { id: 2, label: 'Dairy, Bread & Eggs', sliceId: 2, categoryKey: 'dairy', searchQuery: '' },
  { id: 3, label: 'Fruits & Vegetables', sliceId: 14, categoryKey: 'veggies', searchQuery: '' },
  { id: 4, label: 'Cold Drinks & Juices', sliceId: 4, categoryKey: 'beverages', searchQuery: '' },
  { id: 5, label: 'Snacks & Munchies', sliceId: 5, categoryKey: 'snacks', searchQuery: '' },
  { id: 6, label: 'Breakfast & Instant Food', sliceId: 6, categoryKey: 'instant', searchQuery: '' },
  { id: 7, label: 'Sweet Tooth', sliceId: 7, categoryKey: 'all', searchQuery: 'Ice Cream Chocolate' },
  { id: 8, label: 'Bakery & Biscuits', sliceId: 8, categoryKey: 'snacks', searchQuery: 'Biscuits Bread' },
  { id: 9, label: 'Tea, Coffee & Milk Drinks', sliceId: 9, categoryKey: 'beverages', searchQuery: 'Tea Coffee' },
  { id: 10, label: 'Atta, Rice & Dal', sliceId: 10, categoryKey: 'staples', searchQuery: '' },

  // Row 2
  { id: 11, label: 'Masala, Oil & More', sliceId: 11, categoryKey: 'staples', searchQuery: 'Oil Masala' },
  { id: 12, label: 'Sauces & Spreads', sliceId: 12, categoryKey: 'instant', searchQuery: 'Sauce Spread' },
  { id: 13, label: 'Chicken, Meat & Fish', sliceId: 13, categoryKey: 'all', searchQuery: 'Eggs Meat' },
  { id: 14, label: 'Organic & Healthy Living', sliceId: 14, categoryKey: 'all', searchQuery: 'Organic' },
  { id: 15, label: 'Baby Care', sliceId: 15, categoryKey: 'all', searchQuery: 'Baby Care' },
  { id: 16, label: 'Pharma & Wellness', sliceId: 16, categoryKey: 'all', searchQuery: 'Pharma Dettol' },
  { id: 17, label: 'Cleaning Essentials', sliceId: 17, categoryKey: 'household', searchQuery: '' },
  { id: 18, label: 'Home & Office', sliceId: 18, categoryKey: 'household', searchQuery: 'Home' },
  { id: 19, label: 'Personal Care', sliceId: 19, categoryKey: 'personal', searchQuery: '' },
  { id: 20, label: 'Pet Care', sliceId: 20, categoryKey: 'all', searchQuery: 'Pet Care' },
];

export const BlinkitHeroPromo: React.FC<BlinkitHeroPromoProps> = ({ onSelectCategory }) => {
  const handleTileClick = (tile: CategoryTile) => {
    onSelectCategory(tile.categoryKey || 'all', tile.searchQuery || '');
    const el = document.getElementById('catalog-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleBannerClick = (searchQuery: string = '', categoryKey: string = 'all') => {
    onSelectCategory(categoryKey, searchQuery);
    const el = document.getElementById('catalog-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full space-y-4 sm:space-y-6 mb-8">
      {/* 1. Panoramic Hero Banner */}
      <div 
        onClick={() => handleBannerClick('', 'all')}
        className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden cursor-pointer shadow-xs hover:shadow-md transition-all group border border-slate-200/60"
      >
        <img
          src="https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=2700/layout-engine/2022-05/Group-33704.jpg"
          alt="Fresh Groceries in 8 Minutes"
          className="w-full h-auto object-cover max-h-[220px] sm:max-h-[260px] md:max-h-[300px] group-hover:scale-[1.01] transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/40 via-transparent to-transparent flex items-center p-4 sm:p-8">
          <div className="max-w-md">
            <button
              type="button"
              className="px-5 py-2 sm:px-6 sm:py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-extrabold text-xs sm:text-sm shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>Shop Now</span>
              <span>→</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Three Promo Feature Cards (Pharmacy, Pet Care, Baby Care) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 w-full">
        {/* Card 1: Pharmacy */}
        <div
          onClick={() => handleBannerClick('Pharma Dettol Medicine', 'all')}
          className="rounded-2xl sm:rounded-3xl overflow-hidden cursor-pointer shadow-xs hover:shadow-md transition-all group border border-slate-100 bg-white"
        >
          <img
            src="https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=720/layout-engine/2023-07/pharmacy-WEB.jpg"
            alt="Pharmacy at your doorstep"
            className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </div>

        {/* Card 2: Pet Care */}
        <div
          onClick={() => handleBannerClick('Pet Food Dog Cat', 'all')}
          className="rounded-2xl sm:rounded-3xl overflow-hidden cursor-pointer shadow-xs hover:shadow-md transition-all group border border-slate-100 bg-white"
        >
          <img
            src="https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=720/layout-engine/2023-07/Pet-Care_WEB.jpg"
            alt="Pet care supplies at your door"
            className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </div>

        {/* Card 3: Baby Care */}
        <div
          onClick={() => handleBannerClick('Baby Diaper Pampers', 'all')}
          className="rounded-2xl sm:rounded-3xl overflow-hidden cursor-pointer shadow-xs hover:shadow-md transition-all group border border-slate-100 bg-white"
        >
          <img
            src="https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=720/layout-engine/2023-03/babycare-WEB.jpg"
            alt="No time for a diaper run?"
            className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </div>
      </div>

      {/* 3. The 20 Iconic Blinkit Category Tiles (Exact 2 Rows of 10) */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-5 border border-slate-200/80 shadow-xs">
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-2 sm:gap-3 lg:gap-4 w-full">
          {CATEGORY_TILES.map((tile) => {
            const imgUrl = `https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/layout-engine/2022-11/Slice-${tile.sliceId}.png`;
            return (
              <button
                key={tile.id}
                type="button"
                onClick={() => handleTileClick(tile)}
                className="flex flex-col items-center text-center group cursor-pointer p-1 rounded-2xl transition-all focus:outline-none"
              >
                <div className="w-full aspect-square rounded-2xl bg-[#f4f6fb] group-hover:bg-[#e8effd] p-1.5 flex items-center justify-center border border-[#eef2f9] transition-all group-hover:scale-105 group-hover:shadow-xs">
                  <img
                    src={imgUrl}
                    alt={tile.label}
                    className="w-full h-full object-contain"
                    loading="lazy"
                  />
                </div>
                <span className="text-[11px] sm:text-xs font-semibold text-slate-800 group-hover:text-emerald-700 leading-tight mt-1.5 line-clamp-2 max-w-[90px]">
                  {tile.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
