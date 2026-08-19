import React, { useMemo, useState } from 'react';
import {
  Flame,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Sparkles,
  Tag,
  X,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { Product } from '../types';
import { FilterDrawer, FilterState } from './FilterDrawer';
import { ProductCard } from './ProductCard';

export const CatalogView: React.FC = () => {
  const { products, selectedCategory, setSelectedCategory, searchQuery, setSearchQuery } = useShop();

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    category: selectedCategory,
    sizes: [],
    colors: [],
    maxPrice: 7000,
    minRating: 0,
    sortBy: 'FEATURED',
    fit: null,
  });

  // Synchronize category if changed from navigation
  React.useEffect(() => {
    setFilters((prev) => ({ ...prev, category: selectedCategory }));
  }, [selectedCategory]);

  const handleResetFilters = () => {
    setSelectedCategory(null);
    setSearchQuery('');
    setFilters({
      category: null,
      sizes: [],
      colors: [],
      maxPrice: 7000,
      minRating: 0,
      sortBy: 'FEATURED',
      fit: null,
    });
  };

  // Filter & sort logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Search
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = p.name.toLowerCase().includes(q);
          const matchCat = p.category.toLowerCase().includes(q);
          const matchTags = p.tags.some((t) => t.toLowerCase().includes(q));
          const matchDesc = p.description.toLowerCase().includes(q);
          if (!matchName && !matchCat && !matchTags && !matchDesc) return false;
        }

        // Category
        if (filters.category && p.category !== filters.category) return false;

        // Max price
        if (p.price > filters.maxPrice) return false;

        // Min rating
        if (p.rating < filters.minRating) return false;

        // Fit
        if (filters.fit && p.fit !== filters.fit) return false;

        // Sizes
        if (filters.sizes.length > 0) {
          const hasSize = p.sizes.some(
            (s) => filters.sizes.includes(s.size) && s.stock > 0
          );
          if (!hasSize) return false;
        }

        // Colors
        if (filters.colors.length > 0) {
          const hasColor = p.colors.some((c) =>
            filters.colors.some((fc) => c.name.toLowerCase().includes(fc.toLowerCase()))
          );
          if (!hasColor) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === 'PRICE_ASC') return a.price - b.price;
        if (filters.sortBy === 'PRICE_DESC') return b.price - a.price;
        if (filters.sortBy === 'RATING') return b.rating - a.rating;
        if (filters.sortBy === 'NEWEST') return (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0);
        if (filters.sortBy === 'BEST_SELLER') return (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0);
        return 0; // FEATURED
      });
  }, [products, searchQuery, filters]);

  const activeFilterCount =
    (filters.category ? 1 : 0) +
    filters.sizes.length +
    filters.colors.length +
    (filters.fit ? 1 : 0) +
    (filters.maxPrice < 7000 ? 1 : 0) +
    (filters.minRating > 0 ? 1 : 0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6 pb-24 select-none">
      {/* Top Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search heavyweight tees, hoodies, parachute pants, accessories..."
            className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl pl-10 pr-10 py-3 text-xs font-mono text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600 transition"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Trigger Button */}
        <button
          type="button"
          onClick={() => setIsFilterOpen(true)}
          className="flex items-center justify-center gap-2 px-5 py-3 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 rounded-2xl text-xs font-mono font-bold text-white transition active:scale-98 shadow-md"
        >
          <SlidersHorizontal className="w-4 h-4 text-cyan-400" />
          <span>FILTER & SORT</span>
          {activeFilterCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-white text-zinc-950 text-[10px] font-black flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Suggested Search Keywords */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 text-xs font-mono">
        <span className="text-zinc-500 text-[11px] font-bold shrink-0 mr-1">POPULAR:</span>
        {['Oversized Tee', '380 GSM Hoodie', 'Acid Wash', 'Parachute Pants', 'Boxy Fit', 'Limited Vault'].map((kw) => (
          <button
            key={kw}
            type="button"
            onClick={() => setSearchQuery(kw)}
            className="px-2.5 py-1 rounded-xl bg-zinc-900/60 border border-zinc-850 text-zinc-400 hover:text-white hover:border-zinc-700 transition shrink-0 text-[11px]"
          >
            {kw}
          </button>
        ))}
      </div>

      {/* Header Info & Count */}
      <div className="flex items-center justify-between border-b border-zinc-900 pb-3 font-mono text-xs">
        <div className="flex items-center gap-2">
          <span className="text-white font-bold uppercase tracking-wider">
            {filters.category ? filters.category.toUpperCase() : 'FULL STUDIO COLLECTION'}
          </span>
          <span className="text-zinc-500">({filteredProducts.length} Pieces)</span>
        </div>

        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={handleResetFilters}
            className="flex items-center gap-1 text-cyan-400 hover:underline text-[11px]"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Clear Filters</span>
          </button>
        )}
      </div>

      {/* Product Grid or Empty Slots */}
      {products.length === 0 ? (
        <div className="space-y-6">
          <div className="p-8 text-center rounded-3xl border border-dashed border-zinc-800 bg-zinc-950/60 max-w-xl mx-auto space-y-3">
            <Tag className="w-10 h-10 text-zinc-600 mx-auto" />
            <h3 className="text-base font-bold text-white uppercase tracking-wider font-mono">
              ALL STOREFRONT SLOTS ARE EMPTY
            </h3>
            <p className="text-xs text-zinc-400 font-sans max-w-md mx-auto">
              All previous clothes and sales have been cleared. As an admin, you can now upload photos of your brand's clothing directly in the Admin Panel.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((slot) => (
              <div
                key={slot}
                className="aspect-[3/4] rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/20 flex flex-col items-center justify-center p-4 text-center group"
              >
                <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-600 mb-2">
                  #{slot}
                </div>
                <span className="font-mono text-[11px] font-bold text-zinc-400 uppercase">
                  Empty Studio Slot
                </span>
                <span className="text-[10px] text-zinc-600 font-sans mt-0.5">
                  Awaiting photo & apparel details
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="py-20 text-center text-zinc-500 font-mono space-y-3">
          <Search className="w-12 h-12 stroke-[1] mx-auto text-zinc-600 mb-2" />
          <p className="text-sm font-bold text-zinc-300">NO PIECES MATCH YOUR CRITERIA</p>
          <p className="text-xs font-sans text-zinc-500 max-w-sm mx-auto">
            Try adjusting your search keywords, price range, or clearing size filters.
          </p>
          <button
            type="button"
            onClick={handleResetFilters}
            className="px-6 py-2.5 bg-white text-zinc-950 font-bold rounded-full text-xs hover:bg-zinc-200 transition mt-2"
          >
            RESET ALL FILTERS
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
          {filteredProducts.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      )}

      {/* Filter Drawer */}
      <FilterDrawer
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        onUpdateFilters={setFilters}
        onResetFilters={handleResetFilters}
        productCount={filteredProducts.length}
      />
    </div>
  );
};
