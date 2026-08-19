import React, { useState } from 'react';
import {
  RotateCcw,
  SlidersHorizontal,
  Star,
  X,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { Product } from '../types';

export interface FilterState {
  category: string | null;
  sizes: string[];
  colors: string[];
  maxPrice: number;
  minRating: number;
  sortBy: 'FEATURED' | 'NEWEST' | 'PRICE_ASC' | 'PRICE_DESC' | 'RATING' | 'BEST_SELLER';
  fit: string | null;
}

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onUpdateFilters: (newFilters: FilterState) => void;
  onResetFilters: () => void;
  productCount: number;
}

export const FilterDrawer: React.FC<FilterDrawerProps> = ({
  isOpen,
  onClose,
  filters,
  onUpdateFilters,
  onResetFilters,
  productCount,
}) => {
  const { categories } = useShop();

  if (!isOpen) return null;

  const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const availableColors = [
    { name: 'Black', hex: '#0a0a0a' },
    { name: 'Charcoal', hex: '#262626' },
    { name: 'White / Bone', hex: '#f4f1ea' },
    { name: 'Olive / Green', hex: '#4a4e3b' },
    { name: 'Indigo / Blue', hex: '#1e293b' },
    { name: 'Sand / Beige', hex: '#d6c7b2' },
  ];
  const fits = ['Oversized', 'Boxy Heavyweight', 'Relaxed', 'Wide Leg'];

  const toggleSize = (s: string) => {
    const next = filters.sizes.includes(s)
      ? filters.sizes.filter((x) => x !== s)
      : [...filters.sizes, s];
    onUpdateFilters({ ...filters, sizes: next });
  };

  const toggleColor = (c: string) => {
    const next = filters.colors.includes(c)
      ? filters.colors.filter((x) => x !== c)
      : [...filters.colors, c];
    onUpdateFilters({ ...filters, colors: next });
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-zinc-950/80 backdrop-blur-sm animate-in fade-in select-none">
      <div className="w-full max-w-md h-full bg-zinc-900 border-l border-zinc-800 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-800 sticky top-0 bg-zinc-900 z-10">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-white" />
            <h2 className="text-base font-black font-brand text-white uppercase tracking-wider">
              FILTER & SORT
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Body */}
        <div className="p-4 space-y-6 flex-1">
          {/* SORT BY */}
          <div>
            <label className="block text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider mb-2.5">
              SORT BY
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'FEATURED', label: 'Featured Drops' },
                { id: 'NEWEST', label: 'Newest Arrivals' },
                { id: 'PRICE_ASC', label: 'Price: Low to High' },
                { id: 'PRICE_DESC', label: 'Price: High to Low' },
                { id: 'RATING', label: 'Customer Rating' },
                { id: 'BEST_SELLER', label: 'Best Sellers' },
              ].map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => onUpdateFilters({ ...filters, sortBy: s.id as any })}
                  className={`py-2 px-2.5 rounded-xl text-left text-xs font-mono transition ${
                    filters.sortBy === s.id
                      ? 'bg-white text-zinc-950 font-bold shadow-sm'
                      : 'bg-zinc-950/70 border border-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* CATEGORIES */}
          <div>
            <label className="block text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider mb-2.5">
              CATEGORY
            </label>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => onUpdateFilters({ ...filters, category: null })}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono transition ${
                  filters.category === null
                    ? 'bg-white text-zinc-950 font-bold'
                    : 'bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                ALL CATEGORIES
              </button>
              {categories.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => onUpdateFilters({ ...filters, category: c.name })}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono transition ${
                    filters.category === c.name
                      ? 'bg-white text-zinc-950 font-bold'
                      : 'bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* SIZES */}
          <div>
            <label className="block text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider mb-2.5">
              SIZE SELECTION
            </label>
            <div className="grid grid-cols-6 gap-2">
              {availableSizes.map((sz) => {
                const isSelected = filters.sizes.includes(sz);
                return (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => toggleSize(sz)}
                    className={`py-2 rounded-xl text-xs font-mono font-bold transition ${
                      isSelected
                        ? 'bg-white text-zinc-950 shadow-sm'
                        : 'bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {sz}
                  </button>
                );
              })}
            </div>
          </div>

          {/* MAX PRICE SLIDER */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider">
                MAX PRICE
              </label>
              <span className="text-xs font-mono font-bold text-white">
                ₹{filters.maxPrice.toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min="1000"
              max="7000"
              step="250"
              value={filters.maxPrice}
              onChange={(e) =>
                onUpdateFilters({ ...filters, maxPrice: parseInt(e.target.value, 10) })
              }
              className="w-full h-2 bg-zinc-950 rounded-lg appearance-none cursor-pointer accent-white border border-zinc-800"
            />
            <div className="flex justify-between text-[10px] font-mono text-zinc-500 mt-1">
              <span>₹1,000</span>
              <span>₹7,000+</span>
            </div>
          </div>

          {/* FIT SELECTION */}
          <div>
            <label className="block text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider mb-2.5">
              SILHOUETTE / FIT
            </label>
            <div className="flex flex-wrap gap-2">
              {fits.map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() =>
                    onUpdateFilters({
                      ...filters,
                      fit: filters.fit === f ? null : f,
                    })
                  }
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono transition ${
                    filters.fit === f
                      ? 'bg-white text-zinc-950 font-bold'
                      : 'bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* MIN RATING */}
          <div>
            <label className="block text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider mb-2.5">
              MINIMUM RATING
            </label>
            <div className="flex items-center gap-2">
              {[0, 4, 4.5, 4.8].map((rt) => (
                <button
                  key={rt}
                  type="button"
                  onClick={() => onUpdateFilters({ ...filters, minRating: rt })}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-mono transition ${
                    filters.minRating === rt
                      ? 'bg-white text-zinc-950 font-bold'
                      : 'bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  {rt === 0 ? (
                    'All'
                  ) : (
                    <>
                      <Star className="w-3 h-3 fill-current" />
                      <span>{rt}+</span>
                    </>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-900/90 sticky bottom-0 flex items-center gap-3">
          <button
            type="button"
            onClick={onResetFilters}
            className="flex items-center justify-center gap-1.5 px-4 py-3 bg-zinc-950 hover:bg-zinc-850 border border-zinc-800 text-zinc-300 font-mono text-xs font-bold rounded-2xl transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>RESET</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 bg-white hover:bg-zinc-200 text-zinc-950 font-mono text-xs font-black tracking-wider rounded-2xl transition active:scale-98 shadow-md"
          >
            SHOW {productCount} PIECES
          </button>
        </div>
      </div>
    </div>
  );
};
