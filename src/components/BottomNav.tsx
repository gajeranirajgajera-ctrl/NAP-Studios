import React from 'react';
import {
  Grid,
  Heart,
  Home,
  Search,
  User,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { ActiveTab } from '../types';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, wishlist } = useShop();

  const navItems: { id: ActiveTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'HOME', label: 'HOME', icon: Home },
    { id: 'CATEGORIES', label: 'CATALOG', icon: Grid },
    { id: 'SEARCH', label: 'SEARCH', icon: Search },
    { id: 'WISHLIST', label: 'WISHLIST', icon: Heart },
    { id: 'ACCOUNT', label: 'ACCOUNT', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-zinc-950/95 backdrop-blur-xl border-t border-zinc-900 px-2 py-1.5 select-none max-w-lg mx-auto sm:rounded-t-2xl">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-150 relative ${
                isActive ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 stroke-[2.5]' : 'stroke-[1.8]'}`} />
                {item.id === 'WISHLIST' && wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-2 min-w-3.5 h-3.5 px-0.5 rounded-full bg-pink-500 text-white font-mono text-[9px] font-bold flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </div>
              <span
                className={`text-[9px] font-mono tracking-wider mt-1 transition-colors ${
                  isActive ? 'font-bold text-white' : 'text-zinc-500'
                }`}
              >
                {item.label}
              </span>
              {isActive && (
                <span className="w-1 h-1 bg-white rounded-full mt-0.5 animate-in fade-in" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
