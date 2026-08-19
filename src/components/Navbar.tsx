import React from 'react';
import {
  Bell,
  Heart,
  Search,
  ShoppingBag,
  SlidersHorizontal,
  Sparkles,
  UserCheck,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';

interface NavbarProps {
  onOpenFilter?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenFilter }) => {
  const {
    cartCount,
    wishlist,
    setIsCartOpen,
    setIsAdminOpen,
    setIsNotificationsOpen,
    setActiveTab,
    activeTab,
  } = useShop();

  return (
    <header className="sticky top-0 z-40 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-900 px-4 py-3 select-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setActiveTab('HOME')}
            className="flex items-center gap-1.5 text-left group"
          >
            <div className="w-8 h-8 rounded-lg bg-white text-zinc-950 flex items-center justify-center font-black font-brand text-lg tracking-tighter shadow-sm group-hover:scale-105 transition-transform">
              N
            </div>
            <div>
              <span className="font-brand font-black text-xl tracking-widest text-white block leading-none">
                NAP
              </span>
              <span className="text-[9px] font-mono tracking-[0.25em] text-zinc-400 block uppercase">
                STUDIOS
              </span>
            </div>
          </button>
        </div>

        {/* Search Quick Bar (visible on top on tablet/desktop, icon on mobile) */}
        <div className="flex-1 max-w-md hidden sm:block">
          <button
            type="button"
            onClick={() => setActiveTab('SEARCH')}
            className="w-full flex items-center justify-between px-3.5 py-2 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 rounded-full text-xs text-zinc-400 transition"
          >
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-zinc-400" />
              <span>Search oversized hoodies, heavyweight tees...</span>
            </div>
            <span className="text-[10px] font-mono bg-zinc-800 px-2 py-0.5 rounded text-zinc-300">⌘K</span>
          </button>
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Search Icon on mobile */}
          <button
            type="button"
            onClick={() => setActiveTab('SEARCH')}
            className="sm:hidden p-2 rounded-full text-zinc-300 hover:text-white hover:bg-zinc-900 transition"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Notifications */}
          <button
            type="button"
            onClick={() => setIsNotificationsOpen(true)}
            className="relative p-2 rounded-full text-zinc-300 hover:text-white hover:bg-zinc-900 transition"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-400 ring-2 ring-zinc-950" />
          </button>

          {/* Wishlist */}
          <button
            type="button"
            onClick={() => setActiveTab('WISHLIST')}
            className={`relative p-2 rounded-full transition ${
              activeTab === 'WISHLIST'
                ? 'text-pink-400 bg-zinc-900'
                : 'text-zinc-300 hover:text-white hover:bg-zinc-900'
            }`}
            aria-label="Wishlist"
          >
            <Heart className="w-5 h-5" />
            {wishlist.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 rounded-full bg-pink-500 text-white font-mono font-bold text-[10px] flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Shopping Bag Button */}
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center gap-2 px-3 py-2 bg-white hover:bg-zinc-200 text-zinc-950 rounded-full font-bold text-xs tracking-wider transition active:scale-95 shadow-sm"
            aria-label="Shopping Bag"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden xs:inline">BAG</span>
            {cartCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-zinc-950 text-white font-mono font-bold text-[10px] flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
